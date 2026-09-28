define({
  show: function (config) {
    config = config || {};

    kony.print("NOTIFICATION :: show called");
    kony.print("NOTIFICATION :: type = " + config.type);

    this.applySkin(config.type || "success");

    if (this.view.lblDesc1) {
      this.view.lblDesc1.text = config.desc1 || "";
    }

    if (this.view.lblDesc2) {
      this.view.lblDesc2.text = config.desc2 || "";
    }

    if (this.view.btnSheetEnable) {
      this.view.btnSheetEnable.text = config.buttonText || "Understood";
    }

    this.view.flxClose.onTouchEnd = config.onButtonClick;

    this.onButtonClick = config.onButtonClick || null;

    /*
     * Reset sheet position
     */
    this.view.flxBottomSheet.bottom = "-380dp";

    /*
     * IMPORTANT:
     * notification is the grey full-screen overlay.
     * Show it together with the bottom sheet.
     */
    this.view.isVisible = true;
    this.view.opacity = 1;

    this.view.flxBottomSheet.isVisible = true;
    this.view.flxBottomSheet.opacity = 1;

    this.resetAnimation();

    this.view.forceLayout();

    kony.print("NOTIFICATION :: Overlay shown");
    kony.print("NOTIFICATION :: Bottom sheet shown");

    var self = this;

    var animation = kony.ui.createAnimation({
      100: {
        bottom: "-16dp",
      },
    });

    this.view.flxBottomSheet.animate(
      animation,
      {
        duration: 0.4,
        fillMode: kony.anim.FILL_MODE_FORWARDS,
      },
      {
        animationEnd: function () {
          self.view.flxBottomSheet.bottom = "-16dp";
          self.view.forceLayout();

          kony.print("NOTIFICATION :: Bottom sheet animation completed");

          self.playNotificationAnimation(config.type || "success");
        },
      },
    );
  },

  hide: function () {
    kony.print("NOTIFICATION :: hide called");

    var self = this;

    var animation = kony.ui.createAnimation({
      100: {
        bottom: "-380dp",
      },
    });

    this.view.flxBottomSheet.animate(
      animation,
      {
        duration: 0.3,
        fillMode: kony.anim.FILL_MODE_FORWARDS,
      },
      {
        animationEnd: function () {
          self.view.flxBottomSheet.bottom = "-380dp";
          self.view.flxBottomSheet.isVisible = false;

          self.view.isVisible = false;
          self.view.opacity = 0;

          self.view.forceLayout();

          kony.print("NOTIFICATION :: Bottom sheet hidden");
          kony.print("NOTIFICATION :: Overlay hidden");
        },
      },
    );
  },

  resetAnimation: function () {
    if (this.view.flxRipple) {
      this.view.flxRipple.opacity = 0;
      this.view.flxRipple.transform = kony.ui.makeAffineTransform();
    }

    if (this.view.flxCircle) {
      this.view.flxCircle.transform = kony.ui.makeAffineTransform();
    }

    if (this.view.flxWhite) {
      this.view.flxWhite.transform = kony.ui.makeAffineTransform();
    }

    if (this.view.imgToAnimate) {
      this.view.imgToAnimate.opacity = 0;
      this.view.imgToAnimate.transform = kony.ui.makeAffineTransform();
    }

    if (this.view.btnSheetEnable) {
      this.view.btnSheetEnable.onClick = this.onButtonPressed.bind(this);
    }
  },

  onButtonPressed: function () {
    kony.print("NOTIFICATION :: Button pressed");

    if (this.onButtonClick) {
      this.onButtonClick();
    } else {
      this.hide();
    }
  },

  applySkin: function (type) {
    type = type || "success";

    kony.print("NOTIFICATION :: Applying skin = " + type);

    if (type === "warning") {
      this.view.imgToAnimate.src = "imgexclamationwarning.png";

      this.view.flxWhite.skin = "sknFlxClrFCF2F3";
      this.view.flxCircle.skin = "sknFlxRadius100Clrade2b37Opa40Borderde2b37";
      this.view.flxRipple.skin =
        "sknFlxRadius100Clr8C1B2333Opa20Border8C1B2333";
    } else if (type === "info") {
      this.view.imgToAnimate.src = "imgexclamationbrown.png";

      this.view.flxWhite.skin = "sknFlxClrFDF1CB";
      this.view.flxCircle.skin = "sknFlxRadius100Clraf8611Opa40Borderaf8611";
      this.view.flxRipple.skin =
        "sknFlxRadius100Clr43330C33Opa20Border43330C33";
    } else {
      this.view.imgToAnimate.src = "paymenttick.png";

      this.view.flxWhite.skin = "sknFlxClreef4ec";
      this.view.flxCircle.skin = "sknFlxRadius100Clr28611eOpa40Border28611e";
      this.view.flxRipple.skin = "sknFlxRadius100Clr28611eOpa20Border28611e";
    }
  },

  playNotificationAnimation: function (type) {
    kony.print("NOTIFICATION :: Playing " + type + " animation");

    var self = this;

    var rippleAnimation = kony.ui.createAnimation({
      0: {
        transform: kony.ui.makeAffineTransform(),
      },
      60: {
        transform: kony.ui.makeAffineTransform(),
      },
      85: {
        transform: kony.ui.makeAffineTransform(),
      },
      100: {
        transform: kony.ui.makeAffineTransform(),
      },
    });

    /*
     * Keep the notification visible even if the animation
     * itself has an issue.
     */
    if (this.view.flxRipple) {
      this.view.flxRipple.opacity = 1;
    }

    if (this.view.flxCircle) {
      this.view.flxCircle.opacity = 1;
    }

    if (this.view.flxWhite) {
      this.view.flxWhite.opacity = 1;
    }

    if (this.view.imgToAnimate) {
      this.view.imgToAnimate.opacity = 1;
    }

    this.view.forceLayout();

    kony.print("NOTIFICATION :: Content animation started");
  },
});
