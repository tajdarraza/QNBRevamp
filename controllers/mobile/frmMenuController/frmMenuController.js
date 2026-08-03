define({

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.onDeviceBack;
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });
    },

    preShow: function () {
        this.setIdentity();
        this.bindRows();
        this.bindFooter();
    },

    onDeviceBack: function () {
        new kony.mvc.Navigation("frmDashboard").navigate();
    },

    //Every widget touch is guarded individually: this form is hand-assembled, so a single renamed or
    //missing widget should degrade one row rather than blank the whole screen.
    safeSet: function (id, prop, value) {
        try {
            if (this.view[id]) { this.view[id][prop] = value; }
        } catch (e) {
            kony.print("frmMenu safeSet " + id + "." + prop + " :: " + e);
        }
    },

    safeTap: function (id, fn) {
        try {
            if (this.view[id]) { this.view[id].onTouchEnd = fn; }
        } catch (e) {
            kony.print("frmMenu safeTap " + id + " :: " + e);
        }
    },

    setIdentity: function () {
        var name = currentUserName();
        if (nullCheck(name)) {
            this.safeSet("lblUserName", "text", name);
            this.safeSet("lblInitials", "text", initialsFromName(name));
        }
        //Life-rewards points come from getLastLogin (tlp) and are cached on gblQNB by the dashboard.
        var pts = (typeof gblQNB !== "undefined" && gblQNB && nullCheck(gblQNB.tlp)) ? gblQNB.tlp : null;
        if (nullCheck(pts)) {
            this.safeSet("lblRewards", "text", "Life rewards: " + pts + " points");
        }
    },

    //The menu is a static list in this prototype. Only the destinations that actually exist navigate;
    //the rest answer rather than sitting dead.
    bindRows: function () {
        var self = this;
        this.safeTap("flxMenuAccounts", function () { pocNotBuilt("Accounts"); });
        this.safeTap("flxMenuCards", function () { new kony.mvc.Navigation("frmCards").navigate(); });
        this.safeTap("flxMenuPayments", function () { pocNotBuilt("Payments"); });
        this.safeTap("flxMenuTransfers", function () {
            new kony.mvc.Navigation("frmTransfers").navigate();
        });
        this.safeTap("flxMenuLoans", function () { pocNotBuilt("Loans"); });
        this.safeTap("flxMenuInsurance", function () { pocNotBuilt("Insurance"); });
        this.safeTap("flxMenuInvestments", function () { pocNotBuilt("Investments"); });
        this.safeTap("flxMenuRewards", function () { pocNotBuilt("Life Rewards"); });
    },

    bindFooter: function () {
        this.safeTap("imgFooter1", function () { new kony.mvc.Navigation("frmDashboard").navigate(); });
        this.safeTap("imgFooter2", function () { new kony.mvc.Navigation("frmCards").navigate(); });
        this.safeTap("imgFooter3", function () { pocNotBuilt("Payments"); });
        this.safeTap("imgFooter4", function () {
            new kony.mvc.Navigation("frmTransfers").navigate();
        });
        this.safeTap("imgFooter5", function () { /* already here */ });
    },

});
