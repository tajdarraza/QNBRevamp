define(["Navigation"], function (Navigation) {

    return {

        onNavigate: function(navData) {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = this.onDeviceBack;

            this.view.commonheader.configure({
                title: "New account",

                action1: function() {
                    alert("not yet developed");
                },

                action2: function() {
                    Navigation.goBack();
                },

                action2Image: "closeicon.png"
            });

            this.data = navData;
        },

        init: function() {},

        preShow: function() {
            this.view.flxAccountType5.onTouchEnd =
                this.onClickFixedDeposit.bind(this);
        },

        postShow: function() {},

        onClickFixedDeposit: function() {
            Navigation.navigate("frmDepositDetail");
        },

        onDeviceBack: function() {
            Navigation.goBack();
        }
    };
});