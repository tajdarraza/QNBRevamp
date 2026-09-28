define({

    // Which picker the common list is currently showing:
    // "acc" | "alias" | "main" | "sub"
    pickerMode: "",

    // Maximum number of accounts displayed in the account picker.
    MAX_ACCOUNT_PICKER_ROWS: 8,

    onNavigate: function (navData) {
        var self = this;

        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.onDeviceBack;

        this.view.cmpFooter.initializeFooter();
        this.view.cmpFooter.setSelectedTab("transfer");
    },

    preShow: function () {
        var self = this;

        this.bindActions();
        this.hidePicker();
        this.renderDraft();

        // rtpAccList and rtpPurpose are REAL and confirmed working.
        // Alias types come from rtpInfoNew.
        this.loadAccounts();
        this.loadPurposes();

        this.view.commonheader.configure({
            title: "Fawran",
            backAction: function () {
                self.onDeviceBack();
            },
            action1: function () {
                new kony.mvc.Navigation("frmFawran").navigate();
            },
            action1Image: "customsettings.png",
            action2: function () {
                self.onDeviceBack();
            }
        });
    },

    onDeviceBack: function () {
        if (this.view.commonlist &&
            this.view.commonlist.isOpen) {

            this.hidePicker();
            return;
        }

        new kony.mvc.Navigation("frmFawran").navigate();
    },

    // -------------------------------------------------------------------------
    // Small guarded helpers
    // -------------------------------------------------------------------------

    safeTap: function (id, fn) {
        try {
            if (this.view[id]) {
                this.view[id].onTouchEnd = fn;
            }
        } catch (e) {
            kony.print(
                "frmFawranTransfer safeTap " +
                id +
                " :: " +
                e
            );
        }
    },

    safeText: function (id, txt) {
        if (txt === null || txt === undefined) {
            return;
        }

        try {
            if (this.view[id]) {
                this.view[id].text = "" + txt;
            }
        } catch (e) {
            kony.print(
                "frmFawranTransfer safeText " +
                id +
                " :: " +
                e
            );
        }
    },

    // -------------------------------------------------------------------------
    // Bind actions
    // -------------------------------------------------------------------------

    bindActions: function () {
        var self = this;

        this.safeTap("flxTransferFrom", function () {
            self.openAccountPicker();
        });

        this.safeTap("lblChangeAccount", function () {
            self.openAccountPicker();
        });

        this.safeTap("flxAliasType", function () {
            self.openAliasTypePicker();
        });

        this.safeTap("flxMainPurpose", function () {
            self.openPurposePicker("main");
        });

        this.safeTap("flxSubPurpose", function () {
            self.openPurposePicker("sub");
        });

        this.safeTap("flxBtnContinue", function () {
            self.onContinue();
        });
    },

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    loadAccounts: function () {
        var self = this;

        fawranFetchAccounts(function (ok, rows) {

            if (!ok || !rows || !rows.length) {
                self.safeText(
                    "lblFromAlias",
                    "No debit accounts"
                );
                return;
            }

            /*
             * Preserve the existing behavior:
             * if there is no account already selected,
             * automatically select the first account.
             */
            if (!fawranDraft.debitAccount) {
                fawranDraft.debitAccount = rows[0];
            }

            self.renderDraft();
        });
    },

    loadPurposes: function () {
        var self = this;

        fawranFetchPurposes(function (ok, rows) {

            kony.print(
                "POC FAWRAN XFER: purposes loaded=" +
                (ok && rows ? rows.length : 0)
            );

            if (
                ok &&
                rows &&
                rows.length &&
                !nullCheck(fawranDraft.purposeCode)
            ) {
                self.renderDraft();
            }
        });
    },

    // -------------------------------------------------------------------------
    // Render existing draft
    // -------------------------------------------------------------------------

renderDraft: function () {
    var a = fawranDraft.debitAccount;

    /*
     * ACCOUNT DISPLAY
     */
    if (a) {
        this.safeText(
            "lblFromAlias",
            nullCheck(a.acNoF)
                ? a.acNoF
                : ""
        );

        this.safeText(
            "lblFromAccType",
            nullCheck(a.atdsc)
                ? a.atdsc
                : ""
        );

        this.safeText(
            "lblFromBalance",
            amountText(a.accBal)
        );

        this.safeText(
            "lblFromCurrency",
            nullCheck(a.cur)
                ? a.cur
                : "QAR"
        );
    }

    /*
     * ALIAS TYPE
     */
    if (nullCheck(fawranDraft.aliasTypeDesc)) {

        this.safeText(
            "lblAliasType",
            fawranDraft.aliasTypeDesc
        );

        this.safeText(
            "lblAliasValueLabel",
            fawranDraft.aliasTypeDesc
        );

        this.view.lblAliasType.skin =
            "sknLblSansENNormal14px1b124b";

    } else {

        this.safeText(
            "lblAliasValueLabel",
            "Beneficiary alias"
        );

        this.view.lblAliasType.skin =
            "sknLbl16PxA8A1C4";
    }

    /*
     * MAIN PURPOSE
     */
    if (nullCheck(fawranDraft.purposeDesc)) {

        this.safeText(
            "lblMainPurpose",
            fawranDraft.purposeDesc
        );

        this.view.lblMainPurpose.skin =
            "sknLblSansENNormal14px1b124b";

    } else {

        this.safeText(
            "lblMainPurpose",
            "Select"
        );

        this.view.lblMainPurpose.skin =
            "sknLbl16PxA8A1C4";
    }

    /*
     * SUB PURPOSE
     */
    if (nullCheck(fawranDraft.subPurposeDesc)) {

        this.safeText(
            "lblSubPurpose",
            fawranDraft.subPurposeDesc
        );

        this.view.lblSubPurpose.skin =
            "sknLblSansENNormal14px1b124b";

    } else {

        this.safeText(
            "lblSubPurpose",
            "Select"
        );

        this.view.lblSubPurpose.skin =
            "sknLbl16PxA8A1C4";
    }
},

    // -------------------------------------------------------------------------
    // Account picker
    // -------------------------------------------------------------------------

    openAccountPicker: function () {
        var self = this;
        var rows = [];

        /*
         * Limit the account picker to 8 accounts.
         *
         * We do not modify fawranAccounts itself.
         * Only the picker display is limited.
         */
        var accountCount = Math.min(
            fawranAccounts.length,
            this.MAX_ACCOUNT_PICKER_ROWS
        );

        for (var i = 0; i < accountCount; i++) {

            var a = fawranAccounts[i];

            rows.push({
                label: nullCheck(a.acNoF)
                    ? a.acNoF
                    : "",

                sub: nullCheck(a.atdsc)
                    ? a.atdsc
                    : "",

                amount: amountText(a.accBal),

                currency: nullCheck(a.cur)
                    ? a.cur
                    : "QAR",

                acc: a
            });
        }

        if (!rows.length) {
            pocNotBuilt("Debit accounts");
            return;
        }

        kony.print(
            "POC FAWRAN XFER: account picker showing " +
            rows.length +
            " of " +
            fawranAccounts.length +
            " accounts"
        );

        this.pickerMode = "acc";

        this.view.commonlist.show({

            title: "Transfer from",

            template: "flxAllAccounts",

            widgetDataMap: {
                lblAccName: "sub",
                lblAccNum: "label",
                lblAmount: "amount",
                lblCurrency: "currency"
            },

            data: rows,

            onRowSelected: function (row) {

                if (!row) {
                    return;
                }

                /*
                 * Preserve the original behavior:
                 * only replace the selected debit account.
                 *
                 * renderDraft() updates:
                 * lblFromAlias
                 * lblFromAccType
                 * lblFromBalance
                 * lblFromCurrency
                 */
                fawranDraft.debitAccount = row.acc;

                self.renderDraft();

                self.pickerMode = "";
            }
        });
    },

    // -------------------------------------------------------------------------
    // Alias type
    // -------------------------------------------------------------------------

    aliasTypeLabel: function (it, isCorp) {

        if (!it) {
            return "";
        }

        /*
         * Corporate alias types carry their own description.
         */
        if (isCorp) {

            return nullCheck(it.desc)
                ? it.desc
                : (it.type || "");
        }

        /*
         * Retail alias types.
         *
         * This mirrors production behavior.
         */
        if (it.type === "MOB") {
            return "Mobile number";
        }

        if (it.type === "ALI") {
            return "Alias name";
        }

        return "IBAN";
    },

    openAliasTypePicker: function () {
        var self = this;

        var info = fawranInfo || {};

        var retail = info.benAliasTypes || [];
        var corp = info.benAliasTypesCorp || [];

        if (!retail.length && !corp.length) {
            pocNotBuilt(
                "Beneficiary alias types"
            );
            return;
        }

        kony.print(
            "POC FAWRAN XFER: alias types " +
            (info._standIn ? "STAND-IN" : "from rtpInfoNew") +
            ", retail=" +
            retail.length +
            " corp=" +
            corp.length +
            ", retail[0]=" +
            JSON.stringify(retail[0]) +
            " corp[0]=" +
            JSON.stringify(corp[0])
        );

        var rows = [];
        var i;

        /*
         * Retail
         */
        for (i = 0; i < retail.length; i++) {

            rows.push({
                label: this.aliasTypeLabel(
                    retail[i],
                    false
                ),

                description: "",

                type: retail[i].type,

                isCorp: false
            });
        }

        /*
         * Corporate
         */
        for (i = 0; i < corp.length; i++) {

            rows.push({
                label: this.aliasTypeLabel(
                    corp[i],
                    true
                ),

                description: "",

                type: corp[i].type,

                isCorp: true
            });
        }

        this.pickerMode = "alias";

        this.view.commonlist.show({

            title: "Beneficiary alias type",

            template: "flxOptionList",

            widgetDataMap: {
                lblOption: "label",
                lblOptionDesc: "description"
            },

            data: rows,

            onRowSelected: function (row) {

                if (!row) {
                    return;
                }

                fawranDraft.aliasType = row.type;

                fawranDraft.aliasTypeDesc =
                    row.label;

                fawranDraft.aliasIsCorp =
                    !!row.isCorp;

                /*
                 * Field label follows the selected alias type.
                 */
                self.safeText(
                    "lblAliasValueLabel",
                    row.label
                );

                self.renderDraft();

                self.pickerMode = "";
            }
        });
    },

    // -------------------------------------------------------------------------
    // Purpose picker
    // -------------------------------------------------------------------------

    openPurposePicker: function (which) {
        var self = this;

        if (
            !fawranPurposes ||
            !fawranPurposes.length
        ) {
            pocNotBuilt(
                "Remittance purposes"
            );
            return;
        }

        var rows = [];
        var i;

        // ---------------------------------------------------------------------
        // MAIN PURPOSE
        // ---------------------------------------------------------------------

        if (which === "main") {

            for (
                i = 0;
                i < fawranPurposes.length;
                i++
            ) {

                rows.push({
                    label: fawranPurposes[i].label,

                    description: "",

                    item: fawranPurposes[i]
                });
            }

            this.pickerMode = "main";

            this.view.commonlist.show({

                title: "Main purpose of remittance",

                template: "flxOptionList",

                widgetDataMap: {
                    lblOption: "label",
                    lblOptionDesc: "description"
                },

                data: rows,

                onRowSelected: function (row) {

                    if (!row || !row.item) {
                        return;
                    }

                    /*
                     * Store the COMPLETE selected purpose.
                     *
                     * This is important because the sub-purpose
                     * picker gets its data from row.item.subs.
                     */
                    fawranDraft.purposeItem =
                        row.item;

                    fawranDraft.purposeCode =
                        row.item.code;

                    fawranDraft.purposeDesc =
                        row.label;

                    /*
                     * Selecting a new main purpose invalidates
                     * the previously selected sub-purpose.
                     */
                    fawranDraft.subPurposeDesc = "";
                    fawranDraft.subPurposeCode = "";

                    self.safeText(
                        "lblSubPurpose",
                        "Select"
                    );

                    kony.print(
                        "POC FAWRAN XFER: main purpose " +
                        row.item.code +
                        ", sub count=" +
                        (
                            row.item.subs
                                ? row.item.subs.length
                                : 0
                        )
                    );

                    self.renderDraft();

                    self.pickerMode = "";
                }
            });

            return;
        }

        // ---------------------------------------------------------------------
        // SUB PURPOSE
        // ---------------------------------------------------------------------

        /*
         * Sub-purpose is NOT allowed until a main purpose
         * has been selected.
         */
        var main = fawranDraft.purposeItem;

        if (!main) {

            this.warn(
                "Select the main purpose of remittance first."
            );

            return;
        }

        /*
         * The sub-purpose list belongs ONLY to the selected
         * main purpose.
         */
        var subs = main.subs || [];

        if (!subs.length) {

            this.warn(
                "This purpose has no sub-purpose to choose."
            );

            return;
        }

        for (
            i = 0;
            i < subs.length;
            i++
        ) {

            rows.push({
                label: subs[i].label,

                description: "",

                code: subs[i].code,

                item: subs[i]
            });
        }

        this.pickerMode = "sub";

        this.view.commonlist.show({

            title: "Sub-purpose of remittance",

            template: "flxOptionList",

            widgetDataMap: {
                lblOption: "label",
                lblOptionDesc: "description"
            },

            data: rows,

            onRowSelected: function (row) {

                if (!row) {
                    return;
                }

                fawranDraft.subPurposeDesc =
                    row.label;

                fawranDraft.subPurposeCode =
                    nullCheck(row.code)
                        ? row.code
                        : "";

                kony.print(
                    "POC FAWRAN XFER: sub-purpose " +
                    row.label +
                    " fullCode=" +
                    row.code
                );

                self.renderDraft();

                self.pickerMode = "";
            }
        });
    },

    // -------------------------------------------------------------------------
    // Hide common list
    // -------------------------------------------------------------------------

    hidePicker: function () {
        try {

            if (this.view.commonlist) {

                /*
                 * Prevent an old callback from firing
                 * after back/cancel/close.
                 */
                this.view.commonlist.selectedCallback =
                    null;

                this.view.commonlist.hide();
            }

        } catch (e) {

            kony.print(
                "frmFawranTransfer hidePicker :: " +
                e
            );
        }

        this.pickerMode = "";
    },

    // -------------------------------------------------------------------------
    // Continue
    // -------------------------------------------------------------------------

    onContinue: function () {
        var val = "";

        try {
            val = this.view.txtAliasValue.text;
        } catch (e) {
        }

        if (!fawranDraft.debitAccount) {

            this.warn(
                "Select an account to transfer from."
            );

            return;
        }

        if (!nullCheck(fawranDraft.aliasType)) {

            this.warn(
                "Select a beneficiary alias type."
            );

            return;
        }

        if (!nullCheck(val)) {

            this.warn(
                "Enter the beneficiary " +
                (
                    fawranDraft.aliasTypeDesc ||
                    "alias"
                ) +
                "."
            );

            return;
        }

        if (!nullCheck(fawranDraft.purposeCode)) {

            this.warn(
                "Select the main purpose of remittance."
            );

            return;
        }

        /*
         * Preserve the existing behavior:
         * sub-purpose is optional at this stage because
         * the original controller did not validate it here.
         */
        fawranDraft.aliasValue = val;

        fawranDraft.currency =
            fawranDraft.debitAccount.cur ||
            "QAR";

        kony.print(
            "POC FAWRAN XFER: draft ready aliasType=" +
            fawranDraft.aliasType +
            " purpose=" +
            fawranDraft.purposeCode +
            " auid=" +
            fawranDraft.debitAccount.auid
        );

        try {

            new kony.mvc.Navigation(
                "frmFawranAmount"
            ).navigate();

        } catch (e) {

            kony.print(
                "frmFawranAmount not available yet :: " +
                e
            );

            pocNotBuilt(
                "Amount entry"
            );
        }
    },

    // -------------------------------------------------------------------------
    // Warning
    // -------------------------------------------------------------------------

    warn: function (msg) {
        kony.ui.Alert(
            {
                message: msg,
                alertType: constants.ALERT_TYPE_INFO,
                alertTitle: "Fawran",
                yesLabel: "OK"
            },
            {}
        );
    }

});