define({

    //Which picker the sheet is currently showing: "acc" | "alias" | "main" | "sub"
    pickerMode: "",

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
        this.hidePicker();
        this.renderDraft();

        //rtpAccList and rtpPurpose are both REAL and confirmed working. Alias types come from
        //rtpInfoNew, which is down on SIT, so those are stand-ins — see FawranService.
        this.loadAccounts();
        this.loadPurposes();
    },

    onDeviceBack: function () {
        if (this.view.flxPickerSheet && this.view.flxPickerSheet.isVisible) {
            this.hidePicker();
            return;
        }
        new kony.mvc.Navigation("frmFawran").navigate();
    },

    //--- small guarded helpers -------------------------------------------------------------------

    safeTap: function (id, fn) {
        try { if (this.view[id]) { this.view[id].onTouchEnd = fn; } }
        catch (e) { kony.print("frmFawranTransfer safeTap " + id + " :: " + e); }
    },

    //Ignores null/undefined rather than writing the literal string "undefined" to the screen.
    safeText: function (id, txt) {
        if (txt === null || txt === undefined) { return; }
        try { if (this.view[id]) { this.view[id].text = "" + txt; } }
        catch (e) { kony.print("frmFawranTransfer safeText " + id + " :: " + e); }
    },

    bindActions: function () {
        var self = this;
        this.safeTap("flxBack", function () { self.onDeviceBack(); });
        this.safeTap("imgClose", function () {
            new kony.mvc.Navigation("frmFawran").navigate();
        });

        this.safeTap("flxTransferFrom", function () { self.openAccountPicker(); });
        this.safeTap("lblChangeAccount", function () { self.openAccountPicker(); });
        this.safeTap("flxAliasType", function () { self.openAliasTypePicker(); });
        this.safeTap("flxMainPurpose", function () { self.openPurposePicker("main"); });
        this.safeTap("flxSubPurpose", function () { self.openPurposePicker("sub"); });

        this.safeTap("flxBtnContinue", function () { self.onContinue(); });
        this.safeTap("imgPickerClose", function () { self.hidePicker(); });

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

    //--- data ------------------------------------------------------------------------------------

    loadAccounts: function () {
        var self = this;
        fawranFetchAccounts(function (ok, rows) {
            if (!ok || !rows.length) {
                self.safeText("lblFromAlias", "No debit accounts");
                return;
            }
            if (!fawranDraft.debitAccount) { fawranDraft.debitAccount = rows[0]; }
            self.renderDraft();
        });
    },

    loadPurposes: function () {
        var self = this;
        fawranFetchPurposes(function (ok, rows) {
            kony.print("POC FAWRAN XFER: purposes loaded=" + (ok ? rows.length : 0));
            if (ok && rows.length && !nullCheck(fawranDraft.purposeCode)) {
                self.renderDraft();
            }
        });
    },

    renderDraft: function () {
        var a = fawranDraft.debitAccount;
        if (a) {
            this.safeText("lblFromAlias", nullCheck(a.acNoF) ? a.acNoF : "");
            this.safeText("lblFromAccType", nullCheck(a.atdsc) ? a.atdsc : "");
            this.safeText("lblFromBalance",
                amountText(a.accBal) + " " + (nullCheck(a.cur) ? a.cur : "QAR"));
        }
        //Guard both: an undefined here previously rendered as the literal string "undefined" above
        //the input, because safeText stringifies whatever it is given.
        if (nullCheck(fawranDraft.aliasTypeDesc)) {
            this.safeText("lblAliasType", fawranDraft.aliasTypeDesc);
            this.safeText("lblAliasValueLabel", fawranDraft.aliasTypeDesc);
        } else {
            this.safeText("lblAliasValueLabel", "Beneficiary alias");
        }
        if (nullCheck(fawranDraft.purposeDesc)) {
            this.safeText("lblMainPurpose", fawranDraft.purposeDesc);
        }
        if (nullCheck(fawranDraft.subPurposeDesc)) {
            this.safeText("lblSubPurpose", fawranDraft.subPurposeDesc);
        }
    },

    //--- picker sheet ----------------------------------------------------------------------------
    //Rows are built at runtime rather than using a Segment: the row content differs per picker and
    //this avoids introducing a template whose binding we cannot verify without the service.

    //Rows are STATIC widgets in the form (flxPickRow0..9), not built at runtime.
    //Runtime-constructed kony.ui.Label ignored its position config however it was passed, so every
    //row rendered on the same line on top of the others. Pre-built rows remove the whole class of
    //problem: the controller only sets text, visibility and the tap handler.
    PICKER_ROWS: 10,

    showPicker: function (title, rows, onPick) {
        var self = this;
        this.safeText("lblPickerTitle", title);

        if (rows.length > this.PICKER_ROWS) {
            //Never silently truncate — say so, so a missing option is not mistaken for missing data.
            kony.print("POC FAWRAN XFER: picker has " + rows.length + " rows but only " +
                this.PICKER_ROWS + " slots exist — extra rows NOT shown");
        }

        for (var i = 0; i < this.PICKER_ROWS; i++) {
            var row = (i < rows.length) ? rows[i] : null;
            this.showRow(i, row, rows.length, onPick);
        }

        try {
            this.view.flxPickerSheet.setVisibility(true);
            this.view.forceLayout();
        } catch (e) {
            kony.print("frmFawranTransfer showPicker :: " + e);
        }
    },

    showRow: function (i, row, total, onPick) {
        var self = this;
        var flx = this.view["flxPickRow" + i];
        var lbl = this.view["lblPickRow" + i];
        var div = this.view["flxPickDiv" + i];
        if (!flx || !lbl) { return; }

        if (!row) { flx.setVisibility(false); return; }

        lbl.text = row.label;
        flx.setVisibility(true);
        //Making the parent visible does NOT recurse, so the label and divider are set explicitly.
        lbl.setVisibility(true);
        if (div) { div.setVisibility(i < total - 1); }

        var handler = function () {
            self.hidePicker();
            onPick(row);
        };
        flx.onTouchEnd = handler;
        lbl.onTouchEnd = handler;
    },

    hidePicker: function () {
        try { this.view.flxPickerSheet.setVisibility(false); }
        catch (e) { kony.print("hidePicker :: " + e); }
    },

    openAccountPicker: function () {
        var self = this;
        var rows = [];
        for (var i = 0; i < fawranAccounts.length; i++) {
            var a = fawranAccounts[i];
            rows.push({
                label: a.acNoF + "   " + amountText(a.accBal) + " " + (a.cur || "QAR"),
                acc: a
            });
        }
        if (!rows.length) { pocNotBuilt("Debit accounts"); return; }
        this.showPicker("Transfer from", rows, function (row) {
            fawranDraft.debitAccount = row.acc;
            self.renderDraft();
        });
    },

    //Label derivation MIRRORS PRODUCTION (QNBMBTransfer/frmInstaPayController.js:578-606).
    //The two lists are NOT the same shape, which is what produced the literal "undefined":
    //
    //  benAliasTypes (retail)     -> rows carry ONLY `type`. There is no desc. Production derives
    //                                the label client-side: MOB -> mobile number, ALI -> alias name,
    //                                anything else -> IBAN (the default branch).
    //  benAliasTypesCorp (SME)    -> rows DO carry `desc`, and production uses it verbatim.
    //
    //Reading `.desc` off the retail rows yields undefined for every one of them. The corporate rows
    //rendered fine, which is exactly the split seen on device.
    aliasTypeLabel: function (it, isCorp) {
        if (isCorp) { return nullCheck(it.desc) ? it.desc : (it.type || ""); }
        if (it.type === "MOB") { return "Mobile number"; }
        if (it.type === "ALI") { return "Alias name"; }
        return "IBAN";
    },

    openAliasTypePicker: function () {
        var self = this;
        var info = fawranInfo || {};
        var retail = info.benAliasTypes || [];
        var corp = info.benAliasTypesCorp || [];
        if (!retail.length && !corp.length) { pocNotBuilt("Beneficiary alias types"); return; }

        kony.print("POC FAWRAN XFER: alias types " + (info._standIn ? "STAND-IN" : "from rtpInfoNew") +
            ", retail=" + retail.length + " corp=" + corp.length +
            ", retail[0]=" + JSON.stringify(retail[0]) + " corp[0]=" + JSON.stringify(corp[0]));

        //isCorp travels with the row: rtpPayPreprocess needs it as isCorpBen to know which alias
        //namespace to resolve the beneficiary in.
        var rows = [], i;
        for (i = 0; i < retail.length; i++) {
            rows.push({ label: this.aliasTypeLabel(retail[i], false), type: retail[i].type, isCorp: false });
        }
        for (i = 0; i < corp.length; i++) {
            rows.push({ label: this.aliasTypeLabel(corp[i], true), type: corp[i].type, isCorp: true });
        }
        this.showPicker("Beneficiary alias type", rows, function (row) {
            fawranDraft.aliasType = row.type;
            fawranDraft.aliasTypeDesc = row.label;
            fawranDraft.aliasIsCorp = !!row.isCorp;
            //Field label follows the chosen type, as the design does.
            self.safeText("lblAliasValueLabel", row.label);
            self.renderDraft();
        });
    },

    //rtpPurpose returns a flat list of {purposeCode, purposeDesc} — there is no sub-purpose data in
    //the response. The design shows two dropdowns, so main sets `p` (purposeCode) and sub sets `pd`
    //(the free-text description production sends alongside it). Worth confirming with the business
    //whether sub-purpose is meant to be a second server-driven list.
    openPurposePicker: function (which) {
        var self = this;
        if (!fawranPurposes.length) { pocNotBuilt("Remittance purposes"); return; }

        var rows = [];
        for (var i = 0; i < fawranPurposes.length; i++) {
            rows.push({
                label: fawranPurposes[i].purposeDesc,
                code: fawranPurposes[i].purposeCode
            });
        }
        this.showPicker(which === "main" ? "Main purpose of remittance"
                                         : "Sub-purpose of remittance",
            rows, function (row) {
                if (which === "main") {
                    fawranDraft.purposeCode = row.code;
                    fawranDraft.purposeDesc = row.label;
                } else {
                    fawranDraft.subPurposeDesc = row.label;
                }
                self.renderDraft();
            });
    },

    //--- continue --------------------------------------------------------------------------------

    onContinue: function () {
        var val = "";
        try { val = this.view.txtAliasValue.text; } catch (e) { }

        if (!fawranDraft.debitAccount) { this.warn("Select an account to transfer from."); return; }
        if (!nullCheck(fawranDraft.aliasType)) { this.warn("Select a beneficiary alias type."); return; }
        if (!nullCheck(val)) { this.warn("Enter the beneficiary " + (fawranDraft.aliasTypeDesc || "alias") + "."); return; }
        if (!nullCheck(fawranDraft.purposeCode)) { this.warn("Select the main purpose of remittance."); return; }

        fawranDraft.aliasValue = val;
        fawranDraft.currency = fawranDraft.debitAccount.cur || "QAR";

        kony.print("POC FAWRAN XFER: draft ready aliasType=" + fawranDraft.aliasType +
            " purpose=" + fawranDraft.purposeCode +
            " auid=" + fawranDraft.debitAccount.auid);

        try {
            new kony.mvc.Navigation("frmFawranAmount").navigate();
        } catch (e) {
            kony.print("frmFawranAmount not available yet :: " + e);
            pocNotBuilt("Amount entry");
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
