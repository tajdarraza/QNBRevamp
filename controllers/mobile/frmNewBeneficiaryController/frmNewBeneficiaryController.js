define(["Navigation"], function (Navigation) {
    return {

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            //this.view.onDeviceBack = this.backNavigation;
        },

        init: function () {
            kony.print("init");
        },

        preShow: function () {
            this.view.flxTransferType4.onClick = this.transferWUnionOnClick;
            //frmAddBeneficiary
            kony.print("preShow");
        },

        postShow: function () {
            kony.print("postShow");
        },

        onHide: function () {
            kony.print("onHide");
        },

        backNavigation: function () {
            kony.print("backNavigation");
        },

        transferWUnionOnClick: function(){
            new kony.mvc.Navigation("frmAddBeneficiary").navigate();
        }
    }
});