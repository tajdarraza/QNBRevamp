define({
  loanData: [],
  transactionData: [],
  currentLoanRow: 0,
  currentPage: 1,
  indicatorsPage2: [],
  screenHeight: "",
  availableHeight:"",
  pageSwipeConfigured: false,
  isAnimatingPage: false,

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
      action2Image: "closeicon.png",
    });

    this.data = navData;
  },
init: function () {
  var deviceInfo = kony.os.deviceInfo();

  this.screenHeight = deviceInfo.screenHeight;

  var headerHeight = this.screenHeight * 0.10;
  var availableHeight = this.screenHeight - headerHeight;
  this.availableHeight = availableHeight;

  kony.print("LOAN :: Screen Height = " + this.screenHeight + "dp");
  kony.print("LOAN :: Header Height = " + headerHeight + "dp");
  kony.print("LOAN :: Available Height = " + availableHeight + "dp");

  this.configurePageSwipe();
},

  preShow: function () {
    this.view.circularchart.isVisible = false;
    this.currentLoanRow = 0;
    this.currentPage = 1;
    this.isAnimatingPage = false;
    var devH = 250;
    if(isiOS()){
        devH = 366;
    }
this.view.flxSwipeUse.height = (this.availableHeight-devH)+"dp"

    // Completely disable scrolling on flxScrollMain to prevent touch interception
    if (this.view.flxScrollMain) {
      this.view.flxScrollMain.enableScrolling = false;
    }

    this.view.flxPage1.left = "0%";
    this.view.flxPage2.left = "100%";

    this.configurePageSwipe();

    if (this.view.segLoanAccounts) {
      this.view.segLoanAccounts.widgetDataMap = {
        lblRemainingBalance: "lblRemainingBalance",
        lblRemainingBalAmt: "lblRemainingBalAmt",
        lblInstallment: "lblInstallment",
        lblUtilAmt: "lblUtilAmt",
        lblTotalAmt: "lblTotalAmt",
        lblSettingHeader: "lblSettingHeader",
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
        lblLoanAmountVal: "lblLoanAmountVal",
        flxClick1: "flxClick1",
        flxClick2: "flxClick2",
        flxClick3: "flxClick3",
      };

      this.view.segLoanDashBoard.onSwipe = this.onLoanDashboardSwipe.bind(this);
    }

    this.setLoanData();
    this.setLoanAccountsData(this.loanData);
    this.setLoanDashboardData();

    this.configureCircularChart();
    this.configureTabs();
    this.configureTransactionTabs();

    this.transactionData = [
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "Today, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Aug 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Jul 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Jun 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 May 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Apr 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Mar 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Feb 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Jan 2026, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Dec 2025, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Nov 2025, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Monthly Loan Payment",
        lblTransactTime: "13 Oct 2025, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "QAR",
      },
    ];

    if (this.view.transactionList) {
      this.view.transactionList.configure({
        data: this.transactionData,
        pageSize: 5,
        onSeeAll: function () {},
      });
    }

    this.createLoanIndicators();
    this.updateLoanDots(1);

    this.view.forceLayout();
  },

  postShow: function () {
    this.view.circularchart.isVisible = true;

    if (this.view.flxScrollMain) {
      this.view.flxScrollMain.enableScrolling = false;
    }
  },

  configurePageSwipe: function () {
    var self = this;

    if (this.pageSwipeConfigured) {
      kony.print("LOAN :: Page swipe already configured");
      return;
    }

    if (!this.view.flxPage1) {
      kony.print("LOAN :: flxPage1 widget missing from view tree.");
      return;
    }

    try {
      var swipeConfig = {
        fingers: 1,
        swipedistance: 30,
        swipevelocity: 60,
      };

      // 1. Page 1 Gesture: Swipe Left -> Go to Page 2
      this.view.flxPage1.addGestureRecognizer(
        constants.GESTURE_TYPE_SWIPE,
        swipeConfig,
        function (widgetRef, gestureInfo) {
          if (!gestureInfo || self.isAnimatingPage) return;

          if (gestureInfo.swipeDirection === 1) { // 1 = SWIPE_LEFT
            self.onPage1SwipeLeft();
          }
        }
      );

      // 2. Attach Gesture directly to flxSwipeUse container
      if (this.view.flxSwipeUse) {
        this.view.flxSwipeUse.addGestureRecognizer(
          constants.GESTURE_TYPE_SWIPE,
          swipeConfig,
          function (widgetRef, gestureInfo) {
            if (!gestureInfo || self.isAnimatingPage) return;

            if (gestureInfo.swipeDirection === 2) { // 2 = SWIPE_RIGHT
              self.onPage2SwipeRight();
            }
          }
        );
      }

      // 3. Fallback gesture on segLoanDashBoard for row 0 right-swipe
      if (this.view.segLoanDashBoard) {
        this.view.segLoanDashBoard.addGestureRecognizer(
          constants.GESTURE_TYPE_SWIPE,
          swipeConfig,
          function (widgetRef, gestureInfo) {
            if (!gestureInfo || self.isAnimatingPage) return;

            if (gestureInfo.swipeDirection === 2 && self.currentLoanRow === 0) {
              kony.print("LOAN :: Fallback gesture on Segment triggered Page 2 -> Page 1");
              self.onPage2SwipeRight();
            }
          }
        );
      }

      this.pageSwipeConfigured = true;
      kony.print("LOAN :: Gestures attached cleanly");
    } catch (err) {
      kony.print("LOAN :: Error binding gesture engines: " + JSON.stringify(err));
    }
  },

  onPage1SwipeLeft: function () {
    if (this.isAnimatingPage) {
      kony.print("LOAN :: Swipe ignored - page animation running");
      return;
    }

    if (!this.view.flxPage1 || !this.view.flxPage2) {
      return;
    }

    this.isAnimatingPage = true;
    this.currentPage = 2;
    var self = this;

    // Reset Page 2 tabs: select Activity tab (Index 0) and show transactionList
    if (this.view.twotab && typeof this.view.twotab.setSelectedTab === "function") {
      this.view.twotab.setSelectedTab(0);
    } else if (this.view.twotab) {
      this.configureTransactionTabs();
    }
    if (this.view.transactionList) {
      this.view.transactionList.isVisible = true;
    }

    kony.print("LOAN :: Moving Layout View from Page 1 -> Page 2");

    var page1Animation = kony.ui.createAnimation({
      100: {
        left: "-100%",
        stepConfig: { timingFunction: kony.anim.EASE_IN_OUT },
      },
    });

    var page2Animation = kony.ui.createAnimation({
      100: {
        left: "0%",
        stepConfig: { timingFunction: kony.anim.EASE_IN_OUT },
      },
    });

    this.view.flxPage1.animate(
      page1Animation,
      { duration: 0.25, fillMode: kony.anim.FILL_MODE_FORWARDS },
      {
        animationEnd: function () {
          self.view.flxPage1.left = "-100%";
          self.view.flxPage2.left = "0%";

          if (self.view.flxScrollMain) {
            self.view.flxScrollMain.enableScrolling = false;
          }

          self.updateLoanDots(self.currentLoanRow + 1);
          self.isAnimatingPage = false;
          kony.print("LOAN :: Page 1 -> Page 2 completed");
        },
      }
    );

    this.view.flxPage2.animate(page2Animation, {
      duration: 0.25,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
    });
  },

  onPage2SwipeRight: function () {
    if (this.isAnimatingPage) {
      kony.print("LOAN :: Swipe ignored - page animation running");
      return;
    }

    if (!this.view.flxPage1 || !this.view.flxPage2) {
      return;
    }

    this.isAnimatingPage = true;
    this.currentPage = 1;
    var self = this;

    // Reset Page 1 tabs: select "All" tab (Index 0) and display all accounts data
    if (this.view.multipletab && typeof this.view.multipletab.setSelectedTab === "function") {
      this.view.multipletab.setSelectedTab(0);
    } else if (this.view.multipletab) {
      this.configureTabs();
    }
    this.setLoanAccountsData(this.loanData);

    kony.print("LOAN :: Moving Layout View from Page 2 -> Page 1");

    var page1Animation = kony.ui.createAnimation({
      100: {
        left: "0%",
        stepConfig: { timingFunction: kony.anim.EASE_IN_OUT },
      },
    });

    var page2Animation = kony.ui.createAnimation({
      100: {
        left: "100%",
        stepConfig: { timingFunction: kony.anim.EASE_IN_OUT },
      },
    });

    this.view.flxPage1.animate(
      page1Animation,
      { duration: 0.25, fillMode: kony.anim.FILL_MODE_FORWARDS },
      {
        animationEnd: function () {
          self.view.flxPage1.left = "0%";
          self.view.flxPage2.left = "100%";

          self.isAnimatingPage = false;
          kony.print("LOAN :: Page 2 -> Page 1 completed");
        },
      }
    );

    this.view.flxPage2.animate(page2Animation, {
      duration: 0.25,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
    });
  },

  createLoanIndicators: function () {
    if (!this.view.segLoanDashBoard) {
      return;
    }

    if (this.view.flxDotsPage1) {
      this.view.flxDotsPage1.removeAll();
      this.view.flxDotsPage1.layoutType = kony.flex.FREE_FORM;
    }
    if (this.view.flxDots) {
      this.view.flxDots.removeAll();
      this.view.flxDots.layoutType = kony.flex.FREE_FORM;
    }

    this.indicatorsPage2 = [];

    var data = this.view.segLoanDashBoard.data || [];
    var totalDots = data.length + 1;

    if (totalDots <= 0) {
      return;
    }

    var normalWidthNum = 10;
    var selectedWidthNum = 20;
    var gapNum = 4;

    var totalContentWidth =
      selectedWidthNum +
      (totalDots - 1) * normalWidthNum +
      (totalDots - 1) * gapNum;

    var createCenteredInnerWrapper = function (id) {
      return new kony.ui.FlexContainer(
        {
          id: id,
          width: totalContentWidth + "dp",
          height: "20dp",
          centerX: "50%",
          centerY: "50%",
          layoutType: kony.flex.FLOW_HORIZONTAL,
          clipBounds: false,
          zIndex: 10,
        },
        {},
        {}
      );
    };

    if (this.view.flxDotsPage1) {
      var innerFlowP1 = createCenteredInnerWrapper("flxPage1DotsInnerFlow");

      for (var i = 0; i < totalDots; i++) {
        var isSelectedP1 = i === 0;

        var dotP1 = new kony.ui.FlexContainer(
          {
            id: "flxLoanDotPage1_" + i,
            centerY: "50%",
            width: (isSelectedP1 ? selectedWidthNum : normalWidthNum) + "dp",
            height: "10dp",
            left: i === 0 ? "0dp" : gapNum + "dp",
            skin: isSelectedP1 ? "sknDotSelected" : "sknDotUnselected",
            clipBounds: false,
          },
          {},
          {}
        );

        innerFlowP1.add(dotP1);
      }

      this.view.flxDotsPage1.add(innerFlowP1);
      this.view.flxDotsPage1.forceLayout();
    }

    if (this.view.flxDots) {
      var innerFlowP2 = createCenteredInnerWrapper("flxPage2DotsInnerFlow");

      for (var j = 0; j < totalDots; j++) {
        var isSelectedP2 = j === 1;

        var dotP2 = new kony.ui.FlexContainer(
          {
            id: "flxLoanDotPage2_" + j,
            centerY: "50%",
            width: (isSelectedP2 ? selectedWidthNum : normalWidthNum) + "dp",
            height: "10dp",
            left: j === 0 ? "0dp" : gapNum + "dp",
            skin: isSelectedP2 ? "sknDotSelected" : "sknDotUnselected",
            clipBounds: false,
          },
          {},
          {}
        );

        innerFlowP2.add(dotP2);
        this.indicatorsPage2.push(dotP2);
      }

      this.view.flxDots.add(innerFlowP2);
      this.view.flxDots.forceLayout();
    }

    kony.print(
      "LOAN :: Indicators built cleanly with total width: " +
        totalContentWidth +
        "dp"
    );
  },

  updateLoanDots: function (targetIndex) {
    if (
      !this.indicatorsPage2 ||
      !this.indicatorsPage2.length ||
      targetIndex < 1 ||
      targetIndex >= this.indicatorsPage2.length
    ) {
      return;
    }

    for (var j = 0; j < this.indicatorsPage2.length; j++) {
      if (j === 0) {
        continue;
      }

      var dotWidget = this.indicatorsPage2[j];
      var isSelected = j === targetIndex;

      if (dotWidget) {
        dotWidget.skin = isSelected ? "sknDotSelected" : "sknDotUnselected";

        dotWidget.animate(
          kony.ui.createAnimation({
            100: {
              width: isSelected ? "20dp" : "10dp",
            },
          }),
          {
            duration: 0.25,
            fillMode: kony.anim.FILL_MODE_FORWARDS,
          }
        );
      }
    }

    if (this.indicatorsPage2[0] && this.indicatorsPage2[0].parent) {
      this.indicatorsPage2[0].parent.forceLayout();
    }

    this.activeDotIndex = targetIndex;
  },

  onLoanSwipeMove: function (widgetHandle, context) {
    if (!context) {
      kony.print("LOAN :: widgetSwipeMove callback without context");
      return;
    }

    var rowIndex = Number(context.rowIndex);

    if (isNaN(rowIndex)) {
      return;
    }

    if (rowIndex < 0 || rowIndex >= this.loanData.length) {
      return;
    }

    this.currentLoanRow = rowIndex;
    this.updateLoanDots(rowIndex + 1);
  },

  configureCircularChart: function () {
    if (!this.view.circularchart) {
      return;
    }

    var totalLoan = 0;
    var totalPaid = 0;

    for (var i = 0; i < this.loanData.length; i++) {
      var loan = this.loanData[i];

      var totalAmount =
        parseFloat(String(loan.totalAmount).replace(/,/g, "")) || 0;
      var paidInstallments = parseFloat(loan.paidInstallments) || 0;
      var totalInstallments = parseFloat(loan.totalInstallments) || 0;

      totalLoan += totalAmount;

      if (totalInstallments > 0) {
        totalPaid += totalAmount * (paidInstallments / totalInstallments);
      }
    }

    this.view.circularchart.configure(
      totalLoan,
      totalPaid,
      this.loanData.length
    );
  },

  onMenuClick1: function () {
    var selectedLoan = this.loanData[this.currentLoanRow];

    if (!selectedLoan) {
      return;
    }

    if (selectedLoan.postponeStatus === "allowed") {
      new kony.mvc.Navigation("frmLoanPostpone").navigate({
        loan: selectedLoan,
        loanIndex: this.currentLoanRow,
      });
      return;
    }

    if (selectedLoan.postponeStatus === "not_allowed") {
      this.showPostponeNotification(
        "warning",
        "Unable to postpone",
        "You've hit the limit (2 months per year) and can no longer postpone."
      );
      return;
    }

    if (selectedLoan.postponeStatus === "not_eligible") {
      this.showPostponeNotification(
        "info",
        "Attention",
        "You are not eligible for a loan postponement of this loan."
      );
    }
  },

  showPostponeNotification: function (type, title, description) {
    if (!this.view.notification) {
      alert(description);
      return;
    }

    this.view.notification.show({
      type: type,
      desc1: title,
      desc2: description,
      buttonText: "Understood",
      onButtonClick: function () {
        if (this.view.notification) {
          this.view.notification.hide();
        }
      }.bind(this),
    });
  },

  onMenuClick2: function () {
    kony.print("LOAN :: flxClick2 tapped | row = " + this.currentLoanRow);
    alert("Pay to unlock more features");
  },

  onMenuClick3: function () {
    kony.print("LOAN :: flxClick3 tapped | row = " + this.currentLoanRow);
    alert("Pay to unlock more features");
  },

  onLoanDashboardSwipe: function (
    widget,
    sectionIndex,
    rowIndex,
    selectionState,
    dir
  ) {
    kony.print(
      "LOAN :: onSwipe | section=" +
        sectionIndex +
        " | row=" +
        rowIndex +
        " | state=" +
        selectionState+" dir "+dir
    );

    var rIndex = Number(rowIndex);
    if (isNaN(rIndex)) {
      return;
    }

    var stateNum = Number(selectionState);

    /*
     * ROW 0 SWIPE HANDLER:
     * Swipe right (or left depending on state flags) at row 0 triggers transition back to Page 1
     */
    if ((rIndex === 0 || this.currentLoanRow === 0) && (stateNum === 2 || stateNum === 1) && !this.isAnimatingPage) {
      kony.print("LOAN :: Row 0 Swipe -> Moving to Page 1");
      this.onPage2SwipeRight();
      return;
    }

    /*
     * Normal row tracking
     */
    if (rIndex >= 0 && rIndex < this.loanData.length) {
      this.currentLoanRow = rIndex;
      this.updateLoanDots(rIndex + 1);
    }
  },

  setLoanData: function () {
    var transaction = {
      imgTranLogo: "cash_outflow.png",
      lblTransaction: "Monthly Loan Payment",
      lblTransactTime: "13 May 2026, 10:32 AM",
      imgTransaction: "trailingcontent.png",
      lblTransactAmount: "-2,500.00",
      lblTransactCurr: "QAR",
    };

    this.loanData = [
      {
        loanType: "Personal",
        loanName: "Personal",
        imgTypeOfLoan: "personal_loan.png",
        remainingBalance: "75,000.00 QAR",
        paidInstallments: 18,
        totalInstallments: 60,
        utilisedAmount: "30,000.00 QAR",
        totalAmount: "100,000",
        dueDate: "on Mar. 13th",
        postponeStatus: "allowed",
        transactions: [transaction],
      },
      {
        loanType: "Personal",
        loanName: "Personal",
        imgTypeOfLoan: "personal_loan.png",
        remainingBalance: "42,500.00 QAR",
        paidInstallments: 12,
        totalInstallments: 48,
        utilisedAmount: "25,000.00 QAR",
        totalAmount: "67,500",
        dueDate: "on Apr. 04th",
        postponeStatus: "not_allowed",
        transactions: [transaction],
      },
      {
        loanType: "Vehicle",
        loanName: "Vehicle",
        imgTypeOfLoan: "vehicle_loan.png",
        remainingBalance: "48,129.67 QAR",
        paidInstallments: 24,
        totalInstallments: 60,
        utilisedAmount: "32,000.00 QAR",
        totalAmount: "80,000",
        dueDate: "on Apr. 11th",
        postponeStatus: "not_eligible",
        transactions: [transaction],
      },
      {
        loanType: "Mortgage",
        loanName: "Mortgage",
        imgTypeOfLoan: "mortgage_loan.png",
        remainingBalance: "850,089.43 QAR",
        paidInstallments: 100,
        totalInstallments: 250,
        utilisedAmount: "400,000.00 QAR",
        totalAmount: "1,250,000",
        dueDate: "on May 17th",
        postponeStatus: "allowed",
        transactions: [transaction],
      },
      {
        loanType: "Personal",
        loanName: "Personal",
        imgTypeOfLoan: "personal_loan.png",
        remainingBalance: "28,750.25 QAR",
        paidInstallments: 8,
        totalInstallments: 36,
        utilisedAmount: "18,000.00 QAR",
        totalAmount: "50,000",
        dueDate: "on Jun. 21st",
        postponeStatus: "not_allowed",
        transactions: [transaction],
      },
      {
        loanType: "Vehicle",
        loanName: "Vehicle",
        imgTypeOfLoan: "vehicle_loan.png",
        remainingBalance: "61,420.80 QAR",
        paidInstallments: 30,
        totalInstallments: 72,
        utilisedAmount: "45,000.00 QAR",
        totalAmount: "95,000",
        dueDate: "on Jul. 08th",
        postponeStatus: "allowed",
        transactions: [transaction],
      },
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
        lblRemainingBalAmt: loan.remainingBalance,
        lblInstallment:
          "Paid " + loan.paidInstallments + " of " + loan.totalInstallments,
        lblUtilAmt: loan.utilisedAmount,
        lblTotalAmt: loan.dueDate,
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
        personalLoans,
      ]);
    }

    if (vehicleLoans.length > 0) {
      sections.push([
        { lblSettingHeader: "Vehicle Loans" },
        vehicleLoans,
      ]);
    }

    if (mortgageLoans.length > 0) {
      sections.push([
        { lblSettingHeader: "Mortgage Loans" },
        mortgageLoans,
      ]);
    }

    if (this.view.segLoanAccounts) {
      this.view.segLoanAccounts.setData(sections);
    }
  },

  setLoanDashboardData: function () {
    var self = this;
    var rows = [];

    for (var i = 0; i < this.loanData.length; i++) {
      var loan = this.loanData[i];
      var remainingBalance = loan.remainingBalance || "";
      var amountMain = remainingBalance;
      var amountDecimal = "";

      var decimalIndex = remainingBalance.lastIndexOf(".");

      if (decimalIndex !== -1) {
        amountMain = remainingBalance.substring(0, decimalIndex);
        amountDecimal = remainingBalance.substring(decimalIndex);
      }

      var percentage = 0;
      if (loan.totalInstallments > 0) {
        percentage = Math.round(
          (loan.paidInstallments / loan.totalInstallments) * 100
        );
      }

      if (percentage > 100) percentage = 100;
      if (percentage < 0) percentage = 0;

      rows.push({
        flxLoanDashboard: { isVisible: true },
        flxLoanCard: { isVisible: true },
        flxLoanQuickMenu: { isVisible: true },
        flxRemainingToPay: { isVisible: true },
        lblRemainingToPay: { text: "Remaining to Pay" },
        flxTypeOfLoan: { isVisible: true },
        lblTypeOfLoan: { text: loan.loanName || loan.loanType || "" },
        imgTypeOfLoan: { src: loan.imgTypeOfLoan || "usericon.png" },
        flxRemainingAmt: { isVisible: true },
        lblRemainingAmount: { text: amountMain },
        lblRemainingAmtDecimal: { text: amountDecimal },
        flxPercentagePaid: { isVisible: true },
        flxPaid: { isVisible: true },
        lblPaid: { text: percentage + "% repaid" },
        flxBottomLoan: { isVisible: true },
        flxProgressBack: { isVisible: true },
        flxProgressBar: { isVisible: true, width: percentage + "%" },
        flxCompletedPayments: { isVisible: true },
        lblPaymentCompleted: { text: "Payments Completed" },
        lblTotalEMI: { text: loan.paidInstallments + " of " + loan.totalInstallments },
        flxLoanAmount: { isVisible: true },
        lblLoanAmount: { text: "Loan Amount" },
        lblLoanAmountVal: { text: "QAR " + loan.totalAmount },
        flxClick1: {
          isVisible: true,
          onTouchEnd: function () {
            self.onMenuClick1();
          },
        },
        flxClick2: {
          isVisible: true,
          onTouchEnd: function () {
            self.onMenuClick2();
          },
        },
        flxClick3: {
          isVisible: true,
          onTouchEnd: function () {
            self.onMenuClick3();
          },
        },
      });
    }

    this.view.segLoanDashBoard.setData(rows);
    this.currentLoanRow = 0;
    kony.print("LOAN :: Dashboard rows = " + rows.length);
  },

  configureTabs: function () {
    var self = this;

    if (!this.view.multipletab) {
      return;
    }

    this.view.multipletab.initialize({
      selectedIndex: 0,
      flxFourTabSkin: "sknParent72PxBgf4f3f6",
      tabs: [
        { flx: "flxTab1", lbl: "lblTab1", text: "All", enabled: true },
        { flx: "flxTab2", lbl: "lblTab2", text: "Personal", enabled: true },
        { flx: "flxTab3", lbl: "lblTab3", text: "Vehicle", enabled: true },
        { flx: "flxTab4", lbl: "lblTab4", text: "Mortgage", enabled: true },
      ],
      onTabSelected: function (tab, index) {
        self.onTabSelected(tab, index);
      },
    });
  },

  onTabSelected: function (tab, index) {
    if (index === 0) {
      this.setLoanAccountsData(this.loanData);
      return;
    }

    var type = "";
    if (index === 1) {
      type = "Personal";
    } else if (index === 2) {
      type = "Vehicle";
    } else if (index === 3) {
      type = "Mortgage";
    }

    this.setLoanAccountsData(
      this.loanData.filter(function (loan) {
        return loan.loanType === type;
      })
    );
  },

  configureTransactionTabs: function () {
    var self = this;

    if (!this.view.twotab) {
      return;
    }

    this.view.twotab.initialize({
      selectedIndex: 0,
      flxFourTabSkin: "sknParent72PxBgf4f3f6",
      tabs: [
        { flx: "flxTab1", lbl: "lblTab1", text: "Activity", enabled: true },
        { flx: "flxTab2", lbl: "lblTab2", text: "Details", enabled: true },
      ],
      onTabSelected: function (tab, index) {
        self.onTransactionTabSelected(tab, index);
      },
    });
  },

  onTransactionTabSelected: function (tab, index) {
    kony.print("LOAN :: TRANSACTION TAB " + tab.flx + " INDEX " + index);

    if (this.view.transactionList) {
      this.view.transactionList.isVisible = index === 0;
    }

    this.view.forceLayout();
  },
});