define({

    isChecked: false,
    cardData: [],

    onNavigate: function (params) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.backNav;
        this.view.flxBack.onTouchEnd = this.backNav;
    },

    onInit: function () {

        this.cardData = [

            {
                imgCard: "qnb_visa.png",
                lblCardName: "Visa Platinum",
                lblHolderName: "James Lee",
                lblCardNumber: "**** 0467",

                utilised: 7500,
                limit: 10000,

                lblUtilAmt: "7,500.00 QAR",
                lblTotalAmt: "out of 10,00.00 QAR"
            },

            {
                imgCard: "qnb_visa.png",
                lblCardName: "Visa Signature",
                lblHolderName: "Tajdar Raza",
                lblCardNumber: "**** 1709",

                utilised: 2500,
                limit: 8000,

                lblUtilAmt: "2,500.00 QAR",
                lblTotalAmt: "out of 8,000.00 QAR"
            },

            {
                imgCard: "qnb_visa.png",
                lblCardName: "Mastercard World",
                lblHolderName: "Sarah Ahmed",
                lblCardNumber: "**** 9218",

                utilised: 50000,
                limit: 1000000,

                lblUtilAmt: "5,000.00 QAR",
                lblTotalAmt: "out of 100,000.00 QAR"
            }

        ];

    },

    preShow: function () {
        this.setProgress();
    },

    backNav: function() {
        var prevForm = kony.application.getPreviousForm().id;

        new kony.mvc.Navigation(prevForm).navigate();
    },

    setProgress: function () {

        for (var i = 0; i < this.cardData.length; i++) {

            // var percent = (this.cardData[i].utilised / this.cardData[i].limit) * 100;

            // this.cardData[i].flxProgressBar = {
            //     width: percent + "%"
            // };

            var percent = (this.cardData[i].utilised / this.cardData[i].limit) * 100;
            var remaining = 100 - percent;

            this.cardData[i].flxProgressBar = {
                width: percent + "%",
                skin: remaining > 90
                    ? "sknProgressBillDE2B37"
                    : "sknProgressBill376cd2"
            };

        }

        this.view.segChooseCard.widgetDataMap = {
            imgCard: "imgCard",
            lblCardName: "lblCardName",
            lblHolderName: "lblHolderName",
            lblCardNumber: "lblCardNumber",
            lblUtilAmt: "lblUtilAmt",
            lblTotalAmt: "lblTotalAmt",
            flxProgressBar: "flxProgressBar"
        };

        this.view.segChooseCard.setData(this.cardData);

    }

});