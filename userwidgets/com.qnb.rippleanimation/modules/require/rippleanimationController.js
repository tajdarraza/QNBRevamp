define(function () {
  return {
    currentType: "success",

    init: function () {
      this.reset();
    },

    /*
     * ============================================================
     * SHOW
     * ============================================================
     *
     * Usage:
     *
     * this.view.notification.show({
     *     type: "success"
     * });
     *
     * type:
     * success
     * info
     * warning
     */
    show: function (config) {
      config = config || {};

      var type = config.type || "success";

      kony.print("NOTIFICATION :: show | type = " + type);

      this.currentType = type;

      this.applySkin(type);

      /*
       * Only label used by this component
       */
      if (this.view.lblPaymentSuccessful) {
        if (config.text) {
          this.view.lblPaymentSuccessful.text = config.text;
        } else {
          if (type === "success") {
            this.view.lblPaymentSuccessful.text = "Payment successful";
          } else if (type === "info") {
            this.view.lblPaymentSuccessful.text = "Information";
          } else if (type === "warning") {
            this.view.lblPaymentSuccessful.text = "Warning";
          }
        }
      }

      this.reset();

      this.playAnimation(type);
    },

    hide: function () {
      kony.print("NOTIFICATION :: hide");

      this.reset();

      if (this.view.flxSuccess) {
        this.view.flxSuccess.opacity = 0;
      }
    },

    reset: function () {
      if (this.view.flxSuccess) {
        this.view.flxSuccess.opacity = 1;
      }

      if (this.view.flxRipple) {
        this.view.flxRipple.opacity = 0;

        var rippleTransform = kony.ui.makeAffineTransform();

        rippleTransform.scale(0.2, 0.2);

        this.view.flxRipple.transform = rippleTransform;
      }

      /*
       * Circle
       */
      if (this.view.flxCircle) {
        var circleTransform = kony.ui.makeAffineTransform();

        circleTransform.scale(0.2, 0.2);

        this.view.flxCircle.transform = circleTransform;
      }

      /*
       * White circle
       */
      if (this.view.flxWhite) {
        var whiteTransform = kony.ui.makeAffineTransform();

        whiteTransform.scale(0.2, 0.2);

        this.view.flxWhite.transform = whiteTransform;
      }

      /*
       * Image
       */
      if (this.view.imgPaymentTick) {
        this.view.imgPaymentTick.opacity = 0;

        var imageTransform = kony.ui.makeAffineTransform();

        imageTransform.scale(0.2, 0.2);

        this.view.imgPaymentTick.transform = imageTransform;
      }

      /*
       * Cancel previously scheduled animations
       */
      try {
        kony.timer.cancel("notificationWhiteCircle");
      } catch (e) {}

      try {
        kony.timer.cancel("notificationImageAnim");
      } catch (e) {}
    },

    applySkin: function (type) {
      kony.print("NOTIFICATION :: applySkin = " + type);

      if (type === "success") {
        this.view.imgPaymentTick.src = "paymenttick.png";

        this.view.flxRipple.skin = "sknFlxRadius100Clr28611eOpa20Border28611e";

        this.view.flxCircle.skin = "sknFlxRadius100Clr28611eOpa40Border28611e";

        this.view.flxWhite.skin = "sknFlxClreef4ec";

        return;
      }

      if (type === "info") {
        this.view.imgPaymentTick.src = "imgexclamationbrown.png";

        this.view.flxWhite.skin = "sknFlxClrFDF1CB";

        this.view.flxCircle.skin = "sknFlxRadius100Clraf8611Opa40Borderaf8611";

        this.view.flxRipple.skin =
          "sknFlxRadius100Clr43330C33Opa20Border43330C33";

        return;
      }

      if (type === "failure") {
        this.view.imgPaymentTick.src = "imgexclamationwarning.png";

        this.view.flxWhite.skin = "sknFlxClrFCF2F3";

        this.view.flxCircle.skin = "sknFlxRadius100Clrade2b37Opa40Borderde2b37";

        this.view.flxRipple.skin =
          "sknFlxRadius100Clr8C1B2333Opa20Border8C1B2333";

        return;
      }

      kony.print("NOTIFICATION :: Unknown type = " + type + " | using success");

      this.applySkin("success");
    },

    playAnimation: function (type) {
      kony.print("NOTIFICATION :: playAnimation = " + type);

      var self = this;

      var rippleStart = kony.ui.makeAffineTransform();

      rippleStart.scale(0.2, 0.2);

      var rippleBig = kony.ui.makeAffineTransform();

      rippleBig.scale(1.45, 1.45);

      var rippleSmall = kony.ui.makeAffineTransform();

      rippleSmall.scale(0.96, 0.96);

      var rippleNormal = kony.ui.makeAffineTransform();

      rippleNormal.scale(1, 1);

      self.view.flxRipple.opacity = 1;

      self.view.flxRipple.transform = rippleStart;

      self.view.flxRipple.animate(
        kony.ui.createAnimation({
          60: {
            transform: rippleBig,
            opacity: 0.45,
          },

          85: {
            transform: rippleSmall,
            opacity: 1,
          },

          100: {
            transform: rippleNormal,
            opacity: 1,
          },
        }),

        {
          duration: 0.9,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },

        {},
      );

      var circleBig = kony.ui.makeAffineTransform();

      circleBig.scale(1.15, 1.15);

      var circleNormal = kony.ui.makeAffineTransform();

      circleNormal.scale(1, 1);

      self.view.flxCircle.animate(
        kony.ui.createAnimation({
          50: {
            transform: circleBig,
          },

          100: {
            transform: circleNormal,
          },
        }),

        {
          duration: 0.45,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },

        {},
      );

      kony.timer.schedule(
        "notificationWhiteCircle",
        function () {
          self.view.flxWhite.animate(
            kony.ui.createAnimation({
              100: {
                transform: circleNormal,
              },
            }),

            {
              duration: 0.25,
              fillMode: kony.anim.FILL_MODE_FORWARDS,
            },

            {},
          );
        },
        0.15,
        false,
      );

      kony.timer.schedule(
        "notificationImageAnim",
        function () {
          var imageBig = kony.ui.makeAffineTransform();

          imageBig.scale(1.25, 1.25);
          imageBig.rotate(-15);

          var imageNormal = kony.ui.makeAffineTransform();

          imageNormal.scale(1, 1);

          self.view.imgPaymentTick.opacity = 1;

          self.view.imgPaymentTick.animate(
            kony.ui.createAnimation({
              60: {
                transform: imageBig,
                opacity: 1,
              },

              100: {
                transform: imageNormal,
                opacity: 1,
              },
            }),

            {
              duration: 0.35,
              fillMode: kony.anim.FILL_MODE_FORWARDS,
            },

            {},
          );
        },
        0.35,
        false,
      );
    },
  };
});
