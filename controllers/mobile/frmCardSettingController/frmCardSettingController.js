define({

    isChecked: false,

    onNavigate: function (params) {

        this.view.init = this.onInit;
        this.view.preShow = this.preShow;

        // Segment row click
        this.view.segCardSettings.onRowClick = this.onSettingsRowClick.bind(this);

        // this.view.onDeviceBack = this.onDeviceBack;
    },


    onInit: function () {

    },


    preShow: function () {

        this.setSettingsData();
    },


    // =========================================================
    // SET SETTINGS DATA
    //
    // This function can later receive API response directly.
    // =========================================================

    setSettingsData: function (response) {

        var seg = this.view.segCardSettings;

        // =====================================================
        // WIDGET DATA MAP
        // =====================================================

        seg.widgetDataMap = {

            // Section header
            lblSettingHeader: "lblSettingHeader",

            // Main row container
            flxSettings: "flxSettings",

            // Top / bottom containers
            flxContainerTop: "flxContainerTop",
            flxContainerBottom: "flxContainerBottom",

            // Menu container
            flxMenuOptions: "flxMenuOptions",

            // Menu widgets
            imgIcon: "imgIcon",
            imgMenuName: "imgMenuName",
            imgTrail: "imgTrail"
        };


        // =====================================================
        // DEMO / LOCAL DATA
        //
        // Later replace this with your API response.
        // =====================================================

        if (!response) {

            response = [

                {
                    header: "Financial services",

                    items: [
                        {
                            id: "digital_wallet",
                            title: "Digital wallet",
                            icon: "digitalwallet.png",
                            action: "DIGITAL_WALLET"
                        },
                        {
                            id: "click_to_pay",
                            title: "Click to Pay",
                            icon: "clicktopay.png",
                            action: "CLICK_TO_PAY"
                        },
                        {
                            id: "payment_holiday",
                            title: "Payment holiday",
                            icon: "paymentholiday.png",
                            action: "PAYMENT_HOLIDAY"
                        }
                    ]
                },


                {
                    header: "Credit limits",

                    items: [
                        {
                            id: "temporary_limit",
                            title: "Temporarily increase limit",
                            icon: "paymentholiday.png",
                            action: "TEMPORARY_LIMIT"
                        },
                        {
                            id: "permanent_limit",
                            title: "Permanently increase limit",
                            icon: "paymentholiday.png",
                            action: "PERMANENT_LIMIT"
                        }
                    ]
                },


                {
                    header: "Card management",

                    items: [
                        {
                            id: "activate_abroad",
                            title: "Activate abroad",
                            icon: "paymentholiday.png",
                            action: "ACTIVATE_ABROAD"
                        },
                        {
                            id: "block_card",
                            title: "Block card permanently",
                            icon: "paymentholiday.png",
                            action: "BLOCK_CARD"
                        },
                        {
                            id: "change_pin",
                            title: "Change pin",
                            icon: "paymentholiday.png",
                            action: "CHANGE_PIN"
                        },
                        {
                            id: "edit_nickname",
                            title: "Edit card nickname",
                            icon: "paymentholiday.png",
                            action: "EDIT_NICKNAME"
                        },
                        {
                            id: "freeze_card",
                            title: "Freeze card",
                            icon: "paymentholiday.png",
                            action: "FREEZE_CARD"
                        },
                        {
                            id: "minimum_payment",
                            title: "Manage minimum payment",
                            icon: "paymentholiday.png",
                            action: "MINIMUM_PAYMENT"
                        },
                        {
                            id: "replace_renew",
                            title: "Replace and renew card",
                            icon: "paymentholiday.png",
                            action: "REPLACE_RENEW"
                        }
                    ]
                }
            ];
        }


        // =====================================================
        // BUILD SEGMENT DATA DYNAMICALLY
        // =====================================================

        var segmentData = this.buildSegmentData(response);


        // =====================================================
        // SET SEGMENT DATA
        // =====================================================

        seg.setData(segmentData);
    },


    // =========================================================
    // BUILD SEGMENT DATA
    //
    // Automatically determines:
    //
    // FIRST ROW
    //     flxContainerTop    = visible
    //     flxContainerBottom = hidden
    //
    // MIDDLE ROW
    //     flxContainerTop    = hidden
    //     flxContainerBottom = hidden
    //
    // LAST ROW
    //     flxContainerTop    = hidden
    //     flxContainerBottom = visible
    //
    // SINGLE ROW
    //     flxContainerTop    = visible
    //     flxContainerBottom = visible
    // =========================================================

    buildSegmentData: function (response) {

        var segmentData = [];


        if (!response || !response.length) {
            return segmentData;
        }


        for (var sectionIndex = 0;
             sectionIndex < response.length;
             sectionIndex++) {

            var section = response[sectionIndex];

            if (!section) {
                continue;
            }


            // =================================================
            // SECTION HEADER
            // =================================================

            var headerData = {
                lblSettingHeader:
                    section.header || section.lblSettingHeader || ""
            };


            // =================================================
            // SECTION ITEMS
            // =================================================

            var items =
                section.items ||
                section.data ||
                section.rows ||
                [];


            var rows = [];


            for (var rowIndex = 0;
                 rowIndex < items.length;
                 rowIndex++) {

                var item = items[rowIndex];

                if (!item) {
                    continue;
                }


                // =================================================
                // DETERMINE ROW POSITION
                // =================================================

                var isFirst = rowIndex === 0;

                var isLast =
                    rowIndex === items.length - 1;

                var isSingle =
                    items.length === 1;


                // =================================================
                // CREATE ROW
                // =================================================

                var row = {

                    // -------------------------------------------------
                    // Keep original API item
                    // -------------------------------------------------

                    originalData: item,


                    // -------------------------------------------------
                    // Common display values
                    //
                    // Supports both API-style names and our
                    // local demo names.
                    // -------------------------------------------------

                    id:
                        item.id ||
                        item.code ||
                        item.key ||
                        "",

                    imgIcon:
                        item.icon ||
                        item.imgIcon ||
                        "",

                    imgMenuName:
                        item.title ||
                        item.name ||
                        item.label ||
                        item.imgMenuName ||
                        "",

                    imgTrail:
                        item.trailIcon ||
                        item.imgTrail ||
                        "traling.png",


                    // -------------------------------------------------
                    // Main container
                    // -------------------------------------------------

                    flxSettings: {
                        isVisible: true
                    },


                    // -------------------------------------------------
                    // TOP CONTAINER
                    // -------------------------------------------------

                    flxContainerTop: {
                        isVisible:
                            isFirst || isSingle
                    },


                    // -------------------------------------------------
                    // BOTTOM CONTAINER
                    // -------------------------------------------------

                    flxContainerBottom: {
                        isVisible:
                            isLast || isSingle
                    },


                    // -------------------------------------------------
                    // MENU OPTIONS
                    // -------------------------------------------------

                    flxMenuOptions: {

                        skin:
                            isFirst || isLast || isSingle
                                ? "sknFlxPxBgE4E2EDBorderE4E2ED"
                                : "sknFlxPxBgE4E2EDBorderE4E2ED",

                        top:
                            isFirst
                                ? "10dp"
                                : "0dp"
                    }
                };


                rows.push(row);
            }


            // =================================================
            // ADD SECTION
            // =================================================

            if (rows.length > 0) {

                segmentData.push([
                    headerData,
                    rows
                ]);
            }
        }


        return segmentData;
    },


    // =========================================================
    // ROW CLICK
    // =========================================================

    onSettingsRowClick: function (
        segment,
        sectionIndex,
        rowIndex
    ) {

        var rowData;


        // =====================================================
        // GET CLICKED ROW DATA
        // =====================================================

        if (
            segment &&
            segment.data &&
            segment.data[sectionIndex] &&
            segment.data[sectionIndex][1] &&
            segment.data[sectionIndex][1][rowIndex]
        ) {

            rowData =
                segment.data[sectionIndex][1][rowIndex];
        }


        if (!rowData) {
            return;
        }


        // =====================================================
        // ORIGINAL API RESPONSE
        // =====================================================

        var originalData =
            rowData.originalData || rowData;


        // =====================================================
        // DEBUG
        // =====================================================

        // Remove this alert once your navigation is implemented.

        alert(
            "Clicked: " +
            rowData.imgMenuName +
            "\nAction: " +
            (originalData.action || "")
        );


        // =====================================================
        // FUTURE API / NAVIGATION LOGIC
        // =====================================================

        switch (originalData.action) {

            case "DIGITAL_WALLET":

                // Navigate to Digital Wallet
                // new kony.mvc.Navigation(
                //     "frmDigitalWallet"
                // ).navigate();

                break;


            case "CLICK_TO_PAY":

                // new kony.mvc.Navigation(
                //     "frmClickToPay"
                // ).navigate();

                break;


            case "PAYMENT_HOLIDAY":

                // new kony.mvc.Navigation(
                //     "frmPaymentHoliday"
                // ).navigate();

                break;


            case "TEMPORARY_LIMIT":

                // new kony.mvc.Navigation(
                //     "frmTemporaryLimit"
                // ).navigate();

                break;


            case "PERMANENT_LIMIT":

                // new kony.mvc.Navigation(
                //     "frmPermanentLimit"
                // ).navigate();

                break;


            case "ACTIVATE_ABROAD":

                // new kony.mvc.Navigation(
                //     "frmActivateAbroad"
                // ).navigate();

                break;


            case "BLOCK_CARD":

                // new kony.mvc.Navigation(
                //     "frmBlockCard"
                // ).navigate();

                break;


            case "CHANGE_PIN":

                // new kony.mvc.Navigation(
                //     "frmChangePin"
                // ).navigate();

                break;


            case "EDIT_NICKNAME":

                // new kony.mvc.Navigation(
                //     "frmEditCardNickname"
                // ).navigate();

                break;


            case "FREEZE_CARD":

                // new kony.mvc.Navigation(
                //     "frmFreezeCard"
                // ).navigate();

                break;


            case "MINIMUM_PAYMENT":

                // new kony.mvc.Navigation(
                //     "frmMinimumPayment"
                // ).navigate();

                break;


            case "REPLACE_RENEW":

                // new kony.mvc.Navigation(
                //     "frmReplaceRenew"
                // ).navigate();

                break;


            default:

                // No action configured.
                break;
        }
    },


    // =========================================================
    // DEVICE BACK
    // =========================================================

    onDeviceBack: function () {

        var prevForm =
            kony.application.getPreviousForm();

        new kony.mvc.Navigation(
            prevForm
        ).navigate();
    }

});