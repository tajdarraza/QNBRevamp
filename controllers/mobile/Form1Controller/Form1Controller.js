define(["Navigation"], function (Navigation) {
    return {

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            this.view.onDeviceBack = this.backNavigation;
        },

        init: function () {
            alert("init");
        },

        preShow: function () {
            Navigation.navigate("frmAccounts","","")
            alert("preShow");
        },

        postShow: function () {
            alert("postShow");
        },

        onHide: function () {
            alert("onHide");
        },

        backNavigation: function () {
            alert("backNavigation");
        }
    }
});