define({
  isChecked: false,

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

    this.data = navData || {};

    this.view.wallError.setError({
      description:
        "Review your details. Please ensure all information is correct before proceeding.",
      image: "info_blue.png",
      backgroundSkin: "sknFlxOutlineC2D9FF",
      foregroundSkin: "sknFlxBgE8F0FF",
      descriptionSkin: "sknLbl100PFont08217a",
    });
  },

  init: function () {
    this.view.flxChckbox.onTouchEnd = this.toggleCheckbox.bind(this);
    this.view.btnContinue.onClick = this.btnOpenAccount.bind(this);
  },

  preShow: function () {
    this.isChecked = false;

    this.view.imgCheck.src = "uncheckbox.png";
    this.view.btnContinue.skin = "sknBtn48pxTransa8a1c4Focus";
    this.view.btnContinue.setEnabled(false);

    this.populateConfirmationData();
  },

  postShow: function () {},

  populateConfirmationData: function () {
    var data = this.data || {};

    var currency = data.selectedCurrency || {};
    var fundAccount = data.selectedAccount || {};
    var depositType = data.selectedDepositType || {};
    var depositPeriod = data.selectedDepositPeriod || {};
    var returnAccount = data.selectedReturnAccount || {};
    var interestAccount = data.selectedInterestAccount || {};

    var currencyCode = currency.currencyCode || currency.lblCurrency || "";

    this.view.lblCurrencyVal.text = currencyCode;

    this.view.lblFundFromAccVal.text = fundAccount.lblAccountList || "";

    this.view.lblDepositTypeVal.text =
      depositType.lblDepositName || depositType.lblDeposit || "";

    this.view.lblInitialDepositVal.text = this.formatAmount(
      data.enteredAmount,
      currencyCode,
    );

    this.view.lblStartDateVal.text = this.getCurrentDate();

    this.view.lblDepositPeriodVal.text =
      depositPeriod.lblDepositName || depositPeriod.lblDeposit || "";

    this.view.lblAutoRenewVal.text = data.isAutoRenew ? "On" : "Off";

    var interestRate = this.parseAmount(data.interestRate);

    this.view.lblInterestRateVal.text = interestRate.toFixed(2) + "%";
    var initialDeposit = this.parseAmount(data.enteredAmount);

    var periodMonths = this.getPeriodInMonths(depositPeriod);

    var interestAmount =
      initialDeposit * (interestRate / 100) * (periodMonths / 12);

    var totalMaturityAmount = initialDeposit + interestAmount;

    this.view.lblTotalMaturityAmtVal.text = this.formatAmount(
      totalMaturityAmount.toFixed(2),
      currencyCode,
    );

    /*
     * Return Initial Deposit To
     */
    this.view.lblReturnDepositToVal.text = returnAccount.lblAccountList || "";

    /*
     * Pay Interest To
     */
    this.view.lblPayInterestVal.text = interestAccount.lblAccountList || "";

    this.view.forceLayout();
  },

  getPeriodInMonths: function (depositPeriod) {
    if (!depositPeriod) {
      return 0;
    }

    switch (depositPeriod.lblDeposit) {
      case "3M":
        return 3;

      case "6M":
        return 6;

      case "12M":
        return 12;

      case "24M":
        return 24;

      default:
        return 0;
    }
  },

  parseAmount: function (amount) {
    if (amount === null || amount === undefined || amount === "") {
      return 0;
    }

    amount = String(amount).replace(/,/g, "").replace(/%/g, "").trim();

    var numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
      return 0;
    }

    return numericAmount;
  },

  formatAmount: function (amount, currencyCode) {
    if (amount === null || amount === undefined || amount === "") {
      return "";
    }

    if (!currencyCode) {
      return String(amount);
    }

    return String(amount) + " " + currencyCode;
  },

  getCurrentDate: function () {
    var date = new Date();
    var day = date.getDate();
    var month = date.toLocaleString("en-US", {
      month: "short",
    });
    var year = date.getFullYear();

    return day + " " + month + " " + year;
  },

  btnOpenAccount: function () {
    var otpData = Object.assign({}, this.data, {
      depositFlow: true,
      otpTitle: "New account",
      otpBackForm: "frmDepositConfirmation",
      otpSuccessForm: "frmPaymentScreen",
    });

    new kony.mvc.Navigation("frmOtpCommon").navigate(otpData);
  },

  toggleCheckbox: function () {
    this.isChecked = !this.isChecked;

    if (this.isChecked) {
      this.view.imgCheck.src = "checkbox.png";
      this.view.btnContinue.skin = "sknBtnRounded72px2A59BD";
      this.view.btnContinue.setEnabled(true);
    } else {
      this.view.imgCheck.src = "uncheckbox.png";
      this.view.btnContinue.skin = "sknBtn48pxTransa8a1c4Focus";
      this.view.btnContinue.setEnabled(false);
    }
  },
});
