define({
    billData: null,

    onNavigate: function (navData) {
        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;

        this.view.cmpFooter.initializeFooter();
        this.view.cmpFooter.setSelectedTab("payments");

        this.view.commonheader.configure({
            title: "Pay bills",
            action1: function () {
                alert("not yet developed");
            }
        });

        this.billData = navData;
    },

    init: function () {
        if (this.view.cmpbottomup) {
            this.view.cmpbottomup.postRender();
        }
    },

    preShow: function () {
        this.view.flxAccountList.onTouchEnd = this.flxAccountListOnClick;
        this.view.segAccountDropDown.onRowClick = this.onAccountRowClick;
        this.view.imgEditBill.onTouchEnd = this.onBillEditClick;
        this.view.btnRemove.onClick = this.onRemoveClick.bind(this);
        this.view.imgInfo.onTouchEnd = this.onInfoClick.bind(this);

        if (this.view.cmpbottomup) {
            this.view.cmpbottomup.isVisible = false;
        }
    },

    postShow: function () { },


    onBillEditClick: function () {
        if (!this.billData) {
            kony.print("PAY BILL ACCOUNT :: NO BILL DATA FOR EDIT");
            return;
        }

        if (!this.view.cmpbottomup || typeof this.view.cmpbottomup.show !== "function") {
            kony.print("PAY BILL ACCOUNT :: cmpbottomup.show() NOT FOUND");
            return;
        }

        this.view.cmpbottomup.show(
            this.onAmountEditConfirmed.bind(this),
            "edit",
            this.billData,
            this.onAmountEditCancelled.bind(this)
        );
    },
    onAmountEditConfirmed: function (actionType, billData, newAmount) {
        kony.print("PAY BILL ACCOUNT :: AMOUNT EDIT CONFIRMED");
        kony.print("ACTION = " + actionType);
        kony.print("NEW AMOUNT = " + newAmount);
        kony.print("BILL DATA = " + JSON.stringify(billData));

        if (!newAmount) {
            kony.print("PAY BILL ACCOUNT :: AMOUNT IS EMPTY");
            return;
        }

        // Update UI/API here later.
        // this.updateBillAmountAPI(billData, newAmount);
    },

    onAmountEditCancelled: function (actionType, billData) {
        kony.print("PAY BILL ACCOUNT :: AMOUNT EDIT CANCELLED");
    },

    onRemoveClick: function () {
        kony.print("PAY BILL ACCOUNT :: REMOVE BUTTON CLICKED");

        if (!this.billData) {
            kony.print("PAY BILL ACCOUNT :: NO BILL DATA");
            return;
        }

        if (!this.view.cmpbottomup || typeof this.view.cmpbottomup.show !== "function") {
            kony.print("PAY BILL ACCOUNT :: cmpbottomup.show() NOT FOUND");
            return;
        }

        kony.print("PAY BILL ACCOUNT :: REMOVE BILL = " + JSON.stringify(this.billData));

        this.view.cmpbottomup.show(
            this.onAutoPayRemoved.bind(this),
            "remove",
            this.billData
        );
    },

    onAutoPayRemoved: function (actionType, billData) {
        kony.print("PAY BILL ACCOUNT :: REMOVE CONFIRMED");
        kony.print("ACTION = " + actionType);
        kony.print("BILL DATA = " + JSON.stringify(billData));

        // Future API:
        // this.removeAutoPayAPI(billData);
    },
    onInfoClick: function() {
    var loyaltyData = {
        points: "500 points",
        value: "125 QAR"
    };

    this.view.cmpbottomup.show(this.onLoyaltyConfirmed.bind(this), "loyalty", loyaltyData, this.onLoyaltyCancelled.bind(this));
},

onLoyaltyConfirmed: function(actionType, data) {
    kony.print("LOYALTY :: CONFIRMED");
    kony.print("ACTION = " + actionType);
    kony.print("DATA = " + JSON.stringify(data));
},
onLoyaltyCancelled: function(actionType, data) {
    kony.print("LOYALTY :: CANCELLED");
},

    onAccountRowClick: function (...onrowtap) {
        var data = this.view.segAccountDropDown.data;
        var rowData = data[onrowtap[2]];

        if (!rowData) {
            return;
        }

        this.view.lblSelectedAcc.text = rowData.lblAccountList;
        this.view.flxAccountsDrop.isVisible = false;
    },

    flxAccountListOnClick: function () {
        this.view.flxAccountsDrop.isVisible = !this.view.flxAccountsDrop.isVisible;
    }
});