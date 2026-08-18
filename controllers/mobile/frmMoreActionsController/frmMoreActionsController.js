define({
    isChecked: false,

    onNavigate: function (params) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        //this.view.onDeviceBack = this.onDeviceBack;
    },

    onInit: function () {

    },
    preShow: function(){
        this.view.lblEditActions.onTouchEnd = this.onEditClick;
    },
    onDeviceBack: function(){
        var prevForm = kony.application.getPreviousForm();

        new kony.mvc.Navigation(prevForm).navigate();
    },

    onEditClick: function(){
        new kony.mvc.Navigation("frmMoreActionsEdit").navigate();
    },

 });