define(function() {

    return {

        /*
         * =====================================================
         * FOOTER CONFIGURATION
         * =====================================================
         */

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


        /*
         * =====================================================
         * STATE
         * =====================================================
         */

        selectedTab: "",


        /*
         * =====================================================
         * COMPONENT INITIALIZATION
         * =====================================================
         */

        initializeFooter: function() {

            kony.print(
                "========================================"
            );

            kony.print(
                "FOOTER COMPONENT INIT START"
            );


            /*
             * Make sure the component widgets exist.
             */

            if (!this.view.imgFooter1) {

                kony.print(
                    "FOOTER ERROR: imgFooter1 NOT FOUND"
                );

                return;
            }

            if (!this.view.imgFooter2) {

                kony.print(
                    "FOOTER ERROR: imgFooter2 NOT FOUND"
                );

                return;
            }

            if (!this.view.imgFooter3) {

                kony.print(
                    "FOOTER ERROR: imgFooter3 NOT FOUND"
                );

                return;
            }

            if (!this.view.imgFooter4) {

                kony.print(
                    "FOOTER ERROR: imgFooter4 NOT FOUND"
                );

                return;
            }

            if (!this.view.imgFooter5) {

                kony.print(
                    "FOOTER ERROR: imgFooter5 NOT FOUND"
                );

                return;
            }


            /*
             * =================================================
             * ATTACH TOUCH EVENTS
             * =================================================
             */

            this.view.imgFooter1.onTouchEnd =
                this.onHomeClick.bind(this);

            this.view.imgFooter2.onTouchEnd =
                this.onCardsClick.bind(this);

            this.view.imgFooter3.onTouchEnd =
                this.onPaymentsClick.bind(this);

            this.view.imgFooter4.onTouchEnd =
                this.onTransferClick.bind(this);

            this.view.imgFooter5.onTouchEnd =
                this.onMenuClick.bind(this);


            kony.print(
                "FOOTER :: ALL TOUCH EVENTS ATTACHED"
            );


            /*
             * Default state
             */

            this.setSelectedTab("");


            kony.print(
                "FOOTER COMPONENT INIT COMPLETE"
            );

            kony.print(
                "========================================"
            );
        },


        /*
         * =====================================================
         * SET SELECTED TAB
         * =====================================================
         *
         * Public method.
         *
         * Parent can call:
         *
         * this.view.cmpFooter.setSelectedTab("home");
         *
         */

        setSelectedTab: function(tabName) {

            kony.print(
                "FOOTER :: SET SELECTED TAB = " +
                tabName
            );


            this.selectedTab =
                tabName || "";


            this.updateFooterImage("home");

            this.updateFooterImage("cards");

            this.updateFooterImage("payments");

            this.updateFooterImage("transfer");

            this.updateFooterImage("menu");
        },


        /*
         * =====================================================
         * UPDATE FOOTER IMAGE
         * =====================================================
         */

        updateFooterImage: function(tabName) {

            var item =
                this.footerItems[tabName];


            if (!item) {

                kony.print(
                    "FOOTER :: UNKNOWN TAB = " +
                    tabName
                );

                return;
            }


            var widget =
                this.view[item.widgetId];


            if (!widget) {

                kony.print(
                    "FOOTER :: WIDGET NOT FOUND = " +
                    item.widgetId
                );

                return;
            }


            if (
                this.selectedTab ===
                tabName
            ) {

                widget.src =
                    item.selectedImage;

            } else {

                widget.src =
                    item.unselectedImage;
            }
        },


        /*
         * =====================================================
         * HOME
         * =====================================================
         */

        onHomeClick: function() {

            kony.print(
                "########################################"
            );

            kony.print(
                "FOOTER :: HOME CLICKED"
            );


            this.handleFooterNavigation(
                "home"
            );
        },


        /*
         * =====================================================
         * CARDS
         * =====================================================
         */

        onCardsClick: function() {

            kony.print(
                "########################################"
            );

            kony.print(
                "FOOTER :: CARDS CLICKED"
            );


            this.handleFooterNavigation(
                "cards"
            );
        },


        /*
         * =====================================================
         * PAYMENTS
         * =====================================================
         */

        onPaymentsClick: function() {

            kony.print(
                "########################################"
            );

            kony.print(
                "FOOTER :: PAYMENTS CLICKED"
            );


            this.handleFooterNavigation(
                "payments"
            );
        },


        /*
         * =====================================================
         * TRANSFER
         * =====================================================
         */

        onTransferClick: function() {

            kony.print(
                "########################################"
            );

            kony.print(
                "FOOTER :: TRANSFER CLICKED"
            );


            this.handleFooterNavigation(
                "transfer"
            );
        },


        /*
         * =====================================================
         * MENU
         * =====================================================
         */

        onMenuClick: function() {

            kony.print(
                "########################################"
            );

            kony.print(
                "FOOTER :: MENU CLICKED"
            );


            this.handleFooterNavigation(
                "menu"
            );
        },


        /*
         * =====================================================
         * COMMON FOOTER NAVIGATION
         * =====================================================
         */

        handleFooterNavigation: function(tabName) {

            kony.print(
                "FOOTER :: HANDLE NAVIGATION = " +
                tabName
            );


            var item =
                this.footerItems[tabName];


            if (!item) {

                kony.print(
                    "FOOTER :: CONFIG NOT FOUND = " +
                    tabName
                );

                return;
            }


            /*
             * Update icon first.
             */

            this.setSelectedTab(
                tabName
            );


            /*
             * Navigate.
             */

            this.navigateToForm(
                item.formId
            );
        },


        /*
         * =====================================================
         * COMMON NAVIGATION
         * =====================================================
         */

        navigateToForm: function(formId) {

            kony.print(
                "FOOTER :: NAVIGATE TO = " +
                formId
            );


            if (!formId) {

                kony.print(
                    "FOOTER :: FORM ID EMPTY"
                );

                return;
            }


            try {

                var navigation =
                    new kony.mvc.Navigation(
                        formId
                    );


                kony.print(
                    "FOOTER :: NAVIGATION OBJECT CREATED"
                );


                navigation.navigate();


                kony.print(
                    "FOOTER :: NAVIGATION CALLED"
                );

            } catch (e) {

                kony.print(
                    "FOOTER :: NAVIGATION ERROR = " +
                    e
                );
            }
        },


        /*
         * =====================================================
         * PUBLIC METHODS
         * =====================================================
         */

        goHome: function() {

            this.handleFooterNavigation(
                "home"
            );
        },


        goCards: function() {

            this.handleFooterNavigation(
                "cards"
            );
        },


        goPayments: function() {

            this.handleFooterNavigation(
                "payments"
            );
        },


        goTransfer: function() {

            this.handleFooterNavigation(
                "transfer"
            );
        },


        goMenu: function() {

            this.handleFooterNavigation(
                "menu"
            );
        }

    };

});