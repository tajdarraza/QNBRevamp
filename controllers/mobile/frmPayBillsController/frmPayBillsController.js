define({
  openBills: [],
  lastPaidBills: [],
  pendingAutoPaySection: null,
  pendingAutoPayRow: null,
  pendingAutoPayWidget: null,
  pendingAutoPayData: null,
  autoPayTouchHandled: false,

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    this.view.cmpFooter.initializeFooter();
    this.view.cmpFooter.setSelectedTab("payments");

    this.view.flxListProvider.onTouchEnd = this.onProviderClick;

    this.view.billprovider.onProviderSelected =
      this.onProviderSelected.bind(this);

    this.view.segBillPreview.onRowClick = this.onBillRowClick.bind(this);

    this.view.commonheader.configure({
      title: "Pay bills",
      action1: function () {
        alert("not yet developed");
      },
    });

    this.data = navData;
  },

  onFooterMenu: function (context) {
    alert("footer menu " + JSON.stringify(context));

    new kony.mvc.Navigation("frmDashboard").navigate();
  },

  init: function () {
    this.view.billprovider.isVisible = false;

    this.view.billprovider.initializeProviders();

    this.initializeBillPreview();
  },

  preShow: function () {
    this.view.lblProviderPlaceHolder.text = "All provider";

    this.view.billprovider.isVisible = false;

    if (this.view.cmpbottomup) {
      this.view.cmpbottomup.isVisible = false;
    }

    this.autoPayTouchHandled = false;
  },

  postShow: function () {},

  onProviderClick: function () {
    this.view.billprovider.isVisible = true;

    this.view.billprovider.openProviderList();
  },

  onProviderSelected: function (providerName) {
    this.view.lblProviderPlaceHolder.text = providerName;

    this.view.billprovider.isVisible = false;
  },

  onAutoPayTouchStart: function () {
    this.autoPayTouchHandled = true;
  },

  onAutoPayTouchEnd: function () {
    this.autoPayTouchHandled = true;
  },

  onBillRowClick: function () {
    if (this.autoPayTouchHandled) {
      this.autoPayTouchHandled = false;

      return;
    }

    var selectedIndex = this.view.segBillPreview.selectedRowIndex;

    if (!selectedIndex || selectedIndex.length < 2) {
      kony.print("BILL ROW CLICK :: NO ROW INDEX");

      return;
    }

    var sectionIndex = selectedIndex[0];

    var rowIndex = selectedIndex[1];

    var selectedRow;

    if (sectionIndex === 0) {
      selectedRow = this.openBills[rowIndex];
    } else if (sectionIndex === 1) {
      selectedRow = this.lastPaidBills[rowIndex];
    }

    if (!selectedRow) {
      kony.print("BILL ROW CLICK :: NO BILL DATA");

      return;
    }

    var billData = {
      billLogo: selectedRow.billLogo,

      billHeader: selectedRow.billHeader,

      billDetails: selectedRow.billDetails,

      billAmount: selectedRow.billAmount,

      billCurr: selectedRow.billCurr,

      calendarIcon: selectedRow.calendarIcon,

      endDate: selectedRow.endDate,

      switchOn: selectedRow.switchOn,
    };

    kony.print("BILL ROW CLICKED");

    kony.print("SELECTED BILL = " + JSON.stringify(billData));

    new kony.mvc.Navigation("frmPayBillAccount").navigate(billData);
  },

  initializeBillPreview: function () {
    this.openBills = [
      {
        billLogo: "zakat.png",
        billHeader: "Kahramaa",
        billDetails: "Electricity & Water",
        billAmount: "250.00",
        billCurr: "QAR",
        calendarIcon: "calendar.png",
        endDate: "Due date on May, 15th",
        switchOn: false,
      },

      {
        billLogo: "ooredoo.png",
        billHeader: "Ooredoo",
        billDetails: "Mobile Bill",
        billAmount: "150.00",
        billCurr: "QAR",
        calendarIcon: "calendar.png",
        endDate: "Due date on May, 15th",
        switchOn: false,
      },

      {
        billLogo: "ooredoo.png",
        billHeader: "Vodafone",
        billDetails: "Mobile Bill",
        billAmount: "180.00",
        billCurr: "QAR",
        calendarIcon: "calendar.png",
        endDate: "Due date on May, 15th",
        switchOn: false,
      },
    ];

    this.lastPaidBills = [
      {
        billLogo: "zakat.png",
        billHeader: "Zakat",
        billDetails: "Zakat Payment",
        billAmount: "500.00",
        billCurr: "QAR",
        calendarIcon: "calendar.png",
        endDate: "Due date on May, 15th",
        switchOn: false,
      },

      {
        billLogo: "zakat.png",
        billHeader: "Qatar Cool",
        billDetails: "Cooling Services",
        billAmount: "300.00",
        billCurr: "QAR",
        calendarIcon: "calendar.png",
        endDate: "Due date on May, 15th",
        switchOn: false,
      },
    ];

    this.view.segBillPreview.widgetDataMap = {
      imgBillLogo: "billLogo",

      lblBillHeader: "billHeader",

      lblBillDetails: "billDetails",

      lblBillAmount: "billAmount",

      lblBillCurr: "billCurr",

      imgCalendar: "calendarIcon",

      lblEndDate: "endDate",

      flxSwitchWidget: "flxSwitchWidget",

      lblBillType: "billType",

      lblBillSeeAll: "billSeeAll",
    };

    for (var i = 0; i < this.openBills.length; i++) {
      this.openBills[i].flxSwitchWidget = {
        onTouchStart: this.onAutoPayTouchStart.bind(this),

        onTouchEnd: this.toggleOpenBillSwitch.bind(this, i),
      };
    }

    for (var j = 0; j < this.lastPaidBills.length; j++) {
      this.lastPaidBills[j].flxSwitchWidget = {
        onTouchStart: this.onAutoPayTouchStart.bind(this),

        onTouchEnd: this.toggleLastPaidBillSwitch.bind(this, j),
      };
    }

    this.view.segBillPreview.setData([
      [
        {
          billType: "Open bills (" + this.openBills.length + ")",

          billSeeAll: "See all",
        },

        this.openBills,
      ],

      [
        {
          billType: "Last paid bills",

          billSeeAll: "See all",
        },

        this.lastPaidBills,
      ],
    ]);
  },

  updateSwitchUI: function (switchWidget, isOn) {
    if (!switchWidget) {
      return;
    }

    try {
      switchWidget.skin = isOn ? "sknBillSwitchOn" : "sknSwitchOff";

      if (switchWidget.flxThumb) {
        switchWidget.flxThumb.left = isOn ? "17dp" : "3dp";
      }

      if (typeof switchWidget.forceLayout === "function") {
        switchWidget.forceLayout();
      }
    } catch (e) {
      kony.print("UPDATE SWITCH UI ERROR :: " + e);
    }
  },

  showAutoPayBottomSheet: function (sectionIndex, rowIndex, switchWidget) {
    this.pendingAutoPaySection = sectionIndex;

    this.pendingAutoPayRow = rowIndex;

    this.pendingAutoPayWidget = switchWidget;

    this.pendingAutoPayData =
      sectionIndex === 0
        ? this.openBills[rowIndex]
        : this.lastPaidBills[rowIndex];

    if (!this.pendingAutoPayData) {
      kony.print("AUTO PAY :: NO BILL DATA");

      return;
    }

    if (
      !this.view.cmpbottomup ||
      typeof this.view.cmpbottomup.show !== "function"
    ) {
      kony.print("AUTO PAY :: BOTTOM SHEET UNAVAILABLE");

      return;
    }

    this.view.cmpbottomup.show({
      description: "Do you want to enable automatic payment for this bill?",

      description1: "Your bills will be paid automatically on the due date using your default payment method.",

      buttonText: "Enable automatic payment",

      cancelText: "Cancel",

      showCancel: true,

      showContent: true,

      showButtonAction: true,

      showClose: true,

      data: this.pendingAutoPayData,

      onConfirm: this.onAutoPayEnabled.bind(this),

      onCancel: this.onAutoPayCancelled.bind(this),
    });
  },

  onAutoPayEnabled: function (config) {
    var sectionIndex = this.pendingAutoPaySection;

    var rowIndex = this.pendingAutoPayRow;

    var switchWidget = this.pendingAutoPayWidget;

    var billData = this.pendingAutoPayData;

    if (sectionIndex === null || rowIndex === null || !billData) {
      this.clearPendingAutoPay();

      return;
    }

    var row =
      sectionIndex === 0
        ? this.openBills[rowIndex]
        : this.lastPaidBills[rowIndex];

    if (!row) {
      this.clearPendingAutoPay();

      return;
    }

    row.switchOn = true;

    this.updateSwitchUI(switchWidget, true);

    var autoPayRequestData = {
      billLogo: row.billLogo,

      billHeader: row.billHeader,

      billDetails: row.billDetails,

      billAmount: row.billAmount,

      billCurr: row.billCurr,

      calendarIcon: row.calendarIcon,

      endDate: row.endDate,

      switchOn: row.switchOn,

      sectionIndex: sectionIndex,

      rowIndex: rowIndex,
    };

    kony.print(
      "AUTO PAY :: API REQUEST DATA = " + JSON.stringify(autoPayRequestData),
    );

    this.clearPendingAutoPay();
  },

  onAutoPayCancelled: function (config) {
    kony.print("AUTO PAY :: CANCELLED");

    /*
     * Switch intentionally remains OFF.
     */

    this.clearPendingAutoPay();
  },

  clearPendingAutoPay: function () {
    this.pendingAutoPaySection = null;

    this.pendingAutoPayRow = null;

    this.pendingAutoPayWidget = null;

    this.pendingAutoPayData = null;
  },

  toggleOpenBillSwitch: function (rowIndex, widget) {
    this.autoPayTouchHandled = true;

    var row = this.openBills[rowIndex];

    if (!row) {
      return;
    }

    if (!row.switchOn) {
      this.showAutoPayBottomSheet(0, rowIndex, widget);

      return;
    }

    row.switchOn = false;

    this.updateSwitchUI(widget, false);
  },

  toggleLastPaidBillSwitch: function (rowIndex, widget) {
    this.autoPayTouchHandled = true;

    var row = this.lastPaidBills[rowIndex];

    if (!row) {
      return;
    }

    if (!row.switchOn) {
      this.showAutoPayBottomSheet(1, rowIndex, widget);

      return;
    }

    row.switchOn = false;

    this.updateSwitchUI(widget, false);
  },
});
