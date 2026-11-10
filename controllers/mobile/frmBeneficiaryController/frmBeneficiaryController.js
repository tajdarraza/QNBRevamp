define(["Navigation"], function (Navigation) {
    return {

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            // this.view.onDeviceBack = this.backNavigation;
        },

        init: function () {
            kony.print("init");
        },

        preShow: function () {
            kony.print("preShow");
              this.view.commonheader.configure({
                title: "Beneficiaries",
                action1: function () {
                    new kony.mvc.Navigation("frmNewBeneficiary").navigate();
            },
            action2: function () {
                    new kony.mvc.Navigation("frmNewBeneficiary").navigate();
            },
            action1Image: "add_icon_navy.png",
        });
            this.loadFavouritesData();
            this.setBeneficiariesData();
        },

        postShow: function () {
            kony.print("postShow");
        },

        onHide: function () {
            kony.print("onHide");
        },

        backNavigation: function () {
            kony.print("backNavigation");
        },

        loadFavouritesData: function () {
            // Mock dataset with 4 beneficiaries for horizontal scroll
            var favoritesList = [
                {
                    firstName: "Mohammed",
                    lastName: "Al-Thani",
                    bankName: "QNB",
                    accountType: "Current Account"
                },
                {
                    firstName: "John",
                    lastName: "Smith",
                    bankName: "CBQ",
                    accountType: "Salary Account"
                },
                {
                    firstName: "David",
                    lastName: "Johnson",
                    bankName: "Ahli Bank",
                    accountType: "Savings Account"
                },
                {
                    firstName: "Mohammad",
                    lastName: "Raza",
                    bankName: "CBQ",
                    accountType: "Savings Account"
                }
            ];

            // Clear previous dynamically added items if any
            this.view.flxScrollFavourites.removeAll();

            for (var i = 0; i < favoritesList.length; i++) {
                var data = favoritesList[i];
                var cardId = "flxFav" + (i + 1);
                var isLastItem = (i === favoritesList.length - 1);

                // 1. Create root card flex container (flxFav1, flxFav2, etc.)
                var flxFav = new kony.ui.FlexContainer({
                    "id": cardId,
                    "top": "0dp",
                    "left": (i === 0) ? "0dp" : "12dp",
                    "right": isLastItem ? "16dp" : "0dp", // Apply 16dp right margin strictly to the last card
                    "width": "139dp",
                    "height": "152dp",
                    "zIndex": 100,
                    "isVisible": true,
                    "clipBounds": true,
                    "skin": "sknFlxWhite12PxOutlineEBE6DF",
                    "layoutType": kony.flex.FREE_FORM
                }, {}, {});

                // 2. Create flxBeneficiaryOption (top-right option button with three dots)
                var flxBeneOption = new kony.ui.FlexContainer({
                    "id": "flxBeneficiaryOption_" + i,
                    "top": "12dp",
                    "right": "12dp",
                    "width": "16dp",
                    "height": "16dp",
                    "zIndex": 1,
                    "isVisible": true,
                    "clipBounds": true,
                    "layoutType": kony.flex.FREE_FORM,
                    "onClick": this.onBeneficiaryOptionClick.bind(this, data)
                }, {}, {});

                var imgBeneOption = new kony.ui.Image2({
                    "id": "imgBeneficiaryOption_" + i,
                    "centerX": "50%",
                    "centerY": "50%",
                    "width": "16dp",
                    "height": "16dp",
                    "zIndex": 1,
                    "isVisible": true,
                    "src": "three_dots.png"
                }, {}, {});

                flxBeneOption.add(imgBeneOption);

                // 3. Create flxBeneInitials (Avatar circle with initials)
                var flxInitials = new kony.ui.FlexContainer({
                    "id": "flxBeneInitials_" + i,
                    "top": "20dp",
                    "centerX": "50%",
                    "width": "40dp",
                    "height": "40dp",
                    "zIndex": 1,
                    "isVisible": true,
                    "clipBounds": true,
                    "skin": "sknFlxBgf4f3f672PxOutline1B124B",
                    "layoutType": kony.flex.FREE_FORM
                }, {}, {});

                // Extract first letters from First and Last name
                var initials = "";
                if (data.firstName && data.firstName.length > 0) {
                    initials += data.firstName.charAt(0).toUpperCase();
                }
                if (data.lastName && data.lastName.length > 0) {
                    initials += data.lastName.charAt(0).toUpperCase();
                }

                var lblInitial = new kony.ui.Label({
                    "id": "lblBeneficiaryInitial_" + i,
                    "centerX": "50%",
                    "centerY": "50%",
                    "zIndex": 1,
                    "isVisible": true,
                    "skin": "sknQNBSemiBold35Px2a59bd",
                    "text": initials
                }, {
                    "contentAlignment": constants.CONTENT_ALIGN_CENTER
                }, {});

                flxInitials.add(lblInitial);

                // 4. Create flxBeneficiaryInfo container (Vertical stack for name, bank, type)
                var flxInfo = new kony.ui.FlexContainer({
                    "id": "flxBeneficiaryInfo_" + i,
                    "bottom": "12dp",
                    "centerX": "50%",
                    "width": "80%",
                    "height": "64dp",
                    "zIndex": 1,
                    "isVisible": true,
                    "clipBounds": true,
                    "layoutType": kony.flex.FLOW_VERTICAL
                }, {}, {});

                var fullName = data.firstName + " " + data.lastName;
                
                var lblName = new kony.ui.Label({
                    "id": "lblBeneName_" + i,
                    "centerX": "50%",
                    "width": "96%",
                    "height": "22dp",
                    "zIndex": 1,
                    "isVisible": true,
                    "skin": "sknLblCurrency35pxNormal1b124b",
                    "text": fullName,
                    "maxNumberOfLines": 1,
                    "textTruncatePosition": constants.TEXT_TRUNCATE_END
                }, {
                    "contentAlignment": constants.CONTENT_ALIGN_CENTER
                }, {});

                var lblBank = new kony.ui.Label({
                    "id": "lblBeneBank_" + i,
                    "centerX": "50%",
                    "width": "100%",
                    "zIndex": 1,
                    "isVisible": true,
                    "skin": "sknLbl75P50477D",
                    "text": data.bankName,
                    "maxNumberOfLines": 1,
                    "textTruncatePosition": constants.TEXT_TRUNCATE_END
                }, {
                    "contentAlignment": constants.CONTENT_ALIGN_CENTER
                }, {});

                var lblType = new kony.ui.Label({
                    "id": "lblBeneType_" + i,
                    "centerX": "50%",
                    "width": "100%",
                    "zIndex": 1,
                    "isVisible": true,
                    "skin": "sknLbl75P50477D",
                    "text": data.accountType,
                    "maxNumberOfLines": 1,
                    "textTruncatePosition": constants.TEXT_TRUNCATE_END
                }, {
                    "contentAlignment": constants.CONTENT_ALIGN_CENTER
                }, {});

                flxInfo.add(lblName, lblBank, lblType);

                // Assemble card components
                flxFav.add(flxBeneOption, flxInitials, flxInfo);

                // Add card into the horizontal scroll container
                this.view.flxScrollFavourites.add(flxFav);
            }
        },

        setBeneficiariesData: function () {
            var self = this;

            // Define widget data map including flxBeneficiaryOption and flxActivateBene
            var widgetMap = {
                "lblBeneficiaryInitial": "lblBeneficiaryInitial",
                "lblBeneName": "lblBeneName",
                "lblBeneBank": "lblBeneBank",
                "flxBeneficiaryOption": "flxBeneficiaryOption",
                "imgBeneficiaryOption": "imgBeneficiaryOption",
                "imgAccType": "imgAccType",
                "lblAccNumber": "lblAccNumber",
                "flxBenefeciaryInfo": "flxBenefeciaryInfo", // Controls visibility of bottom info container per row
                "imgActivation": "imgActivation",
                "lblActivation": "lblActivation",
                "flxActivateBene": "flxActivateBene",
                "lblActivateBene": "lblActivateBene"
            };

            // Mock segment dataset
            var beneficiariesList = [
                {
                    "lblBeneficiaryInitial": "MA",
                    "lblBeneName": "Mohammed Al-Thani",
                    "lblBeneBank": "QNB · Current Account",
                    "imgBeneficiaryOption": "three_dots.png",
                    "imgAccType": "intl_bene.png",
                    "lblAccNumber": "QA83 QNBA 0000 0012 3456 7890",
                    "flxBenefeciaryInfo": { "isVisible": true },
                    "imgActivation": "usericon.png",
                    "lblActivation": "Needs activation",
                    "lblActivateBene": "Activate Beneficiary"
                },
                {
                    "lblBeneficiaryInitial": "JS",
                    "lblBeneName": "John Smith",
                    "lblBeneBank": "CBQ · Savings Account",
                    "imgBeneficiaryOption": "three_dots.png",
                    "imgAccType": "intl_bene.png",
                    "lblAccNumber": "QA12 CBQA 9876 5432 1000 1234",
                    "flxBenefeciaryInfo": { "isVisible": false },
                    "imgActivation": "usericon.png",
                    "lblActivation": "",
                    "lblActivateBene": ""
                },
                {
                    "lblBeneficiaryInitial": "DJ",
                    "lblBeneName": "David Johnson",
                    "lblBeneBank": "Ahli Bank · Current Account",
                    "imgBeneficiaryOption": "three_dots.png",
                    "imgAccType": "intl_bene.png",
                    "lblAccNumber": "QA45 ABQK 1122 3344 5566 7788",
                    "flxBenefeciaryInfo": { "isVisible": true },
                    "imgActivation": "usericon.png",
                    "lblActivation": "Needs activation",
                    "lblActivateBene": "Activate Beneficiary"
                },
                {
                    "lblBeneficiaryInitial": "MR",
                    "lblBeneName": "Mohammad Raza",
                    "lblBeneBank": "CBQ · Current Account",
                    "imgBeneficiaryOption": "three_dots.png",
                    "imgAccType": "intl_bene.png",
                    "lblAccNumber": "QA45 CBQ 7178 9824 2966 0988",
                    "flxBenefeciaryInfo": { "isVisible": true },
                    "imgActivation": "usericon.png",
                    "lblActivation": "Needs activation",
                    "lblActivateBene": "Activate Beneficiary"
                }
            ];

            // Bind click event handlers for interactive row elements per item
            for (var i = 0; i < beneficiariesList.length; i++) {
                var item = beneficiariesList[i];

                // 1. Three dots option button click handler
                item.flxBeneficiaryOption = {
                    "onClick": self.onBeneficiaryOptionClick.bind(self, item)
                };

                // 2. Activate beneficiary container click handler (only active if text is present)
                if (item.lblActivateBene && item.lblActivateBene.length > 0) {
                    item.flxActivateBene = {
                        "isVisible": true,
                        "onClick": self.onActivateBeneficiaryClick.bind(self, item)
                    };
                } else {
                    item.flxActivateBene = {
                        "isVisible": false
                    };
                }
            }

            this.view.segBeneficiaryList.widgetDataMap = widgetMap;
            this.view.segBeneficiaryList.setData(beneficiariesList);

            // 3. Entire row selection click handler
            this.view.segBeneficiaryList.onRowClick = function () {
                var selectedRowData = self.view.segBeneficiaryList.selectedRowItems[0];
                self.onSegmentRowClick(selectedRowData);
            }.bind(this);
        },

        onBeneficiaryOptionClick: function (beneficiaryData) {
            kony.print("=== Beneficiary Option Clicked ===");
            alert("Three Dots Clicked:\nName: " + beneficiaryData.lblBeneName +
                "\nBank/Type: " + beneficiaryData.lblBeneBank);
        },

        onActivateBeneficiaryClick: function (beneficiaryData) {
            kony.print("=== Activate Beneficiary Clicked ===");
            alert("Activate Clicked for:\nName: " + beneficiaryData.lblBeneName +
                "\nAccount: " + beneficiaryData.lblAccNumber);
        },

        onSegmentRowClick: function (beneficiaryData) {
            kony.print("=== Segment Row Clicked ===");
            alert("Row Selected:\nName: " + beneficiaryData.lblBeneName +
                "\nAccount: " + beneficiaryData.lblAccNumber);
        }
    };
});