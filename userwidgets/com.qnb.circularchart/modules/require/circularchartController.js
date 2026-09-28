define(function () {
  return {
    configure: function (totalLoan, paidLoan, totalLoanCount) {
      totalLoan = Number(totalLoan) || 0;

      paidLoan = Number(paidLoan) || 0;

      totalLoanCount = Number(totalLoanCount) || 0;

      var remainingAmount = totalLoan - paidLoan;

      if (remainingAmount < 0) {
        remainingAmount = 0;
      }

      var percentage = 0;

      if (totalLoan > 0) {
        percentage = Math.round((paidLoan / totalLoan) * 100);
      }

      if (percentage > 100) {
        percentage = 100;
      }

      if (percentage < 0) {
        percentage = 0;
      }

      kony.print("CIRCULAR CHART :: Total Loan = " + totalLoan);

      kony.print("CIRCULAR CHART :: Paid Loan = " + paidLoan);

      kony.print("CIRCULAR CHART :: Remaining Amount = " + remainingAmount);

      kony.print("CIRCULAR CHART :: Number Of Loans = " + totalLoanCount);

      kony.print("CIRCULAR CHART :: Percentage = " + percentage);

      if (this.view.lblNoOfLoans) {
        this.view.lblNoOfLoans.text = String(totalLoanCount) + " active loans";
      }

      if (this.view.lblRemainingAmt) {
        this.view.lblRemainingAmt.text =
          remainingAmount.toLocaleString("en-US") + " QAR";
      }

      this.percentage = percentage;

      if (this.view.progressbar) {
        this.view.progressbar.onSuccess = function () {
          this.view.progressbar.evaluateJavaScript(
            "animateTo(" + percentage + ");",
          );
        }.bind(this);
      }
    },
    setOnClick: function (callback) {
      this.view.onTouchEnd = callback;

      if (this.view.flxMain) {
        this.view.flxLoanProgressBar.onTouchEnd = callback;
      }
    },
  };
});
