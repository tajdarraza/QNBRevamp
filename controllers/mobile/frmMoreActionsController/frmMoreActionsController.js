define(["MockData/MenuConfig"], function (MenuConfig) {
    return {
        menuData: [],

        onNavigate: function (params) {
            this.view.init = this.onInit;
            this.view.preShow = this.preShow;
            this.view.onDeviceBack = this.onDeviceBack;
            this.view.commonheader.configure({
                title: "More actions",
                backAction: "frmDashboard",
                action1: this.onDeviceBack
        });
        },
        onInit: function(){

        },
        preShow: function () {
            this.view.lblEditActions.onTouchEnd = this.onEditClick;

            // Fetch single source of truth using the imported MenuConfig
            this.menuData = MenuConfig.getMenuData();
            this.renderFavorites();
        },

        getFavourites: function () {
            return this.menuData.filter(function (item) {
                return item.isFavourite === true;
            });
        },

        renderFavorites: function () {
            var favourites = this.getFavourites();
            var self = this; // Capture context

            var slots = [
                { container: this.view.flxMenu1, icon: this.view.flxMenuIcon1, logo: this.view.imgMenuLogo1, label: this.view.lblMenuName1 },
                { container: this.view.flxMenu2, icon: this.view.flxMenuIcon2, logo: this.view.imgMenuLogo2, label: this.view.lblMenuNam2 },
                { container: this.view.flxMenu3, icon: this.view.flxMenuIcon3, logo: this.view.imgMenuLogo3, label: this.view.lblMenuName3 }
            ];

            for (var i = 0; i < slots.length; i++) {
                var slot = slots[i];
                var menu = favourites[i];

                if (!slot.container) continue;

                if (!menu) {
                    slot.container.isVisible = false;
                    slot.container.onClick = null; // Clear old click events
                    continue;
                }

                slot.container.isVisible = true;
                if (slot.logo) slot.logo.src = menu.favLogo || "iconsquare.png";
                if (slot.label) slot.label.text = menu.name;

                // HANDLE THE CLICK EVENT DYNAMICALLY BASED ON MENU ID
                (function (menuItem) {
                    slot.container.onClick = function () {
                        self.onFavouriteItemClick(menuItem);
                    };
                })(menu);
            }
        },

        onFavouriteItemClick: function (menu) {
            kony.print("MAIN FORM -> Clicked favorite: " + menu.name + " (ID: " + menu.id + ")");

            // Route based on the unique menu id
            switch (menu.id) {
                case "fawran":
                    // e.g., new kony.mvc.Navigation("frmFawranDashboard").navigate();
                    alert("Navigating to Fawran feature...");
                    break;
                case "paybill":
                    // e.g., new kony.mvc.Navigation("frmPayBill").navigate();
                    alert("Navigating to Pay Bill feature...");
                    break;
                case "paycard":
                    // e.g., new kony.mvc.Navigation("frmPayCard").navigate();
                    alert("Navigating to Paycard feature...");
                    break;
                default:
                    alert("Feature for " + menu.name + " coming soon!");
                    break;
            }
        },

        onEditClick: function () {
            new kony.mvc.Navigation("frmMoreActionsEdit").navigate();
        },
        onDeviceBack: function () {

                new kony.mvc.Navigation("frmDashboard").navigate();

        }
    };
});