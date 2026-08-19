define({

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.onDeviceBack;
           this.view.cmpFooter.initializeFooter();
        this.view.cmpFooter.setSelectedTab("transfer");
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });
    },

    preShow: function () {
        applyHeaderIdentity(this.view);
        this.bindTiles();
        this.bindFooter();
    },

    onDeviceBack: function () {
        new kony.mvc.Navigation("frmDashboard").navigate();
    },

    //Guarded per widget: this form is generated rather than drawn in Visualizer, so a renamed or
    //missing widget should cost one tile, not the whole screen.
    safeTap: function (id, fn) {
        try {
            if (this.view[id]) { this.view[id].onTouchEnd = fn; }
        } catch (e) {
            kony.print("frmTransfers safeTap " + id + " :: " + e);
        }
    },

    bindTiles: function () {
        //Fawran is the only rail built in this prototype. Everything else answers rather than
        //sitting dead — a dead tap reads as a broken build.
        this.safeTap("flxTileFawran", this.onFawran);

        this.safeTap("flxTileTahweel", function () { pocNotBuilt("Tahweel"); });
        this.safeTap("flxTileBetweenAccounts", function () { pocNotBuilt("Between my accounts"); });
        this.safeTap("flxTileWesternUnion", function () { pocNotBuilt("Western Union"); });
        this.safeTap("flxTileQNBRemit", function () { pocNotBuilt("QNB remit"); });
        this.safeTap("flxTileInternational", function () { pocNotBuilt("International transfers"); });
        this.safeTap("flxTileMobileCash", function () { pocNotBuilt("Mobile cash"); });
        this.safeTap("flxTileZakat", function () { pocNotBuilt("Zakat"); });
        this.safeTap("flxTileToBroker", function () { pocNotBuilt("Transfer to broker"); });

        this.safeTap("flxMngAutoTransfers", function () { pocNotBuilt("Automatic transfers"); });
        this.safeTap("flxMngBeneficiaries", function () { pocNotBuilt("Manage beneficiaries"); });
        this.safeTap("flxMngLimits", function () { pocNotBuilt("Transfer limits"); });
    },

    onFawran: function () {
        //Guarded so this is safe to ship before frmFawran exists — navigating to a form Visualizer
        //has not generated throws, which looks like a crash rather than a missing screen.
        try {
            new kony.mvc.Navigation("frmFawran").navigate();
        } catch (e) {
            kony.print("frmFawran not available yet :: " + e);
            pocNotBuilt("Fawran");
        }
    },

    bindFooter: function () {
        this.safeTap("imgFooter1", function () {
            new kony.mvc.Navigation("frmDashboard").navigate();
        });
        this.safeTap("imgFooter2", function () {
            new kony.mvc.Navigation("frmCards").navigate();
        });
        this.safeTap("imgFooter3", function () { pocNotBuilt("Payments"); });
        this.safeTap("imgFooter4", function () { /* already here */ });
        this.safeTap("imgFooter5", function () { pocNotBuilt("Menu"); });
    },

});
