define({

    isChecked: false,
    cardData: [],

    onNavigate: function (params) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.backNav;
        this.view.flxBack.onTouchEnd = this.backNav;

        //Footer exists on this form but was never wired — reachable from the dashboard's Pay Now.
        this.view.imgFooter1.onTouchEnd = function () {
            new kony.mvc.Navigation("frmDashboard").navigate();
        };
        this.view.imgFooter2.onTouchEnd = function () {
            new kony.mvc.Navigation("frmCards").navigate();
        };
        this.view.imgFooter3.onTouchEnd = function () { pocNotBuilt("Payments"); };
        this.view.imgFooter4.onTouchEnd = function () {
            new kony.mvc.Navigation("frmTransfers").navigate();
        };
        this.view.imgFooter5.onTouchEnd = function () { pocNotBuilt("Menu"); };
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
        var self = this;
        //Service-driven. The inline cardData below is only a fallback if the call returns nothing.
        pocFetchCards(function (rows) {
            if (rows && rows.length) {
                self.cardData = pocMapCardsForChooser(rows);
                kony.print("POC CHOOSE: rendering " + rows.length + " real cards");
                self.setProgress();
                return;
            }
            //No cards means no cards. Showing invented ones here is worse than an empty screen:
            //they carry no ccuid, so every one of them dead-ends at the payment services anyway.
            kony.print("POC CHOOSE: customer has no cards — showing empty state");
            self.cardData = [];
            self.setProgress();
            self.showNoCards();
        });
    },

    showNoCards: function () {
        var self = this;
        kony.ui.Alert({
            message: "You don't have any cards to pay.",
            alertType: constants.ALERT_TYPE_INFO,
            alertTitle: "Cards",
            yesLabel: "OK",
            alertHandler: function () { self.backNav(); }
        }, {});
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

        //The list had no onRowClick, so this screen was a dead end — Dashboard "Pay Now" led here and
        //the journey stopped. Selecting a row now carries its limits forward to frmPayCard, which
        //expects utilisedAmount/totalLimit.
        this.view.segChooseCard.onRowClick = this.onCardSelected;

        this.view.segChooseCard.setData(this.cardData);

    },

    onCardSelected: function () {
        try {
            var idx = 0;
            var sel = this.view.segChooseCard.selectedRowIndex;
            if (sel && sel.length > 1) { idx = sel[1]; }

            var card = this.cardData[idx];
            if (!card) { return; }

            //ccuid / currency / minDueText were being dropped here even though pocMapCardsForChooser
            //carries them, so frmPayCard always saw ccuid=MISSING — the payment services would have
            //been unable to name the card even with real data on screen.
            kony.print("POC CHOOSE: selected " + card.lblCardName +
                " ccuid=" + (nullCheck(card.ccuid) ? card.ccuid : "MISSING"));

            new kony.mvc.Navigation("frmPayCard").navigate({
                utilisedAmount: card.utilised,
                totalLimit: card.limit,
                lblCardName: card.lblCardName,
                lblHolderName: card.lblHolderName,
                lblCardNumber: card.lblCardNumber,
                ccuid: card.ccuid,
                currency: card.currency,
                minDueText: card.minDueText,
                outstandingText: card.outstandingText
            });
        } catch (e) {
            kony.print("onCardSelected :: " + e);
        }
    }

});