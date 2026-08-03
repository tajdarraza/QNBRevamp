define({

    //Guards a double-tap on Confirm. invokeServiceAsync's own duplicate guard covers the wire, but
    //this keeps the UI honest while the post is in flight.
    posting: false,

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.onDeviceBack;
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });
    },

    preShow: function () {
        this.posting = false;
        this.busy(false);
        this.bindActions();
        this.applyOtpLength();
        this.renderSummary();
        this.clearError();

        try { this.view.txtOtp.text = ""; } catch (e) { }

        //rtpVal has ALREADY run — the review screen's Confirm is what sent the SMS. This screen must
        //not re-send it on show, or the user gets two codes and the first one stops working.
        kony.print("POC FAWRAN OTP: expecting " + fawranDraft.otpLength + " digits");
    },

    //Back is allowed, but it abandons a transfer the server is already holding. Say so rather than
    //silently leaving another incomplete transaction behind — three of those suspend Fawran.
    onDeviceBack: function () {
        var self = this;
        kony.ui.Alert({
            message: "If you leave now this transfer stays incomplete. Too many incomplete transfers " +
                "will suspend your Fawran service.",
            alertType: constants.ALERT_TYPE_CONFIRMATION,
            alertTitle: "Fawran",
            yesLabel: "Leave",
            noLabel: "Stay",
            alertHandler: function (response) {
                if (response) { new kony.mvc.Navigation("frmFawran").navigate(); }
            }
        }, {});
    },

    safeTap: function (id, fn) {
        try {
            if (!this.view[id]) {
                kony.print("frmFawranOTP: WIDGET NOT FOUND -> " + id);
                return false;
            }
            this.view[id].onTouchEnd = fn;
            return true;
        } catch (e) {
            kony.print("frmFawranOTP safeTap " + id + " :: " + e);
            return false;
        }
    },

    safeText: function (id, txt) {
        if (txt === null || txt === undefined) { return; }
        try { if (this.view[id]) { this.view[id].text = "" + txt; } }
        catch (e) { kony.print("frmFawranOTP safeText " + id + " :: " + e); }
    },

    bindActions: function () {
        var self = this;
        this.safeTap("flxBack", function () { self.onDeviceBack(); });
        this.safeTap("imgClose", function () { self.onDeviceBack(); });
        //Container AND caption, for the same reason as the review screen.
        var tapped = function () { self.onConfirm(); };
        this.safeTap("flxBtnConfirmOtp", tapped);
        this.safeTap("lblBtnConfirmOtp", tapped);
        this.safeTap("lblResend", function () { self.onResend(); });

        try {
            this.view.txtOtp.onTextChange = function () { self.clearError(); };
        } catch (e) {
            kony.print("frmFawranOTP onTextChange :: " + e);
        }
    },

    //Server-driven: rtpVal returns otpLength. Never hardcode 6.
    applyOtpLength: function () {
        try {
            this.view.txtOtp.maxTextLength = fawranDraft.otpLength;
        } catch (e) {
            kony.print("frmFawranOTP applyOtpLength :: " + e);
        }
    },

    //Production masks as first three + **** + last four (frmInstaPayController rtpValCallBack).
    maskedMobile: function () {
        var n = "";
        try { n = (typeof gblQNB !== "undefined" && gblQNB) ? ("" + gblQNB.mmNo) : ""; } catch (e) { }
        if (!nullCheck(n) || n.length < 7) { return "your registered mobile number"; }
        return n.substring(0, 3) + "****" + n.slice(-4);
    },

    renderSummary: function () {
        var cur = fawranDraft.currency || "QAR";
        this.safeText("lblOtpInfo",
            "We sent a " + fawranDraft.otpLength + "-digit code to " + this.maskedMobile() + ".");
        this.safeText("lblOtpAmount", amountText(fawranDraft.amount) + " " + cur);
        this.safeText("lblOtpTo",
            nullCheck(fawranDraft.aliasValue) ? fawranDraft.aliasValue : "—");
    },

    otpValue: function () {
        try { return ("" + this.view.txtOtp.text).replace(/\s/g, ""); }
        catch (e) { return ""; }
    },

    showError: function (msg) {
        this.safeText("lblOtpError", msg);
        try { this.view.lblOtpError.setVisibility(true); } catch (e) { }
    },

    clearError: function () {
        try { this.view.lblOtpError.setVisibility(false); } catch (e) { }
    },

    onConfirm: function () {
        var self = this;
        if (this.posting) { return; }

        var otp = this.otpValue();
        if (!nullCheck(otp) || otp.length < fawranDraft.otpLength) {
            this.showError("Enter the " + fawranDraft.otpLength + "-digit code.");
            return;
        }

        this.posting = true;
        this.clearError();
        this.busy(true);

        fawranSubmit(otp, function (ok, data, code) {
            self.posting = false;
            self.busy(false);

            if (ok) {
                kony.print("POC FAWRAN OTP: rtpPost succeeded, code=" + code +
                    " receipt = " + JSON.stringify(data).substring(0, 400));
                fawranDraft.receipt = data;
                try {
                    new kony.mvc.Navigation("frmFawranSuccess").navigate();
                } catch (e) {
                    kony.print("frmFawranSuccess not available :: " + e);
                    pocNotBuilt("Transfer receipt");
                }
                return;
            }

            var msg = (data && data.status && nullCheck(data.status.description))
                ? data.status.description : "That code was not accepted.";

            //A wrong or expired code is recoverable HERE; an exhausted attempt counter is not — the
            //server has torn the pending transfer down, so staying on this screen would post against
            //nothing. Production makes the same split.
            if (fawranOtpFailureAction(code) === "retry") {
                self.showError(msg);
                try { self.view.txtOtp.text = ""; } catch (e) { }
                return;
            }

            kony.ui.Alert({
                message: msg,
                alertType: constants.ALERT_TYPE_INFO,
                alertTitle: "Fawran",
                yesLabel: "OK",
                alertHandler: function () {
                    fawranResetDraft();
                    new kony.mvc.Navigation("frmFawran").navigate();
                }
            }, {});
        });
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
            kony.print("frmFawranOTP overlay busy(" + on + ") :: " + e);
        }
        try {
            if (on) { showLoadingScreen(); } else { dismissLoadingScreen(); }
        } catch (e) {
            kony.print("frmFawranOTP busy(" + on + ") :: " + e);
        }
    },

    onResend: function () {
        var self = this;
        this.busy(true);
        fawranResendOtp(function (ok, res) {
            self.busy(false);
            if (!ok) {
                self.showError("Could not resend the code. Please try again.");
                return;
            }
            //rtpResend answers with the same shape as rtpVal, so the length can change.
            try {
                if (res && res.data && nullCheck(res.data.otpLength)) {
                    fawranDraft.otpLength = parseInt(res.data.otpLength, 10) || fawranDraft.otpLength;
                    self.applyOtpLength();
                }
            } catch (e) { }

            try { self.view.txtOtp.text = ""; } catch (e) { }
            self.clearError();
            self.renderSummary();
            kony.print("POC FAWRAN OTP: code resent");
            kony.ui.Alert({
                message: "A new code has been sent to " + self.maskedMobile() + ".",
                alertType: constants.ALERT_TYPE_INFO,
                alertTitle: "Fawran",
                yesLabel: "OK"
            }, {});
        });
    },

});
