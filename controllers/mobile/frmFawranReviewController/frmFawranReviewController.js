define({

    quoted: false,

    //One acknowledgement only. If the server still returns RTP_BL_004 after we retry with
    //isNotiCkReq "N", re-prompting would loop forever — treat the second one as a hard stop.
    acked: false,

    //Set the moment a submit starts and NEVER cleared on success — once a transfer is posted this
    //screen must not post again. Binding the handler to both the container and its caption means a
    //single tap can fire twice, and invokeServiceAsync's dup-guard did not stop 8 concurrent posts
    //reaching the server on 2026-08-03.
    submitting: false,

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.onDeviceBack;
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });
    },

    preShow: function () {
        this.quoted = false;
        this.acked = false;
        this.submitting = false;
        this.busy(false);
        this.bindActions();
        this.renderDraft();
        this.getQuote();
    },

    onDeviceBack: function () {
        new kony.mvc.Navigation("frmFawranAmount").navigate();
    },

    //Says so when a widget is absent. The silent `if (this.view[id])` meant a missing or renamed
    //widget bound nothing and logged nothing, which is indistinguishable from a dead tap.
    safeTap: function (id, fn) {
        try {
            if (!this.view[id]) {
                kony.print("frmFawranReview: WIDGET NOT FOUND -> " + id);
                return false;
            }
            this.view[id].onTouchEnd = fn;
            return true;
        } catch (e) {
            kony.print("frmFawranReview safeTap " + id + " :: " + e);
            return false;
        }
    },

    safeText: function (id, txt) {
        try { if (this.view[id]) { this.view[id].text = "" + txt; } }
        catch (e) { kony.print("frmFawranReview safeText " + id + " :: " + e); }
    },

    bindActions: function () {
        var self = this;
        this.safeTap("flxBack", function () { self.onDeviceBack(); });
        this.safeTap("imgClose", function () {
            new kony.mvc.Navigation("frmFawran").navigate();
        });
        //Bound on the label as well as the container: a child widget drawn on top can take the
        //touch instead of its parent, which is exactly how the alias picker rows behaved.
        var tapped = function () { self.onConfirm(); };
        var a = this.safeTap("flxBtnConfirm", tapped);
        var b = this.safeTap("lblBtnConfirm", tapped);
        kony.print("frmFawranReview: confirm bound flx=" + a + " lbl=" + b);
    },

    //Everything we already know, rendered immediately so the screen is never blank while the quote
    //is in flight. Fees, beneficiary name and total are filled in by rtpPayPreprocess.
    renderDraft: function () {
        var cur = fawranDraft.currency || "QAR";
        this.safeText("lblSendAmount", amountText(fawranDraft.amount));
        this.safeText("lblSendCurrency", cur);
        this.safeText("lblFees", "Fees —");

        var a = fawranDraft.debitAccount;
        if (a) {
            this.safeText("lblFromAlias", nullCheck(a.acNoF) ? a.acNoF : "");
            this.safeText("lblFromAccType", nullCheck(a.atdsc) ? a.atdsc : "");
            //Amount and currency are separate labels now — currency sits on its own line.
            this.safeText("lblFromBalance", amountText(a.accBal));
            this.safeText("lblFromCurrency", a.cur || cur);
        }

        this.safeText("lblToAlias", nullCheck(fawranDraft.aliasValue) ? fawranDraft.aliasValue : "—");
        this.safeText("lblToAliasLabel",
            nullCheck(fawranDraft.aliasTypeDesc) ? fawranDraft.aliasTypeDesc : "Beneficiary alias");
        this.safeText("lblRevMainPurpose", nullCheck(fawranDraft.purposeDesc) ? fawranDraft.purposeDesc : "—");
        this.safeText("lblRevSubPurpose", nullCheck(fawranDraft.subPurposeDesc) ? fawranDraft.subPurposeDesc : "—");
        this.safeText("lblBeneficiaryName", "Checking…");
        this.safeText("lblTotalDebit", "—");
    },

    //rtpPayPreprocess: resolves the beneficiary and quotes the fee, AND establishes the server-side
    //pending transfer that rtpVal/rtpPost act on. If this fails there is nothing to confirm, so the
    //CTA stays disabled rather than sending the user into an OTP step that cannot succeed.
    getQuote: function () {
        var self = this;
        var cur = fawranDraft.currency || "QAR";

        fawranPreprocess(function (ok, data, code) {
            if (ok) {
                self.quoted = true;
                kony.print("POC FAWRAN REVIEW: quote fields = " + JSON.stringify(data).substring(0, 500));

                var name = fawranBenName();
                self.safeText("lblBeneficiaryName", nullCheck(name) ? name : "Verified");

                self.safeText("lblFees", "Fees " + fawranFeeText() + " " + cur);
                self.safeText("lblTotalDebit", formatAmount(fawranTotalDebit()) + " " + cur);
                return;
            }

            self.quoted = false;
            var msg = (data && data.status && nullCheck(data.status.description))
                ? data.status.description : "";

            //RTP_BL_004 is NOT a rejection. It is the incomplete-transaction notification check
            //firing, and production (frmInstaPayController.js:2260-2268) shows the server's wording
            //and then RE-CALLS rtpPayPreprocess with isNotiCkReq "N". Treating it as a failure is
            //what dead-ended the flow here.
            if (code === "RTP_BL_004" && !self.acked) {
                self.acked = true;
                self.busy(false);
                self.safeText("lblBeneficiaryName", "Awaiting confirmation");
                self.acknowledge(nullCheck(msg) ? msg : "You have incomplete Fawran transactions.",
                    function () {
                        fawranAckNotiWarning();
                        self.safeText("lblBeneficiaryName", "Checking…");
                        self.getQuote();
                    });
                return;
            }

            //Everything else is a genuine stop — RTP_BL_003 (limit breach), unknown alias, etc.
            self.safeText("lblBeneficiaryName", "Could not verify");
            self.safeText("lblFees", "Fees unavailable");
            self.warn(nullCheck(msg)
                ? msg
                : "Could not verify this transfer. Please check the details and try again.");
        });
    },

    onConfirm: function () {
        var self = this;
        kony.print("POC FAWRAN REVIEW: confirm tapped, quoted=" + this.quoted +
            " submitting=" + this.submitting);
        if (this.submitting) {
            kony.print("POC FAWRAN REVIEW: submit already in flight — tap ignored");
            return;
        }
        if (!this.quoted) {
            this.warn("This transfer could not be verified, so it cannot be confirmed.");
            return;
        }

        this.submitting = true;
        this.busy(true);

        //rtpVal sends the real SMS OTP. It acts on the pending transfer established by preprocess.
        fawranSendOtp(function (ok, data) {
            if (!ok) {
                self.submitting = false;
                self.busy(false);
                self.warn("Could not send the verification code. Please try again.");
                return;
            }

            //The server decides whether an OTP is needed at all. When isOtpRequired is "N",
            //production posts immediately — showing an OTP screen would strand the user waiting for
            //a code that is never sent.
            if (!fawranDraft.otpRequired) {
                kony.print("POC FAWRAN REVIEW: isOtpRequired=N — posting without an OTP step");
                self.postWithoutOtp();
                return;
            }

            //Handing off to the OTP screen — that screen owns the spinner from here.
            self.busy(false);
            kony.print("POC FAWRAN REVIEW: OTP sent, length=" + fawranDraft.otpLength);
            try {
                new kony.mvc.Navigation("frmFawranOTP").navigate();
            } catch (e) {
                kony.print("frmFawranOTP not available yet :: " + e);
                pocNotBuilt("OTP verification");
            }
        });
    },

    postWithoutOtp: function () {
        var self = this;
        fawranSubmit("", function (ok, data, code) {
            if (!ok) {
                //Released only on a definite failure, so the user can correct and retry. A success
                //keeps the guard set for the life of the screen.
                self.submitting = false;
                self.busy(false);
                var msg = (data && data.status && nullCheck(data.status.description))
                    ? data.status.description : "The transfer could not be completed.";
                self.warn(msg);
                return;
            }
            self.busy(false);
            kony.print("POC FAWRAN REVIEW: posted without OTP, code=" + code);
            fawranDraft.receipt = data;
            try {
                new kony.mvc.Navigation("frmFawranSuccess").navigate();
            } catch (e) {
                kony.print("frmFawranSuccess not available :: " + e);
                pocNotBuilt("Transfer receipt");
            }
        });
    },

    //Alert whose dismissal drives the next step, as production's showErr callback does.
    acknowledge: function (msg, onDismiss) {
        kony.ui.Alert({
            message: msg,
            alertType: constants.ALERT_TYPE_CONFIRMATION,
            alertTitle: "Fawran",
            yesLabel: "Continue",
            noLabel: "Cancel",
            alertHandler: function (response) {
                if (response) { onDismiss(); }
                else { new kony.mvc.Navigation("frmFawranAmount").navigate(); }
            }
        }, {});
    },

    //Common's showLoadingScreen() resolves and does not throw (POC-CHECK passes it), but renders
    //nothing in this app — the confirm chain sat silent for ~20s. So the POC shows its own overlay
    //and calls Common's too, in case it works elsewhere. The overlay also swallows taps while a
    //submit is in flight, which is a second line of defence behind the submit guard.
    busy: function (on) {
        try {
            if (this.view.flxBusy) {
                this.view.flxBusy.setVisibility(on);
                if (on) { this.view.flxBusy.onTouchEnd = function () { }; }
                this.view.forceLayout();
            }
        } catch (e) {
            kony.print("frmFawranReview overlay busy(" + on + ") :: " + e);
        }
        try {
            if (on) { showLoadingScreen(); } else { dismissLoadingScreen(); }
        } catch (e) {
            kony.print("frmFawranReview busy(" + on + ") :: " + e);
        }
    },

    warn: function (msg) {
        kony.ui.Alert({
            message: msg,
            alertType: constants.ALERT_TYPE_INFO,
            alertTitle: "Fawran",
            yesLabel: "OK"
        }, {});
    },

});
