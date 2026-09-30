define(["Navigation"], function (Navigation) {
    return {
        indicators: [],
        cards: [],
        cardPage: 0,
        accountPage: 0,
        snapPoints: [],
        cardData: [],
        allAccounts: [],
        isSnapping: false,
        data: "",

        serverAccounts: [],
        serverDashRows: [],
        serverCards: [],
        dataLoaded: false,
        pendingCalls: 0,

        loadServerData: function () {
            var self = this;

            if (!nullCheck(gblQNB.atkn)) {
                kony.print("POC DASH: no auth token — staying on fallback data");
                return;
            }

            self.pendingCalls = 3;
            self.armDashWatchdog();

            invokeServiceAsync(
                QNBConstants.serviceName.dashBoard,
                createHeaderObj("", true),
                {},
                function (s, r) {
                    self.onAccounts(s, r);
                },
            );

            pocFetchCards(function (rows) {
                if (rows && rows.length) {
                    self.serverCards = pocMapCardsForScroller(rows);
                    kony.print("POC DASH: mapped " + rows.length + " cards");
                }

                self.onCallDone();
            });

            invokeServiceAsync(
                QNBConstants.serviceName.getLastLogin,
                createHeaderObj("", true),
                {},
                function (s, r) {
                    self.onLastLogin(s, r);
                },
            );
        },

        onAccounts: function (status, res) {
            var self = this;

            try {
                var st =
                    res && res.status_getAcctListFx ? res.status_getAcctListFx.code : "?";

                kony.print(
                    "POC DASH: DashboardComposite status=" + status + " code=" + st,
                );

                var accs = [];

                if (res && res.data_getAcctListFx && res.data_getAcctListFx.units) {
                    var units = res.data_getAcctListFx.units;

                    for (var u = 0; u < units.length; u++) {
                        var list = units[u].acclist || [];

                        for (var a = 0; a < list.length; a++) {
                            accs.push(list[a]);
                        }
                    }
                }

                if (accs.length) {
                    kony.print("POC DASH: raw acclist[0] = " + JSON.stringify(accs[0]));

                    self.serverAccounts = self.mapAccountRows(accs);
                    self.serverDashRows = self.mapDashboardRows(accs);

                    kony.print(
                        "POC DASH: mapped " +
                        accs.length +
                        " accounts, first balance='" +
                        self.serverAccounts[0].lblAmount +
                        "' " +
                        self.serverAccounts[0].lblCurrency,
                    );
                } else {
                    kony.print(
                        "POC DASH: no account data from server — using fallback data",
                    );
                }
            } catch (e) {
                kony.print("POC DASH: account map failed :: " + e);
            }

            self.onCallDone();
        },

        onLastLogin: function (status, res) {
            try {
                kony.print("POC DASH: getLastLogin status=" + status);

                var d = res && res.data && res.data.length ? res.data[0] : res;

                if (d && nullCheck(d.tlp)) {
                    gblQNB.tlp = d.tlp;
                }

                if (d && nullCheck(d.fln)) {
                    gblQNB.fln = d.fln;

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

            if (this.pendingCalls > 0) {
                return;
            }

            this.cancelDashWatchdog();
            this.dataLoaded = true;

            try {
                this.view.loading.hideLoader(this);
            } catch (e) { }

            this.renderAll();
        },

        amountText: function (v) {
            if (v === null || v === undefined || v === "") {
                return "0.00";
            }

            if (typeof v === "number") {
                return formatAmount(v);
            }

            return "" + v;
        },

        mapAccountRows: function (accs) {
            var rows = [];

            for (var i = 0; i < accs.length; i++) {
                var a = accs[i];

                var accountType = "";
                var desc = nullCheck(a.accTypeDesc)
                    ? ("" + a.accTypeDesc).toUpperCase()
                    : "";

                var rawType = nullCheck(a.accType) ? ("" + a.accType).toUpperCase() : "";

                if (
                    rawType === "CA" ||
                    rawType.indexOf("CURRENT") > -1 ||
                    desc.indexOf("CURRENT") > -1
                ) {
                    accountType = "Current";
                } else if (
                    rawType === "SA" ||
                    rawType.indexOf("SAVING") > -1 ||
                    desc.indexOf("SAVING") > -1
                ) {
                    accountType = "Savings";
                } else if (nullCheck(a.accountType)) {
                    accountType = "" + a.accountType;
                }

                var separatorSkin =
                    accountType === "Current"
                        ? "sknFlxRounderdSeperator2a59bd"
                        : "sknFlxRounderdSeperatorAC2672";

                kony.print(
                    "POC DASH :: ACCOUNT " +
                    i +
                    " :: type=" +
                    accountType +
                    " :: skin=" +
                    separatorSkin,
                );

                rows.push({
                    accountType: accountType,
                    lblAccName: nullCheck(a.accTypeDesc) ? a.accTypeDesc : "Account",
                    lblAccNum: nullCheck(a.accNumFormat) ? a.accNumFormat : "",
                    lblAmount: this.amountText(a.avlBal),
                    lblCurrency: nullCheck(a.curr) ? a.curr : "",
                    flxSeperator: {
                        skin: separatorSkin,
                    },
                });
            }

            return rows;
        },

        amountSkinFor: function (intPart) {
            var digits = ("" + intPart).replace(/[^0-9]/g, "").length;

            if (digits >= 15) {
                return "sknLblAmount60PxBold1b124b";
            }

            if (digits >= 11) {
                return "sknLblAmount60PxBold1b124b";
            }

            return "sknLblAmount85PxBold1b124b";
        },

        mapDashboardRows: function (accs) {
            var rows = [];

            var total = 0,
                current = 0,
                savings = 0,
                cur = "QAR";

            for (var t = 0; t < accs.length; t++) {
                var acc = accs[t];

                var base =
                    typeof acc.accBalBase === "number"
                        ? acc.accBalBase
                        : amountNumber(acc.accBalRaw || acc.avlBal);

                total += base;

                var isCurrent =
                    acc.accType === "CA" ||
                    (nullCheck(acc.accTypeDesc) &&
                        acc.accTypeDesc.toUpperCase().indexOf("CURRENT") > -1);

                if (isCurrent) {
                    current += base;
                } else {
                    savings += base;
                }
            }

            var totalText = formatAmount(total);
            var tParts = totalText.split(".");

            var pct = function (v) {
                if (total <= 0) {
                    return "0%";
                }

                return Math.round((v / total) * 100) + "%";
            };

            kony.print(
                "POC DASH: total=" +
                totalText +
                " current=" +
                formatAmount(current) +
                " savings=" +
                formatAmount(savings) +
                " over " +
                accs.length +
                " accounts",
            );

            var amountSkin = this.amountSkinFor(tParts[0]);

            rows.push({
                lblAccountType: "Total balance",
                imgAccType: "eyevisible1.png",
                lblAccBalance: {
                    text: tParts[0],
                    skin: amountSkin,
                },
                lblDecimal: "." + (tParts[1] || "00"),
                lblCurr: cur,
                lblActualBal: "Loans remaining balance: ",
                lblBalance: "0.00 QAR",
                lblAllAccounts: "All accounts",
                imgAllAccount: "iconright1.png",
                lblCurrent: "Current",
                lblSavings: "Savings",
                flxAllAccounts: {
                    isVisible: true,
                },
                flxActualBalance: {
                    isVisible: false,
                },
            });

            for (var i = 0; i < accs.length; i++) {
                var a = accs[i];
                var full = this.amountText(a.avlBal);
                var parts = full.split(".");

                rows.push({
                    lblAccountType: nullCheck(a.accTypeDesc) ? a.accTypeDesc : "Account",
                    imgAccType: "eyevisible1.png",
                    lblAccBalance: {
                        text: parts[0],
                        skin: this.amountSkinFor(parts[0]),
                    },
                    lblDecimal: "." + (parts[1] || "00"),
                    lblCurr: nullCheck(a.curr) ? a.curr : "",
                    lblActualBal: "Actual balance  ",
                    lblBalance: full + " " + (nullCheck(a.curr) ? a.curr : ""),
                    lblAllAccounts: "All accounts",
                    imgAllAccount: "iconright1.png",
                    lblSavings: "",
                    lblCurrent: "",
                    flxGraphics: {
                        isVisible: false,
                    },
                    flxAllAccounts: {
                        isVisible: true,
                    },
                    flxActualBalance: {
                        isVisible: true,
                    },
                });
            }

            return rows;
        },

        mapCardRows: function (list) {
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
                    dueDay: nullCheck(c.pd) ? "Due " + c.pd : "No Due",
                    payNow: "Pay Now",
                });
            }

            while (rows.length > 0 && rows.length < 4) {
                var pad = JSON.parse(JSON.stringify(rows[rows.length - 1]));

                pad.id = rows.length + 1;
                rows.push(pad);
            }

            return rows;
        },

        getFallbackCardData: function () {
            return [
                {
                    id: 1,
                    cardImage: "card.png",
                    accountType: "Credit",
                    nickName: "Primary Card",
                    holderName: "Mohammad Raza",
                    cardNumber: "**** **** **** 4589",
                    dueDay: "Due in 6 days",
                    payNow: "Pay Now",
                },
                {
                    id: 2,
                    cardImage: "card.png",
                    accountType: "Diners",
                    nickName: "Travel Card",
                    holderName: "Mohammad Raza",
                    cardNumber: "**** **** **** 9132",
                    dueDay: "Due Tomorrow",
                    payNow: "Pay Now",
                },
                {
                    id: 3,
                    cardImage: "card.png",
                    accountType: "Credit",
                    nickName: "Shopping Card",
                    holderName: "Mohammad Raza",
                    cardNumber: "**** **** **** 7721",
                    dueDay: "Due in 12 days",
                    payNow: "Pay Now",
                },
                {
                    id: 4,
                    cardImage: "card.png",
                    accountType: "Debit",
                    nickName: "Salary Account",
                    cardNumber: "**** **** **** 1122",
                    holderName: "Mohammad Raza",
                    dueDay: "No Due",
                    payNow: "View",
                },
            ];
        },

        getFallbackAccountData: function () {
            return [
                {
                    accountType: "Savings",
                    lblAccName: "Fixed deposit account",
                    lblAccNum: "0031-3256-7253",
                    lblAmount: "8,900.00",
                    lblCurrency: "QAR",
                    flxSeperator: {
                        skin: "sknFlxRounderdSeperator2a59bd",
                    },
                },
                {
                    accountType: "Savings",
                    lblAccName: "eSaver account",
                    lblAccNum: "0067-9756-2762",
                    lblAmount: "45,120.80",
                    lblCurrency: "QAR",
                    flxSeperator: {
                        skin: "sknFlxRounderdSeperatorAC2672",
                    },
                },
                {
                    accountType: "Current",
                    lblAccName: "Current account (USD)",
                    lblAccNum: "0002-2344-2793",
                    lblAmount: "12,450.75",
                    lblCurrency: "QAR Equivalent",
                    flxSeperator: {
                        skin: "sknFlxRounderdSeperatorAC2672",
                    },
                },
                {
                    accountType: "Current",
                    lblAccName: "Current account 2 (USD)",
                    lblAccNum: "0002-2344-3793",
                    lblAmount: "1,450.75",
                    lblCurrency: "QAR Equivalent",
                    flxSeperator: {
                        skin: "sknFlxRounderdSeperatorAC2672",
                    },
                },
            ];
        },

        getFallbackDashboardData: function () {
            return [
                {
                    lblAccountType: "Current Account",
                    imgAccType: "eyevisible1.png",
                    lblAccBalance: "12,450",
                    lblDecimal: ".75",
                    lblCurr: "QAR",
                    lblActualBal: "Actual balance  ",
                    lblBalance: "12,450.75 QAR",
                    lblAllAccounts: "All accounts",
                    imgAllAccount: "iconright1.png",
                    lblSavings: "Current",
                    lblCurrent: "Saving",
                },
                {
                    lblAccountType: "Savings Account",
                    imgAccType: "eyevisible1.png",
                    lblAccBalance: "35,220",
                    lblDecimal: ".10",
                    lblCurr: "QAR",
                    lblActualBal: "Available Balance",
                    lblBalance: "QAR 35,220.10",
                    lblAllAccounts: "All accounts",
                    imgAllAccount: "iconright1.png",
                    lblSavings: "QAR 28K",
                    lblCurrent: "QAR 7.2K",
                },
                {
                    lblAccountType: "Fixed Deposit",
                    imgAccType: "eyevisible1.png",
                    lblAccBalance: "100,000",
                    lblDecimal: ".00",
                    lblCurr: "QAR",
                    lblActualBal: "Maturity Value",
                    lblBalance: "100,000.00 QAR",
                    lblAllAccounts: "All accounts",
                    imgAllAccount: "iconright1.png",
                    lblSavings: "QAR 90K",
                    lblCurrent: "QAR 10K",
                },
                {
                    lblAccountType: "USD Account",
                    imgAccType: "eyevisible1.png",
                    lblAccBalance: "5,400",
                    lblDecimal: ".25",
                    lblCurr: "USD",
                    lblActualBal: "Available Balance",
                    lblBalance: "5,400.25 USD",
                    lblAllAccounts: "All accounts",
                    imgAllAccount: "iconright1.png",
                    lblSavings: "USD 4.2K",
                    lblCurrent: "USD 1.2K",
                },
            ];
        },

        armDashWatchdog: function () {
            var self = this;

            kony.timer.schedule(
                "pocDashWatchdog",
                function () {
                    kony.timer.cancel("pocDashWatchdog");

                    kony.print(
                        "POC DASH: timed out with " +
                        self.pendingCalls +
                        " call(s) unanswered — " +
                        "keeping fallback data. If POC_BYPASS_OTP is true, the pre-OTP token was likely rejected.",
                    );

                    self.pendingCalls = 0;

                    try {
                        self.view.loading.hideLoader(self);
                    } catch (e) { }
                },
                45,
                false,
            );
        },

        cancelDashWatchdog: function () {
            try {
                kony.timer.cancel("pocDashWatchdog");
            } catch (e) { }
        },


        onNavigate: function (navData) {
            this.view.init = this.onInit;
            this.view.preShow = this.preShow;

            this.view.cmpFooter.initializeFooter();
            this.view.cmpFooter.setSelectedTab("home");

            this.view.postShow = this.onPostShow;
            this.view.onDeviceBack = this.onDeviceBack;
            this.view.flxScrollCards.onScrollEnd = this.onScrollCardsEnd;

            this.view.cmpHeader.configure({
                mode: "normal",
                firstName: "Mohammad",
                lastName: "Raza",
                notificationCount: 5,
            });

            this.data = navData;

            if (Navigation.getStack().length === 0) {
                Navigation.startFlow("frmDashboard", navData);
            }
        },


        setHeaderIdentity: function () {
            applyHeaderIdentity(this.view);
        },

        hideRecentActivity: function () {
            try {
                if (this.view.transactions) {
                    this.view.transactions.setVisibility(false);
                }
            } catch (e) {
                kony.print("hideRecentActivity :: " + e);
            }
        },

        applyCardsSectionVisibility: function () {
            var show = !!(this.serverCards && this.serverCards.length);

            var ids = ["flxCardsHeader", "flxScrollCards"];

            for (var i = 0; i < ids.length; i++) {
                try {
                    if (this.view[ids[i]]) {
                        this.view[ids[i]].setVisibility(show);
                    }
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
                flxSeperator: "flxSeperator",
            };

            this.view.segAccounts.widgetDataMap = {
                lblAccountType: "lblAccountType",
                imgAccType: "imgAccType",
                lblAccBalance: "lblAccBalance",
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
                flxAllAccounts: "flxAllAccounts",
                flxMenu1: "flxMenu1",
                flxMenu2: "flxMenu2",
                flxMenu3: "flxMenu3",
                flxMenu4: "flxMenu4",
            };
        },

        setAccountData: function () {
            var data =
                this.serverAccounts && this.serverAccounts.length
                    ? this.serverAccounts
                    : this.getFallbackAccountData();

            if (this.serverAccounts && this.serverAccounts.length) {
                kony.print("POC DASH: using server account data");
            } else {
                kony.print("POC DASH: using fallback account data");
            }

            this.allAccounts = data;
            this.view.segAllAccounts.setData(data);
        },

        maxCarouselAccounts: 5,

        setAccountDashboardData: function () {
            var rows =
                this.serverDashRows && this.serverDashRows.length
                    ? this.serverDashRows
                    : this.getFallbackDashboardData();

            if (this.serverDashRows && this.serverDashRows.length) {
                kony.print("POC DASH: using server dashboard data");

                if (rows.length > this.maxCarouselAccounts) {
                    kony.print(
                        "POC DASH: carousel capped at " +
                        this.maxCarouselAccounts +
                        " of " +
                        rows.length +
                        " accounts — the rest are on All accounts",
                    );

                    rows = rows.slice(0, this.maxCarouselAccounts);
                }

                rows = JSON.parse(JSON.stringify(rows));
            } else {
                kony.print("POC DASH: using fallback dashboard data");
            }

            if (
                this.data &&
                this.data.hasOwnProperty("hideBalance") &&
                this.data.hideBalance
            ) {
                for (var r = 0; r < rows.length; r++) {
                    rows[r].lblAccBalance = "************";
                    rows[r].lblDecimal = "";
                    rows[r].lblCurr = "";
                }
            }

            this.bindQuickActions(rows);
            this.view.segAccounts.setData(rows);
            this.updateDashboard(0);
        },

        bindQuickActions: function (rows) {
            var self = this;

            for (var i = 0; i < rows.length; i++) {
                rows[i].flxMenu1 = {
                    onTouchEnd: function () {
                        self.goTo("frmFawran", "Fawran");
                    },
                };

                rows[i].flxMenu2 = {
                    onTouchEnd: function () {
                        self.goTo("frmPayments", "Pay Bill");
                    },
                };

                rows[i].flxMenu3 = {
                    onTouchEnd: function () {
                        self.goTo("frmChooseCard", "Pay card");
                    },
                };

                rows[i].flxMenu4 = {
                    onTouchEnd: function () {
                        self.goTo("frmMoreActions", "Menu");
                    },
                };

                rows[i].flxAllAccounts = {
                    onTouchEnd: function () {
                        self.goTo("frmAccounts", "All accounts");
                    },
                };
            }
        },

        goTo: function (formName, label) {
            kony.print("POC DASH: quick action " + label + " -> " + formName);

            try {
                Navigation.navigate(formName);
            } catch (e) {
                kony.print("POC DASH: " + formName + " not available :: " + e);
                pocNotBuilt(label);
            }
        },

        updateDashboard: function () {
            var data = this.view.segAccounts.data;

            for (var i = 0; i < data.length; i++) {
                data[i].flxGraphics = {
                    isVisible: i === 0,
                };

                data[i].flxMenuOptions = {
                    isVisible: i !== 0,
                };
            }

            this.bindQuickActions(data);
            this.view.segAccounts.setData(data);
        },

        onInit: function () {
            this.cardData = [];

            this.widgetMap();
            this.updateAccountScrollView(0);
        },

        initProgressView: function () {
            if (!this.view.circularchart) {
                kony.print("POC DASH: circularchart component not found");
                return;
            }

            var totalLoan = 100000;
            var totalPaid = 35000;

            kony.print("POC DASH: Circular chart totalLoan = " + totalLoan);
            kony.print("POC DASH: Circular chart totalPaid = " + totalPaid);

            this.view.circularchart.configure(totalLoan, totalPaid, 5);
        },

        preShow: function () {
            try {
                this.initProgressView();

                if (this.view.circularchart) {
                    this.view.circularchart.setOnClick(
                        this.navigateToLoan.bind(this)
                    );
                }

                if (!USE_MOCK_SERVICES && !this.dataLoaded && this.pendingCalls === 0) {
                    try {
                        this.view.loading.show(this, "Loading...");
                    } catch (e) { }

                    this.loadServerData();
                    return;
                }

                this.renderAll();
            } catch (e) {
                alert(e);
            }
        },

        navigateToLoan: function () {
            Navigation.navigate("frmLoanDashboard");
        },

        renderAll: function () {
            this.setHeaderIdentity();

            if (this.serverCards && this.serverCards.length) {
                this.cardData = this.serverCards;
                kony.print("POC DASH: rendering server cards");
            } else {
                this.cardData = this.getFallbackCardData();
                kony.print("POC DASH: rendering fallback cards");
            }

            this.applyCardsSectionVisibility();
            this.hideRecentActivity();

            this.initializeCards();
            this.bindCardData();

            this.setAccountDashboardData();
            this.setAccountData();

            this.createIndicators();

            this.configureTabs();

            this.updateDashboard();

            var currentPage = this.view.segAccounts.selectedRowIndex
                ? this.view.segAccounts.selectedRowIndex[1]
                : 0;

            this.updateIndicator(currentPage);
            this.updateAccountScrollView(0);

            this.view.segAccounts.onSwipe = this.onSwipeAccounts.bind(this);
        },

        onPostShow: function () { },

        onDeviceBack: function () {
            Navigation.goBack();
        },


        configureTabs: function () {
            var self = this;

            kony.print("POC DASH :: CONFIGURING ACCOUNT TABS");

            this.view.multipletab.initialize({
                selectedIndex: 0,
                flxFourTabSkin: "sknParent72PxBgf4f3f6",
                tabs: [
                    {
                        flx: "flxTab1",
                        lbl: "lblTab1",
                        text: "All",
                        enabled: true,
                    },
                    {
                        flx: "flxTab2",
                        lbl: "lblTab2",
                        text: "Current",
                        enabled: true,
                    },
                    {
                        flx: "flxTab3",
                        lbl: "lblTab3",
                        text: "Savings",
                        enabled: true,
                    },
                    {
                        flx: "flxTab4",
                        lbl: "lblTab4",
                        text: "",
                        enabled: false,
                    },
                ],
                onTabSelected: function (tab, index) {
                    kony.print(
                        "POC DASH :: TAB CALLBACK :: index=" +
                        index +
                        " tab=" +
                        JSON.stringify(tab),
                    );

                    self.onTabSelected(tab, index);
                },
            });

            kony.print("POC DASH :: MULTIPLETAB INITIALIZED");
        },

        onTabSelected: function (tab, index) {
            kony.print("POC DASH :: TAB " + tab.flx + " INDEX " + index);

            if (index === 0) {
                this.filterAccounts("All");
            } else if (index === 1) {
                this.filterAccounts("Current");
            } else if (index === 2) {
                this.filterAccounts("Savings");
            }
        },

        filterAccounts: function (type) {
            kony.print("POC DASH :: FILTER ACCOUNTS :: " + type);

            if (type === "All") {
                this.view.segAllAccounts.setData(this.allAccounts);

                kony.print("POC DASH :: ALL COUNT = " + this.allAccounts.length);

                return;
            }

            var filteredData = [];

            for (var i = 0; i < this.allAccounts.length; i++) {
                if (this.allAccounts[i].accountType === type) {
                    filteredData.push(this.allAccounts[i]);
                }
            }

            kony.print("POC DASH :: " + type + " COUNT = " + filteredData.length);

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
                },
            ];

            var isAndroid = kony.os.deviceInfo().name;

            if (isAndroid == "android") {
                this.cards[this.cards.length - 1].mainContainer.width = "280dp";
            }
        },

        bindCardData: function () {
            for (var i = 0; i < this.cards.length; i++) {
                var cardData = this.cardData[i];

                this.cards[i].container.cardIndex = i;

                this.cards[i].container.cardData = cardData;

                this.cards[i].container.onClick = this.onCardClick.bind(this);

                this.cards[i].lblPayNow.onTouchEnd = this.onPayNowClick.bind(this);

                if (cardData) {
                    this.loadCard(this.cards[i], cardData);
                    this.cards[i].mainContainer.isVisible = true;
                } else {
                    this.cards[i].mainContainer.isVisible = false;
                }
            }
        },

        loadCard: function (card, data) {
            card.imgCard.src = data.cardImage;
            card.lblCard.text = data.accountType + " card";
            card.lblNickName.text = data.nickName;
            card.lblName.text = data.holderName;
            card.lblCardNumber.text = data.cardNumber;
            card.lblDueDay.text = data.dueDay;
            card.lblPayNow.text = data.payNow;
        },

        onPayNowClick: function () {
            Navigation.navigate("frmChooseCard");
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
        },

        onSwipeAccounts: function (eventobject, sectionNumber, rowNumber) {
            this.accountPage = rowNumber;

            this.updateIndicator(rowNumber);
            this.updateAccountScrollView(rowNumber);
        },

        updateIndicator: function (currentPage) {
            for (var i = 0; i < this.indicators.length; i++) {
                var dot = this.indicators[i];

                dot.skin = i === currentPage ? "sknDotSelected" : "sknDotUnselected";

                dot.animate(
                    kony.ui.createAnimation({
                        100: {
                            width: i === currentPage ? "20dp" : "10dp",
                        },
                    }),
                    {
                        duration: 0.3,
                        fillMode: kony.anim.FILL_MODE_FORWARDS,
                    },
                );
            }

            this.view.flxDots.forceLayout();
        },

        createIndicators: function () {
            this.view.flxDots.removeAll();
            this.indicators = [];

            var accData = this.view.segAccounts.data;

            var pageCount = accData && accData.length ? accData.length : 0;

            for (var i = 0; i < pageCount; i++) {
                var dot = new kony.ui.FlexContainer(
                    {
                        id: "flxDot" + i,
                        width: i === 0 ? "20dp" : "10dp",
                        height: "10dp",
                        left: i === 0 ? "140dp" : "4dp",
                        centerX: i === 0 ? "45%" : "",
                        centerY: "50%",
                        skin: i === 0 ? "sknDotSelected" : "sknDotUnselected",
                    },
                    {},
                    {},
                );

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

            this.view.flxScrollCards.setContentOffset(
                {
                    x: this.getSnapPoint(this.cardPage),
                    y: 0,
                },
                true,
            );

            this.animateCards(this.cardPage);
        },

        animateCards: function (page) {
            for (var i = 0; i < this.cards.length; i++) {
                var transform = kony.ui.makeAffineTransform();

                if (i === page) {
                    transform.scale(1, 1);
                } else {
                    transform.scale(0.96, 0.96);
                }

                this.cards[i].mainContainer.animate(
                    kony.ui.createAnimation({
                        100: {
                            transform: transform,
                            opacity: i === page ? 1 : 0.85,
                        },
                    }),
                    {
                        duration: 0.18,
                        fillMode: kony.anim.FILL_MODE_FORWARDS,
                    },
                    null,
                );
            }
        },

        updateAccountScrollView: function (selectedIndex) {
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
        },
    };
});