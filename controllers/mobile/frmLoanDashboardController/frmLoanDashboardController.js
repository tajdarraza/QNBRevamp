define({
  loanData: [],
  transactionData: [],
  currentLoanRow: 0,
  previousLoanRow: -1,
  indicators: [],
  screenHeight: "",
  visibilityAnimationId: 0,

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
  },

  preShow: function () {
    this.view.circularchart.isVisible = false;

    this.view.flxLoanData.height = "75%";

    this.currentLoanRow = 0;
    this.previousLoanRow = -1;
    this.visibilityAnimationId = 0;

    if (this.view.flxLoanInfo) {
      this.view.flxLoanInfo.isVisible = true;
      this.view.flxLoanInfo.opacity = 1;
    }

    if (this.view.flxLoanTransactions) {
      this.view.flxLoanTransactions.isVisible = false;
      this.view.flxLoanTransactions.opacity = 0;
    }

    if (this.view.flxDueDate) {
      this.view.flxDueDate.isVisible = false;
      this.view.flxDueDate.opacity = 0;
    }

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
        flxLoanVisual: "flxLoanVisual",
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

    this.updateLoanDots(0);

    this.updateLoanRowVisibility(0, false);

    this.view.forceLayout();
  },

  postShow: function () {
    this.view.circularchart.isVisible = true;
  },

  animateLoanSection: function (widget, shouldShow, animationId) {
    if (!widget) {
      return;
    }

    var self = this;

    if (shouldShow) {
      widget.isVisible = true;
      widget.opacity = 0;

      widget.animate(
        kony.ui.createAnimation({
          100: {
            opacity: 1,
          },
        }),
        {
          duration: 0.28,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },
        {
          animationEnd: function () {
            if (animationId !== self.visibilityAnimationId) {
              return;
            }

            widget.opacity = 1;
            widget.isVisible = true;

            self.view.forceLayout();
          },
        },
      );
    } else {
      widget.animate(
        kony.ui.createAnimation({
          100: {
            opacity: 0,
          },
        }),
        {
          duration: 0.22,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },
        {
          animationEnd: function () {
            if (animationId !== self.visibilityAnimationId) {
              return;
            }

            widget.opacity = 0;
            widget.isVisible = false;

            self.view.forceLayout();
          },
        },
      );
    }
  },

  configureCircularChart: function () {
    if (!this.view.circularchart) {
      kony.print("LOAN :: circularchart component not found");
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

    kony.print("LOAN :: Circular chart totalLoan = " + totalLoan);

    kony.print("LOAN :: Circular chart totalPaid = " + totalPaid);

    this.view.circularchart.configure(
      totalLoan,
      totalPaid,
      this.loanData.length,
    );
  },

  onMenuClick1: function () {
    var selectedLoan = this.loanData[this.currentLoanRow];

    if (!selectedLoan) {
      kony.print("LOAN :: No selected loan found for postpone");
      return;
    }

    kony.print("LOAN :: flxClick1 tapped | row = " + this.currentLoanRow);

    kony.print("LOAN :: Selected loan = " + JSON.stringify(selectedLoan));

    kony.print("LOAN :: Postpone status = " + selectedLoan.postponeStatus);

    if (selectedLoan.postponeStatus === "allowed") {
      kony.print("LOAN :: Postpone allowed - navigating");

      new kony.mvc.Navigation("frmLoanPostpone").navigate({
        loan: selectedLoan,
        loanIndex: this.currentLoanRow,
      });

      return;
    }

    if (selectedLoan.postponeStatus === "not_allowed") {
      kony.print("LOAN :: Postpone not allowed - showing warning");

      this.showPostponeNotification(
        "warning",
        "Unable to postpone",
        "You've hit the limit (2 months per year) and can no longer postpone.",
      );

      return;
    }

    if (selectedLoan.postponeStatus === "not_eligible") {
      kony.print("LOAN :: Postpone not eligible - showing info");

      this.showPostponeNotification(
        "info",
        "Attention",
        "You are not eligible for a loan postponement of this loan.",
      );

      return;
    }

    kony.print(
      "LOAN :: Unknown postpone status = " + selectedLoan.postponeStatus,
    );
  },

  showPostponeNotification: function (type, title, description) {
    if (!this.view.notification) {
      kony.print("LOAN :: notification component not found");

      alert(description);

      return;
    }

    kony.print(
      "LOAN :: Showing notification | type = " + type + " | title = " + title,
    );

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

  updateLoanRowVisibility: function (rowIndex, animateVisibility) {
    var isFirstRow = rowIndex === 0;

    if (typeof animateVisibility === "undefined") {
      animateVisibility = true;
    }

    var isInitialSetup = this.previousLoanRow === -1;

    var wasFirstRow = this.previousLoanRow === 0;

    var layoutStateChanged = isInitialSetup || isFirstRow !== wasFirstRow;

    //this.view.circularchart.isVisible = isFirstRow;

    if (!layoutStateChanged) {
      kony.print(
        "LOAN :: No layout transition | previousRow = " +
          this.previousLoanRow +
          " | currentRow = " +
          rowIndex,
      );

      this.previousLoanRow = rowIndex;

      return;
    }

    this.visibilityAnimationId++;

    var animationId = this.visibilityAnimationId;

    var devHeight = this.screenHeight;

    kony.print("LOAN :: devHeight = " + devHeight);

    var isAndroid = kony.os.deviceInfo().name;

    var page1Size = "";
    var page2Size = "";

    if (isAndroid === "android") {
      page1Size = 228;
      page2Size = 474;
    } else {
      page1Size = 362;
      page2Size = 618;
    }

    if (!isFirstRow) {
      this.view.flxLoanDetails.height = "448dp";

      this.view.flxLoanTransactions.height = devHeight - page2Size;

      this.view.flxTransList.height = this.view.flxLoanTransactions.height - 64;

      kony.print("LOAN :: Transition 0 -> non-zero");
    } else {
      this.view.flxLoanDetails.height = "220dp";

      this.view.flxLoanInfo.height = devHeight - page1Size;

      kony.print("LOAN :: Transition non-zero -> 0");
    }

    if (this.view.flxLoanInfo) {
      if (animateVisibility) {
        this.animateLoanSection(this.view.flxLoanInfo, isFirstRow, animationId);
      } else {
        this.view.flxLoanInfo.isVisible = isFirstRow;
        this.view.flxLoanInfo.opacity = isFirstRow ? 1 : 0;
      }
    }

    if (this.view.flxLoanTransactions) {
      if (animateVisibility) {
        this.animateLoanSection(
          this.view.flxLoanTransactions,
          !isFirstRow,
          animationId,
        );
      } else {
        this.view.flxLoanTransactions.isVisible = !isFirstRow;
        this.view.flxLoanTransactions.opacity = !isFirstRow ? 1 : 0;
      }
    }

    if (this.view.flxDueDate) {
      this.view.flxDueDate.isVisible = !isFirstRow;
      this.view.flxDueDate.opacity = !isFirstRow ? 1 : 0;
    }

    this.view.forceLayout();

    kony.print(
      "LOAN :: Row visibility updated | previousRow = " +
        this.previousLoanRow +
        " | -- currentRow = " +
        rowIndex +
        " | -- flxLoanInfo = " +
        isFirstRow +
        " | -- flxLoanTransactions = " +
        !isFirstRow +
        " | -- flxDueDate = " +
        !isFirstRow +
        " |-- animated = " +
        animateVisibility,
    );

    this.previousLoanRow = rowIndex;
  },

  onLoanDashboardSwipe: function (
    widget,
    sectionIndex,
    rowIndex,
    selectionState,
  ) {
    kony.print(
      "LOAN :: onSwipe sectionIndex = " +
        sectionIndex +
        " | rowIndex = " +
        rowIndex,
    );

    if (typeof rowIndex !== "number") {
      kony.print("LOAN :: Invalid rowIndex = " + rowIndex);

      return;
    }

    this.currentLoanRow = rowIndex;

    this.updateLoanRowVisibility(rowIndex, true);

    this.updateLoanDots(rowIndex);

    kony.print("LOAN :: Current loan row = " + this.currentLoanRow);

    kony.print(
      "LOAN :: Current loan image = " +
        (this.loanData[rowIndex] && this.loanData[rowIndex].imgTypeOfLoan
          ? this.loanData[rowIndex].imgTypeOfLoan
          : "EMPTY"),
    );

    kony.print(
      "LOAN :: Current postpone status = " +
        (this.loanData[rowIndex]
          ? this.loanData[rowIndex].postponeStatus
          : "EMPTY"),
    );
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

    kony.print("LOAN :: Total loans = " + this.loanData.length);
    kony.print("LOAN :: loanData = " + JSON.stringify(this.loanData));
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
        {
          lblSettingHeader: "Personal Loans",
        },
        personalLoans,
      ]);
    }

    if (vehicleLoans.length > 0) {
      sections.push([
        {
          lblSettingHeader: "Vehicle Loans",
        },
        vehicleLoans,
      ]);
    }

    if (mortgageLoans.length > 0) {
      sections.push([
        {
          lblSettingHeader: "Mortgage Loans",
        },
        mortgageLoans,
      ]);
    }

    this.view.segLoanAccounts.setData(sections);
  },

  setLoanDashboardData: function () {
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
          (loan.paidInstallments / loan.totalInstallments) * 100,
        );
      }

      if (percentage > 100) {
        percentage = 100;
      }

      if (percentage < 0) {
        percentage = 0;
      }

      rows.push({
        flxLoanVisual: {
          isVisible: i === 0,
        },

        flxLoanCard: {
          isVisible: i !== 0,
        },

        flxLoanQuickMenu: {
          isVisible: i !== 0,
        },

        flxClick1: {
          isVisible: i !== 0,
          onTouchEnd: this.onMenuClick1.bind(this),
        },

        flxClick2: {
          isVisible: i !== 0,
          onTouchEnd: this.onMenuClick2.bind(this),
        },

        flxClick3: {
          isVisible: i !== 0,
          onTouchEnd: this.onMenuClick3.bind(this),
        },

        flxLoanDashboard: {
          isVisible: true,
        },

        flxRemainingToPay: {
          isVisible: true,
        },

        lblRemainingToPay: {
          text: "Remaining to Pay",
          isVisible: true,
        },

        flxTypeOfLoan: {
          isVisible: true,
        },

        lblTypeOfLoan: {
          text: loan.loanName || loan.loanType || "",
          isVisible: true,
        },

        imgTypeOfLoan: {
          src: loan.imgTypeOfLoan || "usericon.png",
          isVisible: true,
        },

        flxRemainingAmt: {
          isVisible: true,
        },

        lblRemainingAmount: {
          text: amountMain,
          isVisible: true,
        },

        lblRemainingAmtDecimal: {
          text: amountDecimal,
          isVisible: true,
        },

        flxPercentagePaid: {
          isVisible: true,
        },

        flxPaid: {
          isVisible: true,
        },

        lblPaid: {
          text: percentage + "% repaid",
          isVisible: true,
        },

        flxBottomLoan: {
          isVisible: true,
        },

        flxProgressBack: {
          isVisible: true,
        },

        flxProgressBar: {
          isVisible: true,
          width: percentage + "%",
        },

        flxCompletedPayments: {
          isVisible: true,
        },

        lblPaymentCompleted: {
          text: "Payments Completed",
          isVisible: true,
        },

        lblTotalEMI: {
          text: loan.paidInstallments + " of " + loan.totalInstallments,
          isVisible: true,
        },

        flxLoanAmount: {
          isVisible: true,
        },

        lblLoanAmount: {
          text: "Loan Amount",
          isVisible: true,
        },

        lblLoanAmountVal: {
          text: "QAR " + loan.totalAmount,
          isVisible: true,
        },
      });
    }

    this.view.segLoanDashBoard.setData(rows);

    this.currentLoanRow = 0;

    kony.print("LOAN :: Dashboard rows = " + rows.length);

    kony.print("LOAN :: ALL rows use flxLoanDashboard");

    kony.print("LOAN :: Row 0 = flxLoanVisual visible");

    kony.print("LOAN :: Rows 1+ = flxLoanCard + flxLoanQuickMenu visible");
  },

  configureTabs: function () {
    var self = this;

    this.view.multipletab.initialize({
      selectedIndex: 0,

      flxFourTabSkin: "sknParent72PxBgf4f3f6",

      tabs: [
        {
          flx: "flxTab1",
          lbl: "lblTab1",
          text: "All",
          enabled: true,
        },
        {
          flx: "flxTab2",
          lbl: "lblTab2",
          text: "Personal",
          enabled: true,
        },
        {
          flx: "flxTab3",
          lbl: "lblTab3",
          text: "Vehicle",
          enabled: true,
        },
        {
          flx: "flxTab4",
          lbl: "lblTab4",
          text: "Mortgage",
          enabled: true,
        },
      ],

      onTabSelected: function (tab, index) {
        self.onTabSelected(tab, index);
      },
    });
  },

  onTabSelected: function (tab, index) {
    kony.print("LOAN :: TAB " + tab.flx + " INDEX " + index);

    if (index === 0) {
      this.setLoanAccountsData(this.loanData);
    } else if (index === 1) {
      this.setLoanAccountsData(
        this.loanData.filter(function (loan) {
          return loan.loanType === "Personal";
        }),
      );
    } else if (index === 2) {
      this.setLoanAccountsData(
        this.loanData.filter(function (loan) {
          return loan.loanType === "Vehicle";
        }),
      );
    } else if (index === 3) {
      this.setLoanAccountsData(
        this.loanData.filter(function (loan) {
          return loan.loanType === "Mortgage";
        }),
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

      flxFourTabSkin: "sknParent72PxBgf4f3f6",

      tabs: [
        {
          flx: "flxTab1",
          lbl: "lblTab1",
          text: "Activity",
          enabled: true,
        },
        {
          flx: "flxTab2",
          lbl: "lblTab2",
          text: "Details",
          enabled: true,
        },
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

  createLoanIndicators: function () {
    if (!this.view.flxDots) {
      kony.print("LOAN :: flxDots not found");

      return;
    }

    this.view.flxDots.removeAll();

    this.indicators = [];

    var data = this.view.segLoanDashBoard.data || [];

    var pageCount = data.length;

    kony.print("LOAN :: Creating " + pageCount + " indicators");

    for (var i = 0; i < pageCount; i++) {
      var dot = new kony.ui.FlexContainer(
        {
          id: "flxLoanDot" + i,

          width: i === 0 ? "20dp" : "10dp",

          height: "10dp",

          left: i === 0 ? "140dp" : "4dp",

          centerX: i === 0 ? "45%" : "",

          centerY: "50%",

          skin: i === 0 ? "sknDotSelected" : "sknDotUnselected",
        },
        {},
        {},
      );

      this.view.flxDots.add(dot);

      this.indicators.push(dot);
    }

    this.view.flxDots.forceLayout();

    this.updateLoanDots(0);
  },

  updateLoanDots: function (currentPage) {
    if (!this.view.flxDots) {
      return;
    }

    if (!this.indicators || !this.indicators.length) {
      return;
    }

    if (currentPage < 0 || currentPage >= this.indicators.length) {
      kony.print("LOAN :: Invalid dot index = " + currentPage);

      return;
    }

    for (var i = 0; i < this.indicators.length; i++) {
      var dot = this.indicators[i];

      var selected = i === currentPage;

      dot.skin = selected ? "sknDotSelected" : "sknDotUnselected";

      dot.animate(
        kony.ui.createAnimation({
          100: {
            width: selected ? "20dp" : "10dp",
          },
        }),
        {
          duration: 0.3,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },
      );
    }

    this.view.flxDots.forceLayout();

    kony.print("LOAN :: Active dot = " + currentPage);
  },
});
