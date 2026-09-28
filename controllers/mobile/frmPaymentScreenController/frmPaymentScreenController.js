define({
  utilisedAmount: 45000,
  totalLimit: 60000,
  navData: null,

  onNavigate: function (data) {
    this.navData = data || {};

    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    if (this.view.btnReturnCards) {
      this.view.btnReturnCards.onClick = this.returnFromSuccess.bind(this);
    }
  },

  preShow: function () {
    if (this.isDepositFlow()) {
      this.renderDepositSuccess();
    } else {
      this.renderBillSuccess();
    }

    /*
     * Reset modular success animation.
     */
    if (this.view.rippleanimation) {
      this.view.rippleanimation.reset();
    }
  },

  postShow: function () {
    kony.print("PAYMENT SCREEN :: postShow");

    /*
     * Play modular success animation.
     */
    if (this.view.rippleanimation) {
      var message = this.isDepositFlow()
        ? "Fixed deposit opened successfully"
        : "Payment successful";

      this.view.rippleanimation.show({
        type: "success",
        text: message,
      });
    } else {
      kony.print("PAYMENT SCREEN :: rippleanimation not found");
    }
  },

  /*
   * ==========================================
   * FLOW DETECTION
   * ==========================================
   */

  isDepositFlow: function () {
    var data = this.navData || {};

    return data.depositFlow === true;
  },

  renderBillSuccess: function () {
    var data = this.navData || {};
    var bill = data.billData || {};

    if (this.view.flxBillName) {
      this.view.flxBillName.isVisible = true;
    }

    if (this.view.flxBillSeperator) {
      this.view.flxBillSeperator.isVisible = true;
    }

    this.safeText("lblBillName", bill.billHeader || "");

    this.safeText("lblBillDesc", "Description:");

    this.safeText("lblBillDescValue", bill.billDetails || "");

    this.safeText("lblDueOn", "Due on:");

    this.safeText("lblDueOnDate", bill.endDate || "");

    this.safeText("lblAutoPay", "Autopay:");

    this.safeText("lblAutoPayVal", bill.switchOn ? "On" : "Off");

    if (this.view.lblInterestRate) {
      this.view.lblInterestRate.isVisible = false;
    }

    if (this.view.lblInterestRateVal) {
      this.view.lblInterestRateVal.isVisible = false;
    }

    this.safeText("lblBillAmount", "Bill amount:");

    this.safeText("lblBillAmtValue", this.formatNumber(bill.billAmount));

    this.safeText("lblBillCurrency", bill.billCurr || "QAR");

    if (this.view.btnReturnCards) {
      this.view.btnReturnCards.text = "Return to Cards";
    }

    if (this.view.lblCancel) {
      this.view.lblCancel.text = "Set automatic payment";
    }

    this.view.forceLayout();

    kony.print("BILL PAYMENT SUCCESS :: " + JSON.stringify(bill));
  },

  renderDepositSuccess: function () {
    var data = this.navData || {};
    var currency = data.selectedCurrency || {};

    var depositPeriod = data.selectedDepositPeriod || {};

    var currencyCode = currency.currencyCode || currency.lblCurrency || "QAR";

    if (this.view.flxBillName) {
      this.view.flxBillName.isVisible = false;
    }

    if (this.view.flxBillSeperator) {
      this.view.flxBillSeperator.isVisible = false;
    }

    var referenceNumber = data.referenceNumber || "123456789-001";

    this.safeText("lblBillDesc", "Reference number:");

    this.safeText("lblBillDescValue", referenceNumber);

    var startDate = data.startDate || this.getDepositStartDate();

    this.safeText("lblDueOn", "Start date:");

    this.safeText("lblDueOnDate", startDate);

    var period =
      depositPeriod.lblDepositName ||
      depositPeriod.lblDeposit ||
      data.depositPeriod ||
      "";

    period = this.formatDepositPeriod(period);

    this.safeText("lblAutoPay", "Period:");

    this.safeText("lblAutoPayVal", period);

    if (this.view.lblInterestRate) {
      this.view.lblInterestRate.isVisible = true;
    }

    if (this.view.lblInterestRateVal) {
      this.view.lblInterestRateVal.isVisible = true;
    }

    this.safeText("lblInterestRate", "Interest rate:");

    this.safeText("lblInterestRateVal", data.interestRate || "0.65%");

    var totalAmount = data.totalMaturityAmount;

    if (
      totalAmount === null ||
      totalAmount === undefined ||
      totalAmount === ""
    ) {
      totalAmount = data.enteredAmount || "0.00";
    }

    this.safeText("lblBillAmount", "Total amount:");

    this.safeText("lblBillAmtValue", this.formatNumber(totalAmount));

    this.safeText("lblBillCurrency", currencyCode);

    if (this.view.btnReturnCards) {
      this.view.btnReturnCards.text = "Return to Accounts";
    }

    if (this.view.lblCancel) {
      this.view.lblCancel.text = "View Details";

      this.view.lblCancel.onTouchEnd = this.onViewDepositDetails.bind(this);
    }

    this.view.forceLayout();

    kony.print(
      "DEPOSIT SUCCESS :: " +
        JSON.stringify({
          referenceNumber: referenceNumber,
          startDate: startDate,
          period: period,
          interestRate: data.interestRate,
          totalAmount: totalAmount,
          currency: currencyCode,
        }),
    );
  },

  returnFromSuccess: function () {
    if (this.isDepositFlow()) {
      new kony.mvc.Navigation("frmAccounts").navigate(this.navData);

      return;
    }

    new kony.mvc.Navigation("frmPayBills").navigate(this.navData);
  },

  onViewDepositDetails: function () {
    kony.print("DEPOSIT VIEW DETAILS :: " + JSON.stringify(this.navData));
  },

  safeText: function (id, txt) {
    if (txt === null || txt === undefined) {
      return;
    }

    try {
      if (this.view[id]) {
        this.view[id].text = String(txt);
      }
    } catch (e) {
      kony.print("frmPaymentScreen safeText " + id + " :: " + e);
    }
  },

  formatNumber: function (amount) {
    if (amount === null || amount === undefined || amount === "") {
      return "0.00";
    }

    var value = String(amount).replace(/,/g, "").trim();

    var number = parseFloat(value);

    if (isNaN(number)) {
      return String(amount);
    }

    return number.toFixed(2);
  },

  formatDepositPeriod: function (period) {
    if (!period) {
      return "";
    }

    var value = String(period).trim();

    return value.charAt(0) + value.substring(1).toLowerCase();
  },

  getDepositStartDate: function () {
    var date = new Date();

    var day = date.getDate();

    var month = date.toLocaleString("en-US", {
      month: "short",
    });

    var year = date.getFullYear();

    return day + " " + month + " " + year;
  },
});
