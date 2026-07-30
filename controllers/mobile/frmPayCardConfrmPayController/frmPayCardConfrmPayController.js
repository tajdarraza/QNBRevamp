define(["APICallController"], function (commonUtil) {

    return {
        navData: null,

        onNavigate: function (data) {
            this.navData = data;
            this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;
            this.view.preShow = this.preShow;

        },

        btnRevAndConfrm: function () {
            new kony.mvc.Navigation("frmCardPayment").navigate(this.navData);
        },

        preShow: function () {
            this.updateProgress(
                this.navData.utilisedAmount,
                this.navData.totalLimit,
                this.navData.payAmount
            );
        },
        updateProgress: function (currentAmount, totalLimit, payAmount) {

            var currentPercent = (currentAmount / totalLimit) * 100;
            var previewPercent = ((currentAmount + payAmount) / totalLimit) * 100;

            if (previewPercent > 100) {
                previewPercent = 100;
            }

            this.view.flxProgressBar.width = currentPercent + "%";
            this.view.flxCreditBackProgress.width = previewPercent + "%";
            this.view.flxCreditBackProgress.isVisible = (payAmount > 0);
            this.view.lblUtilAmt.text = formatAmount(currentAmount) + " QAR";
            this.view.lblTotalAmt.text = formatAmount(totalLimit) + " QAR";
            this.view.lblPayAmount.text = this.navData.payAmount.toLocaleString() + " QAR";
            //commonUtil.callAlert();
            this.view.flxCardVisual.forceLayout();
        },

        onAmountChange: function () {


        },
    }


});