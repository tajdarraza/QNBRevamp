define(["Navigation"], function (Navigation) {
    return {

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            this.view.onDeviceBack = this.backNavigation;

            this.view.commonheader.configure({
                title: "Profile",
                action1: function () {
                    new kony.mvc.Navigation("frmAIChatBot").navigate();
            },
            action1Image: "header_icon_help.png",
        });

            // Bind the segment row click event here, exactly like your working code
            this.view.segMyProfile.onRowClick = this.onSettingsRowClick.bind(this);
        },

        init: function () {
        },

        preShow: function () {
            this.setSettingsData();
            //alert("preShow");
        },

        postShow: function () {

        },

        onHide: function () {
            //alert("onHide");
        },

        backNavigation: function () {
             Navigation.navigateTo("frmDashboard")
        },

        setSettingsData: function (response) {
            var seg = this.view.segMyProfile;
            seg.widgetDataMap = {
                // Section header
                lblSettingHeader: "lblSettingHeader",

                // Main row container
                flxSettingMenu: "flxSettingMenu",

                // Top / bottom containers
                flxContainerTop: "flxContainerTop",
                flxContainerBottom: "flxContainerBottom",

                // Menu container
                flxMenuOptions: "flxMenuOptions",

                // Menu widgets
                imgIcon: "imgIcon",
                imgMenuName: "imgMenuName",
                imgTrail: "imgTrail",
            };

            // =====================================================
            // DEMO / LOCAL DATA
            //
            // Later replace this with API response.
            // =====================================================

            if (!response) {
                response = [
                    {
                        header: "Personal Information",

                        items: [
                            {
                                id: "profile",
                                title: "Profile",
                                icon: "icon_profile.png",
                                action: "ACTION_PROFILE",
                            },
                            {
                                id: "kyc_details",
                                title: "KYC Details",
                                icon: "icon_ekyc.png",
                                action: "ACTION_KYC_DETAILS",
                            },
                            {
                                id: "qid_details",
                                title: "QID Details",
                                icon: "icon_qid.png",
                                action: "ACTION_QID_DETAILS",
                            },
                            {
                                id: "crs",
                                title: "Common Reporting Standards",
                                icon: "icon_crs.png",
                                action: "ACTION_CRS",
                            },
                        ],
                    },

                    {
                        header: "Documents & statements",

                        items: [
                            {
                                id: "documents_statements",
                                title: "Documents & statements",
                                icon: "icon_doc_statement.png",
                                action: "ACTION_DOCUMENTS_STATEMENTS",
                            },
                        ],
                    },

                    {
                        header: "Security & access",

                        items: [
                            {
                                id: "biometric_auth",
                                title: "Biometric authentication",
                                icon: "icon_profile_biometric.png",
                                action: "ACTION_BIOMETRIC_AUTH",
                            },
                            {
                                id: "username",
                                title: "Username",
                                icon: "icon_profile_username.png",
                                action: "ACTION_USERNAME",
                            },
                            {
                                id: "password",
                                title: "Password",
                                icon: "icon_profile_password.png",
                                action: "ACTION_PASSWORD",
                            },
                            {
                                id: "devices",
                                title: "Devices",
                                icon: "icon_devices.png",
                                action: "ACTION_DEVICES",
                            },
                        ],
                    },
                    {
                        header: "Preferences",

                        items: [
                            {
                                id: "appearance",
                                title: "Appearance",
                                icon: "construct.png",
                                action: "ACTION_APPEARANCE",
                            },
                            {
                                id: "home_preferences",
                                title: "Home page preferences",
                                icon: "icon_home_prefer.png",
                                action: "ACTION_HOME_PREFERENCES",
                            },
                            {
                                id: "hide_balance",
                                title: "Hide balance",
                                icon: "icon_hide_balance.png",
                                action: "ACTION_HIDE_BALANCE",
                            },
                            {
                                id: "notifications_settings",
                                title: "Notifications settings",
                                icon: "icon_noti_settings.png",
                                action: "ACTION_NOTIFICATIONS_SETTINGS",
                            },
                            {
                                id: "manage_estatements",
                                title: "Manage E-statements",
                                icon: "icon_manage_statement.png",
                                action: "ACTION_MANAGE_ESTATEMENTS",
                            },
                            {
                                id: "favourite_transactions",
                                title: "Favourite transactions",
                                icon: "icon_fav_transaction.png",
                                action: "ACTION_FAVOURITE_TRANSACTIONS",
                            },
                        ],
                    },
                    {
                        header: "Inbox",

                        items: [
                            {
                                id: "my_messages",
                                title: "My messages",
                                icon: "icon_inbox.png",
                                action: "ACTION_MY_MESSAGES",
                            },
                        ],
                    },
                    {
                        header: "About QNB",

                        items: [
                            {
                                id: "disclaimer",
                                title: "Disclaimer",
                                icon: "icon_disclaimer.png",
                                action: "ACTION_DISCLAIMER",
                            },
                            {
                                id: "privacy_information",
                                title: "Privacy information",
                                icon: "icon_privacy.png",
                                action: "ACTION_PRIVACY_INFORMATION",
                            },
                            {
                                id: "rate_app",
                                title: "Rate the app",
                                icon: "icon_rate_app.png",
                                action: "ACTION_RATE_APP",
                            },
                            {
                                id: "refer_friend",
                                title: "Refer a friend",
                                icon: "icon_refer.png",
                                action: "ACTION_REFER_FRIEND",
                            },
                            {
                                id: "terms_conditions",
                                title: "Terms & Conditions",
                                icon: "icon_terms.png",
                                action: "ACTION_TERMS_CONDITIONS",
                            },
                        ],
                    },
                ];
            }
            var segmentData = this.buildSegmentData(response);
            seg.setData(segmentData);
        },
        buildSegmentData: function (response) {
            var segmentData = [];

            if (!response || !response.length) {
                return segmentData;
            }

            for (var sectionIndex = 0; sectionIndex < response.length; sectionIndex++) {
                var section = response[sectionIndex];

                if (!section) {
                    continue;
                }

                var headerData = {
                    lblSettingHeader: section.header || section.lblSettingHeader || "",
                };

                var items = section.items || section.data || section.rows || [];
                var rows = [];

                for (var rowIndex = 0; rowIndex < items.length; rowIndex++) {
                    var item = items[rowIndex];

                    if (!item) {
                        continue;
                    }

                    var isFirst = rowIndex === 0;
                    var isLast = rowIndex === items.length - 1;
                    var isSingle = items.length === 1;

                    var row = {
                        originalData: item,
                        id: item.id || item.code || item.key || "",
                        imgIcon: item.icon || item.imgIcon || "",
                        imgMenuName: item.title || item.name || item.label || item.imgMenuName || "",
                        imgTrail: item.trailIcon || item.imgTrail || "traling.png",

                        flxSettingMenu: {
                            isVisible: true,
                        },

                        flxContainerTop: {
                            isVisible: !isSingle && isFirst
                        },

                        flxContainerBottom: {
                            isVisible: !isSingle && isLast
                        },

                        flxMenuOptions: {
                            skin: isSingle
                                ? "sknFlxBorder16PxWhiteBg"
                                : "sknFlexWhiteBG",
                            top: isFirst ? "10dp" : "0dp",
                            height: isSingle ? "60dp" : "50dp"
                        },
                    };

                    rows.push(row);
                }

                if (rows.length > 0) {
                    segmentData.push([headerData, rows]);
                }
            }

            return segmentData;
        },

        onSettingsRowClick: function (segment, sectionIndex, rowIndex) {
            var rowData;

            if (
                segment &&
                segment.data &&
                segment.data[sectionIndex] &&
                segment.data[sectionIndex][1] &&
                segment.data[sectionIndex][1][rowIndex]
            ) {
                rowData = segment.data[sectionIndex][1][rowIndex];
            }

            if (!rowData) {
                return;
            }

            var originalData = rowData.originalData || rowData;

            alert(
                "Clicked ID: " + originalData.id +
                "\nTitle: " + rowData.imgMenuName +
                "\nAction: " + (originalData.action || "")
            );

            // =====================================================
            // FORM NAVIGATION MAPPING
            // =====================================================

            switch (originalData.action) {
                case "ACTION_PROFILE":
                    // new kony.mvc.Navigation("frmProfile").navigate();
                    break;
                case "ACTION_KYC_DETAILS":
                    // new kony.mvc.Navigation("frmKYCDetails").navigate();
                    break;
                case "ACTION_QID_DETAILS":
                    // new kony.mvc.Navigation("frmQIDDetails").navigate();
                    break;
                case "ACTION_CRS":
                    // new kony.mvc.Navigation("frmCRS").navigate();
                    break;
                case "ACTION_DOCUMENTS_STATEMENTS":
                    // new kony.mvc.Navigation("frmDocumentsStatements").navigate();
                    break;
                case "ACTION_BIOMETRIC_AUTH":
                    // new kony.mvc.Navigation("frmBiometricAuth").navigate();
                    break;
                case "ACTION_USERNAME":
                    // new kony.mvc.Navigation("frmUsername").navigate();
                    break;
                case "ACTION_PASSWORD":
                    // new kony.mvc.Navigation("frmPassword").navigate();
                    break;
                case "ACTION_DEVICES":
                    // new kony.mvc.Navigation("frmDevices").navigate();
                    break;
                case "ACTION_APPEARANCE":
                    // new kony.mvc.Navigation("frmAppearance").navigate();
                    break;
                case "ACTION_HOME_PREFERENCES":
                    // new kony.mvc.Navigation("frmHomePreferences").navigate();
                    break;
                case "ACTION_HIDE_BALANCE":
                    // new kony.mvc.Navigation("frmHideBalance").navigate();
                    break;
                case "ACTION_NOTIFICATIONS_SETTINGS":
                    // new kony.mvc.Navigation("frmNotifications").navigate();
                    break;
                case "ACTION_MANAGE_ESTATEMENTS":
                    // new kony.mvc.Navigation("frmManageEstatements").navigate();
                    break;
                case "ACTION_FAVOURITE_TRANSACTIONS":
                    // new kony.mvc.Navigation("frmFavouriteTransactions").navigate();
                    break;
                case "ACTION_MY_MESSAGES":
                    // new kony.mvc.Navigation("frmMyMessages").navigate();
                    break;
                case "ACTION_DISCLAIMER":
                    // new kony.mvc.Navigation("frmDisclaimer").navigate();
                    break;
                case "ACTION_PRIVACY_INFORMATION":
                    // new kony.mvc.Navigation("frmPrivacyInfo").navigate();
                    break;
                case "ACTION_RATE_APP":
                    // new kony.mvc.Navigation("frmRateApp").navigate();
                    break;
                case "ACTION_REFER_FRIEND":
                    // new kony.mvc.Navigation("frmReferFriend").navigate();
                    break;
                case "ACTION_TERMS_CONDITIONS":
                    // new kony.mvc.Navigation("frmTermsConditions").navigate();
                    break;
                default:
                    break;
            }
        },
    }
});