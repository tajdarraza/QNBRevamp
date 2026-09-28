define(function () {

    return {

        isOpen: false,

        enableCallback: null,
        cancelCallback: null,

        config: null,
        billData: null,


        postRender: function () {

            this.isOpen = false;

            this.enableCallback = null;
            this.cancelCallback = null;

            this.config = null;
            this.billData = null;

            this.bindEvents();

            if (this.view.lblDesc3) {
                this.view.lblDesc3.isVisible = false;
            }

            if (this.view.flxBillDetailsEdit) {
                this.view.flxBillDetailsEdit.isVisible = false;
            }

            if (this.view.flxEnterAmount) {
                this.view.flxEnterAmount.isVisible = false;
            }

            if (this.view.flxTxtAmtRewards) {
                this.view.flxTxtAmtRewards.isVisible = false;
            }

            if (this.view.lblCurrencyRewarrds) {
                this.view.lblCurrencyRewarrds.isVisible = false;
            }

            if (this.view.flxLoyaltyPoint) {
                this.view.flxLoyaltyPoint.isVisible = false;
            }

            if (this.view.lblCancel) {
                this.view.lblCancel.isVisible = true;
            }

            this.view.isVisible = false;
        },


        bindEvents: function () {

            if (this.view.flxClose) {
                this.view.flxClose.onTouchEnd =
                    this.onClose.bind(this);
            }

            if (this.view.lblCancel) {
                this.view.lblCancel.onTouchEnd =
                    this.onCancel.bind(this);
            }

            if (this.view.btnSheetEnable) {
                this.view.btnSheetEnable.onClick =
                    this.onSheetAction.bind(this);
            }
        },


        /*
         * MODULAR SHOW API
         *
         * config:
         *
         * description
         * description1
         * description2
         * description3
         * buttonText
         * cancelText
         *
         * showCancel
         * showClose
         * showContent
         * showButtonAction
         *
         * showBillDetails
         * showEnterAmount
         * showRewardsAmount
         * showRewardsCurrency
         * showLoyaltyPoints
         *
         * data
         *
         * onConfirm
         * onCancel
         */
        show: function (config) {

            config = config || {};

            kony.print(
                "BOTTOM SHEET :: SHOW"
            );


            /*
             * Store configuration
             */

            this.config = config;

            this.enableCallback =
                typeof config.onConfirm === "function"
                    ? config.onConfirm
                    : null;

            this.cancelCallback =
                typeof config.onCancel === "function"
                    ? config.onCancel
                    : null;

            this.billData =
                config.data || null;


            /*
             * Configure content
             */

            this.configureContent(config);


            /*
             * IMPORTANT
             *
             * Re-bind events here exactly like
             * the old working controller.
             */

            this.bindEvents();


            /*
             * Show bottom sheet
             */

            this.isOpen = true;

            this.view.isVisible = true;

            this.view.flxBottomSheet.bottom =
                "-100%";


            var animation =
                kony.ui.createAnimation({

                    0: {
                        bottom: "-100%",

                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_OUT
                        }
                    },

                    100: {
                        bottom: "-16dp",

                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_OUT
                        }
                    }
                });


            this.view.flxBottomSheet.animate(
                animation,
                {
                    duration: 0.35,

                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {

                        this.view.flxBottomSheet.bottom =
                            "-16dp";

                    }.bind(this)
                }
            );
        },


        configureContent: function (config) {

            if (this.view.lblDesc1) {
                this.view.lblDesc1.text = "";
                this.view.lblDesc1.isVisible = false;
            }

            if (this.view.lblDesc2) {
                this.view.lblDesc2.text = "";
                this.view.lblDesc2.isVisible = false;
            }

            if (this.view.lblDesc3) {
                this.view.lblDesc3.text = "";
                this.view.lblDesc3.isVisible = false;
            }

            /*
             * Reset only dynamic sections.
             */

            if (this.view.lblDesc3) {
                this.view.lblDesc3.isVisible = false;
            }

            if (this.view.flxBillDetailsEdit) {
                this.view.flxBillDetailsEdit.isVisible = false;
            }

            if (this.view.flxEnterAmount) {
                this.view.flxEnterAmount.isVisible = false;
            }

            if (this.view.flxTxtAmtRewards) {
                this.view.flxTxtAmtRewards.isVisible = false;
            }

            if (this.view.lblCurrencyRewarrds) {
                this.view.lblCurrencyRewarrds.isVisible = false;
            }

            if (this.view.flxLoyaltyPoint) {
                this.view.flxLoyaltyPoint.isVisible = false;
            }


            /*
             * Default cancel state
             */

            if (this.view.lblCancel) {
                this.view.lblCancel.isVisible = true;
                this.view.lblCancel.text = "Cancel";
            }


            /*
             * Default button position
             */

            if (this.view.btnSheetEnable) {
    if (config.showCancel === false) {
        this.view.btnSheetEnable.bottom = "24dp";
    } else {
        this.view.btnSheetEnable.bottom = "0dp";
    }
}


            /*
             * IMPORTANT:
             *
             * Keep the SAME mapping as the old
             * working component.
             *
             * description  -> lblDesc1
             * description1 -> lblDesc2
             * description2 -> lblDesc3
             */

            if (
                config.description !== undefined &&
                this.view.lblDesc1
            ) {

                this.view.lblDesc1.text =
                    config.description;

                this.view.lblDesc1.isVisible = true;
            }


            if (
                config.description1 !== undefined &&
                this.view.lblDesc2
            ) {

                this.view.lblDesc2.text =
                    config.description1;

                this.view.lblDesc2.isVisible = true;
            }


            if (
                config.description2 !== undefined &&
                this.view.lblDesc3
            ) {

                this.view.lblDesc3.text =
                    config.description2;

                this.view.lblDesc3.isVisible = true;
            }


            /*
             * Button text
             */

            if (
                config.buttonText !== undefined &&
                this.view.btnSheetEnable
            ) {

                this.view.btnSheetEnable.text =
                    config.buttonText;
            }


            /*
             * Cancel text
             */

            if (
                config.cancelText !== undefined &&
                this.view.lblCancel
            ) {

                this.view.lblCancel.text =
                    config.cancelText;
            }


            /*
             * Cancel visibility
             */

            if (
                config.showCancel !== undefined &&
                this.view.lblCancel
            ) {

                this.view.lblCancel.isVisible =
                    config.showCancel;
            }


            /*
             * Content visibility
             */

            if (
                config.showContent !== undefined &&
                this.view.flxContent
            ) {

                this.view.flxContent.isVisible =
                    config.showContent;
            }


            /*
             * Button section
             */

            if (
                config.showButtonAction !== undefined &&
                this.view.flxButtonAction
            ) {

                this.view.flxButtonAction.isVisible =
                    config.showButtonAction;
            }


            /*
             * Close button
             */

            if (
                config.showClose !== undefined &&
                this.view.flxClose
            ) {

                this.view.flxClose.isVisible =
                    config.showClose;
            }


            /*
             * Bill details
             */

            if (
                config.showBillDetails !== undefined &&
                this.view.flxBillDetailsEdit
            ) {

                this.view.flxBillDetailsEdit.isVisible =
                    config.showBillDetails;

                if (config.showBillDetails) {
                    this.setBillDetails(config.data);
                }
            }


            /*
             * Edit amount
             */

            if (
                config.showEnterAmount !== undefined &&
                this.view.flxEnterAmount
            ) {

                this.view.flxEnterAmount.isVisible =
                    config.showEnterAmount;

                /*
                 * Only populate edit amount when
                 * data is supplied.
                 */

                if (
                    config.showEnterAmount &&
                    config.data &&
                    config.isEditAmount === true
                ) {
                    this.setEditAmount(config.data);
                }
            }


            /*
             * Rewards amount
             */

            if (
                config.showRewardsAmount !== undefined &&
                this.view.flxTxtAmtRewards
            ) {

                this.view.flxTxtAmtRewards.isVisible =
                    config.showRewardsAmount;
            }


            /*
             * Rewards currency
             */

            if (
                config.showRewardsCurrency !== undefined &&
                this.view.lblCurrencyRewarrds
            ) {

                this.view.lblCurrencyRewarrds.isVisible =
                    config.showRewardsCurrency;
            }


            /*
             * Loyalty points
             */

            if (
                config.showLoyaltyPoints !== undefined &&
                this.view.flxLoyaltyPoint
            ) {

                this.view.flxLoyaltyPoint.isVisible =
                    config.showLoyaltyPoints;

                if (
                    config.showLoyaltyPoints &&
                    config.data
                ) {
                    this.setLoyaltyPoints(config.data);
                }
            }


            /*
             * Pay with points
             */

            if (config.showPayWithPoints === true) {

                if (this.view.flxEnterAmount) {
                    this.view.flxEnterAmount.isVisible =
                        true;
                }

                if (this.view.lblEnterAmount) {
                    this.view.lblEnterAmount.text =
                        "Points";
                }

                if (this.view.lblCurrencyRewarrds) {
                    this.view.lblCurrencyRewarrds.isVisible =
                        true;
                }

                if (this.view.flxTxtAmtRewards) {
                    this.view.flxTxtAmtRewards.isVisible =
                        true;
                }

                this.setPayWithPoints(config.data);
            }


            /*
             * Loyalty layout
             */

            if (config.showLoyaltyPoints === true) {

                if (this.view.btnSheetEnable) {
                    this.view.btnSheetEnable.bottom =
                        "32dp";
                }

                if (this.view.lblCancel) {
                    this.view.lblCancel.isVisible =
                        false;
                }
            }


            this.view.forceLayout();
        },


        setBillDetails: function (data) {

            if (!data) {
                return;
            }

            if (this.view.lblBillThumbnail) {
                this.view.lblBillThumbnail.text =
                    data.billLogo || "";
            }

            if (this.view.lblBillName) {
                this.view.lblBillName.text =
                    data.billHeader || "";
            }

            if (this.view.lblBillDescValue) {
                this.view.lblBillDescValue.text =
                    data.billDetails || "";
            }

            if (this.view.lblDueOnDate) {
                this.view.lblDueOnDate.text =
                    data.endDate || "";
            }

            if (this.view.lblAutoPayVal) {
                this.view.lblAutoPayVal.text =
                    data.switchOn ? "On" : "Off";
            }

            if (this.view.lblBillAmtValue) {
                this.view.lblBillAmtValue.text =
                    data.billAmount || "";
            }

            if (this.view.lblBillCurrency) {
                this.view.lblBillCurrency.text =
                    data.billCurr || "";
            }
        },


        setEditAmount: function (data) {

            var amount =
                data && data.billAmount
                    ? data.billAmount
                    : "";

            var currency =
                data && data.billCurr
                    ? data.billCurr
                    : "QAR";


            if (this.view.lblEnterAmount) {
                this.view.lblEnterAmount.text =
                    "Enter amount";
            }

            if (this.view.txtAmount) {
                this.view.txtAmount.text =
                    amount;
            }

            if (this.view.lblTotalAmt) {
                this.view.lblTotalAmt.text =
                    "Total amount: " +
                    amount +
                    " " +
                    currency;
            }
        },


        setLoyaltyPoints: function (data) {

            if (!data) {
                return;
            }

            if (this.view.lblLoyaltyPoints) {
                this.view.lblLoyaltyPoints.text =
                    data.points || "500 points";
            }

            if (this.view.lblLoyaltyPointVal) {
                this.view.lblLoyaltyPointVal.text =
                    data.value || "125 QAR";
            }
        },


        setPayWithPoints: function (data) {

            var points =
                data && data.points
                    ? data.points
                    : "";

            var numericPoints =
                parseFloat(
                    String(points)
                        .replace(/[^0-9.]/g, "")
                );

            var convertedValue = "";


            if (this.view.txtAmount) {
                this.view.txtAmount.text = "";
            }


            if (!isNaN(numericPoints)) {

                convertedValue =
                    (numericPoints * 2) +
                    " QAR";

                if (this.view.lblTotalAmt) {
                    this.view.lblTotalAmt.text =
                        "Available points : " +
                        numericPoints;
                }

            } else if (this.view.lblTotalAmt) {

                this.view.lblTotalAmt.text =
                    "Available points : " +
                    points;
            }


            if (this.view.lblCurrencyRewarrds) {
                this.view.lblCurrencyRewarrds.text =
                    "QAR";
            }


            if (this.view.lblConvertedValue) {
                this.view.lblConvertedValue.text =
                    convertedValue;
            }
        },


        hide: function (callback) {

            if (!this.view.flxBottomSheet) {

                this.view.isVisible = false;

                if (typeof callback === "function") {
                    callback();
                }

                return;
            }


            this.isOpen = false;


            var animation =
                kony.ui.createAnimation({

                    0: {
                        bottom: "-16dp",

                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_IN
                        }
                    },

                    100: {
                        bottom: "-100%",

                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_IN
                        }
                    }
                });


            this.view.flxBottomSheet.animate(
                animation,
                {
                    duration: 0.28,

                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {

                        this.view.flxBottomSheet.bottom =
                            "-100%";

                        this.view.isVisible =
                            false;

                        if (typeof callback === "function") {
                            callback();
                        }

                    }.bind(this)
                }
            );
        },


        onSheetAction: function () {

            kony.print(
                "BOTTOM SHEET :: ACTION CLICKED"
            );


            var callback =
                this.enableCallback;

            var config =
                this.config;

            var amount =
                this.view.txtAmount
                    ? this.view.txtAmount.text
                    : "";


            /*
             * Clear stored callbacks AFTER
             * taking local references.
             */

            this.enableCallback = null;
            this.cancelCallback = null;
            this.config = null;
            this.billData = null;


            this.hide(function () {

                if (typeof callback === "function") {

                    /*
                     * New modular API:
                     *
                     * callback(config)
                     *
                     * Existing amount is also added
                     * to the config result.
                     */

                    config = config || {};

                    config.amount =
                        amount;

                    callback(config);
                }

            });
        },


        onCancel: function () {

            kony.print(
                "BOTTOM SHEET :: CANCEL CLICKED"
            );


            var callback =
                this.cancelCallback;

            var config =
                this.config;


            this.enableCallback = null;
            this.cancelCallback = null;
            this.config = null;
            this.billData = null;


            this.hide(function () {

                if (typeof callback === "function") {
                    callback(config);
                }

            });
        },


        onClose: function () {

            kony.print(
                "BOTTOM SHEET :: CLOSE CLICKED"
            );


            /*
             * Close simply closes the sheet.
             *
             * It does not execute Confirm
             * or Cancel callbacks.
             */

            this.enableCallback = null;
            this.cancelCallback = null;
            this.config = null;
            this.billData = null;


            this.hide();
        }
    };
});