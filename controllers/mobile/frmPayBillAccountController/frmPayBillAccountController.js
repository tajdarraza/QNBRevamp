define({
  billData: null,

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    //this.view.onDeviceBack = this.onDeviceBack;

    this.view.cmpFooter.initializeFooter();
    this.view.cmpFooter.setSelectedTab("payments");

    this.view.commonheader.configure({
      title: "Pay bills",
      action1: function () {
        alert("not yet developed");
      },
    });

    this.billData = navData;

    kony.print(
      "PAY BILL ACCOUNT :: NAVIGATED BILL = " + JSON.stringify(this.billData),
    );
  },

  init: function () {
    if (this.view.cmpbottomup) {
      this.view.cmpbottomup.postRender();
    }

    this.initializeBillDetails();
    this.initializeLoyaltyCalculation();
  },

  onDeviceBack: function () {},

  preShow: function () {
    this.view.flxAccountList.onTouchEnd = this.flxAccountListOnClick;

    this.view.segAccountDropDown.onRowClick = this.onAccountRowClick;

    this.view.imgEditBill.onTouchEnd = this.onBillEditClick.bind(this);

    this.view.btnRemove.onClick = this.onRemoveClick.bind(this);

    this.view.imgInfo.onTouchEnd = this.onInfoClick.bind(this);

    this.view.lblPayWithPoints.onTouchEnd = this.onPayWithPoints.bind(this);

    this.view.btnContinue.onClick = this.continuePayment;

    if (this.view.cmpbottomup) {
      this.view.cmpbottomup.isVisible = false;
    }

    this.initializeBillDetails();
    this.initializeLoyaltyCalculation();
  },

  postShow: function () {},

  continuePayment: function () {
    var data = {
      billData: this.billData,

      otpTitle: "Pay bills",
      otpBackForm: "frmPayBillAccount",
      otpSuccessForm: "frmPaymentScreen",
    };

    kony.print("PAY BILL :: OTP NAV DATA = " + JSON.stringify(data));

    new kony.mvc.Navigation("frmOtpCommon").navigate(data);
  },

  continueOTPCall: function () {
    new kony.mvc.Navigation("frmPaymentScreen").navigate();

    //alert("calling api for otp validation and payment")
  },

  initializeBillDetails: function () {
    if (!this.billData) {
      return;
    }

    if (this.view.lblBillThumbnail) {
      this.view.lblBillThumbnail.text = this.billData.billLogo || "";
    }

    if (this.view.lblBillName) {
      this.view.lblBillName.text = this.billData.billHeader || "";
    }

    if (this.view.lblBillDescValue) {
      this.view.lblBillDescValue.text = this.billData.billDetails || "";
    }

    if (this.view.lblDueOnDate) {
      this.view.lblDueOnDate.text = this.billData.endDate || "";
    }

    if (this.view.lblAutoPayVal) {
      this.view.lblAutoPayVal.text = this.billData.switchOn ? "On" : "Off";
    }

    if (this.view.lblBillAmtValue) {
      this.view.lblBillAmtValue.text = this.billData.billAmount || "";
    }

    if (this.view.lblBillCurrency) {
      this.view.lblBillCurrency.text = this.billData.billCurr || "QAR";
    }
  },

  initializeLoyaltyCalculation: function () {
    if (this.view.flxLoyaltyCalc) {
      this.view.flxLoyaltyCalc.isVisible = false;
    }

    if (this.view.lblPayWithPoints) {
      this.view.lblPayWithPoints.text = "Pay with points";
    }

    if (this.view.lblRewardUsed) {
      this.view.lblRewardUsed.text = "0";
    }

    if (this.view.lblRewardValue) {
      this.view.lblRewardValue.text = "0";
    }

    if (this.view.lblTotalBillValue) {
      this.view.lblTotalBillValue.text =
        this.billData && this.billData.billAmount
          ? this.billData.billAmount
          : "0";
    }

    if (this.view.lblTotalBillCurr) {
      this.view.lblTotalBillCurr.text =
        this.billData && this.billData.billCurr
          ? this.billData.billCurr
          : "QAR";
    }

    if (this.view.lblTotalAmt) {
      this.view.lblTotalAmt.text =
        this.billData && this.billData.billAmount
          ? this.billData.billAmount
          : "0";
    }

    if (this.view.lblTitalCurr) {
      this.view.lblTitalCurr.text =
        this.billData && this.billData.billCurr
          ? this.billData.billCurr
          : "QAR";
    }
  },

  onPayWithPoints: function () {
    kony.print("click on onPayWithPoints");

    if (!this.billData) {
      return;
    }

    if (
      !this.view.cmpbottomup ||
      typeof this.view.cmpbottomup.show !== "function"
    ) {
      return;
    }

    var pointsData = {
      points: "500",
    };

    this.view.cmpbottomup.show({
      description: "Pay with life rewards",

      description1:
        "How many Life Rewards points would you like to spend to this bill?",

      buttonText: "Confirm",

      cancelText: "Cancel",

      showCancel: true,

      showContent: true,

      showButtonAction: true,

      showClose: true,

      showEnterAmount: true,

      showRewardsCurrency: true,

      showRewardsAmount: true,

      onConfirm: this.onPayWithPointsConfirmed.bind(this),

      onCancel: this.onPayWithPointsCancelled.bind(this),

      data: pointsData,
    });
  },

  onPayWithPointsConfirmed: function (config) {
    var points = "";

    if (this.view.cmpbottomup && this.view.cmpbottomup.txtAmount) {
      points = this.view.cmpbottomup.txtAmount.text;
    }

    var numericPoints = parseFloat(points);

    if (isNaN(numericPoints) || numericPoints <= 0) {
      return;
    }

    var convertedAmount = numericPoints * 2;

    var billAmount = parseFloat(this.billData.billAmount);

    if (isNaN(billAmount)) {
      billAmount = 0;
    }

    var remainingAmount = billAmount - convertedAmount;

    if (remainingAmount < 0) {
      remainingAmount = 0;
    }

    if (this.view.lblRewardUsed) {
      this.view.lblRewardUsed.text = String(numericPoints) + " points";
    }

    if (this.view.lblRewardValue) {
      this.view.lblRewardValue.text =
        "= " + convertedAmount.toFixed(2) + " QAR";
    }

    if (this.view.lblTotalBillValue) {
      this.view.lblTotalBillValue.text = remainingAmount.toFixed(2);
    }

    if (this.view.lblTotalBillCurr) {
      this.view.lblTotalBillCurr.text = this.billData.billCurr || "QAR";
    }

    if (this.view.lblPayWithPoints) {
      this.view.lblPayWithPoints.text = String(numericPoints) + " points";
    }

    if (this.view.flxLoyaltyCalc) {
      this.view.flxLoyaltyCalc.isVisible = true;
    }

    this.view.forceLayout();

    var requestData = {
      billData: this.billData,

      points: numericPoints,

      convertedAmount: convertedAmount,

      remainingAmount: remainingAmount,

      currency: "QAR",
    };

    kony.print("PAY WITH POINTS :: API DATA = " + JSON.stringify(requestData));
  },

  onPayWithPointsCancelled: function (config) {
    // Nothing required
  },

  onBillEditClick: function () {
    kony.print("click on onBillEditClick");

    if (!this.billData) {
      return;
    }

    if (
      !this.view.cmpbottomup ||
      typeof this.view.cmpbottomup.show !== "function"
    ) {
      return;
    }

    this.view.cmpbottomup.show({
      description: "Edit amount",

      description1: "Edit and enter the new amount",

      buttonText: "Confirm",

      cancelText: "Cancel",

      showCancel: true,

      showContent: true,

      showButtonAction: true,

      showClose: true,

      showEnterAmount: true,

      data: this.billData,

      onConfirm: this.onAmountEditConfirmed.bind(this),

      onCancel: this.onAmountEditCancelled.bind(this),
    });
  },

  onAmountEditConfirmed: function (config) {
    var newAmount = "";

    if (this.view.cmpbottomup && this.view.cmpbottomup.txtAmount) {
      newAmount = this.view.cmpbottomup.txtAmount.text;
    }

    if (!newAmount) {
      return;
    }

    this.billData.billAmount = newAmount;

    if (this.view.lblBillAmtValue) {
      this.view.lblBillAmtValue.text = newAmount;
    }

    if (this.view.lblTotalAmt) {
      this.view.lblTotalAmt.text = newAmount;
    }

    if (this.view.lblTotalBillValue) {
      this.view.lblTotalBillValue.text = newAmount;
    }

    if (this.view.flxLoyaltyCalc && this.view.flxLoyaltyCalc.isVisible) {
      var rewardPoints = parseFloat(this.view.lblRewardUsed.text);

      if (!isNaN(rewardPoints) && rewardPoints > 0) {
        var convertedAmount = rewardPoints * 2;

        var updatedBill = parseFloat(newAmount);

        var remaining = updatedBill - convertedAmount;

        if (remaining < 0) {
          remaining = 0;
        }

        this.view.lblRewardValue.text =
          "= " + convertedAmount.toFixed(2) + " QAR";

        this.view.lblTotalBillValue.text = remaining.toFixed(2);
      }
    }

    this.view.forceLayout();
  },

  onAmountEditCancelled: function (config) {
    // Nothing required
  },

  onRemoveClick: function () {
    if (!this.billData) {
      return;
    }

    if (
      !this.view.cmpbottomup ||
      typeof this.view.cmpbottomup.show !== "function"
    ) {
      return;
    }

    this.view.cmpbottomup.show({
      description: "Are you sure you want to remove this bill?",

      description1: "Remove bill",

      buttonText: "Remove",

      cancelText: "Cancel",

      showCancel: true,

      showContent: true,

      showButtonAction: true,

      showClose: true,

      showBillDetails: true,

      data: this.billData,

      onConfirm: this.onAutoPayRemoved.bind(this),

      onCancel: this.onRemoveCancelled.bind(this),
    });
  },

  onAutoPayRemoved: function (config) {
    kony.print("PAY BILL :: REMOVE BILL CONFIRMED");

    /*
     * FUTURE API CALL
     */
  },

  onRemoveCancelled: function (config) {
    // Nothing required
  },

  onInfoClick: function () {
    var loyaltyData = {
      points: "500 points",

      value: "125 QAR",
    };

    this.view.cmpbottomup.show({
      description: "Loyalty exchange rate",

      description1:
        "For every 4 points you redeem, you’ll receive the equivalent of 1 QAR to use within the program.",

      buttonText: "Confirm",

      showCancel: false,

      showContent: true,

      showButtonAction: true,

      showClose: true,

      showLoyaltyPoints: true,

      data: loyaltyData,

      onConfirm: this.onLoyaltyConfirmed.bind(this),
    });
  },

  onLoyaltyConfirmed: function (config) {
    // Nothing required
  },

  onAccountRowClick: function (...onrowtap) {
    var data = this.view.segAccountDropDown.data;

    var rowData = data[onrowtap[2]];

    if (!rowData) {
      return;
    }

    this.view.lblSelectedAcc.text = rowData.lblAccountList;

    this.view.flxAccountsDrop.isVisible = false;
  },

  flxAccountListOnClick: function () {
    this.view.flxAccountsDrop.isVisible = !this.view.flxAccountsDrop.isVisible;
  },
});
