define({

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.onDeviceBack;
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });
    },

    preShow: function () {
        this.bindActions();
        //Optimistic render, but say so: rtpInfoNew has been taking 19-29s on SIT before failing,
        //and a card sitting on "—" for half a minute then flipping to an error looks broken.
        this.showEnrolled(true);
        this.safeText("lblFawranAlias", "Loading…");
        this.safeText("lblFawranBalance", "—");
        this.loadFawran();
    },

    onDeviceBack: function () {
        new kony.mvc.Navigation("frmTransfers").navigate();
    },

    safeTap: function (id, fn) {
        try {
            if (this.view[id]) { this.view[id].onTouchEnd = fn; }
        } catch (e) {
            kony.print("frmFawran safeTap " + id + " :: " + e);
        }
    },

    safeText: function (id, txt) {
        try {
            if (this.view[id]) { this.view[id].text = "" + txt; }
        } catch (e) {
            kony.print("frmFawran safeText " + id + " :: " + e);
        }
    },

    safeShow: function (id, show) {
        try {
            if (this.view[id]) { this.view[id].setVisibility(!!show); }
        } catch (e) {
            kony.print("frmFawran safeShow " + id + " :: " + e);
        }
    },

    bindActions: function () {
        var self = this;
        this.safeTap("flxBack", function () { self.onDeviceBack(); });
        this.safeTap("imgClose", function () {
            new kony.mvc.Navigation("frmDashboard").navigate();
        });
        this.safeTap("imgSettings", function () { pocNotBuilt("Fawran settings"); });
        this.safeTap("imgShare", function () { pocNotBuilt("Share alias"); });

        this.safeTap("flxBtnSend", function () { self.onSend(); });
        this.safeTap("flxBtnRequest", function () { pocNotBuilt("Request money"); });
        this.safeTap("flxBtnManage", function () { pocNotBuilt("Manage alias"); });

        this.safeTap("imgFooter1", function () {
            new kony.mvc.Navigation("frmDashboard").navigate();
        });
        this.safeTap("imgFooter2", function () {
            new kony.mvc.Navigation("frmCards").navigate();
        });
        this.safeTap("imgFooter3", function () { pocNotBuilt("Payments"); });
        this.safeTap("imgFooter4", function () {
            new kony.mvc.Navigation("frmTransfers").navigate();
        });
        this.safeTap("imgFooter5", function () { pocNotBuilt("Menu"); });
    },

    //Toggles between the enrolled layout (alias card + action buttons) and the not-enrolled notice.
    //Both occupy the same slot, so exactly one must be visible.
    showEnrolled: function (enrolled) {
        this.safeShow("flxAliasCard", enrolled);
        this.safeShow("flxBtnSend", enrolled);
        this.safeShow("flxBtnRequest", enrolled);
        this.safeShow("flxBtnManage", enrolled);
        this.safeShow("flxNoFawran", !enrolled);
    },

    loadFawran: function () {
        //ORDER MATTERS. Production's frmInstaPay calls rtpInfoNew FIRST (postShw -> callInfoSME),
        //and only reaches rtpAccList later, from rtpPurposeCallBack. This flow is demonstrably
        //server-side stateful — rtpVal and rtpPost carry no parameters and act on session state — so
        //rtpInfoNew is very likely the call that initiates it.
        //
        //An earlier version of this fetched accounts first, based on callInfoSendCB using an
        //already-populated account list. That was a misread: callInfoSend is the per-alias call
        //triggered later by senderAliasSel, not the screen-boot call.
        //
        //TESTED: reordering made no difference — rtpInfoNew still fails with GENER_CODE after ~24s
        //even when it is demonstrably the first RTP call of the session. Ordering is ruled out.
        //Accounts are therefore issued immediately after the info REQUEST goes out (not after it
        //returns), so the balance is not held hostage to a 24-second call that is going to fail.
        var self = this;
        this.loadInfo();
        fawranFetchAccounts(function () { self.applyBalance(); });
    },

    loadInfo: function () {
        var self = this;
        fawranFetchInfo(function (ok, data) {
            if (!ok || !data) {
                kony.print("POC FAWRAN: info call failed — showing not-enrolled state");
                self.showEnrolled(false);
                //Surface the server's own wording when it gave one; a generic "check your
                //connection" would be misleading for a server-side refusal.
                var msg = "Could not load Fawran details. Check the connection and try again.";
                if (data && data.status && nullCheck(data.status.description)) {
                    msg = data.status.description;
                }
                self.safeText("lblNoFawranMsg", msg);
                return;
            }

            //hasRTP is the hard gate. Anything other than "Y" and the server blocks the whole flow,
            //so there is no point rendering the alias card and Send button.
            if (data.hasRTP !== "Y") {
                kony.print("POC FAWRAN: hasRTP=" + data.hasRTP + " — customer not enrolled");
                self.showEnrolled(false);
                self.safeText("lblNoFawranMsg", "This account is not registered for Fawran.");
                return;
            }

            self.showEnrolled(true);
            self.safeText("lblFawranAlias", nullCheck(data.alias) ? data.alias : "—");
            self.safeText("lblFawranAccMasked", nullCheck(data.accNo) ? data.accNo : "");

            //Use the account the server nominated for Fawran. rtpInfoNew.accNo IS the account the
            //customer's alias is registered against — paying from a different one is a plausible
            //cause of RTP_0017 ("sender ... not registered"), since the sender the server checks is
            //the account, not the customer.
            //
            //Compare on DIGITS ONLY: acNoF and accNo are both formatted strings and there is no
            //guarantee they are punctuated identically. An exact === was failing silently and
            //leaving rows[0] selected.
            if (nullCheck(data.accNo)) {
                var want = ("" + data.accNo).replace(/\D/g, "");
                var matched = false;
                for (var i = 0; i < fawranAccounts.length; i++) {
                    var have = ("" + fawranAccounts[i].acNoF).replace(/\D/g, "");
                    kony.print("POC FAWRAN: acct[" + i + "] acNoF=" + fawranAccounts[i].acNoF +
                        " auid=" + fawranAccounts[i].auid + (have === want ? "  <-- NOMINATED" : ""));
                    if (have === want) {
                        fawranDraft.debitAccount = fawranAccounts[i];
                        matched = true;
                    }
                }
                if (!matched) {
                    kony.print("POC FAWRAN: *** nominated account " + data.accNo +
                        " is NOT in rtpAccList — debiting " +
                        (fawranDraft.debitAccount ? fawranDraft.debitAccount.acNoF : "(none)") + " ***");
                }
            }
            self.applyBalance();
        });
    },

    applyBalance: function () {
        var a = fawranDraft.debitAccount ||
            (fawranAccounts && fawranAccounts.length ? fawranAccounts[0] : null);
        if (!a) {
            this.safeText("lblFawranBalance", "—");
            return;
        }
        if (!fawranDraft.debitAccount) { fawranDraft.debitAccount = a; }
        this.safeText("lblFawranBalance",
            amountText(a.accBal) + " " + (nullCheck(a.cur) ? a.cur : "QAR"));
    },

    onSend: function () {
        //Start a clean draft each time, but keep the account we just defaulted.
        var acc = fawranDraft.debitAccount;
        fawranResetDraft();
        fawranDraft.debitAccount = acc;

        try {
            new kony.mvc.Navigation("frmFawranTransfer").navigate();
        } catch (e) {
            kony.print("frmFawranTransfer not available yet :: " + e);
            pocNotBuilt("Fawran transfer");
        }
    },

});
