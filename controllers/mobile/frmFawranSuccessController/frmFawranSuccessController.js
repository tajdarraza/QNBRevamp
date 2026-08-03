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
        this.render();
    },

    //The transfer is done and the server has consumed the pending transfer. Going "back" to the OTP
    //screen would post against nothing, so hardware back leaves the flow entirely.
    onDeviceBack: function () {
        this.finish("frmDashboard");
    },

    safeTap: function (id, fn) {
        try { if (this.view[id]) { this.view[id].onTouchEnd = fn; } }
        catch (e) { kony.print("frmFawranSuccess safeTap " + id + " :: " + e); }
    },

    safeText: function (id, txt) {
        if (txt === null || txt === undefined) { return; }
        try { if (this.view[id]) { this.view[id].text = "" + txt; } }
        catch (e) { kony.print("frmFawranSuccess safeText " + id + " :: " + e); }
    },

    bindActions: function () {
        var self = this;
        this.safeTap("imgClose", function () { self.finish("frmFawran"); });
        //Container and caption both, for the same reason as the review screen's CTA.
        this.safeTap("flxBtnDone", function () { self.finish("frmFawran"); });
        this.safeTap("lblBtnDone", function () { self.finish("frmFawran"); });
        this.safeTap("lblAnother", function () { self.showReceipt(); });
    },

    //Always clear the draft on the way out. Leaving a completed transfer in fawranDraft would let the
    //next run re-use a stale preprocessed reference and post the wrong thing.
    finish: function (formName) {
        fawranResetDraft();
        new kony.mvc.Navigation(formName).navigate();
    },

    //The design's card carries no reference numbers, but refId / refNo / txnDate are the only proof
    //the transfer actually happened — so they live behind "Get receipt" rather than being dropped.
    showReceipt: function () {
        var r = fawranDraft.receipt || {};
        var cur = fawranDraft.currency || "QAR";
        var acc = (fawranDraft.debitAccount && nullCheck(fawranDraft.debitAccount.acNoF))
            ? fawranDraft.debitAccount.acNoF : "—";
        var lines = [
            "Transaction reference no.",
            nullCheck(r.refId) ? r.refId : "—",
            "",
            "Fawran reference no.",
            nullCheck(r.refNo) ? r.refNo : "—",
            "",
            "Date and time",
            nullCheck(r.txnDate) ? r.txnDate : "—",
            "",
            "Transfer from",
            acc,
            "",
            "Total debit amount",
            formatAmount(fawranTotalDebit()) + " " + cur
        ];
        kony.ui.Alert({
            message: lines.join("\n"),
            alertType: constants.ALERT_TYPE_INFO,
            alertTitle: "Receipt",
            yesLabel: "Close"
        }, {});
    },

    render: function () {
        var r = fawranDraft.receipt || {};
        var cur = fawranDraft.currency || "QAR";

        kony.print("POC FAWRAN SUCCESS: receipt fields = " + JSON.stringify(r).substring(0, 500));

        //RTP_0012 / RTP_0014 are accepted-but-qualified outcomes, and the server's own wording says
        //what the qualification is ("initiated" rather than "sent"). That is more accurate than the
        //design's flat "Money transfer successfully", so it wins whenever the server supplies it.
        this.safeText("lblSuccessMsg",
            nullCheck(r._message) ? r._message : "Money transfer successfully");

        //Card mirrors the design: beneficiary alias, main purpose, sub-purpose, total debit.
        this.safeText("lblTxnRef", nullCheck(fawranDraft.aliasValue) ? fawranDraft.aliasValue : "—");
        this.safeText("lblFawranRef",
            nullCheck(fawranDraft.purposeDesc) ? fawranDraft.purposeDesc : "—");
        this.safeText("lblTxnDate",
            nullCheck(fawranDraft.subPurposeDesc) ? fawranDraft.subPurposeDesc : "—");
        this.safeText("lblRcptTotal", formatAmount(fawranTotalDebit()) + " " + cur);
    },

});
