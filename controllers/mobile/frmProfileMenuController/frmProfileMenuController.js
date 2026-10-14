define(["Navigation"], function (Navigation) {
    return {

        menuData: [],

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            this.view.onDeviceBack = this.backNavigation;

                this.view.cmpFooter.initializeFooter();
    this.view.cmpFooter.setSelectedTab("menu");
        },

        init: function () {

            this.setProfileMenu();
        },

        preShow: function () {

        },

        postShow: function () {

        },

        onHide: function () {

        },

        backNavigation: function () {

        },

        setProfileMenu: function () {
            this.menuData = [
                {
                    imgMenuIcon: "icon_accounts.png",
                    lblMenuName: "Accounts",

                },
                {
                    imgMenuIcon: "icon_cards.png",
                    lblMenuName: "Cards",

                },
                {
                    imgMenuIcon: "icon_payments.png",
                    lblMenuName: "Payments",

                },
                {
                    imgMenuIcon: "icon_transfer.png",
                    lblMenuName: "Transfer",
                },
                {
                    imgMenuIcon: "icon_loan.png",
                    lblMenuName: "Loans",
                },
                {
                    imgMenuIcon: "icon_insurance.png",
                    lblMenuName: "Insurance",
                },
                {
                    imgMenuIcon: "icon_investment.png",
                    lblMenuName: "Investment",
                },
                {
                    imgMenuIcon: "icon_life_rewards.png",
                    lblMenuName: "Life Rewards",
                }
            ];

            this.view.segProfileMenu.widgetDataMap = {
                imgMenuIcon: "imgMenuIcon",
                lblMenuName: "lblMenuName"
            };

            this.view.segProfileMenu.setData(this.menuData);
            this.view.segProfileMenu.onRowClick =
                this.onProfileMenuClick.bind(this);
        },

        onProfileMenuClick: function () {
            var selectedRow = this.view.segProfileMenu.selectedRowItems;

            if (!selectedRow || !selectedRow.length) {
                return;
            }

            var row = selectedRow[0];

            kony.print(
                "PROFILE MENU CLICK: " +
                JSON.stringify(row)
            );

            alert(
                "Menu Selected\n\n" +
                "Name: " + row.lblMenuName + "\n" +
                "Icon: " + row.imgMenuIcon + "\n" +
                "Navigation Icon: " + row.imgNav
            );
        }
    };
});