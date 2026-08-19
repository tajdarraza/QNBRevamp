define({

    openBills: [],
    lastPaidBills: [],

    pendingAutoPaySection: null,
    pendingAutoPayRow: null,
    pendingAutoPayWidget: null,
    pendingAutoPayData: null,

    onNavigate: function (navData) {

        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;

        this.view.cmpFooter.initializeFooter();
        this.view.cmpFooter.setSelectedTab("payments");

        this.view.flxListProvider.onTouchEnd =
            this.onProviderClick;

        this.view.billprovider.onProviderSelected =
            this.onProviderSelected.bind(this);

        this.view.cmpbottomup.postRender();

        this.data = navData;
    },

    onFooterMenu: function (context) {

        alert(
            "footer menuy " +
            JSON.stringify(context)
        );

        new kony.mvc.Navigation(
            "frmDashboard"
        ).navigate();
    },

    init: function () {

        this.view.billprovider.isVisible = false;

        this.view.billprovider.initializeProviders();

        this.initializeBillPreview();
    },

    preShow: function () {

        this.view.lblProviderPlaceHolder.text =
            "All provider";

        this.view.billprovider.isVisible = false;
    },

    postShow: function () {

    },

    onProviderClick: function () {

        this.view.billprovider.isVisible = true;

        this.view.billprovider.openProviderList();
    },

    onProviderSelected: function (providerName) {

        this.view.lblProviderPlaceHolder.text =
            providerName;

        this.view.billprovider.isVisible = false;
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
                calendarIcon: "calendar.png",
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
                onTouchEnd:
                    this.toggleOpenBillSwitch.bind(this, i)
            };
        }

        for (var j = 0; j < this.lastPaidBills.length; j++) {

            this.lastPaidBills[j].flxSwitchWidget = {
                onTouchEnd:
                    this.toggleLastPaidBillSwitch.bind(this, j)
            };
        }

        var sectionData = [
            [
                {
                    billType:
                        "Open bills (" +
                        this.openBills.length +
                        ")",
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
        ];

        this.view.segBillPreview.setData(sectionData);

        kony.print("====================================");
        kony.print("BILL PREVIEW INITIALIZED");
        kony.print("OPEN BILLS = " + this.openBills.length);
        kony.print("LAST PAID BILLS = " + this.lastPaidBills.length);
        kony.print("====================================");
    },

    updateSwitchUI: function (switchWidget, isOn) {

        if (!switchWidget) {
            kony.print(
                "UPDATE SWITCH UI :: widget is NULL"
            );
            return;
        }

        try {

            switchWidget.skin =
                isOn
                    ? "sknBillSwitchOn"
                    : "sknSwitchOff";

            if (switchWidget.flxThumb) {

                switchWidget.flxThumb.left =
                    isOn
                        ? "17dp"
                        : "3dp";

            } else {

                kony.print(
                    "UPDATE SWITCH UI :: flxThumb NOT FOUND"
                );
            }

            if (
                typeof switchWidget.forceLayout ===
                "function"
            ) {
                switchWidget.forceLayout();
            }

            kony.print("SWITCH UI UPDATED");

        } catch (e) {

            kony.print(
                "UPDATE SWITCH UI ERROR :: " + e
            );
        }
    },

    showAutoPayBottomSheet: function (
        sectionIndex,
        rowIndex,
        switchWidget
    ) {

        kony.print("========================================");
        kony.print("AUTO PAY :: SHOW BOTTOM SHEET");
        kony.print("SECTION = " + sectionIndex);
        kony.print("ROW = " + rowIndex);

        this.pendingAutoPaySection = sectionIndex;
        this.pendingAutoPayRow = rowIndex;
        this.pendingAutoPayWidget = switchWidget;

        /*
         * Store the actual bill selected by the user.
         */
        if (sectionIndex === 0) {

            this.pendingAutoPayData =
                this.openBills[rowIndex];

        } else if (sectionIndex === 1) {

            this.pendingAutoPayData =
                this.lastPaidBills[rowIndex];

        } else {

            this.pendingAutoPayData = null;
        }

        kony.print(
            "AUTO PAY :: PENDING DATA = " +
            JSON.stringify(this.pendingAutoPayData)
        );

        if (
            this.view.cmpbottomup &&
            typeof this.view.cmpbottomup.show === "function"
        ) {

            this.view.cmpbottomup.show(
                this.onAutoPayEnabled.bind(this)
            );

        } else {

            kony.print(
                "AUTO PAY :: cmpbottomup.show() NOT FOUND"
            );
        }

        kony.print("AUTO PAY :: BOTTOM SHEET SHOWN");
        kony.print("========================================");
    },

    onAutoPayEnabled: function () {

        kony.print("========================================");
        kony.print("AUTO PAY :: ENABLE CONFIRMED");

        var sectionIndex =
            this.pendingAutoPaySection;

        var rowIndex =
            this.pendingAutoPayRow;

        var switchWidget =
            this.pendingAutoPayWidget;

        var billData =
            this.pendingAutoPayData;

        kony.print(
            "AUTO PAY :: SECTION = " +
            sectionIndex
        );

        kony.print(
            "AUTO PAY :: ROW = " +
            rowIndex
        );

        kony.print(
            "AUTO PAY :: ENABLED BILL DATA = " +
            JSON.stringify(billData)
        );

        if (
            sectionIndex === null ||
            rowIndex === null ||
            !billData
        ) {

            kony.print(
                "AUTO PAY :: NO PENDING DATA"
            );

            return;
        }

        if (sectionIndex === 0) {

            var openRow =
                this.openBills[rowIndex];

            if (!openRow) {

                kony.print(
                    "AUTO PAY :: OPEN BILL ROW NOT FOUND"
                );

                return;
            }

            openRow.switchOn = true;

            this.openBills[rowIndex] = openRow;

            this.updateSwitchUI(
                switchWidget,
                true
            );

            kony.print(
                "AUTO PAY :: OPEN BILL ENABLED"
            );

        } else if (sectionIndex === 1) {

            var paidRow =
                this.lastPaidBills[rowIndex];

            if (!paidRow) {

                kony.print(
                    "AUTO PAY :: LAST PAID ROW NOT FOUND"
                );

                return;
            }

            paidRow.switchOn = true;

            this.lastPaidBills[rowIndex] = paidRow;

            this.updateSwitchUI(
                switchWidget,
                true
            );

            kony.print(
                "AUTO PAY :: LAST PAID BILL ENABLED"
            );
        }

        /*
         * This is the data you can later send to the API.
         */
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

        kony.print("========================================");
        kony.print("AUTO PAY :: API REQUEST DATA");
        kony.print(
            JSON.stringify(autoPayRequestData)
        );
        kony.print("========================================");

        /*
         * Later:
         *
         * this.enableAutoPayAPI(autoPayRequestData);
         */

        this.clearPendingAutoPay();

        kony.print(
            "AUTO PAY :: SWITCH ENABLED SUCCESSFULLY"
        );

        kony.print("========================================");
    },

    clearPendingAutoPay: function () {

        this.pendingAutoPaySection = null;
        this.pendingAutoPayRow = null;
        this.pendingAutoPayWidget = null;
        this.pendingAutoPayData = null;
    },

    toggleOpenBillSwitch: function (
        rowIndex,
        widget
    ) {

        kony.print("########################################");
        kony.print("OPEN BILL SWITCH CLICKED");
        kony.print("SECTION = 0");
        kony.print("ROW INDEX = " + rowIndex);

        var row =
            this.openBills[rowIndex];

        if (!row) {

            kony.print(
                "OPEN BILL ROW NOT FOUND"
            );

            return;
        }

        /*
         * OFF -> show confirmation.
         */
        if (!row.switchOn) {

            kony.print(
                "OPEN BILL :: CURRENTLY OFF"
            );

            kony.print(
                "OPEN BILL :: SHOWING AUTO PAY SHEET"
            );

            this.showAutoPayBottomSheet(
                0,
                rowIndex,
                widget
            );

            return;
        }

        /*
         * ON -> OFF immediately.
         */
        kony.print(
            "OPEN BILL :: CURRENTLY ON"
        );

        row.switchOn = false;

        this.openBills[rowIndex] = row;

        this.updateSwitchUI(
            widget,
            false
        );

        kony.print(
            "OPEN BILL :: SWITCH TURNED OFF"
        );

        kony.print("########################################");
    },

    toggleLastPaidBillSwitch: function (
        rowIndex,
        widget
    ) {

        kony.print("########################################");
        kony.print("LAST PAID SWITCH CLICKED");
        kony.print("SECTION = 1");
        kony.print("ROW INDEX = " + rowIndex);

        var row =
            this.lastPaidBills[rowIndex];

        if (!row) {

            kony.print(
                "LAST PAID BILL ROW NOT FOUND"
            );

            return;
        }

        /*
         * OFF -> show confirmation.
         */
        if (!row.switchOn) {

            kony.print(
                "LAST PAID :: CURRENTLY OFF"
            );

            kony.print(
                "LAST PAID :: SHOWING AUTO PAY SHEET"
            );

            this.showAutoPayBottomSheet(
                1,
                rowIndex,
                widget
            );

            return;
        }

        /*
         * ON -> OFF immediately.
         */
        kony.print(
            "LAST PAID :: CURRENTLY ON"
        );

        row.switchOn = false;

        this.lastPaidBills[rowIndex] = row;

        this.updateSwitchUI(
            widget,
            false
        );

        kony.print(
            "LAST PAID :: AUTO PAY DISABLED"
        );

        kony.print("########################################");
    }

});