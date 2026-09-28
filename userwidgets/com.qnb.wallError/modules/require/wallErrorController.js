define(function () {
  return {
    init: function () {
      this.view.postShow = this.postShow;
    },

    postShow: function () {
      this.reset();
    },

    setError: function (config) {
      // No error -> hide component
      if (!config) {
        this.hide();
        return;
      }

      // Image
      if (config.image !== undefined) {
        this.view.imgErrorDesc.src = config.image;
      }

      // Main description
      if (config.description !== undefined) {
        this.view.lblErrorDesc.text = config.description;
      }

      // Optional second description
      // if (config.description2 !== undefined && this.view.lblErrorDesc2) {
      //     this.view.lblErrorDesc2.text = config.description2;
      // }

      // Background skin
      if (config.backgroundSkin !== undefined) {
        this.view.flxErrorBackground.skin = config.backgroundSkin;
      }

      // Foreground skin
      if (config.foregroundSkin !== undefined) {
        this.view.flxForeground.skin = config.foregroundSkin;
      }

      // Main description skin
      if (config.descriptionSkin !== undefined) {
        this.view.lblErrorDesc.skin = config.descriptionSkin;
      }

      // Second description skin
      // if (config.description2Skin !== undefined && this.view.lblErrorDesc2) {
      //     this.view.lblErrorDesc2.skin = config.description2Skin;
      // }

      // Show error component
      this.show();
    },

    show: function () {
      this.view.isVisible = true;
    },

    hide: function () {
      this.view.isVisible = false;
    },

    reset: function () {
      this.view.imgErrorDesc.src = "info_blue.png";

      this.view.lblErrorDesc.text =
        "Review your details. Please ensure all information is correct before proceeding.";

      this.view.flxErrorBackground.skin = "sknFlxOutlineC2D9FF";

      this.view.flxForeground.skin = "sknFlxBgE8F0FF";

      this.view.lblErrorDesc.skin = "sknLbl100PFont08217";

      // Default state = hidden
      this.hide();
    },
  };
});
