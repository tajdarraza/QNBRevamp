define(function () {
    return {
        isOpen: false,
        enableCallback: null,
        cancelCallback: null,
        actionType: null,
        billData: null,

        postRender: function () {
            this.isOpen = false;
            this.enableCallback = null;
            this.cancelCallback = null;
            this.actionType = null;
            this.billData = null;
            this.bindEvents();

            if (this.view.lblDesc3) this.view.lblDesc3.isVisible = false;
            if (this.view.flxBillDetailsEdit) this.view.flxBillDetailsEdit.isVisible = false;
            if (this.view.flxEnterAmount) this.view.flxEnterAmount.isVisible = false;
            if (this.view.flxLoyaltyPoint) this.view.flxLoyaltyPoint.isVisible = false;
            if (this.view.lblCancel) this.view.lblCancel.isVisible = true;

            this.view.isVisible = false;
        },

        bindEvents: function () {
            if (this.view.flxClose) this.view.flxClose.onTouchEnd = this.onClose.bind(this);
            if (this.view.lblCancel) this.view.lblCancel.onTouchEnd = this.onCancel.bind(this);
            if (this.view.btnSheetEnable) this.view.btnSheetEnable.onClick = this.onSheetAction.bind(this);
        },

        show: function (callback, actionType, billData, cancelCallback) {
            kony.print("BOTTOM SHEET :: SHOW :: " + actionType);

            this.enableCallback = callback || null;
            this.cancelCallback = cancelCallback || null;
            this.actionType = actionType || "enable";
            this.billData = billData || null;

            this.configureContent();
            this.bindEvents();

            this.isOpen = true;
            this.view.isVisible = true;
            this.view.flxBottomSheet.bottom = "-100%";

            var animation = kony.ui.createAnimation({
                0: {
                    bottom: "-100%",
                    stepConfig: {
                        timingFunction: kony.anim.EASE_OUT
                    }
                },
                100: {
                    bottom: "-16dp",
                    stepConfig: {
                        timingFunction: kony.anim.EASE_OUT
                    }
                }
            });

            this.view.flxBottomSheet.animate(
                animation,
                {
                    duration: 0.35,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        this.view.flxBottomSheet.bottom = "-16dp";
                    }.bind(this)
                }
            );
        },

        configureContent: function () {
            if (this.view.lblDesc3) this.view.lblDesc3.isVisible = false;
            if (this.view.flxBillDetailsEdit) this.view.flxBillDetailsEdit.isVisible = false;
            if (this.view.flxEnterAmount) this.view.flxEnterAmount.isVisible = false;
            if (this.view.flxLoyaltyPoint) this.view.flxLoyaltyPoint.isVisible = false;
            if (this.view.lblCancel) this.view.lblCancel.isVisible = true;
            if (this.view.btnSheetEnable) this.view.btnSheetEnable.bottom = "0dp";

            if (this.view.lblCancel) this.view.lblCancel.text = "Cancel";

            if (this.actionType === "remove") {
                if (this.view.btnSheetEnable) this.view.btnSheetEnable.text = "Remove";
                if (this.view.lblDesc1) this.view.lblDesc1.text = "Remove bill";
                if (this.view.lblDesc2) this.view.lblDesc2.text = "Are you sure you want to remove this bill?";
                if (this.view.flxBillDetailsEdit) this.view.flxBillDetailsEdit.isVisible = true;

                this.setBillDetails(this.billData);
            } else if (this.actionType === "edit") {
                if (this.view.btnSheetEnable) this.view.btnSheetEnable.text = "Confirm";
                if (this.view.lblDesc1) this.view.lblDesc1.text = "Edit amount";
                if (this.view.lblDesc2) this.view.lblDesc2.text = "Edit and enter the new amount";
                if (this.view.flxEnterAmount) this.view.flxEnterAmount.isVisible = true;

                this.setEditAmount(this.billData);
            } else if (this.actionType === "loyalty") {
                if (this.view.btnSheetEnable) {
                    this.view.btnSheetEnable.text = "Confirm";
                    this.view.btnSheetEnable.bottom = "32dp";
                }

                if (this.view.lblDesc1) this.view.lblDesc1.text = "Loyalty exchange rate";
                if (this.view.lblDesc2) this.view.lblDesc2.text = "For every 4 points you redeem, you’ll receive the equivalent of 1 QAR to use within the program.";
                if (this.view.flxLoyaltyPoint) this.view.flxLoyaltyPoint.isVisible = true;
                if (this.view.lblCancel) this.view.lblCancel.isVisible = false;

                this.setLoyaltyPoints(this.billData);
            } else {
                if (this.view.btnSheetEnable) this.view.btnSheetEnable.text = "Enable automatic payment";
                if (this.view.lblDesc1) this.view.lblDesc1.text = "Do you want to enable automatic payment for this bill?";
                if (this.view.lblDesc2) this.view.lblDesc2.text = "Your bills will be paid automatically on the due date using your default payment method.";
            }

            this.view.forceLayout();
        },

        setBillDetails: function (data) {
            if (!data) return;

            if (this.view.lblBillThumbnail) this.view.lblBillThumbnail.text = data.billLogo || "";
            if (this.view.lblBillName) this.view.lblBillName.text = data.billHeader || "";
            if (this.view.lblBillDescValue) this.view.lblBillDescValue.text = data.billDetails || "";
            if (this.view.lblDueOnDate) this.view.lblDueOnDate.text = data.endDate || "";
            if (this.view.lblAutoPayVal) this.view.lblAutoPayVal.text = data.switchOn ? "Enabled" : "Disabled";
            if (this.view.lblBillAmtValue) this.view.lblBillAmtValue.text = data.billAmount || "";
            if (this.view.lblBillCurrency) this.view.lblBillCurrency.text = data.billCurr || "";
        },

        setEditAmount: function (data) {
            var amount = data && data.billAmount ? data.billAmount : "";
            var currency = data && data.billCurr ? data.billCurr : "QAR";

            if (this.view.lblEnterAmount) this.view.lblEnterAmount.text = "Enter amount";
            if (this.view.txtAmount) this.view.txtAmount.text = amount;
            if (this.view.lblTotalAmt) this.view.lblTotalAmt.text = "Total amount: " + amount + " " + currency;
        },

        setLoyaltyPoints: function (data) {
            if (!data) return;

            if (this.view.lblLoyaltyPoints) {
                this.view.lblLoyaltyPoints.text = data.points || "500 points";
            }

            if (this.view.lblLoyaltyPointVal) {
                this.view.lblLoyaltyPointVal.text = data.value || "125 QAR";
            }
        },

        hide: function (callback) {
            if (!this.view.flxBottomSheet) {
                this.view.isVisible = false;
                if (typeof callback === "function") callback();
                return;
            }

            this.isOpen = false;

            var animation = kony.ui.createAnimation({
                0: {
                    bottom: "-16dp",
                    stepConfig: {
                        timingFunction: kony.anim.EASE_IN
                    }
                },
                100: {
                    bottom: "-100%",
                    stepConfig: {
                        timingFunction: kony.anim.EASE_IN
                    }
                }
            });

            this.view.flxBottomSheet.animate(
                animation,
                {
                    duration: 0.28,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        this.view.flxBottomSheet.bottom = "-100%";
                        this.view.isVisible = false;

                        if (typeof callback === "function") callback();
                    }.bind(this)
                }
            );
        },

        onSheetAction: function () {
            kony.print("BOTTOM SHEET :: ACTION CLICKED");

            var callback = this.enableCallback;
            var actionType = this.actionType;
            var billData = this.billData;
            var amount = this.view.txtAmount ? this.view.txtAmount.text : "";

            this.enableCallback = null;
            this.cancelCallback = null;
            this.actionType = null;
            this.billData = null;

            this.hide(function () {
                if (typeof callback === "function") {
                    if (actionType === "edit") {
                        callback(actionType, billData, amount);
                    } else {
                        callback(actionType, billData);
                    }
                }
            });
        },

        onCancel: function () {
            kony.print("BOTTOM SHEET :: CANCEL CLICKED");

            var callback = this.cancelCallback;
            var actionType = this.actionType;
            var billData = this.billData;

            this.enableCallback = null;
            this.cancelCallback = null;
            this.actionType = null;
            this.billData = null;

            this.hide(function () {
                if (typeof callback === "function") callback(actionType, billData);
            });
        },

        onClose: function () {
            kony.print("BOTTOM SHEET :: CLOSE CLICKED");

            this.enableCallback = null;
            this.cancelCallback = null;
            this.actionType = null;
            this.billData = null;

            this.hide();
        }
    };
});