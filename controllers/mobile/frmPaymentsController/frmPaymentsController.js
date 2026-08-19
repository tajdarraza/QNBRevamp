define({

    onNavigate: function (navData) {

        this.view.init = this.init;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;

           this.view.cmpFooter.initializeFooter();
        this.view.cmpFooter.setSelectedTab("payments");
        this.view.flxOption1.onTouchEnd = this.onPayBillClick;

        this.data = navData;
    },


    onFooterMenu: function () {

    },


    init: function () {

    },

    onPayBillClick: function(){
         try {
            new kony.mvc.Navigation("frmPayBills").navigate();
        } catch (e) {
            kony.print("frmPayBills not available yet :: " + e);
            pocNotBuilt("frmPayBills");
        }
    },

    preShow: function () {

    },
    postShow: function(){

    }

 });