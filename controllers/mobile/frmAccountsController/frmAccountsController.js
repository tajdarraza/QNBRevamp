define({

    cardData: [],

    // Keep the account lists so tabs can filter them
    currentAccounts: [],
    savingsAccounts: [],
    delegatedAccounts: [],


    // =========================================================
    // NAVIGATION
    // =========================================================

    onNavigate: function (navData) {

        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;

        this.view.imgFooter1.onTouchEnd = this.onFooterMenu;
        this.view.imgFooter2.onTouchEnd = this.onFooterMenu;
        this.view.imgFooter3.onTouchEnd = this.onFooterMenu;
        this.view.imgFooter4.onTouchEnd = this.onFooterMenu;
        this.view.imgFooter5.onTouchEnd = this.onFooterMenu;

        this.data = navData;
    },


    onFooterMenu: function () {

    },


    init: function () {

    },


    // =========================================================
    // PRE SHOW
    // =========================================================

    preShow: function () {

        // =====================================================
        // SEGMENT WIDGET DATA MAP
        // =====================================================

        this.view.segAccounts.widgetDataMap = {

            // -----------------------------------------
            // SECTION HEADER
            // -----------------------------------------

            flxAccountHeader: "flxAccountHeader",
            lblAccountHeader: "lblAccountHeader",


            // -----------------------------------------
            // MAIN
            // -----------------------------------------

            flxMain: "flxMain",


            // -----------------------------------------
            // TOP
            // -----------------------------------------

            flxTop: "flxTop",
            flxTopMain: "flxTopMain",


            // -----------------------------------------
            // VERTICAL SEPARATOR
            // -----------------------------------------

            flxVerticalSeperator: "flxVerticalSeperator",


            // -----------------------------------------
            // ACCOUNT DETAILS
            // -----------------------------------------

            flxAccDetails: "flxAccDetails",
            lblAccName: "lblAccName",
            lblAccNum: "lblAccNum",


            // -----------------------------------------
            // AMOUNT DETAILS
            // -----------------------------------------

            flxAmtDetails: "flxAmtDetails",
            lblAmount: "lblAmount",
            lblCurrency: "lblCurrency",


            // -----------------------------------------
            // SEPARATOR 1
            // -----------------------------------------

            flxSeperator1: "flxSeperator1",


            // -----------------------------------------
            // BOTTOM
            // -----------------------------------------

            flxBottom: "flxBottom",
            flxBottomMain: "flxBottomMain",

            imgCalendar: "imgCalendar",
            lblEndDate: "lblEndDate",


            // -----------------------------------------
            // SEPARATOR 2
            // -----------------------------------------

            flxSeparator2: "flxSeparator2"
        };


        // =====================================================
        // ROW CLICK
        // =====================================================

        this.view.segAccounts.onRowClick =
            this.onAccountRowClick.bind(this);


        // =====================================================
        // TAB CLICK EVENTS
        // =====================================================

        this.view.flxTabAll.onTouchEnd =
            this.onTabAll.bind(this);

        this.view.flxTabCurrent.onTouchEnd =
            this.onTabCurrent.bind(this);

        this.view.flxTabSavings.onTouchEnd =
            this.onTabSavings.bind(this);

        this.view.flxTabDelegate.onTouchEnd =
            this.onTabDelegated.bind(this);


        // =====================================================
        // LOAD DATA
        // =====================================================

        this.setDummyAccounts();


        // =====================================================
        // DEFAULT TAB
        // ALL IS SELECTED
        // =====================================================

        this.selectTab("all");
    },


    // =========================================================
    // POST SHOW
    // =========================================================

    postShow: function () {

    },


    // =========================================================
    // CREATE ACCOUNT ROW
    // =========================================================

    createAccountRow: function (
        accountName,
        accountNumber,
        amount,
        currency,
        showBottom,
        endDate,
        verticalSeparatorSkin
    ) {

        return {

            // =================================================
            // MAIN
            // =================================================

            flxMain: {
                isVisible: true
            },


            // =================================================
            // TOP
            // =================================================

            flxTop: {
                isVisible: true
            },

            flxTopMain: {
                isVisible: true
            },


            // =================================================
            // VERTICAL SEPARATOR
            // =================================================

            flxVerticalSeperator: {
                isVisible: true,
                skin: verticalSeparatorSkin
            },


            // =================================================
            // ACCOUNT DETAILS
            // =================================================

            flxAccDetails: {
                isVisible: true
            },

            lblAccName: accountName,

            lblAccNum: accountNumber,


            // =================================================
            // AMOUNT DETAILS
            // =================================================

            flxAmtDetails: {
                isVisible: true
            },

            lblAmount: amount,

            lblCurrency: currency,


            // =================================================
            // SEPARATOR 1
            // =================================================

            flxSeperator1: {
                isVisible: !showBottom,
                skin: "slFbox"
            },


            // =================================================
            // BOTTOM
            // =================================================

            flxBottom: {
                isVisible: showBottom
            },

            flxBottomMain: {
                isVisible: showBottom
            },


            // =================================================
            // CALENDAR
            // =================================================

            imgCalendar: {
                isVisible: showBottom,
                src: "calendar.png"
            },


            // =================================================
            // END DATE
            // =================================================

            lblEndDate: {
                isVisible: showBottom,
                text: endDate || ""
            },


            // =================================================
            // SEPARATOR 2
            // =================================================

            flxSeparator2: {
                isVisible: showBottom,
                skin: "slFbox"
            }
        };
    },


    // =========================================================
    // DUMMY DATA
    // =========================================================

    setDummyAccounts: function () {

        // =====================================================
        // CURRENT ACCOUNTS
        // =====================================================

        this.currentAccounts = [

            this.createAccountRow(
                "Current Account",
                "**** 4582",
                "12,450.00",
                "QAR",
                true,
                "Valid until 31 Dec 2026",
                "sknFlxRounderdSeperator2a59bd"
            ),


            this.createAccountRow(
                "Current Account",
                "**** 7812",
                "4,066.71",
                "QAR",
                false,
                "",
                "sknFlxRounderdSeperator2a59bd"
            )
        ];


        // =====================================================
        // SAVINGS ACCOUNTS
        // =====================================================

        this.savingsAccounts = [

            this.createAccountRow(
                "Savings Account",
                "**** 9921",
                "150,000.00",
                "QAR",
                false,
                "",
                "sknFlxRounderdSeperatorAC2672"
            ),


            this.createAccountRow(
                "Savings Account",
                "**** 6214",
                "1,250,000.00",
                "QAR",
                true,
                "Maturity 20 Dec 2026",
                "sknFlxRounderdSeperatorAC2672"
            )
        ];


        // =====================================================
        // DELEGATED ACCOUNTS
        // =====================================================

        this.delegatedAccounts = [

            this.createAccountRow(
                "Delegated Account",
                "**** 3456",
                "25,500.00",
                "QAR",
                false,
                "",
                "sknFlxRounderdSeperatorClra8a1c4"
            ),


            this.createAccountRow(
                "Delegated Account",
                "**** 7890",
                "75,250.50",
                "QAR",
                true,
                "Delegation until 30 Nov 2026",
                "sknFlxRounderdSeperatorClra8a1c4"
            )
        ];


        // =====================================================
        // DEFAULT = ALL ACCOUNTS
        // =====================================================

        this.showAllAccounts();
    },


    // =========================================================
    // SHOW ALL ACCOUNTS
    // =========================================================

    showAllAccounts: function () {

        var data = [];


        // -----------------------------------------------------
        // CURRENT
        // -----------------------------------------------------

        if (this.currentAccounts.length > 0) {

            data.push([
                {
                    lblAccountHeader:
                        "Current (" +
                        this.currentAccounts.length +
                        ")"
                },

                this.currentAccounts
            ]);
        }


        // -----------------------------------------------------
        // SAVINGS
        // -----------------------------------------------------

        if (this.savingsAccounts.length > 0) {

            data.push([
                {
                    lblAccountHeader:
                        "Savings (" +
                        this.savingsAccounts.length +
                        ")"
                },

                this.savingsAccounts
            ]);
        }


        // -----------------------------------------------------
        // DELEGATED
        // -----------------------------------------------------

        if (this.delegatedAccounts.length > 0) {

            data.push([
                {
                    lblAccountHeader:
                        "Delegated (" +
                        this.delegatedAccounts.length +
                        ")"
                },

                this.delegatedAccounts
            ]);
        }


        this.view.segAccounts.setData(data);
    },


    // =========================================================
    // SHOW CURRENT ACCOUNTS
    // =========================================================

    showCurrentAccounts: function () {

        var data = [

            [
                {
                    lblAccountHeader:
                        "Current (" +
                        this.currentAccounts.length +
                        ")"
                },

                this.currentAccounts
            ]

        ];


        this.view.segAccounts.setData(data);
    },


    // =========================================================
    // SHOW SAVINGS ACCOUNTS
    // =========================================================

    showSavingsAccounts: function () {

        var data = [

            [
                {
                    lblAccountHeader:
                        "Savings (" +
                        this.savingsAccounts.length +
                        ")"
                },

                this.savingsAccounts
            ]

        ];


        this.view.segAccounts.setData(data);
    },


    // =========================================================
    // SHOW DELEGATED ACCOUNTS
    // =========================================================

    showDelegatedAccounts: function () {

        var data = [

            [
                {
                    lblAccountHeader:
                        "Delegated (" +
                        this.delegatedAccounts.length +
                        ")"
                },

                this.delegatedAccounts
            ]

        ];


        this.view.segAccounts.setData(data);
    },


    // =========================================================
    // TAB SELECTION
    // =========================================================

    selectTab: function (selectedTab) {

        // =====================================================
        // RESET ALL TABS
        // =====================================================

        this.view.flxTabAll.skin = "slFbox";
        this.view.flxTabCurrent.skin = "slFbox";
        this.view.flxTabSavings.skin = "slFbox";
        this.view.flxTabDelegate.skin = "slFbox";

        this.view.lblTabAll.skin  = "sknLblQNBSemibold16Px1b124b";
        this.view.lblTabSavings.skin  = "sknLblQNBSemibold16Px1b124b";
        this.view.lblTabCurrent.skin  = "sknLblQNBSemibold16Px1b124b";
        this.view.lblTabDelegate.skin  = "sknLblQNBSemibold16Px1b124b";


        // =====================================================
        // SELECTED TAB
        // =====================================================

        if (selectedTab === "all") {

            this.view.flxTabAll.skin =
                "sknFlxTabQNBSemiBold16Px2a59bd";
                this.view.lblTabAll.skin  = "sknLblQNBSemibold16PxWhite";

            this.showAllAccounts();

        }


        else if (selectedTab === "current") {

            this.view.flxTabCurrent.skin =
                "sknFlxTabQNBSemiBold16Px2a59bd";
                this.view.lblTabCurrent.skin  = "sknLblQNBSemibold16PxWhite";

            this.showCurrentAccounts();

        }


        else if (selectedTab === "savings") {

            this.view.flxTabSavings.skin =
                "sknFlxTabQNBSemiBold16Px2a59bd";
                this.view.lblTabSavings.skin  = "sknLblQNBSemibold16PxWhite";

            this.showSavingsAccounts();

        }


        else if (selectedTab === "delegated") {

            this.view.flxTabDelegate.skin =
                "sknFlxTabQNBSemiBold16Px2a59bd";
                this.view.lblTabDelegate.skin  = "sknLblQNBSemibold16PxWhite";

            this.showDelegatedAccounts();

        }
    },


    // =========================================================
    // TAB: ALL
    // =========================================================

    onTabAll: function () {

        this.selectTab("all");
    },


    // =========================================================
    // TAB: CURRENT
    // =========================================================

    onTabCurrent: function () {

        this.selectTab("current");
    },


    // =========================================================
    // TAB: SAVINGS
    // =========================================================

    onTabSavings: function () {

        this.selectTab("savings");
    },


    // =========================================================
    // TAB: DELEGATED
    // =========================================================

    onTabDelegated: function () {

        this.selectTab("delegated");
    },


    // =========================================================
    // ROW CLICK
    // =========================================================

    onAccountRowClick: function (
        segmentWidget,
        sectionIndex,
        rowIndex
    ) {

        var rowData =
            segmentWidget.data[sectionIndex][1][rowIndex];


        alert(
            "Clicked: " +
            rowData.lblAccName +
            "\nAccount: " +
            rowData.lblAccNum +
            "\nAmount: " +
            rowData.lblAmount +
            " " +
            rowData.lblCurrency
        );


        // Later:
        //
        // new kony.mvc.Navigation(
        //     "frmAccountDetails"
        // ).navigate(rowData);
    }

});