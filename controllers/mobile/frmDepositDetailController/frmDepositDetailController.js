define({
  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    this.view.commonheader.configure({
      title: "New account",
      action1: function () {
        alert("not yet developed");
      },
    });

    this.data = navData;
  },

  init: function () {
    this.accountData = [
      {
        lblAccountList: "Savings Account - 12345678",
        accountId: "12345678",
        accountType: "Savings",
      },
      {
        lblAccountList: "Current Account - 98765432",
        accountId: "98765432",
        accountType: "Current",
      },
      {
        lblAccountList: "Salary Account - 47667679",
        accountId: "47667679",
        accountType: "Salary",
      },
    ];

    this.currencyData = [
      {
        lblCurrency: "QAR",
        currencyCode: "QAR",
        currencyName: "Qatari Riyal",
      },
      {
        lblCurrency: "USD",
        currencyCode: "USD",
        currencyName: "US Dollar",
      },
      {
        lblCurrency: "EUR",
        currencyCode: "EUR",
        currencyName: "Euro",
      },
      {
        lblCurrency: "SAR",
        currencyCode: "SAR",
        currencyName: "Saudi Riyal",
      },
    ];

    this.depositTypeData = [
      {
        lblDeposit: "FD",
        lblDepositName: "Fixed Deposit",
      },
      {
        lblDeposit: "RD",
        lblDepositName: "Recurring Deposit",
      },
    ];

    this.depositPeriodData = [
      {
        lblDeposit: "3M",
        lblDepositName: "3 Months",
      },
      {
        lblDeposit: "6M",
        lblDepositName: "6 Months",
      },
      {
        lblDeposit: "12M",
        lblDepositName: "12 Months",
      },
      {
        lblDeposit: "24M",
        lblDepositName: "24 Months",
      },
    ];

    this.selectedAccount = null;
    this.selectedCurrency = null;
    this.selectedDepositType = null;
    this.selectedDepositPeriod = null;
    this.isAutoRenew = false;
  },

  preShow: function () {
    this.view.flxAccountList.onTouchEnd = this.flxAccountListOnClick.bind(this);
    this.view.flxCurrency.onTouchEnd = this.flxCurrencyOnClick.bind(this);
    this.view.flxDepositTypeList.onTouchEnd =
      this.flxDepositTypeListOnClick.bind(this);
    this.view.flxDepositPeriodList.onTouchEnd =
      this.flxDepositPeriodListOnClick.bind(this);
    this.view.flxAutoRenewToggle.onTouchEnd =
      this.flxAutoRenewToggleOnClick.bind(this);
    this.view.btnContinue.onClick = this.btnContinueOnClick.bind(this);

    this.updateAutoRenewUI();
  },

  postShow: function () {},

  btnContinueOnClick: function () {
    if (!this.selectedAccount) {
      alert("Please select an account.");
      return;
    }

    if (!this.selectedCurrency) {
      alert("Please select a currency.");
      return;
    }

    if (!this.selectedDepositType) {
      alert("Please select a deposit type.");
      return;
    }

    if (!this.selectedDepositPeriod) {
      alert("Please select a deposit period.");
      return;
    }

    var amount = this.getValidatedAmount();

    if (amount === null) {
      return;
    }

    var navData = {
      accountData: this.accountData,
      selectedAccount: this.selectedAccount,
      selectedCurrency: this.selectedCurrency,
      selectedDepositType: this.selectedDepositType,
      selectedDepositPeriod: this.selectedDepositPeriod,
      enteredAmount: amount,
      isAutoRenew: this.isAutoRenew,
      interestRate: this.view.lblInterestRateVal.text,
    };

    kony.print("DEPOSIT DETAILS :: NAV DATA :: " + JSON.stringify(navData));

    new kony.mvc.Navigation("frmDespositReturn").navigate(navData);
  },

  getValidatedAmount: function () {
    var amount = this.view.txtDepositAmount.text;

    if (amount === null || amount === undefined) {
      alert("Please enter the deposit amount.");
      return null;
    }

    amount = String(amount).trim();

    if (amount === "") {
      alert("Please enter the deposit amount.");
      return null;
    }

    amount = amount.replace(/,/g, "");

    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      alert("Please enter a valid amount.");
      return null;
    }
    var numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Deposit amount must be greater than zero.");
      return null;
    }
    amount = numericAmount.toFixed(2);
    kony.print("DEPOSIT DETAILS :: VALIDATED AMOUNT :: " + amount);
    return amount;
  },

  flxAutoRenewToggleOnClick: function () {
    this.isAutoRenew = !this.isAutoRenew;
    this.updateAutoRenewUI();
    kony.print("DEPOSIT DETAILS :: AUTO RENEW :: " + this.isAutoRenew);
  },

  updateAutoRenewUI: function () {
    if (!this.view.flxSwitchWidget) {
      return;
    }
    if (this.isAutoRenew) {
      this.view.flxSwitchWidget.skin = "sknBillSwitchOn";
      this.view.flxSwitchWidget.flxThumb.left = "17dp";
    } else {
      this.view.flxSwitchWidget.skin = "sknSwitchOff";
      this.view.flxSwitchWidget.flxThumb.left = "3dp";
    }
    this.view.flxSwitchWidget.forceLayout();
    this.view.flxAutoRenew.forceLayout();
  },

  flxAccountListOnClick: function () {
    var self = this;
    this.view.commonlist.show({
      title: "Select Account",
      template: "flxAccountList",
      widgetDataMap: {
        lblAccountList: "lblAccountList",
      },
      data: this.accountData,
      onRowSelected: function (rowData) {
        if (!rowData) {
          return;
        }
        self.selectedAccount = rowData;
        self.view.lblSelectedAcc.text = rowData.lblAccountList;
        self.view.forceLayout();
      },
    });
  },

  flxCurrencyOnClick: function () {
    var self = this;
    this.view.commonlist.show({
      title: "Select Currency",
      template: "flxCurrencyList",
      widgetDataMap: {
        lblCurrency: "lblCurrency",
      },
      data: this.currencyData,
      onRowSelected: function (rowData) {
        if (!rowData) {
          return;
        }
        self.selectedCurrency = rowData;
        self.view.lblSelectedCurr.text = rowData.lblCurrency;
        self.view.forceLayout();
      },
    });
  },

  flxDepositTypeListOnClick: function () {
    var self = this;
    this.view.commonlist.show({
      title: "Select Deposit Type",
      template: "flxDepositTypeList",
      widgetDataMap: {
        lblDeposit: "lblDeposit",
        lblDepositName: "lblDepositName",
      },
      data: this.depositTypeData,
      onRowSelected: function (rowData) {
        if (!rowData) {
          return;
        }

        self.selectedDepositType = rowData;
        self.view.lblDepositTypeList.text = rowData.lblDepositName;
        self.view.forceLayout();
      },
    });
  },

  flxDepositPeriodListOnClick: function () {
    var self = this;
    this.view.commonlist.show({
      title: "Select Deposit Period",
      template: "flxDepositTypeList",
      widgetDataMap: {
        lblDeposit: "lblDeposit",
        lblDepositName: "lblDepositName",
      },
      data: this.depositPeriodData,
      onRowSelected: function (rowData) {
        if (!rowData) {
          return;
        }

        self.selectedDepositPeriod = rowData;
        self.view.lblDepositPeriodList.text = rowData.lblDepositName;
        self.view.forceLayout();
      },
    });
  },
});
