define({
  data: {},
  otpLength: 7,

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;
    this.view.onDeviceBack = this.onDeviceBack;
    this.view.onHide = this.onHide;

    if (navData) {
      this.data = navData;
    }

    var self = this;

    this.view.commonheader.configure({
      title: this.data.otpTitle || "Confirmation",

      action1: function () {
        alert("not yet developed");
      },

      action2: function () {
        alert("not yet developed");
      },

      backAction: function () {
        self.onDeviceBack();
      },
    });
  },

  init: function () {
    var self = this;

    /*
     * Listen for manual OTP entry
     */
    this.view.txtOTP.onTextChange = function () {
      self.onOTPChange();
    };

    /*
     * Allow user to tap anywhere on OTP box
     */
    this.view.flxOTPBox.onTouchEnd = function () {
      self.focusOTP();
    };

    this.clearOTP();
  },

  preShow: function () {
    this.clearOTP();

    this.view.lblTextConfirmation.text =
      "You can ask for a new confirmation code in ";

    this.view.lblTimeUpdate.isVisible = true;
    this.view.lblResendCode.isVisible = false;

    this.view.btnVerifyOTP.onClick = this.onOTPContinue.bind(this);

    this.focusOTP();
  },

  postShow: function () {
    this.startTimer();

    /*
     * MOCK SMS OTP
     */
    var self = this;

    kony.timer.schedule(
      "mockSmsOtp",
      function () {
        var smsOTP = "1234567";

        self.setOTP(smsOTP);

        kony.timer.cancel("mockSmsOtp");
      },
      3,
      false,
    );
  },

  onOTPContinue: function () {
    if (!this.isOTPComplete()) {
      alert("Please enter the complete OTP.");
      return;
    }

    var successForm = this.data && this.data.otpSuccessForm;

    if (!successForm) {
      alert("OTP verified successfully.");
      return;
    }

    kony.print("OTP COMMON :: SUCCESS :: " + successForm);

    new kony.mvc.Navigation(successForm).navigate(this.data);
  },

  onDeviceBack: function () {
    var previousForm = this.data && this.data.otpBackForm;

    if (!previousForm) {
      var previous = kony.application.getPreviousForm();

      if (previous) {
        previousForm = previous.id;
      }
    }

    if (!previousForm) {
      kony.print("OTP COMMON :: PREVIOUS FORM NOT FOUND");
      return;
    }

    new kony.mvc.Navigation(previousForm).navigate(this.data);
  },

  onHide: function () {
    try {
      kony.timer.cancel("countdownTimer");
    } catch (e) {}

    try {
      kony.timer.cancel("mockSmsOtp");
    } catch (e) {}
  },

  onOTPChange: function () {
    var otp = this.view.txtOTP.text || "";

    otp = otp.replace(/[^0-9]/g, "");

    if (otp.length > this.otpLength) {
      otp = otp.substring(0, this.otpLength);
    }

    if (this.view.txtOTP.text !== otp) {
      this.view.txtOTP.text = otp;
    }

    this.updateOTPUI();
  },

  updateOTPUI: function () {
    var otp = this.view.txtOTP.text || "";

    var labels = [
      this.view.lblOTP1,
      this.view.lblOTP2,
      this.view.lblOTP3,
      this.view.lblOTP4,
      this.view.lblOTP5,
      this.view.lblOTP6,
      this.view.lblOTP7,
    ];

    for (var i = 0; i < labels.length; i++) {
      if (i < otp.length) {
        labels[i].text = otp.charAt(i);

        labels[i].skin = "sknLblAmount85PxBold1b124b";
      } else {
        labels[i].text = "•";

        labels[i].skin = "sknLblDot100PxFontClr887eae";
      }
    }
  },

  setOTP: function (otp) {
    otp = String(otp || "");

    otp = otp.replace(/[^0-9]/g, "");

    if (otp.length > this.otpLength) {
      otp = otp.substring(0, this.otpLength);
    }

    this.view.txtOTP.text = otp;

    this.updateOTPUI();
  },

  getOTP: function () {
    return this.view.txtOTP.text || "";
  },

  clearOTP: function () {
    this.view.txtOTP.text = "";

    this.updateOTPUI();
  },

  focusOTP: function () {
    try {
      this.view.txtOTP.setFocus(true);
    } catch (e) {}
  },

  isOTPComplete: function () {
    return this.getOTP().length === this.otpLength;
  },

  startTimer: function () {
    var self = this;
    var remainingSeconds = 30;

    try {
      kony.timer.cancel("countdownTimer");
    } catch (e) {}

    self.view.lblTimeUpdate.text = "00:30";

    kony.timer.schedule(
      "countdownTimer",
      function () {
        remainingSeconds--;

        var minutes = Math.floor(remainingSeconds / 60);

        var seconds = remainingSeconds % 60;

        self.view.lblTimeUpdate.text =
          (minutes < 10 ? "0" : "") +
          minutes +
          ":" +
          (seconds < 10 ? "0" : "") +
          seconds;

        if (remainingSeconds <= 0) {
          kony.timer.cancel("countdownTimer");

          self.view.lblTimeUpdate.text = "00:00";

          self.view.lblTextConfirmation.text = "Didn’t receive the code? ";

          self.view.lblTimeUpdate.isVisible = false;

          self.view.lblResendCode.isVisible = true;
        }
      },
      1,
      true,
    );
  },
});
