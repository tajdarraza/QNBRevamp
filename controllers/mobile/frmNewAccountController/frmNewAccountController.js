define({ 

    onNavigate: function(navData) {
        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;


        this.view.commonheader.configure({
            title: "New account",
            action1: function() {
                alert("not yet developed");
            },


    action2: function() {

    },

    action2Image: "closeicon.png"
        });

        this.data = navData;
    },



    init: function() {

    },

    preShow: function() {

        this.view.flxAccountType5.onTouchEnd = this.onClickFixedDeposit;

    },

    postShow: function() {},

    onClickFixedDeposit: function() {
        new kony.mvc.Navigation("frmDepositDetail").navigate();
    }

 });