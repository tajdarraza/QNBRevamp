define({
  confirmationData: null,

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    this.view.commonheader.configure({
      title: "Loan postpone",
      action1: function () {
        new kony.mvc.Navigation("frmLoanDashboard").navigate();
      },
      action2: function () {
        alert("to unlock the feature develop it");
      },
      action2Image: "closeicon.png",
    });

    this.view.wallError.setError({
      description: "Includes special extra month for Ramadan.",
      image: "info_blue.png",
      backgroundSkin: "sknFlxOutlineC2D9FF",
      foregroundSkin: "sknFlxBgE8F0FF",
      descriptionSkin: "sknLbl100PFont08217a",
    });

    this.confirmationData = navData;

    kony.print(
      "LOAN POSTPONE CONF :: Received data = " +
        JSON.stringify(this.confirmationData),
    );
  },

  init: function () {},

  preShow: function () {
    this.populateLoanInfo();
    this.populatePostponeDetails();
    this.populateSpecialOffer();

    this.view.btnContinue.onClick = this.confirmLoanPostpone.bind(this);
  },

  postShow: function () {
    kony.print("LOAN POSTPONE CONF :: postShow");
  },

  populateLoanInfo: function () {
    if (!this.confirmationData) {
      return;
    }

    var data = this.confirmationData;

    /*
     * Due date
     */
    if (this.view.lblDueDate) {
      this.view.lblDueDate.text = data.newDueDate || "";
    }

    /*
     * Due amount
     */
    if (this.view.lblDueAmountValue) {
      this.view.lblDueAmountValue.text =
        data.dueAmount !== undefined && data.dueAmount !== null
          ? data.dueAmount
          : "";
    }

    /*
     * Type of loan
     */
    if (this.view.lblTypeOfLoan) {
      this.view.lblTypeOfLoan.text = data.typeOfLoan || "";
    }

    /*
     * Loan image
     */
    if (this.view.imgTypeOfLoan && data.imgTypeOfLoan) {
      this.view.imgTypeOfLoan.src = data.imgTypeOfLoan;
    }

    kony.print("LOAN POSTPONE CONF :: Due date = " + data.dueDate);

    kony.print("LOAN POSTPONE CONF :: Due amount = " + data.dueAmount);

    kony.print("LOAN POSTPONE CONF :: Type = " + data.typeOfLoan);

    kony.print("LOAN POSTPONE CONF :: Image = " + data.imgTypeOfLoan);
  },

  populatePostponeDetails: function () {
    if (!this.confirmationData) {
      return;
    }

    var data = this.confirmationData;

    /*
     * Months postponed
     */
    if (this.view.lblMonthPostponedValue) {
      this.view.lblMonthPostponedValue.text =
        data.postponeMonths === 1 ? "1 Month" : data.postponeMonths + " Months";
    }

    /*
     * New due date
     */
    if (this.view.lblPostponeDateVal) {
      this.view.lblPostponeDateVal.text = data.newDueDate || "";
    }

    /*
     * Postpone fee
     */
    if (this.view.lblPostponeFeeVal) {
      this.view.lblPostponeFeeVal.text = "Free of charge";
    }

    kony.print("LOAN POSTPONE CONF :: Months = " + data.postponeMonths);

    kony.print("LOAN POSTPONE CONF :: New date = " + data.newDueDate);

    kony.print("LOAN POSTPONE CONF :: Fee = Free of charge");
  },

  populateSpecialOffer: function () {
    if (!this.confirmationData) {
      return;
    }

    var data = this.confirmationData;

    if (data.specialOfferSelection === "yes") {
      this.view.flxLoanSpecialOffer.setVisibility(true);
    } else {
      this.view.flxLoanSpecialOffer.setVisibility(false);
    }
  },

  confirmLoanPostpone: function () {
    if (!this.confirmationData) {
      kony.print("LOAN POSTPONE CONF :: No confirmation data");
      return;
    }

    kony.print("LOAN POSTPONE CONF :: Continue clicked");

    kony.print(
      "LOAN POSTPONE CONF :: Existing data = " +
        JSON.stringify(this.confirmationData),
    );

    var otpData = this.confirmationData;

    otpData.otpTitle = "Loan postpone";

    otpData.otpBackForm = "frmLoanPostponeUpdate";

    otpData.otpSuccessForm = "frmLoanPostponeConfirmation";

    kony.print("LOAN POSTPONE CONF :: OTP data = " + JSON.stringify(otpData));

    new kony.mvc.Navigation("frmOtpCommon").navigate(otpData);
  },
});
