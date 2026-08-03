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
        this.hideLimitSheet();
        this.applyMaxLength();
        this.renderTo();

        try {
            this.view.txtAmount.text = nullCheck(fawranDraft.amount) ? fawranDraft.amount : "";
        } catch (e) { }
        this.render();
    },

    onDeviceBack: function () {
        if (this.view.flxLimitSheet && this.view.flxLimitSheet.isVisible) {
            this.hideLimitSheet();
            return;
        }
        new kony.mvc.Navigation("frmFawranTransfer").navigate();
    },

    safeTap: function (id, fn) {
        try { if (this.view[id]) { this.view[id].onTouchEnd = fn; } }
        catch (e) { kony.print("frmFawranAmount safeTap " + id + " :: " + e); }
    },

    safeText: function (id, txt) {
        try { if (this.view[id]) { this.view[id].text = "" + txt; } }
        catch (e) { kony.print("frmFawranAmount safeText " + id + " :: " + e); }
    },

    bindActions: function () {
        var self = this;
        this.safeTap("flxBack", function () { self.onDeviceBack(); });
        this.safeTap("imgClose", function () {
            new kony.mvc.Navigation("frmFawran").navigate();
        });
        this.safeTap("imgLimitInfo", function () { self.showLimitSheet(); });
        this.safeTap("flxBtnUnderstood", function () { self.hideLimitSheet(); });
        this.safeTap("flxBtnReview", function () { self.onReview(); });

        //Native numeric keyboard, as the design shows (its mockup keypad is the OS one — note the
        //"2 ABC" / "3 DEF" / "+*#" keys). No custom keypad widget.
        try {
            this.view.txtAmount.onTextChange = function () { self.render(); };
        } catch (e) {
            kony.print("frmFawranAmount onTextChange :: " + e);
        }
    },

    //validationData.RTP.MaxAmt is a FIELD LENGTH, not a money cap — production uses it as
    //cmpAmnt.maxTextLength. Reading it as an amount is what produced the nonsensical
    //"Max 9.00 QAR per transfer".
    applyMaxLength: function () {
        try {
            var v = QNBConstants.validationData && QNBConstants.validationData.RTP;
            if (v && nullCheck(v.MaxAmt)) {
                this.view.txtAmount.maxTextLength = parseInt(v.MaxAmt, 10);
                kony.print("POC FAWRAN AMT: maxTextLength=" + v.MaxAmt + " chars (from validationData.RTP.MaxAmt)");
            }
        } catch (e) {
            kony.print("frmFawranAmount applyMaxLength :: " + e);
        }
    },

    //The real per-transfer cap is enforced SERVER-SIDE by rtpPayPreprocess, which returns
    //RTP_BL_003 / RTP_BL_004 when breached. There is no client-side limit field, so this figure is
    //informational only, taken from the design: 50,000 QAR normally, 10,000 for unregistered or
    //newly registered devices. This device reports devStatus=N, hence the lower figure.
    displayLimit: function () {
        var registered = (typeof gblQNB !== "undefined" && gblQNB && gblQNB.devStatus === "Y");
        return registered ? 50000 : 10000;
    },

    renderTo: function () {
        this.safeText("lblToAlias", nullCheck(fawranDraft.aliasValue) ? fawranDraft.aliasValue : "—");
        this.safeText("lblToMainPurpose", nullCheck(fawranDraft.purposeDesc) ? fawranDraft.purposeDesc : "—");
        this.safeText("lblToSubPurpose", nullCheck(fawranDraft.subPurposeDesc) ? fawranDraft.subPurposeDesc : "—");
        this.safeText("lblCurrency", fawranDraft.currency || "QAR");
    },

    raw: function () {
        try { return ("" + this.view.txtAmount.text).replace(/,/g, ""); }
        catch (e) { return ""; }
    },

    render: function () {
        var amt = amountNumber(this.raw());
        var lim = this.displayLimit();
        var cur = fawranDraft.currency || "QAR";
        var over = amt > lim;

        this.safeText("lblMaxLimit",
            (over ? "Exceeds max " : "Max ") + formatAmount(lim) + " " + cur + " per transfer");

        //sknlblCordaleRed30px is NOT red despite the name (#5A606E grey) — the theme had no red
        //label, so these were cloned from the normal skins with only the colour changed.
        try {
            this.view.txtAmount.skin = over ? "sknLblAmountRedDE2B37" : "CopydefLabel0ebbade0e723843";
            this.view.lblMaxLimit.skin = over ? "sknLblSmallRedDE2B37" : "sknLblSansENNormal14px1b124b";
        } catch (e) {
            kony.print("frmFawranAmount over-limit skin :: " + e);
        }
    },

    showLimitSheet: function () {
        try { this.view.flxLimitSheet.setVisibility(true); this.view.forceLayout(); }
        catch (e) { kony.print("showLimitSheet :: " + e); }
    },

    hideLimitSheet: function () {
        try { this.view.flxLimitSheet.setVisibility(false); }
        catch (e) { kony.print("hideLimitSheet :: " + e); }
    },

    onReview: function () {
        var amt = amountNumber(this.raw());
        if (amt <= 0) { this.warn("Enter an amount to send."); return; }
        if (amt > this.displayLimit()) {
            this.warn("Amount exceeds the maximum of " + formatAmount(this.displayLimit()) + " " +
                (fawranDraft.currency || "QAR") + " per transfer.");
            return;
        }

        fawranDraft.amount = this.raw();
        kony.print("POC FAWRAN AMT: amount=" + fawranDraft.amount + " " + fawranDraft.currency);

        try {
            new kony.mvc.Navigation("frmFawranReview").navigate();
        } catch (e) {
            kony.print("frmFawranReview not available yet :: " + e);
            pocNotBuilt("Review transfer");
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
