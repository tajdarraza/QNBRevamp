define(function () {

    return {

        isOpen: false,

        enableCallback: null,

        postRender: function () {

            kony.print("BOTTOM SHEET :: POST RENDER");

            this.bindEvents();

            if (this.view.flxBottomSheet) {

                this.view.flxBottomSheet.height =
                    "0%";

                this.view.flxBottomSheet.bottom =
                    "0%";
            }

            this.view.isVisible = false;

            this.isOpen = false;

            kony.print("BOTTOM SHEET :: READY");
        },

        bindEvents: function () {

            kony.print("BOTTOM SHEET :: BIND EVENTS");

            if (this.view.flxClose) {

                this.view.flxClose.onTouchEnd = this.hide.bind(this);
            }

            if (this.view.lblCancel) {

                this.view.lblCancel.onTouchEnd = this.onCancel.bind(this);
            }

            if (this.view.btnEnableAutoPay) {

                this.view.btnEnableAutoPay.onClick = this.onEnableAutoPay.bind(this);
            }
        },

        show: function (callback) {

            kony.print("BOTTOM SHEET :: SHOW");

            this.enableCallback = callback || null;
            this.isOpen = true;
            this.view.isVisible = true;

            this.view.flxBottomSheet.height = "0%";

            this.view.flxBottomSheet.bottom = "0%";

            var animation = kony.ui.createAnimation({
                0: {

                    height: "0%",

                    bottom: "0%",

                    stepConfig: {

                        timingFunction:
                            kony.anim.EASE_OUT
                    }
                },


                100: {

                    height: "40%",

                    bottom: "-2%",

                    stepConfig: {

                        timingFunction:
                            kony.anim.EASE_OUT
                    }
                }
            });


            this.view.flxBottomSheet.animate(
                animation,
                {
                    duration: 0.30,

                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {

                        kony.print(
                            "BOTTOM SHEET :: SHOW COMPLETE"
                        );
                    }
                }
            );
        },

        hide: function () {

            if (!this.view.flxBottomSheet) {

                return;
            }

            if (!this.isOpen) {

                this.view.isVisible =
                    false;

                return;
            }


            kony.print("BOTTOM SHEET :: HIDE");
            this.isOpen = false;

            var animation = kony.ui.createAnimation(
                {
                    0: {

                        height: "40%",

                        bottom: "-2%",

                        stepConfig: {

                            timingFunction:
                                kony.anim.EASE_IN
                        }
                    },


                    100: {

                        height: "0%",

                        bottom: "0%",

                        stepConfig: {

                            timingFunction:
                                kony.anim.EASE_IN
                        }
                    }
                });


            this.view.flxBottomSheet.animate(
                animation,
                {
                    duration: 0.25,

                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        this.view.flxBottomSheet.height = "0%";

                        this.view.flxBottomSheet.bottom = "0%";

                        this.view.isVisible = false;
                    }.bind(this)
                }
            );
        },

        onCancel: function () {

            kony.print("BOTTOM SHEET :: CANCEL");

            this.enableCallback = null;

            this.hide();
        },

        onEnableAutoPay: function () {

            kony.print("BOTTOM SHEET :: ENABLE AUTO PAY");

            var callback = this.enableCallback;
            this.enableCallback = null;
            this.hide();

            if (typeof callback === "function") {
                callback();
            }


            kony.print("BOTTOM SHEET :: AUTO PAY ENABLED");

        },

        setDescription: function (desc1, desc2) {

            if (this.view.lblDesc1) {

                this.view.lblDesc1.text = desc1 || "";
            }
            if (this.view.lblDesc2) {

                this.view.lblDesc2.text = desc2 || "";
            }
        }

    };

});