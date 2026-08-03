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

    onNavigate: function (navData) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        this.view.postShow = this.onPostShow;
        this.view.onDeviceBack = this.onDeviceBack;
        this.view.flxScrollCards.onScrollEnd = this.onScrollCardsEnd;
        this.view.imgFooter2.onTouchEnd = this.imgFooter2;
        this.data = navData;
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
        this.updateAccountScrollView(0);
    },
    preShow: function () {

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
        this.view.loading.show(this, "Loading...");

        var response = {
            status: "SUCCESS",
            message: "Data fetched successfully",
            accounts: [
                {
                    accountNo: "1234567890",
                    balance: "QAR 12,450.75"
                }
            ]
        };
        serviceCall(response, function (res) {
            var isLoggedIn = kony.store.getItem("isLoggedIn");
            //kony.application.dismissLoadingScreen();

            this.view.loading.hideLoader(this);
            kony.store.setItem("isLoggedIn", true);
            new kony.mvc.Navigation("frmCards").navigate();                //alert(JSON.stringify(res));
        }.bind(this), 4);


        //new kony.mvc.Navigation("frmCards").navigate();
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
        this.view.lblNoti.text = Math.floor(rowNumber + 1).toString();

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