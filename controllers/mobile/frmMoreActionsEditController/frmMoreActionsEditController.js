define({
  favourites: [],
  otherActions: [],

  favouriteSlots: [],
  otherActionSlots: [],

  onNavigate: function (params) {
    kony.print("MENU -> onNavigate");

    this.view.init = this.onInit.bind(this);
    this.view.preShow = this.preShow.bind(this);
  },

  onInit: function () {
    kony.print("MENU -> onInit");

    this.createSlotMappings();
    this.initializeMenuData();
    this.bindMenuEvents();
    this.renderMenus();
  },

  preShow: function () {
    kony.print("MENU -> preShow");
  },

  createSlotMappings: function () {
    this.favouriteSlots = [
      {
        container: this.view.flxMenuOptions.flxMenu1,
        icon: this.view.flxMenuOptions.flxMenu1.flxMenuIcon1,
        logo: this.view.flxMenuOptions.flxMenu1.flxMenuIcon1.imgMenuLogo1,
        addRemove: this.view.flxMenuOptions.flxMenu1.flxAddRemove1,
        remove: this.view.flxMenuOptions.flxMenu1.flxAddRemove1.imgRemove1,
        label: this.view.flxMenuOptions.flxMenu1.lblMenuName1,
      },

      {
        container: this.view.flxMenuOptions.flxMenu2,
        icon: this.view.flxMenuOptions.flxMenu2.flxMenuIcon2,
        logo: this.view.flxMenuOptions.flxMenu2.flxMenuIcon2.imgMenuLogo2,
        addRemove: this.view.flxMenuOptions.flxMenu2.flxAddRemove2,
        remove: this.view.flxMenuOptions.flxMenu2.flxAddRemove2.imgRemove2,
        label: this.view.flxMenuOptions.flxMenu2.lblMenuName2,
      },

      {
        container: this.view.flxMenuOptions.flxMenu3,
        icon: this.view.flxMenuOptions.flxMenu3.flxMenuIcon3,
        logo: this.view.flxMenuOptions.flxMenu3.flxMenuIcon3.imgMenuLogo3,
        addRemove: this.view.flxMenuOptions.flxMenu3.flxAddRemove3,
        remove: this.view.flxMenuOptions.flxMenu3.flxAddRemove3.imgRemove3,
        label: this.view.flxMenuOptions.flxMenu3.lblMenuName3,
      },
    ];

    this.otherActionSlots = [
      {
        container: this.view.flxSelectMenu.flxOptionMenu1,
        icon: this.view.flxSelectMenu.flxOptionMenu1.flxOptionMenuIcon1,
        logo: this.view.flxSelectMenu.flxOptionMenu1.flxOptionMenuIcon1
          .imgSelectMenuLogo1,
        addRemove: this.view.flxSelectMenu.flxOptionMenu1.flxMenuAddRemove1,
        add: this.view.flxSelectMenu.flxOptionMenu1.flxMenuAddRemove1.imgAdd1,
        label: this.view.flxSelectMenu.flxOptionMenu1.lblOptionMenuName1,
      },

      {
        container: this.view.flxSelectMenu.flxOptionMenu2,
        icon: this.view.flxSelectMenu.flxOptionMenu2.flxOptionMenuIcon2,
        logo: this.view.flxSelectMenu.flxOptionMenu2.flxOptionMenuIcon2
          .imgSelectMenuLogo2,
        addRemove: this.view.flxSelectMenu.flxOptionMenu2.flxMenuAddRemove2,
        add: this.view.flxSelectMenu.flxOptionMenu2.flxMenuAddRemove2.imgAdd2,
        label: this.view.flxSelectMenu.flxOptionMenu2.lblOptionMenuName2,
      },

      {
        container: this.view.flxSelectMenu.flxOptionMenu3,
        icon: this.view.flxSelectMenu.flxOptionMenu3.flxOptionMenuIcon3,
        logo: this.view.flxSelectMenu.flxOptionMenu3.flxOptionMenuIcon3
          .imgSelectMenuLogo3,
        addRemove: this.view.flxSelectMenu.flxOptionMenu3.flxMenuAddRemove3,
        add: this.view.flxSelectMenu.flxOptionMenu3.flxMenuAddRemove3.imgAdd3,
        label: this.view.flxSelectMenu.flxOptionMenu3.lblOptionMenuName3,
      },
    ];
  },

  initializeMenuData: function () {
    this.favourites = [
      {
        id: "fawran",
        name: "Fawran",
        logo: "iconfawran.png",
      },

      {
        id: "paybill",
        name: "Pay bill",
        logo: "paycardbill.png",
      },
    ];

    this.otherActions = [
      {
        id: "paycard",
        name: "Paycard",
        logo: "paycardblue.png",
      },

      {
        id: "fawran_other",
        name: "Fawran",
        logo: "paycardblue.png",
      },

      {
        id: "cards",
        name: "Cards",
        logo: "paycardblue.png",
      },
    ];
  },

  bindMenuEvents: function () {
    var self = this;

    this.favouriteSlots[0].addRemove.onTouchEnd = function () {
      self.removeFavourite(0);
    };

    this.favouriteSlots[1].addRemove.onTouchEnd = function () {
      self.removeFavourite(1);
    };

    this.favouriteSlots[2].addRemove.onTouchEnd = function () {
      self.removeFavourite(2);
    };

    this.otherActionSlots[0].addRemove.onTouchEnd = function () {
      self.addFavourite(0);
    };

    this.otherActionSlots[1].addRemove.onTouchEnd = function () {
      self.addFavourite(1);
    };

    this.otherActionSlots[2].addRemove.onTouchEnd = function () {
      self.addFavourite(2);
    };
  },

  addFavourite: function (index) {
    kony.print("ADD FAVOURITE: " + index);

    if (index < 0 || index >= this.otherActions.length) {
      return;
    }

    if (this.favourites.length >= 3) {
      kony.print("Already 3 favourites");
      return;
    }

    var menu = this.otherActions[index];

    // Remove from Other Actions
    this.otherActions.splice(index, 1);

    // Add to Favourites
    this.favourites.push(menu);

    this.renderMenus();

    this.animateMenuChange();
  },

  // =========================================================
  // REMOVE FAVOURITE
  // =========================================================

  removeFavourite: function (index) {
    kony.print("REMOVE FAVOURITE: " + index);

    if (index < 0 || index >= this.favourites.length) {
      return;
    }

    if (this.otherActions.length >= 3) {
      kony.print("Other Actions already has 3 items");
      return;
    }

    var menu = this.favourites[index];

    // Remove from Favourites
    this.favourites.splice(index, 1);

    // Add to Other Actions
    this.otherActions.push(menu);

    this.renderMenus();

    this.animateMenuChange();
  },

  renderMenus: function () {
    this.renderFavourites();
    this.renderOtherActions();

    // Rebind because the slot contents changed
    this.bindMenuEvents();
  },

  renderFavourites: function () {
    for (var i = 0; i < 3; i++) {
      var slot = this.favouriteSlots[i];
      var menu = this.favourites[i];

      if (menu) {
        slot.container.isVisible = true;

        slot.icon.isVisible = true;

        slot.icon.skin = "sknRounded16pxBg2A59BD";

        slot.addRemove.isVisible = true;

        slot.label.text = menu.name;

        if (menu.logo) {
          slot.logo.src = menu.logo;
        }
      } else {
        slot.container.isVisible = true;

        slot.icon.isVisible = true;

        slot.icon.skin = "sknFlxRound16PxBgE4E2EDBorderE4E2ED";

        slot.addRemove.isVisible = false;

        slot.label.text = "";

        slot.logo.isVisible = false;
      }
    }
  },

  renderOtherActions: function () {
    for (var i = 0; i < 3; i++) {
      var slot = this.otherActionSlots[i];
      var menu = this.otherActions[i];

      if (menu) {
        slot.container.isVisible = true;

        slot.icon.isVisible = true;

        slot.icon.skin = "sknMenuBgWhiteBorderc7c2d9";

        slot.addRemove.isVisible = true;

        slot.label.text = menu.name;

        if (menu.logo) {
          slot.logo.src = menu.logo;
        }
      } else {
        slot.container.isVisible = false;
      }
    }
  },

  animateMenuChange: function () {
    try {
      var favContainer = this.view.flxMenuOptions;

      var otherContainer = this.view.flxSelectMenu;

      var transform = kony.ui.makeAffineTransform();

      transform.scale(0.96, 0.96);

      favContainer.animate(
        kony.ui.createAnimation({
          100: {
            transform: transform,
            stepConfig: {
              timingFunction: kony.anim.EASE_IN_OUT,
            },
          },
        }),
        {
          duration: 0.15,
          iterationCount: 1,
          delay: 0,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },
        {
          animationEnd: function () {
            favContainer.animate(
              kony.ui.createAnimation({
                100: {
                  transform: kony.ui.makeAffineTransform(),
                },
              }),
              {
                duration: 0.15,
                iterationCount: 1,
                delay: 0,
                fillMode: kony.anim.FILL_MODE_FORWARDS,
              },
              {},
            );
          },
        },
      );
    } catch (e) {
      kony.print("Menu animation error: " + e.message);
    }
  },

  onDeviceBack: function () {
    var prevForm = kony.application.getPreviousForm();

    new kony.mvc.Navigation(prevForm).navigate();
  },
});
