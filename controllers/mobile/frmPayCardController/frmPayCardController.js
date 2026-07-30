define({

    utilisedAmount: 45000,
    totalLimit: 60000,

    onNavigate: function () {
        this.view.preShow = this.preShow;
        this.view.txtPayAmt.onTextChange = this.onAmountChange;
        this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;
        
    },

    preShow: function () {
        this.view.lblUtilAmt.text = "45,000.00 QAR out of";
        this.view.lblTotalAmt.text = "60,000.00 QAR"
        this.updateProgress(0);

    },
    btnRevAndConfrm: function () {

    var payAmount = Number(this.view.txtPayAmt.text) || 0;

    new kony.mvc.Navigation("frmPayCardConfrmPay").navigate({
        utilisedAmount: this.utilisedAmount,
        totalLimit: this.totalLimit,
        payAmount: payAmount
    });
},

    onAmountChange: function () {

        var text = this.view.txtPayAmt.text.trim();

        if (text === "") {

            // Default skins
            this.view.btnOtherAmt.skin = "btnSkn32px08217abgWhite";
            this.view.btnRevAndConfrm.skin = "sknBtn50PxA8A1C4BgTrans";

            this.updateProgress(0);

        } else {

            // Active skins
            this.view.btnOtherAmt.skin = "btnSkin32pxWhiteBg2A59BD";
            this.view.btnRevAndConfrm.skin = "sknBtnSansENSemibold16PxWhite";
            this.view.btnRevAndConfrm.focusSkin = "sknBtnSansENSemibold16PxWhite";

            var pay = Number(text.replace(/,/g, "")) || 0;

            this.updateProgress(pay);
        }
    },
    updateProgress: function (payAmount) {

        var currentPercent = (this.utilisedAmount / this.totalLimit) * 100;
        var previewPercent = ((this.utilisedAmount + payAmount) / this.totalLimit) * 100;

        if (previewPercent > 100) {
            previewPercent = 100;
        }

        this.view.flxProgressBar.width = currentPercent + "%";
        this.view.flxCreditBackProgress.width = previewPercent + "%";
        this.view.flxCreditBackProgress.isVisible = (payAmount > 0);

        this.view.flxCardVisual.forceLayout();
    }
});