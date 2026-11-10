define(["MockData/MenuConfig"], function (MenuConfig) {
    return {
        menuData: [],
        favouriteSlots: [],
        dynamicOtherOptionWidgets: [],

        onNavigate: function (params) {
            kony.print("Raza onNavigate  ");
            kony.print("FAVOURITES -> onNavigate");

            this.view.init = this.onInit;
            this.view.preShow = this.preShow;
            this.view.onDeviceBack = this.onDeviceBack;

            // Capture menuData passed via navigation params or load from centralized MenuConfig
            if (params && params.menuData) {
                this.menuData = params.menuData;
            } else {
                this.menuData = MenuConfig.getMenuData();
            }

            this.view.commonheader.configure({
                title: "More actions",
                action1: function () {
                    new kony.mvc.Navigation("frmMoreActions").navigate();
            },
        });
        },

        onInit: function () {
            kony.print("Raza on init  ");
            kony.print("FAVOURITES -> onInit");

            this.createSlotMappings();

            if (!this.menuData || this.menuData.length === 0) {
                this.menuData = MenuConfig.getMenuData();
            }

            this.bindMenuEvents();
            this.renderMenus();
        },

        preShow: function () {
            kony.print("FAVOURITES -> preShow");
            // Ensure we pull fresh data if navigating back into the form
            this.menuData = MenuConfig.getMenuData();
            this.renderMenus();
        },

        createSlotMappings: function () {
            this.favouriteSlots = [
                {
                    container: this.view.flxFavMenu1,
                    icon: this.view.flxMenuIcon1,
                    logo: this.view.imgMenuLogo1,
                    addRemove: this.view.flxAddRemove1,
                    remove: this.view.imgRemove1,
                    label: this.view.lblMenuName1
                },
                {
                    container: this.view.flxFavMenu2,
                    icon: this.view.flxMenuIcon2,
                    logo: this.view.imgMenuLogo2,
                    addRemove: this.view.flxAddRemove2,
                    remove: this.view.imgRemove2,
                    label: this.view.lblMenuName2
                },
                {
                    container: this.view.flxFavMenu3,
                    icon: this.view.flxMenuIcon3,
                    logo: this.view.imgMenuLogo3,
                    addRemove: this.view.flxAddRemove3,
                    remove: this.view.imgRemove3,
                    label: this.view.lblMenuName3
                }
            ];

            this.dynamicOtherOptionWidgets = [];
        },

        bindMenuEvents: function () {
            var self = this;

            this.favouriteSlots[0].addRemove.onClick = function () {
                self.onFavouriteClick(0);
            };

            this.favouriteSlots[1].addRemove.onClick = function () {
                self.onFavouriteClick(1);
            };

            this.favouriteSlots[2].addRemove.onClick = function () {
                self.onFavouriteClick(2);
            };

            if (this.view.btnSaveFavs) {
                this.view.btnSaveFavs.onClick = function () {
                    self.onSaveFavourites();
                };
            }

            if (this.view.lblCancel) {
                this.view.lblCancel.onClick = function () {
                    self.onCancel();
                };
            }
        },

        onFavouriteClick: function (slotIndex) {
            var favourites = this.getFavourites();

            if (!favourites[slotIndex]) {
                kony.print("FAVOURITES -> No favourite at slot: " + slotIndex);
                return;
            }

            kony.print("FAVOURITES -> Removing: " + favourites[slotIndex].name);

            this.setFavouriteState(
                favourites[slotIndex].id,
                false
            );
        },

        onOtherActionClick: function (menuId) {
            var menu = this.getMenuById(menuId);

            if (!menu) {
                kony.print("FAVOURITES -> Menu not found: " + menuId);
                return;
            }

            kony.print("FAVOURITES -> Other option clicked: " + menu.name);

            if (menu.canFavourite === false) {
                kony.print("FAVOURITES -> Cannot favourite: " + menu.name);
                return;
            }

            if (this.getFavourites().length >= 3) {
                kony.print("FAVOURITES -> Maximum 3 favourites reached");
                return;
            }

            this.setFavouriteState(
                menu.id,
                true
            );
        },

        getMenuById: function (menuId) {
            for (var i = 0; i < this.menuData.length; i++) {
                if (this.menuData[i].id === menuId) {
                    return this.menuData[i];
                }
            }
            return null;
        },

        setFavouriteState: function (menuId, isFavourite) {
            for (var i = 0; i < this.menuData.length; i++) {
                if (this.menuData[i].id === menuId) {
                    this.menuData[i].isFavourite = isFavourite;

                    kony.print("FAVOURITES -> " + this.menuData[i].name + " = " + isFavourite);

                    this.renderMenus();
                    this.animateMenuChange();
                    return;
                }
            }
        },

        getFavourites: function () {
            var result = [];
            for (var i = 0; i < this.menuData.length; i++) {
                if (this.menuData[i].isFavourite === true) {
                    result.push(this.menuData[i]);
                }
            }
            return result;
        },

        getOtherActions: function () {
            var result = [];
            for (var i = 0; i < this.menuData.length; i++) {
                if (this.menuData[i].isFavourite === false) {
                    result.push(this.menuData[i]);
                }
            }
            return result;
        },

        renderMenus: function () {
            var favourites = this.getFavourites();
            var otherActions = this.getOtherActions();

            this.renderFavouriteSlots(favourites);
            this.renderOtherActionWidgets(otherActions);
        },

        renderFavouriteSlots: function (favourites) {
            for (var i = 0; i < this.favouriteSlots.length; i++) {
                var slot = this.favouriteSlots[i];
                var menu = favourites[i];

                slot.container.isVisible = true;
                slot.icon.isVisible = true;

                if (!menu) {
                    slot.icon.skin = "sknFlxRound16PxBgE4E2EDBorderE4E2ED";
                    slot.logo.isVisible = false;
                    slot.logo.src = "";
                    slot.label.isVisible = false;
                    slot.label.text = "";
                    slot.addRemove.isVisible = false;
                    slot.remove.isVisible = false;
                    continue;
                }

                slot.icon.skin = "sknRounded16pxBg2A59BD";
                slot.logo.isVisible = true;
                slot.logo.src = menu.favLogo || "iconsquare.png";
                slot.label.isVisible = true;
                slot.label.text = menu.name;
                slot.addRemove.isVisible = true;
                slot.remove.isVisible = true;
            }
        },

        clearDynamicOtherOptions: function () {
            var parent = this.view.flxSelectOptions;
            if (!parent) return;

            try {
                for (var i = this.dynamicOtherOptionWidgets.length - 1; i >= 0; i--) {
                    parent.remove(this.dynamicOtherOptionWidgets[i]);
                }
            } catch (e) {
                kony.print("FAVOURITES -> Clear dynamic options error: " + e.message);
            }

            this.dynamicOtherOptionWidgets = [];
        },

        renderOtherActionWidgets: function (otherActions) {
            var parent = this.view.flxSelectOptions;
            if (!parent) return;

            this.clearDynamicOtherOptions();

            var cardHeight = 114;
            var rowSpacing = 16;
            var topOffset = 32;
            var bottomPadding = 24;

            var rowCount = Math.ceil(otherActions.length / 3);
            var totalHeight = topOffset;

            if (rowCount > 0) {
                totalHeight += rowCount * cardHeight + (rowCount - 1) * rowSpacing + bottomPadding;
            } else {
                totalHeight += bottomPadding;
            }

            parent.height = totalHeight + "dp";

            for (var i = 0; i < otherActions.length; i++) {
                this.createOtherOptionWidget(parent, otherActions[i], i, cardHeight, rowSpacing);
            }

            parent.forceLayout();
        },

        createOtherOptionWidget: function (parent, menu, index, cardHeight, rowSpacing) {
            var self = this;
            var column = index % 3;
            var row = Math.floor(index / 3);

            var left = (column === 0) ? "0%" : (column === 1) ? "35%" : "70%";
            var top = 32 + row * (cardHeight + rowSpacing);

            var card = new kony.ui.FlexContainer({
                id: "flxDynamicOption_" + menu.id,
                left: left,
                top: top + "dp",
                width: "30%",
                height: cardHeight + "dp",
                zIndex: 10,
                isVisible: true,
                layoutType: constants.FLEX_LAYOUT_FREE_FORM,
                clipBounds: false,
                skin: "slFbox"
            }, {}, {});

            var iconContainer = new kony.ui.FlexContainer({
                id: "flxDynamicOptionIcon_" + menu.id,
                top: "10dp",
                width: "81dp",
                height: "64dp",
                centerX: "50%",
                zIndex: 1,
                isVisible: true,
                layoutType: constants.FLEX_LAYOUT_FREE_FORM,
                skin: "sknMenuBgWhiteBorderc7c2d9"
            }, {}, {});

            var logo = new kony.ui.Image2({
                id: "imgDynamicOptionLogo_" + menu.id,
                width: "24dp",
                height: "24dp",
                centerX: "50%",
                centerY: "50%",
                zIndex: 2,
                isVisible: true,
                src: menu.optionLogo || "construct.png"
            }, {}, {});

            var addRemove = new kony.ui.FlexContainer({
                id: "flxDynamicOptionAddRemove_" + menu.id,
                top: "-5dp",
                right: "0dp",
                width: "32dp",
                height: "32dp",
                zIndex: 5,
                isVisible: true,
                layoutType: constants.FLEX_LAYOUT_FREE_FORM,
                skin: "sknRound2a59bd"
            }, {}, {});

            var addImage = new kony.ui.Image2({
                id: "imgDynamicOptionAdd_" + menu.id,
                width: "16dp",
                height: "16dp",
                centerX: "50%",
                centerY: "50%",
                zIndex: 6,
                isVisible: true,
                src: "addicon.png"
            }, {}, {});

            var label = new kony.ui.Label({
                id: "lblDynamicOptionName_" + menu.id,
                top: "80dp",
                width: "preferred",
                height: "25dp",
                centerX: "50%",
                zIndex: 2,
                isVisible: true,
                text: menu.name,
                skin: "lblSknSansSemiBold14Px376cd2",
                contentAlignment: constants.CONTENT_ALIGN_CENTER,
                textAlign: constants.TEXT_ALIGN_CENTER
            }, {}, {});

            iconContainer.add(logo);
            addRemove.add(addImage);
            card.add(iconContainer, addRemove, label);

            card.onClick = function () {
                self.onOtherActionClick(menu.id);
            };

            addRemove.onClick = function () {
                self.onOtherActionClick(menu.id);
            };

            parent.add(card);
            this.dynamicOtherOptionWidgets.push(card);
        },

        animateMenuChange: function () {
            try {
                if (!this.view.flxMenuOptions) return;
                var favContainer = this.view.flxMenuOptions;
                var transform = kony.ui.makeAffineTransform();
                transform.scale(0.96, 0.96);

                favContainer.animate(
                    kony.ui.createAnimation({
                        100: { transform: transform, stepConfig: { timingFunction: kony.anim.EASE_IN_OUT } }
                    }),
                    { duration: 0.15, iterationCount: 1, delay: 0, fillMode: kony.anim.FILL_MODE_FORWARDS },
                    {
                        animationEnd: function () {
                            favContainer.animate(
                                kony.ui.createAnimation({
                                    100: { transform: kony.ui.makeAffineTransform() }
                                }),
                                { duration: 0.15, iterationCount: 1, delay: 0, fillMode: kony.anim.FILL_MODE_FORWARDS },
                                {}
                            );
                        }
                    }
                );
            } catch (e) {
                kony.print("FAVOURITES -> Animation error: " + e.message);
            }
        },

        onSaveFavourites: function () {
            var favourites = this.getFavourites();

            if (favourites.length === 0) {
                alert("No favourites selected.");
                return;
            }

            // 1. PERMANENTLY SAVE USING CENTRALIZED CONFIG MODULE
            MenuConfig.saveMenuData(this.menuData);

            // 2. NAVIGATE BACK TO MAIN FORM WITH PAYLOAD
            var navigationObj = new kony.mvc.Navigation("frmMoreActions");
            navigationObj.navigate({
                menuData: this.menuData
            });
        },

        onCancel: function () {
            var navigationObj = new kony.mvc.Navigation("frmMoreActions");
            navigationObj.navigate({
                menuData: this.menuData
            });
        },

        onDeviceBack: function () {
            var prevForm = kony.application.getPreviousForm();
            if (prevForm) {
                new kony.mvc.Navigation(prevForm.id).navigate();
            }
        }
    };
});