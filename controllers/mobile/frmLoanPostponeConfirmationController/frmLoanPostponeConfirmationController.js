define({
  data: {},

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    if (navData) {
      this.data = navData;
    }

    kony.print(
      "LOAN POSTPONE CONFIRMATION :: Received data = " +
        JSON.stringify(this.data),
    );
  },

  init: function () {
    this.view.btnReturnLoan.onClick = this.returnToLoanDashboard.bind(this);
  },

  preShow: function () {
    this.populateLoanDetails();

    if (
      this.view.flxAmountOptions &&
      this.view.flxAmountOptions.rippleanimation
    ) {
      this.view.flxAmountOptions.rippleanimation.reset();
    }
  },

  postShow: function () {
    kony.print("LOAN POSTPONE CONFIRMATION :: postShow");

    if (
      this.view.flxAmountOptions &&
      this.view.flxAmountOptions.rippleanimation
    ) {
      this.view.flxAmountOptions.rippleanimation.show({
        type: "failure",
        text: "Loan postponement failed",
      });
    }
  },

  populateLoanDetails: function () {
    var data = this.data || {};
    var loan = data.loan || {};

    if (this.view.lblNewDueDate) {
      this.view.lblNewDueDate.text = data.newDueDate || "";
    }

    if (this.view.lblTypeOfLoan) {
      this.view.lblTypeOfLoan.text =
        data.typeOfLoan ||
        loan.loanName ||
        loan.typeOfLoan ||
        loan.loanType ||
        "";
    }

    if (this.view.imgTypeOfLoan) {
      var loanImage =
        data.imgTypeOfLoan ||
        loan.imgTypeOfLoan ||
        loan.loanImage ||
        loan.typeOfLoanImage ||
        "";

      if (loanImage) {
        this.view.imgTypeOfLoan.src = loanImage;
      }
    }

    if (this.view.lblDueDate) {
      this.view.lblDueDate.text =
        data.originalDueDate || data.dueDate || loan.dueDate || "";
    }

    if (this.view.lblDueAmountValue) {
      var dueAmount =
        data.dueAmount !== undefined && data.dueAmount !== null
          ? data.dueAmount
          : loan.remainingBalance;

      this.view.lblDueAmountValue.text =
        dueAmount !== undefined && dueAmount !== null ? dueAmount : "";
    }

    if (this.view.lblMonthPostponedValue) {
      var months = data.postponeMonths;

      if (months !== undefined && months !== null && months !== "") {
        this.view.lblMonthPostponedValue.text =
          months === 1 ? "1 Month" : months + " Months";
      } else {
        this.view.lblMonthPostponedValue.text = "";
      }
    }

    if (this.view.lblPostponeDateVal) {
      this.view.lblPostponeDateVal.text = data.newDueDate || "";
    }

    if (this.view.lblPostponeFeeVal) {
      this.view.lblPostponeFeeVal.text = data.postponeFee || "Free of charge";
    }

    kony.print(
      "LOAN POSTPONE CONFIRMATION :: New due date = " + data.newDueDate,
    );

    kony.print(
      "LOAN POSTPONE CONFIRMATION :: Original due date = " +
        (data.originalDueDate || data.dueDate || loan.dueDate || ""),
    );

    kony.print(
      "LOAN POSTPONE CONFIRMATION :: Due amount = " +
        (data.dueAmount !== undefined && data.dueAmount !== null
          ? data.dueAmount
          : loan.remainingBalance || ""),
    );

    kony.print(
      "LOAN POSTPONE CONFIRMATION :: Type = " +
        (data.typeOfLoan || loan.loanName || loan.loanType || ""),
    );

    kony.print(
      "LOAN POSTPONE CONFIRMATION :: Image = " +
        (data.imgTypeOfLoan || loan.imgTypeOfLoan || ""),
    );

    kony.print("LOAN POSTPONE CONFIRMATION :: Months = " + data.postponeMonths);

    kony.print(
      "LOAN POSTPONE CONFIRMATION :: Fee = " +
        (data.postponeFee || "Free of charge"),
    );
  },

  returnToLoanDashboard: function () {
    kony.print("LOAN POSTPONE CONFIRMATION :: Return to Loan Dashboard");

    new kony.mvc.Navigation("frmLoanDashboard").navigate();
  },
});
