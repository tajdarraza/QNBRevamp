define(["Navigation"], function (Navigation) {
    return {

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            this.view.onDeviceBack = this.backNavigation;
            
            this.view.commonheader.configure({
                title: "Add new card",
                action1: function () {
                    alert("not yet developed");
                },
            });
        },

        init: function () {
            this.initActions();
            kony.print("init");
        },

        preShow: function () {
            kony.print("preShow");
            this.setCardTypesData();
        },

        postShow: function () {
            kony.print("postShow");
        },

        onHide: function () {
            kony.print("onHide");
        },

        backNavigation: function () {
            new kony.mvc.Navigation("frmQuickActions").navigate();
        },

        initActions: function () {
            // Bind segment row click event
            this.view.segCardType.onRowClick = this.onCardTypeRowClick.bind(this);
        },

        setCardTypesData: function () {
            // Define widget data map linking segment template widgets to row data keys
            var widgetMap = {
                "lblCardType": "lblCardType",
                "lblCardDesc": "lblCardDesc",
                "imgArrow": "imgArrow"
            };

            // Data for the 4 card types
            var cardData = [
                {
                    "lblCardType": "Credit Card",
                    "lblCardDesc": "Make purchases now and pay later with a flexible credit limit tailored to your profile",
                    "imgArrow": "traling.png"
                },
                {
                    "lblCardType": "Debit Card",
                    "lblCardDesc": "Spend directly from your account with a secure and widely accepted card",
                    "imgArrow": "traling.png"
                },
                {
                    "lblCardType": "Prepaid Card",
                    "lblCardDesc": "Load the amount you want and spend with full control over your budget",
                    "imgArrow": "traling.png"
                },
                {
                    "lblCardType": "Multi-Currency Card",
                    "lblCardDesc": "Load multiple currencies and pay like a local wherever you travel in the world",
                    "imgArrow": "traling.png"
                }
            ];

            this.view.segCardType.widgetDataMap = widgetMap;
            this.view.segCardType.setData(cardData);
        },

        onCardTypeRowClick: function (...onrowtap) {
            var data = this.view.segCardType.data;

            var rowData = data[onrowtap[2]];

            if (!rowData) {
                return;
            }

            var cardType = rowData.lblCardType;
            kony.print("Selected Card Type: " + cardType);

            if (cardType === "Multi-Currency Card") {
                // Navigate to Multi-Currency form
                var navObj = new kony.mvc.Navigation("frmCurrencyCard");
                navObj.navigate({
                    selectedCard: rowData
                });
            } else {
                // Show development in progress alert for other card types
                var alertConfig = {
                    message: cardType + " development in progress.",
                    alertType: constants.ALERT_TYPE_INFO,
                    alertTitle: "Information",
                    yesLabel: "OK"
                };

                kony.ui.Alert(alertConfig, {});
            }
        }
    };
});