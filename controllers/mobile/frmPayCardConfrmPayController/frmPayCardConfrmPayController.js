define(["APICallController"], function (commonUtil) {

    return {
        navData: null,

        onNavigate: function (data) {
            this.navData = data;
            this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;
            this.view.preShow = this.preShow;

        },

        //Guarded like the Fawran submit: claimed before the call and never released on success, so a
        //second tap cannot post a second payment. confirmPC carries a dup-guard on the wire too, but
        //that did not stop 8 concurrent posts on the Fawran screen.
        submitting: false,

        btnRevAndConfrm: function () {
            var self = this;
            if (this.submitting) { return; }
            this.submitting = true;
            try { showLoadingScreen(); } catch (e) { }

            payCardConfirm(function (ok, data, code) {
                try { dismissLoadingScreen(); } catch (e) { }
                if (!ok) {
                    self.submitting = false;
                    var msg = (data && data.status && nullCheck(data.status.description))
                        ? data.status.description : "The payment could not be completed.";
                    kony.ui.Alert({
                        message: msg, alertType: constants.ALERT_TYPE_INFO,
                        alertTitle: "Pay card", yesLabel: "OK"
                    }, {});
                    return;
                }
                kony.print("POC PAYCARD: confirmPC ok, code=" + code +
                    " receipt = " + JSON.stringify(data).substring(0, 400));
                new kony.mvc.Navigation("frmCardPayment").navigate(self.navData);
            });
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