define({
    onNavigate: function (navData) {
        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;


        this.view.commonheader.configure({
            title: "New account",
            action1: function () {
                alert("not yet developed");
            }
        });

        this.navigationData = navData || {};

        this.accountData = this.navigationData.accountData || [];
        this.interestRate = this.navigationData.interestRate || "";
        this.enteredAmount = this.navigationData.enteredAmount || "";
        this.selectedAccount = this.navigationData.selectedAccount || null;
        this.selectedCurrency = this.navigationData.selectedCurrency || null;
        this.selectedDepositType = this.navigationData.selectedDepositType || null;
        this.selectedDepositPeriod = this.navigationData.selectedDepositPeriod || null;
        this.isAutoRenew = this.navigationData.isAutoRenew || false;
    },

    init: function () {
        this.selectedReturnAccount = null;
        this.selectedInterestAccount = null;
    },

    preShow: function () {
        this.selectedReturnAccount = null;
        this.selectedInterestAccount = null;

        if (this.view.lblSelectedAcc1) {
            this.view.lblSelectedAcc1.text = "Select Account";
        }

        if (this.view.lblSelectedAcc2) {
            this.view.lblSelectedAcc2.text = "Select Account";
        }

        this.view.flxAccountReturn.onTouchEnd = this.flxAccountReturnOnClick.bind(this);
        this.view.flxAccountInterest.onTouchEnd = this.flxAccountInterestOnClick.bind(this);

        if (this.view.btnContinue) {
            this.view.btnContinue.onClick = this.btnContinueOnClick.bind(this);
        }
    },

    postShow: function () { },

    flxAccountReturnOnClick: function () {
        var self = this;
        var availableAccounts = this.getAvailableAccounts(this.selectedInterestAccount);

        this.view.commonlist.show({
            title: "Select Account",
            description2: "Selected account will receive the initial deposit",
            description2Visible: true,
            template: "flxAccountList",
            widgetDataMap: {
                lblAccountList: "lblAccountList"
            },
            data: availableAccounts,
            onRowSelected: function (rowData) {
                if (!rowData) {
                    return;
                }

                self.selectedReturnAccount = rowData;
                self.view.lblSelectedAcc1.text = rowData.lblAccountList;
                self.view.forceLayout();
            }
        });
    },

    flxAccountInterestOnClick: function () {
        var self = this;
        var availableAccounts = this.getAvailableAccounts(this.selectedReturnAccount);

        this.view.commonlist.show({
            title: "Select Account",
            description2: "Selected account will receive the interest",
            description2Visible: true,
            template: "flxAccountList",
            widgetDataMap: {
                lblAccountList: "lblAccountList"
            },
            data: availableAccounts,
            onRowSelected: function (rowData) {
                if (!rowData) {
                    return;
                }

                self.selectedInterestAccount = rowData;
                self.view.lblSelectedAcc2.text = rowData.lblAccountList;
                self.view.forceLayout();
            }
        });
    },

    getAvailableAccounts: function (selectedAccount) {
        var accounts = this.accountData || [];

        if (!selectedAccount) {
            return accounts.slice();
        }

        return accounts.filter(function (account) {
            return account.accountId !== selectedAccount.accountId;
        });
    },

    btnContinueOnClick: function () {
        if (!this.selectedReturnAccount) {
            alert("Please select the account for the initial deposit.");
            return;
        }

        if (!this.selectedInterestAccount) {
            alert("Please select the account for the interest.");
            return;
        }

        var navData = {
            accountData: this.accountData,
            selectedAccount: this.selectedAccount,
            selectedCurrency: this.selectedCurrency,
            interestRate: this.interestRate,
            selectedDepositType: this.selectedDepositType,
            selectedDepositPeriod: this.selectedDepositPeriod,
            enteredAmount: this.enteredAmount,
            isAutoRenew: this.isAutoRenew,
            selectedReturnAccount: this.selectedReturnAccount,
            selectedInterestAccount: this.selectedInterestAccount
        };

        kony.print("DEPOSIT RETURN :: NAV DATA :: " + JSON.stringify(navData));

        new kony.mvc.Navigation("frmDepositConfirmation").navigate(navData);
    }


});
