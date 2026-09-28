define({
    loanData: [],
    currentLoanRow: 0,
    currentMainPage: 0,
    indicators: [],
    isMainScrolling: false,
    isMainPageAnimating: false,

    loanTouchStartX: null,
    loanSwipeDirection: "",
    isReturningToMainPage: false,

    onNavigate: function (navData) {
        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;

        this.view.commonheader.configure({
            title: "Loan",
            action1: function () {
                alert("not yet developed");
            },
            action2: function () {},
            action2Image: "closeicon.png"
        });

        this.data = navData;
    },

    init: function () {},

    preShow: function () {

        this.currentLoanRow = 0;
        this.currentMainPage = 0;
        this.isMainScrolling = false;
        this.isMainPageAnimating = false;
        this.loanTouchStartX = null;
        this.loanSwipeDirection = "";
        this.isReturningToMainPage = false;

        if (this.view.segLoanAccounts) {
            this.view.segLoanAccounts.widgetDataMap = {
                lblRemainingBalance: "lblRemainingBalance",
                lblRemainingBalAmt: "lblRemainingBalAmt",
                lblInstallment: "lblInstallment",
                lblUtilAmt: "lblUtilAmt",
                lblTotalAmt: "lblTotalAmt",
                lblSettingHeader: "lblSettingHeader"
            };
        }

        if (this.view.segLoanDashBoard) {

            this.view.segLoanDashBoard.widgetDataMap = {
                flxLoanDashboard: "flxLoanDashboard",
                flxLoanCard: "flxLoanCard",
                flxLoanQuickMenu: "flxLoanQuickMenu",
                flxRemainingToPay: "flxRemainingToPay",
                lblRemainingToPay: "lblRemainingToPay",
                flxTypeOfLoan: "flxTypeOfLoan",
                lblTypeOfLoan: "lblTypeOfLoan",
                imgTypeOfLoan: "imgTypeOfLoan",
                flxRemainingAmt: "flxRemainingAmt",
                lblRemainingAmount: "lblRemainingAmount",
                lblRemainingAmtDecimal: "lblRemainingAmtDecimal",
                flxPercentagePaid: "flxPercentagePaid",
                flxPaid: "flxPaid",
                lblPaid: "lblPaid",
                flxBottomLoan: "flxBottomLoan",
                flxProgressBack: "flxProgressBack",
                flxProgressBar: "flxProgressBar",
                flxCompletedPayments: "flxCompletedPayments",
                lblPaymentCompleted: "lblPaymentCompleted",
                lblTotalEMI: "lblTotalEMI",
                flxLoanAmount: "flxLoanAmount",
                lblLoanAmount: "lblLoanAmount",
                lblLoanAmountVal: "lblLoanAmountVal"
            };

            this.view.segLoanDashBoard.onSwipe =
                this.onLoanDashboardSwipe.bind(this);

            this.view.segLoanDashBoard.onTouchStart =
                this.onLoanTouchStart.bind(this);

            this.view.segLoanDashBoard.onTouchMove =
                this.onLoanTouchMove.bind(this);

            this.view.segLoanDashBoard.onTouchEnd =
                this.onLoanTouchEnd.bind(this);
        }

        this.configureMainScroll();

        this.setLoanData();
        this.setLoanAccountsData(this.loanData);
        this.setLoanDashboardData();

        this.configureTabs();
        this.configureTransactionTabs();

        this.createLoanIndicators();

        this.showMainPage(true);
    },

    postShow: function () {},

    configureMainScroll: function () {

        var scroll = this.view.flxScrollMain;

        if (!scroll) {
            kony.print("LOAN :: flxScrollMain not found");
            return;
        }

        scroll.isVisible = true;
        scroll.enableScrolling = true;
        scroll.scrollDirection = kony.flex.SCROLL_HORIZONTAL;
        scroll.pagingEnabled = true;

        scroll.horizontalScrollIndicator = false;
        scroll.verticalScrollIndicator = false;

        scroll.bounces = false;
        scroll.allowHorizontalBounce = false;
        scroll.allowVerticalBounce = false;

        if (this.view.flxMain) {
            this.view.flxMain.isVisible = true;
            this.view.flxMain.left = "0%";
            this.view.flxMain.width = "100%";
        }

        if (this.view.flxMain2) {
            this.view.flxMain2.isVisible = true;
            this.view.flxMain2.left = "0%";
            this.view.flxMain2.width = "100%";
        }

        scroll.onScrollStart =
            this.onMainScrollStart.bind(this);

        scroll.onScrolling =
            this.onMainScrolling.bind(this);

        scroll.onScrollEnd =
            this.onMainScrollEnd.bind(this);

        kony.print(
            "LOAN :: flxScrollMain configured with paging"
        );
    },

    /*
     * ============================================================
     * MAIN PAGE SCROLL FADE
     * ============================================================
     *
     * Page 0:
     *      flxLoanDetails     = 1
     *      flxLoanDashboard   = 0
     *
     * Page 1:
     *      flxLoanDetails     = 0
     *      flxLoanDashboard   = 1
     *
     * Opacity follows actual horizontal scroll position.
     */
    onMainScrolling: function () {

        var scroll = this.view.flxScrollMain;

        if (!scroll) {
            return;
        }

        if (!this.view.flxLoanDetails ||
            !this.view.flxLoanDashboard) {
            return;
        }

        var offset = scroll.contentOffsetMeasured;

        if (!offset ||
            typeof offset.x !== "number") {
            return;
        }

        var x = offset.x;

        var pageWidth = 0;

        if (scroll.frame &&
            scroll.frame.width) {

            pageWidth =
                scroll.frame.width;
        }

        if (!pageWidth || pageWidth <= 0) {

            pageWidth =
                kony.os.deviceInfo().screenWidth;
        }

        if (!pageWidth || pageWidth <= 0) {
            return;
        }

        /*
         * Convert scroll position into
         * a 0 -> 1 progress value.
         */
        var progress =
            x / pageWidth;

        if (progress < 0) {
            progress = 0;
        }

        if (progress > 1) {
            progress = 1;
        }

        /*
         * Page 0 fades OUT.
         */
        var detailsOpacity =
            1 - progress;

        /*
         * Page 1 fades IN.
         */
        var dashboardOpacity =
            progress;

        this.view.flxLoanDetails.opacity =
            detailsOpacity;

        this.view.flxLoanDashboard.opacity =
            dashboardOpacity;

        kony.print(
            "LOAN :: Main scrolling | x = " +
            x +
            " | width = " +
            pageWidth +
            " | progress = " +
            progress +
            " | detailsOpacity = " +
            detailsOpacity +
            " | dashboardOpacity = " +
            dashboardOpacity
        );
    },

    onMainScrollStart: function () {

        this.isMainScrolling = true;

        kony.print(
            "LOAN :: flxScrollMain scroll started"
        );
    },

    onMainScrollEnd: function () {

        var scroll = this.view.flxScrollMain;

        if (!scroll) {
            return;
        }

        var offset =
            scroll.contentOffsetMeasured;

        var x = 0;

        if (offset &&
            typeof offset.x === "number") {

            x = offset.x;
        }

        var pageWidth =
            scroll.frame &&
            scroll.frame.width ?
                scroll.frame.width :
                0;

        if (!pageWidth ||
            pageWidth <= 0) {

            pageWidth =
                kony.os.deviceInfo().screenWidth;
        }

        var newPage =
            x >= (pageWidth * 0.5) ?
                1 :
                0;

        this.isMainScrolling = false;

        kony.print(
            "LOAN :: flxScrollMain scroll end | x = " +
            x +
            " | pageWidth = " +
            pageWidth +
            " | newPage = " +
            newPage +
            " | currentPage = " +
            this.currentMainPage
        );

        if (newPage === 0) {

            this.isReturningToMainPage = false;

            scroll.enableScrolling = true;

            /*
             * Ensure final opacity is correct.
             */
            if (this.view.flxLoanDetails) {
                this.view.flxLoanDetails.opacity = 1;
            }

            if (this.view.flxLoanDashboard) {
                this.view.flxLoanDashboard.opacity = 0;
            }

            kony.print(
                "LOAN :: Page 0 active -> flxScrollMain ENABLED"
            );

            this.showMainPage(false);

            return;
        }

        scroll.enableScrolling = false;

        /*
         * Ensure final opacity is correct.
         */
        if (this.view.flxLoanDetails) {
            this.view.flxLoanDetails.opacity = 0;
        }

        if (this.view.flxLoanDashboard) {
            this.view.flxLoanDashboard.opacity = 1;
        }

        kony.print(
            "LOAN :: Page 1 active -> flxScrollMain DISABLED | segment owns swipe"
        );

        this.showDashboardPage(false);
    },

    getTouchX: function (value) {

        if (typeof value === "number") {
            return value;
        }

        if (!value) {
            return null;
        }

        if (typeof value.x === "number") {
            return value.x;
        }

        if (typeof value.pageX === "number") {
            return value.pageX;
        }

        if (typeof value.xCoordinate === "number") {
            return value.xCoordinate;
        }

        return null;
    },

    onLoanTouchStart: function (widget, x, y) {

        this.loanTouchStartX =
            this.getTouchX(x);

        this.loanSwipeDirection = "";

        kony.print(
            "LOAN :: TouchStart X = " +
            this.loanTouchStartX
        );
    },

    onLoanTouchMove: function (widget, x, y) {

        var currentX =
            this.getTouchX(x);

        if (
            this.loanTouchStartX === null ||
            currentX === null
        ) {
            return;
        }

        var deltaX =
            currentX -
            this.loanTouchStartX;

        if (Math.abs(deltaX) >= 20) {

            this.loanSwipeDirection =
                deltaX < 0 ?
                    "left" :
                    "right";
        }
    },

    onLoanTouchEnd: function (widget, x, y) {

        var currentX =
            this.getTouchX(x);

        if (
            this.loanTouchStartX === null ||
            currentX === null
        ) {
            return;
        }

        var deltaX =
            currentX -
            this.loanTouchStartX;

        if (Math.abs(deltaX) >= 20) {

            this.loanSwipeDirection =
                deltaX < 0 ?
                    "left" :
                    "right";
        }

        kony.print(
            "LOAN :: TouchEnd | deltaX = " +
            deltaX +
            " | direction = " +
            this.loanSwipeDirection
        );
    },

setScrollMainHeight: function () {

    var screenHeight =
        kony.os.deviceInfo().screenHeight;

    if (!screenHeight || screenHeight <= 0) {

        kony.print(
            "LOAN :: Invalid screen height = " +
            screenHeight
        );

        return;
    }

    var headerHeight =
        screenHeight * 0.10;

    var scrollHeight;

    if (this.currentMainPage === 0) {

        scrollHeight =
            screenHeight -
            headerHeight - 72
            32;

        kony.print(
            "LOAN :: Main page scroll height = " +
            scrollHeight
        );

    } else {

        scrollHeight =
            screenHeight -
            headerHeight -
            336;

        kony.print(
            "LOAN :: Dashboard page scroll height = " +
            scrollHeight
        );
    }

    if (scrollHeight < 0) {
        scrollHeight = 0;
    }

    /*
     * IMPORTANT:
     * Actually apply the calculated height.
     */
    if (this.view.flxScrollMain) {

       // this.view.flxScrollMain.height = scrollHeight + "dp";

        kony.print(
            "LOAN :: flxScrollMain.height SET = " +
            this.view.flxScrollMain.height
        );
    }

    this.view.forceLayout();
},

    showMainPage: function (initialLoad) {

        if (
            !initialLoad &&
            this.currentMainPage === 0
        ) {
            return;
        }

        this.currentMainPage = 0;

        this.view.commonheader.height = "10%";

        this.view.flxMain.isVisible = true;
        this.view.flxMain2.isVisible = true;

        this.view.flxDots.height = "48dp";

        if (this.view.flxDueDate) {
            this.view.flxDueDate.isVisible = false;
        }

        this.setScrollMainHeight();

        this.updateLoanDots(0);

        /*
         * Page 0 final state.
         */
        this.view.flxLoanDetails.isVisible = true;
        this.view.flxLoanDashboard.isVisible = false;

        this.view.flxLoanDetails.opacity = 1;
        this.view.flxLoanDashboard.opacity = 0;

        kony.print(
            "LOAN :: flxMain active | no animation"
        );
    },

    showDashboardPage: function (initialLoad) {

        if (
            !initialLoad &&
            this.currentMainPage === 1
        ) {
            return;
        }

        this.currentMainPage = 1;

        this.view.commonheader.height = "10%";

        this.view.flxMain.isVisible = true;
        this.view.flxMain2.isVisible = true;

        this.view.flxDots.height = "48dp";

        if (this.view.flxDueDate) {

            this.view.flxDueDate.isVisible = true;
            this.view.flxDueDate.top = "18dp";
            this.view.flxDueDate.height = "72dp";
        }

        this.setScrollMainHeight();

        this.updateLoanDots(
            this.currentLoanRow + 1
        );

        /*
         * Page 1 final state.
         */
        this.view.flxLoanDetails.isVisible = false;
        this.view.flxLoanDashboard.isVisible = true;

        this.view.flxLoanDetails.opacity = 0;
        this.view.flxLoanDashboard.opacity = 1;

        kony.print(
            "LOAN :: flxMain2 active | row = " +
            this.currentLoanRow +
            " | no animation"
        );
    },

    onLoanDashboardSwipe: function (
        widget,
        sectionIndex,
        rowIndex,
        selectionState
    ) {

        kony.print(
            "LOAN :: onSwipe sectionIndex = " +
            sectionIndex +
            " | rowIndex = " +
            rowIndex +
            " | direction = " +
            this.loanSwipeDirection
        );

        if (typeof rowIndex !== "number") {

            kony.print(
                "LOAN :: Invalid rowIndex = " +
                rowIndex
            );

            return;
        }

        /*
         * First loan row + RIGHT swipe:
         * hand control back to flxScrollMain.
         */
        if (
            this.currentMainPage === 1 &&
            this.currentLoanRow === 0 &&
            rowIndex === 0 &&
            this.loanSwipeDirection === "right"
        ) {

            kony.print(
                "LOAN :: First loan row RIGHT swipe -> flxScrollMain"
            );

            this.loanSwipeDirection = "";
            this.loanTouchStartX = null;

            this.moveToMainPageFromLoan();

            return;
        }

        /*
         * Normal segment paging.
         */
        this.currentLoanRow = rowIndex;

        this.loanSwipeDirection = "";
        this.loanTouchStartX = null;

        if (this.currentMainPage === 1) {

            this.updateLoanDots(
                rowIndex + 1
            );
        }

        kony.print(
            "LOAN :: Loan row = " +
            rowIndex +
            " | Dot = " +
            (rowIndex + 1)
        );
    },

    moveToMainPageFromLoan: function () {

        if (this.currentMainPage !== 1) {
            return;
        }

        if (this.isReturningToMainPage) {
            return;
        }

        var scroll =
            this.view.flxScrollMain;

        if (!scroll) {
            return;
        }

        this.isReturningToMainPage = true;

        kony.print(
            "LOAN :: Returning flxScrollMain to original position"
        );

        /*
         * Re-enable outer scrolling.
         */
        scroll.enableScrolling = true;

        /*
         * Reset horizontal scroll position.
         */
        try {

            scroll.contentOffset = {
                x: 0,
                y: 0
            };

            kony.print(
                "LOAN :: flxScrollMain contentOffset set to x=0"
            );

        } catch (e) {

            kony.print(
                "LOAN :: contentOffset reset failed = " +
                e
            );
        }

        /*
         * Make sure page 0 is fully visible.
         */
        this.view.flxLoanDetails.isVisible = true;
        this.view.flxLoanDashboard.isVisible = false;

        this.view.flxLoanDetails.opacity = 1;
        this.view.flxLoanDashboard.opacity = 0;

        /*
         * IMPORTANT:
         * currentMainPage is still 1 here.
         */
        this.showMainPage(false);

        this.currentMainPage = 0;
        this.currentLoanRow = 0;

        this.loanSwipeDirection = "";
        this.loanTouchStartX = null;

        this.isReturningToMainPage = false;

        kony.print(
            "LOAN :: flxScrollMain returned to original position | flxLoanDetails visible"
        );
    },

    setLoanData: function () {

        this.loanData = [
            {
                loanType: "Personal",
                loanName: "Personal Loan",
                remainingBalance: "75,000.00 QAR",
                paidInstallments: 18,
                totalInstallments: 60,
                utilisedAmount: "30,000",
                totalAmount: "100,000"
            },
            {
                loanType: "Personal",
                loanName: "Personal Loan",
                remainingBalance: "42,500.00 QAR",
                paidInstallments: 12,
                totalInstallments: 48,
                utilisedAmount: "25,000",
                totalAmount: "67,500"
            },
            {
                loanType: "Vehicle",
                loanName: "Vehicle Loan",
                remainingBalance: "48,129.67 QAR",
                paidInstallments: 24,
                totalInstallments: 60,
                utilisedAmount: "32,000",
                totalAmount: "80,000"
            },
            {
                loanType: "Mortgage",
                loanName: "Mortgage Loan",
                remainingBalance: "850,089.43 QAR",
                paidInstallments: 100,
                totalInstallments: 250,
                utilisedAmount: "400,000",
                totalAmount: "1,250,000"
            }
        ];
    },

    setLoanAccountsData: function (data) {

        var sections = [];
        var personalLoans = [];
        var vehicleLoans = [];
        var mortgageLoans = [];

        for (var i = 0; i < data.length; i++) {

            var loan = data[i];

            var row = {
                lblRemainingBalance: "Remaining balance",
                lblRemainingBalAmt:
                    loan.remainingBalance,
                lblInstallment:
                    "Paid " +
                    loan.paidInstallments +
                    " of " +
                    loan.totalInstallments,
                lblUtilAmt: loan.utilisedAmount,
                lblTotalAmt: loan.totalAmount
            };

            if (loan.loanType === "Personal") {
                personalLoans.push(row);
            } else if (loan.loanType === "Vehicle") {
                vehicleLoans.push(row);
            } else if (loan.loanType === "Mortgage") {
                mortgageLoans.push(row);
            }
        }

        if (personalLoans.length > 0) {
            sections.push([
                { lblSettingHeader: "Personal Loans" },
                personalLoans
            ]);
        }

        if (vehicleLoans.length > 0) {
            sections.push([
                { lblSettingHeader: "Vehicle Loans" },
                vehicleLoans
            ]);
        }

        if (mortgageLoans.length > 0) {
            sections.push([
                { lblSettingHeader: "Mortgage Loans" },
                mortgageLoans
            ]);
        }

        this.view.segLoanAccounts.setData(sections);
    },

    setLoanDashboardData: function () {

        var dashboardData = [
            {
                loanType: "Personal",
                loanName: "Personal",
                remainingBalance: "75,000.00 QAR",
                paidInstallments: 18,
                totalInstallments: 60,
                totalAmount: "100,000"
            },
            {
                loanType: "Personal",
                loanName: "Personal",
                remainingBalance: "42,500.00 QAR",
                paidInstallments: 12,
                totalInstallments: 48,
                totalAmount: "67,500"
            },
            {
                loanType: "Vehicle",
                loanName: "Vehicle",
                remainingBalance: "48,129.67 QAR",
                paidInstallments: 24,
                totalInstallments: 60,
                totalAmount: "80,000"
            },
            {
                loanType: "Mortgage",
                loanName: "Mortgage",
                remainingBalance: "850,089.43 QAR",
                paidInstallments: 100,
                totalInstallments: 250,
                totalAmount: "1,250,000"
            }
        ];

        var rows = [];

        for (var i = 0; i < dashboardData.length; i++) {

            var loan = dashboardData[i];

            var remainingBalance =
                loan.remainingBalance || "";

            var amountMain = remainingBalance;
            var amountDecimal = "";

            var decimalIndex =
                remainingBalance.lastIndexOf(".");

            if (decimalIndex !== -1) {

                amountMain =
                    remainingBalance.substring(
                        0,
                        decimalIndex
                    );

                amountDecimal =
                    remainingBalance.substring(
                        decimalIndex
                    );
            }

            var percentage = 0;

            if (loan.totalInstallments > 0) {

                percentage =
                    Math.round(
                        (
                            loan.paidInstallments /
                            loan.totalInstallments
                        ) * 100
                    );
            }

            if (percentage > 100) {
                percentage = 100;
            }

            if (percentage < 0) {
                percentage = 0;
            }

            var loanImage = "usericon.png";

            if (loan.loanType === "Personal") {
                loanImage = "personal_loan.png";
            } else if (loan.loanType === "Vehicle") {
                loanImage = "vehicle_loan.png";
            } else if (loan.loanType === "Mortgage") {
                loanImage = "mortgage_loan.png";
            }

            rows.push({

                flxLoanDashboard: {
                    isVisible: true
                },

                flxLoanCard: {
                    isVisible: true
                },

                flxLoanQuickMenu: {
                    isVisible: true
                },

                flxRemainingToPay: {
                    isVisible: true
                },

                lblRemainingToPay: {
                    text: "Remaining to Pay",
                    isVisible: true
                },

                flxTypeOfLoan: {
                    isVisible: true
                },

                lblTypeOfLoan: {
                    text:
                        loan.loanName ||
                        loan.loanType ||
                        "",
                    isVisible: true
                },

                imgTypeOfLoan: {
                    src: loanImage,
                    isVisible: true
                },

                flxRemainingAmt: {
                    isVisible: true
                },

                lblRemainingAmount: {
                    text: amountMain,
                    isVisible: true
                },

                lblRemainingAmtDecimal: {
                    text: amountDecimal,
                    isVisible: true
                },

                flxPercentagePaid: {
                    isVisible: true
                },

                flxPaid: {
                    isVisible: true
                },

                lblPaid: {
                    text: percentage + "% repaid",
                    isVisible: true
                },

                flxBottomLoan: {
                    isVisible: true
                },

                flxProgressBack: {
                    isVisible: true
                },

                flxProgressBar: {
                    isVisible: true,
                    width: percentage + "%"
                },

                flxCompletedPayments: {
                    isVisible: true
                },

                lblPaymentCompleted: {
                    text: "Payments Completed",
                    isVisible: true
                },

                lblTotalEMI: {
                    text:
                        loan.paidInstallments +
                        " of " +
                        loan.totalInstallments,
                    isVisible: true
                },

                flxLoanAmount: {
                    isVisible: true
                },

                lblLoanAmount: {
                    text: "Loan Amount",
                    isVisible: true
                },

                lblLoanAmountVal: {
                    text:
                        "QAR " +
                        loan.totalAmount,
                    isVisible: true
                }
            });
        }

        this.view.segLoanDashBoard.setData(rows);

        this.currentLoanRow = 0;
    },

    configureTabs: function () {

        var self = this;

        this.view.multipletab.initialize({

            selectedIndex: 0,

            flxFourTabSkin:
                "sknParent72PxBgf4f3f6",

            tabs: [
                {
                    flx: "flxTab1",
                    lbl: "lblTab1",
                    text: "All",
                    enabled: true
                },
                {
                    flx: "flxTab2",
                    lbl: "lblTab2",
                    text: "Personal",
                    enabled: true
                },
                {
                    flx: "flxTab3",
                    lbl: "lblTab3",
                    text: "Vehicle",
                    enabled: true
                },
                {
                    flx: "flxTab4",
                    lbl: "lblTab4",
                    text: "Mortgage",
                    enabled: true
                }
            ],

            onTabSelected: function (tab, index) {
                self.onTabSelected(tab, index);
            }
        });
    },

    onTabSelected: function (tab, index) {

        kony.print(
            "LOAN :: TAB " +
            tab.flx +
            " INDEX " +
            index
        );

        if (index === 0) {

            this.setLoanAccountsData(
                this.loanData
            );

        } else if (index === 1) {

            this.setLoanAccountsData(
                this.loanData.filter(function (loan) {
                    return loan.loanType === "Personal";
                })
            );

        } else if (index === 2) {

            this.setLoanAccountsData(
                this.loanData.filter(function (loan) {
                    return loan.loanType === "Vehicle";
                })
            );

        } else if (index === 3) {

            this.setLoanAccountsData(
                this.loanData.filter(function (loan) {
                    return loan.loanType === "Mortgage";
                })
            );
        }
    },

    configureTransactionTabs: function () {

        var self = this;

        if (!this.view.twotab) {
            return;
        }

        this.view.twotab.initialize({

            selectedIndex: 0,

            flxFourTabSkin:
                "sknParent72PxBgf4f3f6",

            tabs: [
                {
                    flx: "flxTab1",
                    lbl: "lblTab1",
                    text: "Activity",
                    enabled: true
                },
                {
                    flx: "flxTab2",
                    lbl: "lblTab2",
                    text: "Details",
                    enabled: true
                }
            ],

            onTabSelected: function (tab, index) {

                self.onTransactionTabSelected(
                    tab,
                    index
                );
            }
        });
    },

    onTransactionTabSelected: function (
        tab,
        index
    ) {

        kony.print(
            "LOAN :: TRANSACTION TAB " +
            tab.flx +
            " INDEX " +
            index
        );

        if (this.view.transactionList) {

            this.view.transactionList.isVisible =
                index === 0;
        }

        this.view.forceLayout();
    },

    createLoanIndicators: function () {

        if (!this.view.flxDots) {

            kony.print(
                "LOAN :: flxDots not found"
            );

            return;
        }

        this.view.flxDots.removeAll();

        this.indicators = [];

        var data =
            this.view.segLoanDashBoard.data || [];

        var pageCount =
            data.length + 1;

        kony.print(
            "LOAN :: Creating " +
            pageCount +
            " indicators"
        );

        for (var i = 0; i < pageCount; i++) {

            var dot =
                new kony.ui.FlexContainer(
                    {
                        id:
                            "flxLoanDot" + i,

                        width:
                            i === 0 ?
                                "20dp" :
                                "10dp",

                        height: "10dp",

                        left:
                            i === 0 ?
                                "140dp" :
                                "4dp",

                        centerX:
                            i === 0 ?
                                "45%" :
                                "",

                        centerY: "50%",

                        skin:
                            i === 0 ?
                                "sknDotSelected" :
                                "sknDotUnselected"
                    },
                    {},
                    {}
                );

            this.view.flxDots.add(dot);

            this.indicators.push(dot);
        }

        this.view.flxDots.forceLayout();

        this.updateLoanDots(0);
    },

    updateLoanDots: function (dotIndex) {

        if (!this.view.flxDots) {
            return;
        }

        if (
            !this.indicators ||
            !this.indicators.length
        ) {
            return;
        }

        if (
            dotIndex < 0 ||
            dotIndex >= this.indicators.length
        ) {

            kony.print(
                "LOAN :: Invalid dot index = " +
                dotIndex
            );

            return;
        }

        for (
            var i = 0;
            i < this.indicators.length;
            i++
        ) {

            var dot =
                this.indicators[i];

            var selected =
                i === dotIndex;

            dot.skin =
                selected ?
                    "sknDotSelected" :
                    "sknDotUnselected";

            dot.animate(
                kony.ui.createAnimation({
                    100: {
                        width:
                            selected ?
                                "20dp" :
                                "10dp",
                        opacity:
                            selected ?
                                1 :
                                0.75
                    }
                }),
                {
                    duration: 0.20,
                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                }
            );
        }

        this.view.flxDots.forceLayout();

        kony.print(
            "LOAN :: Active dot = " +
            dotIndex
        );
    }
});