define(["Navigation"], function (Navigation) {
    return {

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            this.view.onDeviceBack = this.backNavigation;
            this.view.flxQuickAction2.onClick = this.quickAction2;
        },

        init: function () {
            kony.print("init");
        },

        preShow: function () {
            kony.print("preShow");
        },

        postShow: function () {
            kony.print("postShow");
        },

        onHide: function () {
            kony.print("onHide");
        },

        quickAction2: function(){
            new kony.mvc.Navigation("frmCardType").navigate();
        },

        backNavigation: function () {
            new kony.mvc.Navigation("frmCards").navigate();
        }
    }
});