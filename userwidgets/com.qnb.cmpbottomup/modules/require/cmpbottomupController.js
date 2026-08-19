define(function () {

    return {

        /*
         * =====================================================
         * STATE
         * =====================================================
         */

        isOpen: false,

        enableCallback: null,


        /*
         * =====================================================
         * POST RENDER
         * =====================================================
         */

        postRender: function () {

            kony.print(
                "BOTTOM SHEET :: POST RENDER"
            );

            this.bindEvents();

            /*
             * Default state:
             *
             * height = 0%
             * bottom = 0%
             * hidden
             */

            if (this.view.flxBottomSheet) {

                this.view.flxBottomSheet.height =
                    "0%";

                this.view.flxBottomSheet.bottom =
                    "0%";
            }

            this.view.isVisible = false;

            this.isOpen = false;

            kony.print(
                "BOTTOM SHEET :: READY"
            );
        },


        /*
         * =====================================================
         * BIND EVENTS
         * =====================================================
         */

        bindEvents: function () {

            kony.print(
                "BOTTOM SHEET :: BIND EVENTS"
            );


            /*
             * CLOSE ICON
             */

            if (this.view.flxClose) {

                this.view.flxClose.onTouchEnd =
                    this.hide.bind(this);
            }


            /*
             * CANCEL
             */

            if (this.view.lblCancel) {

                this.view.lblCancel.onTouchEnd =
                    this.onCancel.bind(this);
            }


            /*
             * ENABLE AUTO PAY
             */

            if (this.view.btnEnableAutoPay) {

                this.view.btnEnableAutoPay.onClick =
                    this.onEnableAutoPay.bind(this);
            }
        },


        /*
         * =====================================================
         * SHOW
         * =====================================================
         *
         * Parent calls:
         *
         * this.view.cmpbottomup.show(callback);
         *
         */

        show: function (callback) {

            kony.print(
                "========================================"
            );

            kony.print(
                "BOTTOM SHEET :: SHOW"
            );


            /*
             * Save callback.
             */

            this.enableCallback =
                callback || null;


            this.isOpen = true;


            /*
             * Make component visible.
             */

            this.view.isVisible = true;


            /*
             * Start from default position.
             *
             * height = 0%
             * bottom = 0%
             */

            this.view.flxBottomSheet.height =
                "0%";

            this.view.flxBottomSheet.bottom =
                "0%";


            /*
             * Animate to:
             *
             * height = 40%
             * bottom = -2%
             */

            var animation =
                kony.ui.createAnimation({

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


        /*
         * =====================================================
         * HIDE
         * =====================================================
         */

        hide: function () {

            if (!this.view.flxBottomSheet) {

                return;
            }


            /*
             * If already closed, simply hide.
             */

            if (!this.isOpen) {

                this.view.isVisible =
                    false;

                return;
            }


            kony.print(
                "BOTTOM SHEET :: HIDE"
            );


            this.isOpen = false;


            /*
             * Animate:
             *
             * 40% -> 0%
             * -2% -> 0%
             */

            var animation =
                kony.ui.createAnimation({

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

                        /*
                         * Keep default position.
                         */

                        this.view.flxBottomSheet.height =
                            "0%";

                        this.view.flxBottomSheet.bottom =
                            "0%";


                        /*
                         * Hide component.
                         */

                        this.view.isVisible =
                            false;

                    }.bind(this)
                }
            );
        },


        /*
         * =====================================================
         * CANCEL
         * =====================================================
         */

        onCancel: function () {

            kony.print(
                "BOTTOM SHEET :: CANCEL"
            );


            /*
             * IMPORTANT:
             *
             * We DO NOT call enableCallback.
             *
             * Therefore the bill switch remains OFF.
             */

            this.enableCallback =
                null;


            this.hide();
        },


        /*
         * =====================================================
         * ENABLE AUTO PAY
         * =====================================================
         */

        onEnableAutoPay: function () {

            kony.print(
                "########################################"
            );

            kony.print(
                "BOTTOM SHEET :: ENABLE AUTO PAY"
            );


            /*
             * Store callback locally.
             *
             * This is important because hide()
             * does not destroy the callback before
             * we execute it.
             */

            var callback =
                this.enableCallback;


            /*
             * Clear callback.
             */

            this.enableCallback =
                null;


            /*
             * Close the sheet.
             */

            this.hide();


            /*
             * NOW tell parent:
             *
             * "User actually enabled AutoPay."
             */

            if (
                typeof callback ===
                "function"
            ) {

                callback();
            }


            kony.print(
                "BOTTOM SHEET :: AUTO PAY ENABLED"
            );

            kony.print(
                "########################################"
            );
        },


        /*
         * =====================================================
         * DESCRIPTION
         * =====================================================
         */

        setDescription: function (
            desc1,
            desc2
        ) {

            if (this.view.lblDesc1) {

                this.view.lblDesc1.text =
                    desc1 || "";
            }


            if (this.view.lblDesc2) {

                this.view.lblDesc2.text =
                    desc2 || "";
            }
        }

    };

});