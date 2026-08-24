define({
    openBills: [],
    lastPaidBills: [],
    pendingAutoPaySection: null,
    pendingAutoPayRow: null,
    pendingAutoPayWidget: null,
    pendingAutoPayData: null,
    autoPayTouchHandled: false,

    onNavigate: function(navData) {
        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;

        this.view.cmpFooter.initializeFooter();
        this.view.cmpFooter.setSelectedTab("payments");
        this.view.flxListProvider.onTouchEnd = this.onProviderClick;
        this.view.billprovider.onProviderSelected = this.onProviderSelected.bind(this);
        this.view.segBillPreview.onRowClick = this.onBillRowClick.bind(this);

        this.view.commonheader.configure({
            title: "Pay bills",
            action1: function() {
                alert("not yet developed");
            }
        });

        this.data = navData;
    },

    onFooterMenu: function(context) {
        alert("footer menuy " + JSON.stringify(context));
        new kony.mvc.Navigation("frmDashboard").navigate();
    },

    init: function() {
    this.view.billprovider.isVisible = false;
    this.view.billprovider.initializeProviders();
    this.initializeBillPreview();
    },

    preShow: function() {
        this.view.lblProviderPlaceHolder.text = "All provider";
        this.view.billprovider.isVisible = false;
        this.view.cmpbottomup.isVisible = false;
        this.autoPayTouchHandled = false;
    },

    postShow: function() {},

    onProviderClick: function() {
        this.view.billprovider.isVisible = true;
        this.view.billprovider.openProviderList();
    },

    onProviderSelected: function(providerName) {
        this.view.lblProviderPlaceHolder.text = providerName;
        this.view.billprovider.isVisible = false;
    },

    onAutoPayTouchStart: function() {
        this.autoPayTouchHandled = true;
        kony.print("AUTO PAY :: TOUCH START");
    },

    onAutoPayTouchEnd: function() {
        this.autoPayTouchHandled = true;
        kony.print("AUTO PAY :: TOUCH END");
    },

    onBillRowClick: function() {
        if (this.autoPayTouchHandled) {
            kony.print("BILL ROW CLICK :: IGNORED - AUTOPAY CLICK");
            this.autoPayTouchHandled = false;
            return;
        }

        var selectedRow = this.view.segBillPreview.selectedRowItems[0];

        if (!selectedRow) {
            kony.print("BILL ROW CLICK :: NO ROW SELECTED");
            return;
        }

        kony.print("BILL ROW CLICKED");
        kony.print("SELECTED BILL = " + JSON.stringify(selectedRow));

        new kony.mvc.Navigation("frmPayBillAccount").navigate(selectedRow);
    },

    initializeBillPreview: function() {
        this.openBills = [
            {
                billLogo: "zakat.png",
                billHeader: "Kahramaa",
                billDetails: "Electricity & Water",
                billAmount: "250.00",
                billCurr: "QAR",
                calendarIcon: "calendar.png",
                endDate: "Due date on May, 15th",
                switchOn: false
            },
            {
                billLogo: "ooredoo.png",
                billHeader: "Ooredoo",
                billDetails: "Mobile Bill",
                billAmount: "150.00",
                billCurr: "QAR",
                calendarIcon: "calendar.png",
                endDate: "Due date on May, 15th",
                switchOn: false
            },
            {
                billLogo: "ooredoo.png",
                billHeader: "Vodafone",
                billDetails: "Mobile Bill",
                billAmount: "180.00",
                billCurr: "QAR",
                endDate: "Due date on May, 15th",
                switchOn: false
            }
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
                switchOn: false
            },
            {
                billLogo: "zakat.png",
                billHeader: "Qatar Cool",
                billDetails: "Cooling Services",
                billAmount: "300.00",
                billCurr: "QAR",
                calendarIcon: "calendar.png",
                endDate: "Due date on May, 15th",
                switchOn: false
            }
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
            lblBillSeeAll: "billSeeAll"
        };

        for (var i = 0; i < this.openBills.length; i++) {
            this.openBills[i].flxSwitchWidget = {
                onTouchStart: this.onAutoPayTouchStart.bind(this),
                onTouchEnd: this.toggleOpenBillSwitch.bind(this, i)
            };
        }

        for (var j = 0; j < this.lastPaidBills.length; j++) {
            this.lastPaidBills[j].flxSwitchWidget = {
                onTouchStart: this.onAutoPayTouchStart.bind(this),
                onTouchEnd: this.toggleLastPaidBillSwitch.bind(this, j)
            };
        }

        this.view.segBillPreview.setData([
            [
                {
                    billType: "Open bills (" + this.openBills.length + ")",
                    billSeeAll: "See all"
                },
                this.openBills
            ],
            [
                {
                    billType: "Last paid bills",
                    billSeeAll: "See all"
                },
                this.lastPaidBills
            ]
        ]);
    },

    updateSwitchUI: function(switchWidget, isOn) {
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

    showAutoPayBottomSheet: function(sectionIndex, rowIndex, switchWidget) {
        this.pendingAutoPaySection = sectionIndex;
        this.pendingAutoPayRow = rowIndex;
        this.pendingAutoPayWidget = switchWidget;

        this.pendingAutoPayData = sectionIndex === 0 ? this.openBills[rowIndex] : this.lastPaidBills[rowIndex];

        if (!this.pendingAutoPayData) {
            kony.print("AUTO PAY :: NO BILL DATA");
            return;
        }

        if (this.view.cmpbottomup && typeof this.view.cmpbottomup.show === "function") {
            this.view.cmpbottomup.show(this.onAutoPayEnabled.bind(this), "enable", this.pendingAutoPayData);
        }
    },

    onAutoPayEnabled: function(actionType, billData) {
        var sectionIndex = this.pendingAutoPaySection;
        var rowIndex = this.pendingAutoPayRow;
        var switchWidget = this.pendingAutoPayWidget;

        if (sectionIndex === null || rowIndex === null || !billData) {
            this.clearPendingAutoPay();
            return;
        }

        if (sectionIndex === 0) {
            if (!this.openBills[rowIndex]) {
                this.clearPendingAutoPay();
                return;
            }

            this.openBills[rowIndex].switchOn = true;
        } else if (sectionIndex === 1) {
            if (!this.lastPaidBills[rowIndex]) {
                this.clearPendingAutoPay();
                return;
            }

            this.lastPaidBills[rowIndex].switchOn = true;
        }

        this.updateSwitchUI(switchWidget, true);

        var autoPayRequestData = {
            billLogo: billData.billLogo,
            billHeader: billData.billHeader,
            billDetails: billData.billDetails,
            billAmount: billData.billAmount,
            billCurr: billData.billCurr,
            calendarIcon: billData.calendarIcon,
            endDate: billData.endDate,
            sectionIndex: sectionIndex,
            rowIndex: rowIndex
        };

        kony.print("AUTO PAY :: API REQUEST DATA = " + JSON.stringify(autoPayRequestData));
        this.clearPendingAutoPay();
    },

    clearPendingAutoPay: function() {
        this.pendingAutoPaySection = null;
        this.pendingAutoPayRow = null;
        this.pendingAutoPayWidget = null;
        this.pendingAutoPayData = null;
    },

    toggleOpenBillSwitch: function(rowIndex, widget) {
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
        this.openBills[rowIndex] = row;
        this.updateSwitchUI(widget, false);
    },

    toggleLastPaidBillSwitch: function(rowIndex, widget) {
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
        this.lastPaidBills[rowIndex] = row;
        this.updateSwitchUI(widget, false);
    }
});