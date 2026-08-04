define({

    indicators: [],
    cards: [],
    cardPage: 0,
    accountPage: 0,
    snapPoints: [],
    cardData: [],
    tabs: [],
    allAccounts: [],
    isSnapping: false,
    data: '',

    //Server-derived rows. Empty until loadServerData() completes; the hardcoded arrays below act as
    //the fallback so the screen is never blank and mock mode still works.
    serverAccounts: [],
    serverDashRows: [],
    serverCards: [],
    dataLoaded: false,
    pendingCalls: 0,

    //--- service integration -------------------------------------------------------------------

    loadServerData: function () {
        var self = this;
        if (!nullCheck(gblQNB.atkn)) {
            kony.print("POC DASH: no auth token — staying on fallback data");
            return;
        }
        self.pendingCalls = 3;
        self.armDashWatchdog();

        //All three take an empty body and carry Authorization: Bearer <atkn> via createHeaderObj.
        invokeServiceAsync(QNBConstants.serviceName.dashBoard, createHeaderObj("", true), {},
            function (s, r) { self.onAccounts(s, r); });

        //Go through the shared store so there is a single card code path (and a single set of
        //diagnostics) across dashboard, Cards and Choose-your-card.
        pocFetchCards(function (rows) {
            if (rows && rows.length) {
                self.serverCards = pocMapCardsForScroller(rows);
                kony.print("POC DASH: mapped " + rows.length + " cards");
            }
            self.onCallDone();
        });

        invokeServiceAsync(QNBConstants.serviceName.getLastLogin, createHeaderObj("", true), {},
            function (s, r) { self.onLastLogin(s, r); });
    },

    onAccounts: function (status, res) {
        var self = this;
        try {
            //Composite ops namespace their status per sub-service — NOT res.status.code.
            var st = res && res.status_getAcctListFx ? res.status_getAcctListFx.code : "?";
            kony.print("POC DASH: DashboardComposite status=" + status + " code=" + st);

            var accs = [];
            if (res && res.data_getAcctListFx && res.data_getAcctListFx.units) {
                var units = res.data_getAcctListFx.units;
                for (var u = 0; u < units.length; u++) {
                    var list = units[u].acclist || [];
                    for (var a = 0; a < list.length; a++) { accs.push(list[a]); }
                }
            }
            if (accs.length) {
                //Raw first row, so a mapping mistake can be told apart from genuinely zero balances.
                kony.print("POC DASH: raw acclist[0] = " + JSON.stringify(accs[0]));

                self.serverAccounts = self.mapAccountRows(accs);
                self.serverDashRows = self.mapDashboardRows(accs);
                kony.print("POC DASH: mapped " + accs.length + " accounts, first balance='" +
                    self.serverAccounts[0].lblAmount + "' " + self.serverAccounts[0].lblCurrency);
            }
        } catch (e) {
            kony.print("POC DASH: account map failed :: " + e);
        }
        self.onCallDone();
    },

    //onCards was removed — cards now go through pocFetchCards() in modules/CardStore.js so the
    //dashboard, Cards screen and Choose-your-card share one fetch, one cache and one set of logs.

    onLastLogin: function (status, res) {
        try {
            kony.print("POC DASH: getLastLogin status=" + status);
            var d = res && res.data && res.data.length ? res.data[0] : res;
            //Life-rewards points, shown on the Menu screen.
            if (d && nullCheck(d.tlp)) { gblQNB.tlp = d.tlp; }
            if (d && nullCheck(d.fln)) {
                gblQNB.fln = d.fln;
                //Feeds the "Welcome <name>" label on the login screen's returning-user layout, which
                //otherwise shows the design placeholder. Only persist it when the user asked to be
                //remembered — otherwise we would leave their name on the device after opting out.
                if (nullCheck(kony.store.getItem("pocUserName"))) {
                    kony.store.setItem("pocFullName", d.fln);
                }
            }
        } catch (e) {
            kony.print("POC DASH: lastLogin failed :: " + e);
        }
        this.onCallDone();
    },

    onCallDone: function () {
        this.pendingCalls--;
        if (this.pendingCalls > 0) { return; }
        this.cancelDashWatchdog();
        this.dataLoaded = true;
        try { this.view.loading.hideLoader(this); } catch (e) { }
        //Re-render once, synchronously, with whatever landed.
        this.renderAll();
    },

    //--- mappers -------------------------------------------------------------------------------

    //avlBal already arrives from the server as a DISPLAY STRING ("12,450.75") — production
    //concatenates it straight into markup and never re-formats it. Passing it through formatAmount()
    //does Number("12,450.75") -> NaN -> 0, which is why every balance rendered as 0.00.
    //Only format when we are actually handed a number.
    amountText: function (v) {
        if (v === null || v === undefined || v === "") { return "0.00"; }
        if (typeof v === "number") { return formatAmount(v); }
        return "" + v;
    },

    mapAccountRows: function (accs) {
        var rows = [];
        for (var i = 0; i < accs.length; i++) {
            var a = accs[i];
            rows.push({
                accountType: nullCheck(a.accountType) ? a.accountType : "Credit",
                lblAccName: nullCheck(a.accTypeDesc) ? a.accTypeDesc : "Account",
                lblAccNum: nullCheck(a.accNumFormat) ? a.accNumFormat : "",
                lblAmount: this.amountText(a.avlBal),
                lblCurrency: nullCheck(a.curr) ? a.curr : "",
                flxSeperator: {
                    skin: (i === 0) ? "sknFlxRounderdSeperator2a59bd" : "sknFlxRounderdSeperatorAC2672"
                }
            });
        }
        return rows;
    },

    mapDashboardRows: function (accs) {
        var rows = [];
        for (var i = 0; i < accs.length; i++) {
            var a = accs[i];
            var full = this.amountText(a.avlBal);       //already "12,450.75" from the server
            var parts = full.split(".");
            rows.push({
                lblAccountType: nullCheck(a.accTypeDesc) ? a.accTypeDesc : "Account",
                imgAccType: "eyevisible1.png",
                lblAccBalane: parts[0],
                lblDecimal: "." + (parts[1] || "00"),
                lblCurr: nullCheck(a.curr) ? a.curr : "",
                lblActualBal: "Actual balance  ",
                lblBalance: full + " " + (nullCheck(a.curr) ? a.curr : ""),
                lblAllAccounts: "All accounts",
                imgAllAccount: "iconright1.png",
                lblSavings: "",
                lblCurrent: ""
            });
        }
        return rows;
    },

    mapCardRows: function (list) {
        //The card scroller is hardwired to flxCardContainer1..4 / lblPayNow1..4, and bindCardData
        //indexes cardData[i] for i < 4. Fewer than 4 would throw on data.cardImage; more would be
        //dropped silently. So clamp to exactly 4 by padding with the last real card.
        var rows = [];
        for (var i = 0; i < list.length && i < 4; i++) {
            var c = list[i];
            rows.push({
                id: i + 1,
                cardImage: "card.png",
                accountType: "Credit",
                nickName: nullCheck(c.ctd) ? c.ctd : "Card",
                holderName: nullCheck(c.ebn) ? c.ebn : "",
                cardNumber: nullCheck(c.mcn) ? c.mcn : "",
                dueDay: nullCheck(c.pd) ? ("Due " + c.pd) : "No Due",
                payNow: "Pay Now"
            });
        }
        while (rows.length > 0 && rows.length < 4) {
            var pad = JSON.parse(JSON.stringify(rows[rows.length - 1]));
            pad.id = rows.length + 1;
            rows.push(pad);
        }
        return rows;
    },

    armDashWatchdog: function () {
        var self = this;
        kony.timer.schedule("pocDashWatchdog", function () {
            kony.timer.cancel("pocDashWatchdog");
            //A silent timeout here is the expected signature of a rejected token: ServiceController
            //SUPPRESSES the callback entirely on session-expiry / invalid-JWT / user-blocked
            //(G-00001 / G-00002 / G-00011), so a bad atkn produces no error — just nothing.
            //If POC_BYPASS_OTP is on, that is the first thing to suspect.
            kony.print("POC DASH: timed out with " + self.pendingCalls + " call(s) unanswered — " +
                "keeping fallback data. If POC_BYPASS_OTP is true, the pre-OTP token was likely rejected.");
            self.pendingCalls = 0;
            try { self.view.loading.hideLoader(self); } catch (e) { }
        }, 45, false);
    },

    cancelDashWatchdog: function () {
        try { kony.timer.cancel("pocDashWatchdog"); } catch (e) { }
    },

    onNavigate: function (navData) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        this.view.postShow = this.onPostShow;
        this.view.onDeviceBack = this.onDeviceBack;
        this.view.flxScrollCards.onScrollEnd = this.onScrollCardsEnd;

        //Full bottom nav. Only Cards was wired; the other four were dead taps, which is the first
        //thing anyone tries in a demo.
        this.view.imgFooter1.onTouchEnd = this.onFooterHome;
        this.view.imgFooter2.onTouchEnd = this.imgFooter2;
        this.view.imgFooter3.onTouchEnd = this.onFooterPayments;
        this.view.imgFooter4.onTouchEnd = this.onFooterTransfers;
        this.view.imgFooter5.onTouchEnd = this.onFooterMenu;

        this.data = navData;
    },

    onFooterHome: function () {
        //Already here.
    },

    onFooterPayments: function () {
        pocNotBuilt("Payments");
    },

    onFooterTransfers: function () {
        //Guarded until frmTransfers has been opened/rebuilt in Visualizer.
        try {
            new kony.mvc.Navigation("frmTransfers").navigate();
        } catch (e) {
            kony.print("frmTransfers not available yet :: " + e);
            pocNotBuilt("Transfers");
        }
    },

    onFooterMenu: function () {
        //Guarded so the nav is safe to ship before frmMenu exists in the project — navigating to a
        //form Visualizer has not generated throws, which would look like a crash in the demo.
        try {
            new kony.mvc.Navigation("frmMenu").navigate();
        } catch (e) {
            kony.print("frmMenu not available yet :: " + e);
            pocNotBuilt("Menu");
        }
    },

    //Header avatar. Ships as the design default "FF"; derive it from the real signed-in user.
    setHeaderIdentity: function () {
        applyHeaderIdentity(this.view);
    },

    //"Recent activity" is a static design mock — the com.qnb.recent.transactions widget's controller
    //is an empty define() and no transactions service is called anywhere. Its three rows (Uber ride,
    //Cashback, Flower shop) are design-time text. Hidden rather than presented as live data.
    //To make it real later: the production app has no dashboard activity feed, so it would need one
    //of the Accounts ops (e.g. AccountPendingTransactions) wired per selected account.
    hideRecentActivity: function () {
        try {
            if (this.view.transactions) { this.view.transactions.setVisibility(false); }
        } catch (e) {
            kony.print("hideRecentActivity :: " + e);
        }
    },

    //"My cards" is shown only when the service actually returns cards. Hidden before the fetch
    //completes so the hardcoded fallback holders never flash on screen, and left hidden if the
    //customer has none — an absent section reads as intentional, fabricated cardholders do not.
    applyCardsSectionVisibility: function () {
        var show = !!(this.serverCards && this.serverCards.length);
        var ids = ["flxCardsHeader", "flxScrollCards"];
        for (var i = 0; i < ids.length; i++) {
            try {
                if (this.view[ids[i]]) { this.view[ids[i]].setVisibility(show); }
            } catch (e) {
                kony.print("applyCardsSectionVisibility " + ids[i] + " :: " + e);
            }
        }
        kony.print("POC DASH: My cards section visible=" + show);
    },

    widgetMap: function () {
        this.view.segAllAccounts.widgetDataMap = {
            lblAccName: "lblAccName",
            lblAccNum: "lblAccNum",
            lblAmount: "lblAmount",
            lblCurrency: "lblCurrency",
            flxSeperator: "flxSeperator"
        };
        this.view.segAccounts.widgetDataMap = {

            lblAccountType: "lblAccountType",
            imgAccType: "imgAccType",

            lblAccBalane: "lblAccBalane",
            lblDecimal: "lblDecimal",
            lblCurr: "lblCurr",

            lblActualBal: "lblActualBal",
            lblBalance: "lblBalance",

            lblAllAccounts: "lblAllAccounts",
            imgAllAccount: "imgAllAccount",

            lblSavings: "lblSavings",
            lblCurrent: "lblCurrent",

            flxGraphics: "flxGraphics",
            flxMenuOptions: "flxMenuOptions",

            flxMenu1: "flxMenu1",
        };
    },

    setAccountData: function () {
        if (this.serverAccounts && this.serverAccounts.length) {
            this.allAccounts = this.serverAccounts;
            this.view.segAllAccounts.setData(this.serverAccounts);
            return;
        }
        var segData = [

            {
                accountType: "Credit",
                lblAccName: "Fixed deposit account",
                lblAccNum: "0031-3256-7253",
                lblAmount: "8,900.00",
                lblCurrency: "QAR",
                flxSeperator: {
                    skin: "sknFlxRounderdSeperator2a59bd"
                }
            },

            {
                accountType: "Debit",
                lblAccName: "eSaver account",
                lblAccNum: "0067-9756-2762",
                lblAmount: "45,120.80",
                lblCurrency: "QAR",
                flxSeperator: {
                    skin: "sknFlxRounderdSeperatorAC2672"
                }
            },

            {
                accountType: "Credit",
                lblAccName: "Current account (USD)",
                lblAccNum: "0002-2344-2793",
                lblAmount: "12,450.75",
                lblCurrency: "QAR Equivalent",
                flxSeperator: {
                    skin: "sknFlxRounderdSeperatorAC2672"
                }
            },
            {
                accountType: "Credit",
                lblAccName: "Current account 2 (USD)",
                lblAccNum: "0002-2344-3793",
                lblAmount: "1,450.75",
                lblCurrency: "QAR Equivalent",
                flxSeperator: {
                    skin: "sknFlxRounderdSeperatorAC2672"
                }
            },

        ];
        this.allAccounts = segData;
        this.view.segAllAccounts.setData(segData);
    },
    setAccountDashboardData: function () {

        if (this.serverDashRows && this.serverDashRows.length) {
            var rows = this.serverDashRows;
            if (this.data && this.data.hasOwnProperty("hideBalance") && this.data.hideBalance) {
                for (var r = 0; r < rows.length; r++) {
                    rows[r].lblAccBalane = "************";
                    rows[r].lblDecimal = "";
                    rows[r].lblCurr = "";
                }
            }
            this.view.segAccounts.setData(rows);
            this.updateDashboard(0);
            return;
        }

        var segData = [

            {
                lblAccountType: "Current Account",
                imgAccType: "eyevisible1.png",

                lblAccBalane: "12,450",
                lblDecimal: ".75",
                lblCurr: "QAR",

                lblActualBal: "Actual balance  ",
                lblBalance: "12,450.75 QAR",

                lblAllAccounts: "All accounts",
                imgAllAccount: "iconright1.png",


                lblSavings: "Current",
                lblCurrent: "Saving"
            },

            {
                lblAccountType: "Savings Account",
                imgAccType: "eyevisible1.png",

                lblAccBalane: "35,220",
                lblDecimal: ".10",
                lblCurr: "QAR",

                lblActualBal: "Available Balance",
                lblBalance: "QAR 35,220.10",

                lblAllAccounts: "All accounts",
                imgAllAccount: "iconright1.png",

                lblSavings: "QAR 28K",
                lblCurrent: "QAR 7.2K"
            },

            {
                lblAccountType: "Fixed Deposit",
                imgAccType: "eyevisible1.png",

                lblAccBalane: "100,000",
                lblDecimal: ".00",
                lblCurr: "QAR",

                lblActualBal: "Maturity Value",
                lblBalance: "100,000.00 QAR",

                lblAllAccounts: "All accounts",
                imgAllAccount: "iconright1.png",

                lblSavings: "QAR 90K",
                lblCurrent: "QAR 10K"
            },

            {
                lblAccountType: "USD Account",
                imgAccType: "eyevisible1.png",

                lblAccBalane: "5,400",
                lblDecimal: ".25",
                lblCurr: "USD",

                lblActualBal: "Available Balance",
                lblBalance: "5,400.25 USD",

                lblAllAccounts: "All accounts",
                imgAllAccount: "iconright1.png",

                lblSavings: "USD 4.2K",
                lblCurrent: "USD 1.2K"
            }

        ];
        if (this.data && this.data.hasOwnProperty("hideBalance") && this.data.hideBalance) {
            for (var i = 0; i < segData.length; i++) {
                segData[i].lblAccBalane = "************";
                segData[i].lblDecimal = "";
                segData[i].lblCurr = "";
            }
        }

        for (var i = 0; i < segData.length; i++) {

            segData[i].flxMenu1 = {
                onTouchEnd: this.onMenu1Click.bind(this)
            };
        }
        this.view.segAccounts.setData(segData);
        this.updateDashboard(0);
    },
    onMenu1Click: function (widget, context) {
        try {

            new kony.mvc.Navigation("frmMoreActions").navigate();

        } catch (e) {
            alert(e)
        }


    },
    updateDashboard: function () {

        var data = this.view.segAccounts.data;

        for (var i = 0; i < data.length; i++) {

            data[i].flxGraphics = {
                isVisible: (i === 0)
            };

            data[i].flxMenuOptions = {
                isVisible: (i !== 0)
            };
        }

        this.view.segAccounts.setData(data);
    },
    onInit: function () {
        this.cardData = [

            {
                id: 1,
                cardImage: "card.png",
                accountType: "Credit",
                nickName: "Primary Card",
                holderName: "Mohammad Raza",
                cardNumber: "**** **** **** 4589",
                dueDay: "Due in 6 days",
                payNow: "Pay Now"
            },

            {
                id: 2,
                cardImage: "card.png",
                accountType: "Diners",
                nickName: "Travel Card",
                holderName: "Mohammad Raza",
                cardNumber: "**** **** **** 9132",
                dueDay: "Due Tomorrow",
                payNow: "Pay Now"
            },

            {
                id: 3,
                cardImage: "card.png",
                accountType: "Credit",
                nickName: "Shopping Card",
                holderName: "Mohammad Raza",
                cardNumber: "**** **** **** 7721",
                dueDay: "Due in 12 days",
                payNow: "Pay Now"
            },

            {
                id: 4,
                cardImage: "card.png",
                accountType: "Debit",
                nickName: "Salary Account",
                holderName: "Mohammad Raza",
                cardNumber: "**** **** **** 1122",
                dueDay: "No Due",
                payNow: "View"

            }

        ];

        this.widgetMap();
        //Open on the accounts pane (0). The design's Home pane is structurally correct but currently
        //near-empty: Recent activity is a static mock and My cards has no cards behind it for this
        //customer, leaving only the promo banner. The accounts pane is fully backed by live data, so
        //it is the better landing until those two are service-backed. Swiping still reaches Home.
        this.updateAccountScrollView(0);
    },

    initProgressView: function () {
        var paid = 35000;
        var total = 100000;

        var percent = (paid / total) * 100;
        //this.view.progressBar.evaluateJavaScript("JSON.stringify(animateTo(20+3))");
        this.view.progressbar.onSuccess = function () {

            percent = 75;

            this.view.progressbar.evaluateJavaScript(
                "animateTo(" + percent + ");"
            );

        }.bind(this);
    },
    preShow: function () {

        this.initProgressView();

        //Render immediately from whatever data we have, so the screen is never blank.
        this.renderAll();

        //Fetch once per session, not on every form show. Back-navigating from Cards re-renders from
        //the cached server rows rather than re-issuing three calls into widgets that renderAll() is
        //simultaneously tearing down and rebuilding.
        if (!USE_MOCK_SERVICES && !this.dataLoaded && this.pendingCalls === 0) {
            try { this.view.loading.show(this, "Loading..."); } catch (e) { }
            this.loadServerData();
        }
    },

    renderAll: function () {
        //Re-run on the post-fetch render too, since gblQNB.fln only arrives with getLastLogin.
        this.setHeaderIdentity();

        if (this.serverCards && this.serverCards.length) {
            this.cardData = this.serverCards;
        }
        this.applyCardsSectionVisibility();
        this.hideRecentActivity();

        this.initializeCards();
        this.bindCardData();

        this.setAccountDashboardData();
        this.setAccountData();

        this.createIndicators();

        this.tabInit();


        this.updateDashboard();
        var currentPage = this.view.segAccounts.selectedRowIndex ?
            this.view.segAccounts.selectedRowIndex[1] : 0;
        this.updateIndicator(currentPage);
        //Open on the accounts pane (0). The design's Home pane is structurally correct but currently
        //near-empty: Recent activity is a static mock and My cards has no cards behind it for this
        //customer, leaving only the promo banner. The accounts pane is fully backed by live data, so
        //it is the better landing until those two are service-backed. Swiping still reaches Home.
        this.updateAccountScrollView(0);



        this.view.segAccounts.onSwipe =
            this.onSwipeAccounts.bind(this);
    },
    onPostShow: function () {

    },

    onDeviceBack: function () {
        new kony.mvc.Navigation("frmLogin").navigate();
    },

    imgFooter2: function () {
        //This is a bottom-nav tab switch, not a fetch — the old 4s mock delay was pure dead time.
        new kony.mvc.Navigation("frmCards").navigate();
    },

    tabInit: function () {

        this.tabs = [
            {
                container: this.view.flxTabAll,
                label: this.view.lblTabAll,

            },
            {
                container: this.view.flxTabCredit,
                label: this.view.lblTabCredit,

            },
            {
                container: this.view.flxTabDebit,
                label: this.view.lblTabDebit,
            }
        ];

        for (var i = 0; i < this.tabs.length; i++) {
            this.tabs[i].container.onClick = this.onTabClick.bind(this);

        }

        this.selectedTab = 0;
        this.animateTabs(0);
    },

    animateTabs: function (selectedIndex) {

        for (var i = 0; i < this.tabs.length; i++) {

            var selected = (i === selectedIndex);

            this.tabs[i].container.skin = selected
                ? "sknFlxTabQNBSemiBold16Px2a59bd"
                : "slFbox";

            this.tabs[i].label.skin = selected
                ? "sknLblQNBSemibold16PxWhite"
                : "sknLblQNBSemibold16Px1b124b";


            var transform = kony.ui.makeAffineTransform();

            transform.scale(
                selected ? 1.03 : 1,
                selected ? 1.03 : 1
            );


            var animation = kony.ui.createAnimation({

                0: {
                    transform: kony.ui.makeAffineTransform()
                },

                100: {
                    transform: transform
                }

            });


            this.tabs[i].container.animate(
                animation,
                {
                    duration: 0.90,
                    fillMode: kony.anim.FILL_MODE_FORWARDS,
                    delay: 0
                },
                {
                    animationEnd: null
                }
            );
        }
    },
    onTabClick: function (widget) {

        var index = -1;

        for (var i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].container === widget) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            return;
        }

        this.selectedTab = index;
        this.animateTabs(index);

        if (index === 0) {
            this.filterAccounts("All");
        } else if (index === 1) {
            this.filterAccounts("Credit");
        } else {
            this.filterAccounts("Debit");
        }
    },

    filterAccounts: function (type) {

        if (type === "All") {
            this.view.segAllAccounts.setData(this.allAccounts);
            return;
        }

        var filteredData = [];

        for (var i = 0; i < this.allAccounts.length; i++) {

            if (this.allAccounts[i].accountType === type) {
                filteredData.push(this.allAccounts[i]);
            }

        }

        this.view.segAllAccounts.setData(filteredData);

    },

    initializeCards: function () {

        this.cards = [

            {
                mainContainer: this.view.flxCardContainer1,
                container: this.view.flxCard1,
                imgCard: this.view.imgCard1,
                lblCard: this.view.lblCard1,
                lblNickName: this.view.lblNickName1,
                lblName: this.view.lblName1,
                lblCardNumber: this.view.lblCardNumber1,
                lblDueDay: this.view.lblDueDay1,
                lblPayNow: this.view.lblPayNow1,
            },

            {
                mainContainer: this.view.flxCardContainer2,
                container: this.view.flxCard2,
                imgCard: this.view.imgCard2,
                lblCard: this.view.lblCard2,
                lblNickName: this.view.lblNickName2,
                lblName: this.view.lblName2,
                lblCardNumber: this.view.lblCardNumber2,
                lblDueDay: this.view.lblDueDay2,
                lblPayNow: this.view.lblPayNow2,

            },

            {
                mainContainer: this.view.flxCardContainer3,
                container: this.view.flxCard3,
                imgCard: this.view.imgCard3,
                lblCard: this.view.lblCard3,
                lblNickName: this.view.lblNickName3,
                lblName: this.view.lblName3,
                lblCardNumber: this.view.lblCardNumber3,
                lblDueDay: this.view.lblDueDay3,
                lblPayNow: this.view.lblPayNow3,
            },

            {
                mainContainer: this.view.flxCardContainer4,
                container: this.view.flxCard4,
                imgCard: this.view.imgCard4,
                lblCard: this.view.lblCard4,
                lblNickName: this.view.lblNickName4,
                lblName: this.view.lblName4,
                lblCardNumber: this.view.lblCardNumber4,
                lblDueDay: this.view.lblDueDay4,
                lblPayNow: this.view.lblPayNow4,
            }

        ];

        var isAndroid = kony.os.deviceInfo().name;
        if (isAndroid == "android") {
            this.cards[this.cards.length - 1].mainContainer.width = "280dp";
        }

    },

    bindCardData: function () {

        for (var i = 0; i < this.cards.length; i++) {

            this.cards[i].container.cardIndex = i;
            this.cards[i].container.cardData = this.cardData[i];
            this.cards[i].container.onClick = this.onCardClick.bind(this);
            this.cards[i].lblPayNow.onTouchEnd = this.onPayNowClick.bind(this);

            this.loadCard(this.cards[i], this.cardData[i]);

        }

    },
    loadCard: function (card, data) {

        card.imgCard.src = data.cardImage;
        card.lblCard.text = data.accountType;
        card.lblNickName.text = data.nickName;
        card.lblName.text = data.holderName;
        card.lblCardNumber.text = data.cardNumber;
        card.lblDueDay.text = data.dueDay;
        card.lblPayNow.text = data.payNow;

    },

    onPayNowClick: function (widget) {
        new kony.mvc.Navigation("frmChooseCard").navigate();
    },

    onCardClick: function (widget) {

        var index = -1;

        for (var i = 0; i < this.cards.length; i++) {

            if (this.cards[i].container === widget) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            return;
        }

        var data = this.cardData[index];

        //alert(JSON.stringify(data));

    },
    onSwipeAccounts: function (eventobject, sectionNumber, rowNumber) {
        //Was overwriting the notification badge with the carousel index, so the unread count changed
        //every swipe. Debug leftover — the badge is not a page indicator.
        this.accountPage = rowNumber;

        this.updateIndicator(rowNumber);

        this.updateAccountScrollView(rowNumber);
    },

    updateIndicator: function (currentPage) {

        for (var i = 0; i < this.indicators.length; i++) {

            var dot = this.indicators[i];

            dot.skin = (i === currentPage)
                ? "sknDotSelected"
                : "sknDotUnselected";

            dot.animate(
                kony.ui.createAnimation({
                    100: {
                        width: (i === currentPage) ? "20dp" : "10dp"
                    }
                }),
                {
                    duration: 0.30,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                }
            );
        }

        this.view.flxDots.forceLayout();
    },

    createIndicators: function () {

        this.view.flxDots.removeAll();
        this.indicators = [];

        var pageCount = this.view.segAccounts.data.length;

        for (var i = 0; i < pageCount; i++) {

            var dot = new kony.ui.FlexContainer({

                id: "flxDot" + i,
                width: (i === 0) ? "20dp" : "10dp",
                height: "10dp",
                left: (i === 0) ? "140dp" : "4dp",
                centerX: (i === 0) ? "45%" : "",
                centerY: "50%",
                skin: (i === 0)
                    ? "sknDotSelected"
                    : "sknDotUnselected"

            }, {}, {});

            this.view.flxDots.add(dot);
            this.indicators.push(dot);
        }

        this.view.flxDots.forceLayout();

        this.updateIndicator(0);

    },
    onScrollCardsEnd: function (eventobject) {

        var scrollX = eventobject.contentOffsetMeasured.x;

        var nearestPage = this.cardPage;
        var minDistance = Number.MAX_VALUE;

        for (var i = 0; i < this.cards.length; i++) {

            var distance = Math.abs(scrollX - this.getSnapPoint(i));

            if (distance < minDistance) {

                minDistance = distance;
                nearestPage = i;
            }
        }

        if (nearestPage !== this.cardPage) {

            this.cardPage = nearestPage;
        }

        this.view.flxScrollCards.setContentOffset({

            x: this.getSnapPoint(this.cardPage),
            y: 0

        }, true);

        this.animateCards(this.cardPage);
    },

    animateCards: function (page) {

        for (var i = 0; i < this.cards.length; i++) {

            var transform = kony.ui.makeAffineTransform();

            if (i === page) {
                transform.scale(1, 1);
            }
            else {
                transform.scale(0.96, 0.96);
            }

            this.cards[i].mainContainer.animate(

                kony.ui.createAnimation({

                    100: {

                        transform: transform,
                        opacity: (i === page) ? 1 : 0.85

                    }

                }),

                {

                    duration: 0.18,
                    fillMode: kony.anim.FILL_MODE_FORWARDS

                },

                null
            );
        }
    },

    updateAccountScrollView: function (selectedIndex) {
        //Temporary diagnostic: the default is now 1, yet the dashboard still opens on the accounts
        //pane — so something is calling this again with 0 after render.
        kony.print("POC DASH: updateAccountScrollView(" + selectedIndex + ")");

        if (selectedIndex === 0) {

            this.view.flxScrollAccounts.isVisible = true;
            this.view.flxBottomInfo.isVisible = false;

        } else {

            this.view.flxScrollAccounts.isVisible = false;
            this.view.flxBottomInfo.isVisible = true;

        }

        this.view.forceLayout();
    },

    getSnapPoint: function (index) {

        this.view.forceLayout();

        var viewportWidth = this.view.flxScrollCards.frame.width;
        var cardWidth = this.cards[index].mainContainer.frame.width;

        var sidePadding = (viewportWidth - cardWidth) / 2;

        var snap = this.cards[index].mainContainer.frame.x - sidePadding;

        return Math.max(0, snap);
    }
});