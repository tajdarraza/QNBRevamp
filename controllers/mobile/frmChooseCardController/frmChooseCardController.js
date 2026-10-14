define(["Navigation"], function (Navigation) {
    return {
        isChecked: false,
        cardData: [],

        onNavigate: function (params) {
            this.view.init = this.onInit;
            this.view.preShow = this.preShow;
            this.view.onDeviceBack = this.backNav;

            this.view.cmpFooter.initializeFooter();
            this.view.cmpFooter.setSelectedTab("cards");
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
                    lblTotalAmt: "out of 10,00.00 QAR",
                },
                {
                    imgCard: "qnb_visa.png",
                    lblCardName: "Visa Signature",
                    lblHolderName: "Tajdar Raza",
                    lblCardNumber: "**** 1709",
                    utilised: 2500,
                    limit: 8000,
                    lblUtilAmt: "2,500.00 QAR",
                    lblTotalAmt: "out of 8,000.00 QAR",
                },
                {
                    imgCard: "qnb_visa.png",
                    lblCardName: "Mastercard World",
                    lblHolderName: "Sarah Ahmed",
                    lblCardNumber: "**** 9218",
                    utilised: 50000,
                    limit: 1000000,
                    lblUtilAmt: "5,000.00 QAR",
                    lblTotalAmt: "out of 100,000.00 QAR",
                },
            ];
        },

        preShow: function () {
            var self = this;

            this.view.commonheader.configure({
                title: "Choose your card",
                backAction: function () {
                    Navigation.navigateTo("frmCards")
                },
            });

            pocFetchCards(function (rows) {
                if (rows && rows.length) {
                    self.cardData = pocMapCardsForChooser(rows);

                    kony.print(
                        "POC CHOOSE: rendering " +
                        rows.length +
                        " real cards"
                    );

                    self.setProgress();
                    return;
                }

                kony.print(
                    "POC CHOOSE: customer has no cards — showing empty state"
                );

                self.cardData = [];
                self.setProgress();
                self.showNoCards();
            });
        },

        showNoCards: function () {
            var self = this;

            kony.ui.Alert(
                {
                    message: "You don't have any cards to pay.",
                    alertType: constants.ALERT_TYPE_INFO,
                    alertTitle: "Cards",
                    yesLabel: "OK",
                    alertHandler: function () {
                        self.backNav();
                    },
                },
                {}
            );
        },

        backNav: function () {
            Navigation.navigateTo("frmCards")
        },

        setProgress: function () {
            for (var i = 0; i < this.cardData.length; i++) {
                var percent =
                    (this.cardData[i].utilised /
                        this.cardData[i].limit) *
                    100;

                var remaining = 100 - percent;

                this.cardData[i].flxProgressBar = {
                    width: percent + "%",
                    skin:
                        remaining > 90
                            ? "sknProgressBillDE2B37"
                            : "sknProgressBill376cd2",
                };
            }

            this.view.segChooseCard.widgetDataMap = {
                imgCard: "imgCard",
                lblCardName: "lblCardName",
                lblHolderName: "lblHolderName",
                lblCardNumber: "lblCardNumber",
                lblUtilAmt: "lblUtilAmt",
                lblTotalAmt: "lblTotalAmt",
                flxProgressBar: "flxProgressBar",
            };

            this.view.segChooseCard.onRowClick =
                this.onCardSelected.bind(this);

            this.view.segChooseCard.setData(this.cardData);
        },

        onCardSelected: function () {
            try {
                var idx = 0;
                var sel = this.view.segChooseCard.selectedRowIndex;

                if (sel && sel.length > 1) {
                    idx = sel[1];
                }

                var card = this.cardData[idx];

                if (!card) {
                    return;
                }

                kony.print(
                    "POC CHOOSE: selected " +
                    card.lblCardName +
                    " ccuid=" +
                    (nullCheck(card.ccuid)
                        ? card.ccuid
                        : "MISSING")
                );

                Navigation.push("frmPayCard");

                Navigation.navigateTo("frmPayCard", {
                    utilisedAmount: card.utilised,
                    totalLimit: card.limit,
                    lblCardName: card.lblCardName,
                    lblHolderName: card.lblHolderName,
                    lblCardNumber: card.lblCardNumber,
                    mcn: card.mcn,
                    ccuid: card.ccuid,
                    currency: card.currency,
                    minDueText: card.minDueText,
                    outstandingText: card.outstandingText,
                });
            } catch (e) {
                kony.print("onCardSelected :: " + e);
            }
        },
    };
});