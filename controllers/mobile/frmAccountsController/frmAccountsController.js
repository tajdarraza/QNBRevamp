define({
  cardData: [],
  currentAccounts: [],
  savingsAccounts: [],
  delegatedAccounts: [],

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    this.view.cmpHeader.configure({
      mode: "normal",
      firstName: "Mohammad",
      lastName: "Raza",
      notificationCount: 2,
      callbacks: {
        add: this.onAddClick.bind(this),
      },
    });

    this.view.cmpFooter.initializeFooter();
    this.view.cmpFooter.setSelectedTab("menu");
    this.data = navData;
  },

  onAddClick: function () {
    new kony.mvc.Navigation("frmNewAccount").navigate();
  },

  onFooterMenu: function () {
    new kony.mvc.Navigation("frmDashboard").navigate();
  },

  init: function () { },

  preShow: function () {
    this.view.segAccounts.widgetDataMap = {
      flxAccountHeader: "flxAccountHeader",
      lblAccountHeader: "lblAccountHeader",
      flxMain: "flxMain",
      flxTop: "flxTop",
      flxTopMain: "flxTopMain",
      flxVerticalSeperator: "flxVerticalSeperator",
      flxAccDetails: "flxAccDetails",
      lblAccName: "lblAccName",
      lblAccNum: "lblAccNum",
      flxAmtDetails: "flxAmtDetails",
      lblAmount: "lblAmount",
      lblCurrency: "lblCurrency",
      flxSeperator1: "flxSeperator1",
      flxBottom: "flxBottom",
      flxBottomMain: "flxBottomMain",
      imgCalendar: "imgCalendar",
      lblEndDate: "lblEndDate",
      flxSeparator2: "flxSeparator2",
    };

    this.view.segAccounts.onRowClick = this.onAccountRowClick.bind(this);

    this.setDummyAccounts();
    this.configureTabs();
  },

  postShow: function () { },

  createAccountRow: function (
    accountName,
    accountNumber,
    amount,
    currency,
    showBottom,
    endDate,
    verticalSeparatorSkin,
  ) {
    return {
      flxMain: {
        isVisible: true,
      },

      flxTop: {
        isVisible: true,
      },

      flxTopMain: {
        isVisible: true,
      },

      flxVerticalSeperator: {
        isVisible: true,
        skin: verticalSeparatorSkin,
      },

      flxAccDetails: {
        isVisible: true,
      },

      lblAccName: accountName,
      lblAccNum: accountNumber,

      flxAmtDetails: {
        isVisible: true,
      },

      lblAmount: amount,
      lblCurrency: currency,

      flxSeperator1: {
        isVisible: !showBottom,
        skin: "slFbox",
      },

      flxBottom: {
        isVisible: showBottom,
      },

      flxBottomMain: {
        isVisible: showBottom,
      },

      imgCalendar: {
        isVisible: showBottom,
        src: "calendar.png",
      },

      lblEndDate: {
        isVisible: showBottom,
        text: endDate || "",
      },

      flxSeparator2: {
        isVisible: showBottom,
        skin: "slFbox",
      },
    };
  },

  setDummyAccounts: function () {
    this.currentAccounts = [
      this.createAccountRow(
        "Current Account",
        "**** 4582",
        "12,450.00",
        "QAR",
        true,
        "Valid until 31 Dec 2026",
        "sknFlxRounderdSeperator2a59bd",
      ),

      this.createAccountRow(
        "Current Account",
        "**** 7812",
        "4,066.71",
        "QAR",
        false,
        "",
        "sknFlxRounderdSeperator2a59bd",
      ),
    ];

    this.savingsAccounts = [
      this.createAccountRow(
        "Savings Account",
        "**** 9921",
        "150,000.00",
        "QAR",
        false,
        "",
        "sknFlxRounderdSeperatorAC2672",
      ),

      this.createAccountRow(
        "Savings Account",
        "**** 6214",
        "1,250,000.00",
        "QAR",
        true,
        "Maturity 20 Dec 2026",
        "sknFlxRounderdSeperatorAC2672",
      ),
    ];

    this.delegatedAccounts = [
      this.createAccountRow(
        "Delegated Account",
        "**** 3456",
        "25,500.00",
        "QAR",
        false,
        "",
        "sknFlxRounderdSeperatorClra8a1c4",
      ),

      this.createAccountRow(
        "Delegated Account",
        "**** 7890",
        "75,250.50",
        "QAR",
        true,
        "Delegation until 30 Nov 2026",
        "sknFlxRounderdSeperatorClra8a1c4",
      ),
    ];

    this.showAllAccounts();
  },

  showAllAccounts: function () {
    var data = [];

    if (this.currentAccounts.length > 0) {
      data.push([
        {
          lblAccountHeader: "Current (" + this.currentAccounts.length + ")",
        },
        this.currentAccounts,
      ]);
    }

    if (this.savingsAccounts.length > 0) {
      data.push([
        {
          lblAccountHeader: "Savings (" + this.savingsAccounts.length + ")",
        },
        this.savingsAccounts,
      ]);
    }

    if (this.delegatedAccounts.length > 0) {
      data.push([
        {
          lblAccountHeader: "Delegated (" + this.delegatedAccounts.length + ")",
        },
        this.delegatedAccounts,
      ]);
    }

    this.view.segAccounts.setData(data);
  },

  showCurrentAccounts: function () {
    var data = [
      [
        {
          lblAccountHeader: "Current (" + this.currentAccounts.length + ")",
        },
        this.currentAccounts,
      ],
    ];

    this.view.segAccounts.setData(data);
  },

  showSavingsAccounts: function () {
    var data = [
      [
        {
          lblAccountHeader: "Savings (" + this.savingsAccounts.length + ")",
        },
        this.savingsAccounts,
      ],
    ];

    this.view.segAccounts.setData(data);
  },

  showDelegatedAccounts: function () {
    var data = [
      [
        {
          lblAccountHeader: "Delegated (" + this.delegatedAccounts.length + ")",
        },
        this.delegatedAccounts,
      ],
    ];

    this.view.segAccounts.setData(data);
  },

  // =========================================================
  // MULTIPLETAB
  // =========================================================

  configureTabs: function () {
    var self = this;

    this.view.multipletab.initialize({
      selectedIndex: 0,
      flxFourTabSkin: "sknFlx32pxRoundWhiteBgE4E2ED",

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
          text: "Current",
          enabled: true,
        },
        {
          flx: "flxTab3",
          lbl: "lblTab3",
          text: "Savings",
          enabled: true,
        },
        {
          flx: "flxTab4",
          lbl: "lblTab4",
          text: "Delegate",
          enabled: true,
        },
      ],

      onTabSelected: function (tab, index) {
        self.onTabSelected(tab, index);
      },
    });
  },

  onTabSelected: function (tab, index) {
    kony.print("ACCOUNTS :: TAB " + tab.flx + " INDEX " + index);

    if (index === 0) {
      this.showAllAccounts();
    } else if (index === 1) {
      this.showCurrentAccounts();
    } else if (index === 2) {
      this.showSavingsAccounts();
    } else if (index === 3) {
      this.showDelegatedAccounts();
    }
  },

  onAccountRowClick: function (segmentWidget, sectionIndex, rowIndex) {
    var rowData = segmentWidget.data[sectionIndex][1][rowIndex];

    new kony.mvc.Navigation("frmFixedDeposit").navigate();
  },
});
