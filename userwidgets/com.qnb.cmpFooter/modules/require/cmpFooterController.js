define(function () {
    return {
        footerItems: {
            home: {
                widgetId: "imgFooter1",
                selectedImage: "selectedhome.png",
                unselectedImage: "navigationhome.png",
                formId: "frmDashboard"
            },

            cards: {
                widgetId: "imgFooter2",
                selectedImage: "selectedcards.png",
                unselectedImage: "navigationcards.png",
                formId: "frmCards"
            },

            payments: {
                widgetId: "imgFooter3",
                selectedImage: "selectedpayment.png",
                unselectedImage: "navigationpayments.png",
                formId: "frmPayments"
            },

            transfer: {
                widgetId: "imgFooter4",
                selectedImage: "selectedtransfer.png",
                unselectedImage: "navigationpayandtran.png",
                formId: "frmTransfers"
            },

            menu: {
                widgetId: "imgFooter5",
                selectedImage: "selectedmenu.png",
                unselectedImage: "navigationmenu.png",
                formId: "frmMoreActions"
            }
        },

        selectedTab: "",

        initializeFooter: function () {
            kony.print("========================================");
            kony.print("FOOTER :: INITIALIZE START");

            if (!this.view.imgFooter1 ||
                !this.view.imgFooter2 ||
                !this.view.imgFooter3 ||
                !this.view.imgFooter4 ||
                !this.view.imgFooter5) {

                kony.print("FOOTER :: REQUIRED WIDGETS NOT FOUND");
                return;
            }

            this.view.imgFooter1.onTouchEnd = this.onHomeClick.bind(this);
            this.view.imgFooter2.onTouchEnd = this.onCardsClick.bind(this);
            this.view.imgFooter3.onTouchEnd = this.onPaymentsClick.bind(this);
            this.view.imgFooter4.onTouchEnd = this.onTransferClick.bind(this);
            this.view.imgFooter5.onTouchEnd = this.onMenuClick.bind(this);

            kony.print("FOOTER :: TOUCH EVENTS ATTACHED");

            this.updateAllFooterImages();

            kony.print("FOOTER :: INITIALIZE COMPLETE");
            kony.print("========================================");
        },

        setSelectedTab: function (tabName) {
            kony.print("FOOTER :: SET SELECTED TAB = " + tabName);

            this.selectedTab = tabName || "";

            this.updateAllFooterImages();
        },

        updateAllFooterImages: function () {
            this.updateFooterImage("home");
            this.updateFooterImage("cards");
            this.updateFooterImage("payments");
            this.updateFooterImage("transfer");
            this.updateFooterImage("menu");
        },

        updateFooterImage: function (tabName) {
            var item = this.footerItems[tabName];

            if (!item) {
                kony.print("FOOTER :: UNKNOWN TAB = " + tabName);
                return;
            }

            var widget = this.view[item.widgetId];

            if (!widget) {
                kony.print("FOOTER :: WIDGET NOT FOUND = " + item.widgetId);
                return;
            }

            if (this.selectedTab === tabName) {
                widget.src = item.selectedImage;
                kony.print("FOOTER :: " + tabName + " = SELECTED");
            } else {
                widget.src = item.unselectedImage;
            }
        },

        onHomeClick: function () {
            kony.print("FOOTER :: HOME CLICKED");
            this.handleFooterNavigation("home");
        },

        onCardsClick: function () {
            kony.print("FOOTER :: CARDS CLICKED");
            this.handleFooterNavigation("cards");
        },

        onPaymentsClick: function () {
            kony.print("FOOTER :: PAYMENTS CLICKED");
            this.handleFooterNavigation("payments");
        },

        onTransferClick: function () {
            kony.print("FOOTER :: TRANSFER CLICKED");
            this.handleFooterNavigation("transfer");
        },

        onMenuClick: function () {
            kony.print("FOOTER :: MENU CLICKED");
            this.handleFooterNavigation("menu");
        },

        handleFooterNavigation: function (tabName) {
            kony.print("FOOTER :: HANDLE NAVIGATION = " + tabName);

            var item = this.footerItems[tabName];

            if (!item) {
                kony.print("FOOTER :: CONFIG NOT FOUND = " + tabName);
                return;
            }

            this.setSelectedTab(tabName);
            this.navigateToForm(item.formId);
        },

        navigateToForm: function (formId) {
            kony.print("FOOTER :: NAVIGATE TO = " + formId);

            if (!formId) {
                kony.print("FOOTER :: FORM ID EMPTY");
                return;
            }

            try {
                var navigation = new kony.mvc.Navigation(formId);

                kony.print("FOOTER :: NAVIGATION OBJECT CREATED");

                navigation.navigate();

                kony.print("FOOTER :: NAVIGATION CALLED");
            } catch (e) {
                kony.print("FOOTER :: NAVIGATION ERROR = " + e);
            }
        },

        goHome: function () {
            this.handleFooterNavigation("home");
        },

        goCards: function () {
            this.handleFooterNavigation("cards");
        },

        goPayments: function () {
            this.handleFooterNavigation("payments");
        },

        goTransfer: function () {
            this.handleFooterNavigation("transfer");
        },

        goMenu: function () {
            this.handleFooterNavigation("menu");
        }
    };
});