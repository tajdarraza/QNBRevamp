define({

    utilisedAmount: 45000,
    totalLimit: 60000,

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.txtPayAmt.onTextChange = this.onAmountChange;
        this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;

        //Carry the selection from frmChooseCard instead of always using the hardcoded 45000/60000.
        if (navData && navData.totalLimit) {
            this.utilisedAmount = Number(navData.utilisedAmount) || 0;
            this.totalLimit = Number(navData.totalLimit) || 0;
        }
        this.navData = navData;

        //These three were dead — the only way to enter an amount was free text.
        this.view.btnFullBal.onClick = this.onFullBalance;
        this.view.btnMinAmtDue.onClick = this.onMinimumDue;
    },

    preShow: function () {
        //Was hardcoded to the same numbers twice; now reflects the selected card.
        this.view.lblUtilAmt.text = formatAmount(this.utilisedAmount) + " QAR out of";
        this.view.lblTotalAmt.text = formatAmount(this.totalLimit) + " QAR";

        //Spending-limit value ships as the malformed literal "100,00.00 QAR". Drive it from the
        //selected card so it is both correctly formatted and consistent with the bar above it.
        try {
            this.view.CopyLabel0i507f2a0acab40.text = formatAmount(this.totalLimit) + " QAR";
        } catch (e) {
            kony.print("spending limit label :: " + e);
        }

        //Card holder / masked number, when we arrived via Choose your card.
        if (this.navData) {
            if (nullCheck(this.navData.lblHolderName)) {
                this.view.Label0e03101bc02e044.text = this.navData.lblHolderName;
            }
            if (nullCheck(this.navData.lblCardNumber)) {
                this.view.Label0c2de68d6140940.text = "(" + this.navData.lblCardNumber + ")";
            }
        }

        this.updateProgress(0);

    },

    onFullBalance: function () {
        this.setPayAmount(this.utilisedAmount);
    },

    //No statement data in this prototype — 5% of the outstanding balance is the usual convention.
    onMinimumDue: function () {
        this.setPayAmount(Math.round(this.utilisedAmount * 0.05 * 100) / 100);
    },

    setPayAmount: function (amt) {
        this.view.txtPayAmt.text = formatAmount(amt);
        this.onAmountChange();
    },

    btnRevAndConfrm: function () {

    //Strip separators before coercing. The old Number(text) returned 0 for "1,000", so the confirm
    //screen received 0 while the progress bar showed the right figure.
    var payAmount = Number(("" + this.view.txtPayAmt.text).replace(/,/g, "")) || 0;

    if (payAmount <= 0) {
        kony.ui.Alert({
            message: "Enter an amount to pay.",
            alertType: constants.ALERT_TYPE_INFO,
            alertTitle: "Pay card",
            yesLabel: "OK"
        }, {});
        return;
    }

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