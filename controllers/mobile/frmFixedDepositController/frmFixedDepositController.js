define({
  transactionData: "",
  autoRenewCancelled: false,

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    this.data = navData;

    this.view.commonheader.configure({
      title: "Fixed deposit",
    });
  },

  init: function () {
    this.configureTabs();

    this.view.flxTab2.flxOptions.flxOption1.onClick =
      this.onCancelAutoRenewalClick.bind(this);
  },

  preShow: function () {
    if (this.view.cmpbottomup) {
      this.view.cmpbottomup.isVisible = false;
    }

    this.autoRenewCancelled = false;

    if (this.view.flxTab2.flxOptions.flxOption1.lblOption1) {
      this.view.lblOption1.text = "Cancel auto renew";
    }

    if (this.view.flxTab2 && this.view.flxTab2.wallError) {
      this.view.flxTab2.wallError.hide();
    }

    var info = "Maturity reached. This account is inactive.";
    this.view.infoToast.setError({
      description: "" + info,
      image: "error.png",
      backgroundSkin: "sknErrorLogindBGde2b37",
      foregroundSkin: "sknErrorLoginTopf9e5e5",
      descriptionSkin: "sknLblSansBold14px8C1B23",
    });

    this.transactionData = [
      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "QNB Transfer",
        lblTransactTime: "Today, 10:32 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-1,250.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Ooredoo",
        lblTransactTime: "Today, 09:15 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-150.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_inflow.png",
        lblTransaction: "Salary Credit",
        lblTransactTime: "Yesterday, 08:30 AM",
        imgTransaction: "",
        lblTransactAmount: "+15,000.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Karwa",
        lblTransactTime: "Yesterday, 06:45 PM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-75.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_inflow.png",
        lblTransaction: "Noon",
        lblTransactTime: "02 Sep 2026, 03:20 PM",
        imgTransaction: "",
        lblTransactAmount: "-320.50",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Lulu Hypermarket",
        lblTransactTime: "02 Sep 2026, 12:10 PM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-245.75",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Card Payment",
        lblTransactTime: "01 Sep 2026, 09:40 PM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-890.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Vodafone",
        lblTransactTime: "01 Sep 2026, 02:15 PM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-120.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "ATM Withdrawal",
        lblTransactTime: "31 Aug 2026, 05:30 PM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-1,000.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "International Transfer",
        lblTransactTime: "30 Aug 2026, 11:05 AM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-2,500.00",
        lblTransactCurr: "USD",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Account Transfer",
        lblTransactTime: "29 Aug 2026, 04:20 PM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-500.00",
        lblTransactCurr: "QAR",
      },

      {
        imgTranLogo: "cash_outflow.png",
        lblTransaction: "Apple",
        lblTransactTime: "28 Aug 2026, 08:10 PM",
        imgTransaction: "trailingcontent.png",
        lblTransactAmount: "-49.99",
        lblTransactCurr: "QAR",
      },
    ];

    this.view.transactionList.configure({
      data: this.transactionData,

      pageSize: 5,

      onSeeAll: function () {
        // navigate to transaction history
      },
    });

    if (this.view.multipletab) {
      this.view.multipletab.setSelectedTab(0, false);
    }

    this.showTabContent(0);
  },

  postShow: function () {
    this.configureAccountName();
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
          text: "Transactions",
          enabled: true,
        },

        {
          flx: "flxTab2",
          lbl: "lblTab2",
          text: "Actions",
          enabled: true,
        },

        {
          flx: "flxTab3",
          lbl: "lblTab3",
          text: "Details",
          enabled: true,
        },

        {
          flx: "flxTab4",
          lbl: "lblTab4",
          text: "",
          enabled: false,
        },
      ],

      onTabSelected: function (tab, index) {
        self.onTabSelected(tab, index);
      },
    });
  },

  onTabSelected: function (tab, index) {
    kony.print("onTabSelected: tab " + tab.flx + " index: " + index);

    this.showTabContent(index);

    if (index === 1) {
      this.configureTab2Error();
    }
  },

  showTabContent: function (index) {
    this.view.flxTab1.isVisible = false;
    this.view.flxTab2.isVisible = false;
    this.view.flxTab3.isVisible = false;

    // ==========================================
    // SHOW SELECTED CONTENT
    // ==========================================

    switch (index) {
      case 0:
        this.view.flxTab1.isVisible = true;

        break;

      case 1:
        this.view.flxTab2.isVisible = true;

        break;

      case 2:
        this.view.flxTab3.isVisible = true;

        break;
    }

    this.view.forceLayout();
  },

  // ==============================================
  // WALL ERROR
  // ==============================================

  configureTab2Error: function () {
    if (!this.autoRenewCancelled) {
      if (this.view.flxTab2 && this.view.flxTab2.wallError) {
        this.view.flxTab2.wallError.hide();
      }

      return;
    }

    /*
     * Auto-renew has been cancelled.
     * Show WallError.
     */

    if (this.view.flxTab2 && this.view.flxTab2.wallError) {
      this.view.flxTab2.wallError.setError({
        image: "warning_brown.png",

        description:
          "Auto-renewal cancelled. Your funds will be returned to the account on the maturity date.",

        backgroundSkin: "sknFlxOutlineAF8611",

        foregroundSkin: "sknFlxBgFDF1CB",

        descriptionSkin: "sknLbl100PFont43330C",
      });
    }

    this.view.flxTab2.forceLayout();
  },

  // ==============================================
  // OPTION 1
  // AUTO RENEW / CANCEL AUTO RENEW
  // ==============================================

  onCancelAutoRenewalClick: function () {
    kony.print("FIXED DEPOSIT :: OPTION 1 CLICKED");

    // ==========================================
    // STATE 1
    // CANCEL AUTO RENEW
    // ==========================================

    if (!this.autoRenewCancelled) {
      if (!this.view.cmpbottomup) {
        return;
      }

      this.view.cmpbottomup.show({
        /*
         * cmpbottomup mapping:
         *
         * description  -> lblDesc1
         * description1 -> lblDesc2
         */

        description: "Are you sure you want to cancel auto-renew?",

        description1: "Your funds will be available on the maturity date.",

        buttonText: "Confirm cancelation",

        cancelText: "Cancel",

        showCancel: true,

        showContent: true,

        showButtonAction: true,

        showClose: true,

        onConfirm: this.onCancelAutoRenewalConfirmed.bind(this),

        onCancel: this.onCancelAutoRenewalCancelled.bind(this),
      });

      return;
    }

    // ==========================================
    // STATE 2
    // AUTO RENEW
    // ==========================================

    if (!this.view.cmpbottomup) {
      return;
    }

    this.view.cmpbottomup.show({
      /*
       * This goes to lblDesc1.
       */

      description:
        "To activate auto-renew, create a new account or visit branch",

      buttonText: "Continue",

      /*
       * Hide Cancel.
       */

      showCancel: false,

      /*
       * Show content.
       */

      showContent: true,

      /*
             * Show action button.

             */

      showButtonAction: true,

      /*
       * Hide X / Close.
       */

      showClose: false,

      /*
       * Continue only closes
       * the bottom sheet.
       */

      onConfirm: this.onAutoRenewContinue.bind(this),
    });
  },

  onCancelAutoRenewalConfirmed: function (config) {
    this.view.infoToast.isVisible = false;

    kony.print("FIXED DEPOSIT :: CANCEL AUTO RENEWAL CONFIRMED");

    /*
     * Mark cancellation.
     */

    this.autoRenewCancelled = true;

    /*
     * Change:
     *
     * Cancel auto renew
     *
     * to:
     *
     * Auto renew
     */

    if (
      this.view.flxTab2 &&
      this.view.flxTab2.flxOptions &&
      this.view.flxTab2.flxOptions.flxOption1 &&
      this.view.flxTab2.flxOptions.flxOption1.lblOption1
    ) {
      this.view.flxTab2.flxOptions.flxOption1.lblOption1.text = "Auto renew";
    }

    /*
     * Show WallError.
     */

    if (this.view.flxTab2 && this.view.flxTab2.wallError) {
      this.view.flxTab2.wallError.setError({
        image: "warning_brown.png",

        description:
          "Auto-renewal cancelled. Your funds will be returned to the account on the maturity date.",

        backgroundSkin: "sknFlxOutlineAF8611",

        foregroundSkin: "sknFlxBgFDF1CB",

        descriptionSkin: "sknLbl100PFont43330C",
      });
    }

    this.view.flxTab2.forceLayout();

    /*
     * FUTURE API CALL GOES HERE.
     *
     * Example:
     *
     * this.cancelAutoRenewalAPI();
     */
  },

  onCancelAutoRenewalCancelled: function (config) {
    kony.print("FIXED DEPOSIT :: CANCEL AUTO RENEWAL CANCELLED");
  },

  onAutoRenewContinue: function (config) {
    kony.print("FIXED DEPOSIT :: AUTO RENEW CONTINUE");
  },

  configureAccountName: function () {
    var accountHolderName = "Mohammad Tajdar Raza";
    this.view.lblAccName.text = accountHolderName;
    var labelWidth = this.view.lblAccName.frame.width;
    this.view.flxAccountName.width = labelWidth + 32 + "dp";
    this.view.forceLayout();
  },
});
