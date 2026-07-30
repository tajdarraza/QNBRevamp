define({
    cardData: [],
    onNavigate: function (navData) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        this.view.postShow = this.onPostShow;
        this.view.onDeviceBack = this.onDeviceBack;
        this.view.imgFooter1.onTouchEnd = this.imgFooter1;
        this.view.segCards.onSwipe = this.onSwipeCards;
        this.data = navData;
    },

    onInit: function () {
        this.cardData = [{
            lblCardName: "Visa credit card",
            lblCardUser: "James Lee",
            lblNameBackCard: "James Lee",
            lblCreditCard: "Credit card",
            lblCardNumber: "**** 0467",
            lblBackCard: "4657 6757 7667 0467",
            imgCard: "qnb_visa.png",
            lblBal: "10,000.00",
            lblAvlblBal: "Available balance",
            lblMenu1: "Pay card",
            lblMenu2: "Smart installments",
            lblMenu3: "Case speed",
            lblMenu4: "Menu",
            imgMenu1: "iconplaceholder2.png",
            imgMenu2: "iconplaceholder3.png",
            imgMenu3: "iconplaceholder4.png",
            imgMenu4: "iconplaceholder5.png",
            lblCreditCardBack: "Credit card",
            lblBackCardNumber: "Card number",
            index: 1,
            imgFlipBack: 'invert.png',
            lblExpirationDate: "Expiry Date",
            lblExpiryDate: "04/29",
            showBack: false,

            flxCardFrontView: {
                isVisible: true
            },

            flxCardBackView: {
                isVisible: false
            },

            imgFlipFrontCard: {
                onTouchEnd: this.flipCard.bind(this)
            },
            imgFlipBack: {
                onTouchEnd: this.flipCard.bind(this)
            },
            flxMenu4: {
                onTouchEnd: this.onMenu4Click
            },
            flxMenu1: {
                onTouchEnd: this.onClickPayCard
            },
        },

        {
            lblCardName: "Visa credit card",
            lblCardUser: "Tajdar Raza",
            lblCreditCard: "Credit card",
            lblBackCard: "4657 6757 7667 1709",
            lblCardNumber: "**** 1709",
            imgCard: "qnb_visa.png",
            lblMenu1: "Pay card",
            lblMenu2: "Smart installments",
            lblMenu3: "Case speed",
            lblMenu4: "Menu",
            lblBal: "90,000.00",
            lblAvlblBal: "Available balance",
            lblNameBackCard: "Tajdar Raza",
            lblCreditCardBack: "Credit card",
            lblBackCardNumber: "Card number",
            imgMenu1: "iconplaceholder2.png",
            imgMenu2: "iconplaceholder3.png",
            imgMenu3: "iconplaceholder4.png",
            imgMenu4: "iconplaceholder5.png",
            index: 2,
            showBack: false,
            imgFlipBack: 'invert.png',
            lblExpirationDate: "Expiry Date",
            lblExpiryDate: "10/27",
            flxCardFrontView: {
                isVisible: true
            },

            flxCardBackView: {
                isVisible: false
            },

            imgFlipFrontCard: {
                onTouchEnd: this.flipCard.bind(this)
            },
            imgFlipBack: {
                onTouchEnd: this.flipCard.bind(this)
            },
            flxMenu4: {
                onTouchEnd: this.onMenu4Click
            },
            flxMenu1: {
                onTouchEnd: this.onClickPayCard
            },
        }


        ];
    },
    preShow: function () {
        this.setCardData();
        this.createIndicators();
    },
    postShow: function () {

    },
    imgFooter1: function () {
        new kony.mvc.Navigation("frmDashboard").navigate();
    },
    onClickPayCard: function () {
        new kony.mvc.Navigation("frmPayCard").navigate();
    },
    


    setCardData: function () {
        for (var i = 0; i < this.cardData.length; i++) {

            this.cardData[i].imgFlipFrontCard = {
                onTouchEnd: this.flipCard.bind(this, i)
            };

            this.cardData[i].imgFlipBack = {
                onTouchEnd: this.flipCard.bind(this, i)
            };
            this.cardData[i].flxMenu4 = {
                onTouchEnd: this.onMenu4Click
            };
            this.cardData[i].flxMenu1 = {
                onTouchEnd: this.onClickPayCard
            };
        }

        this.view.segCards.setData(this.cardData);
    },

    onMenu4Click: function(){
        new kony.mvc.Navigation("frmCardSetting").navigate();
        
    },

    flipCard: function (rowIndex, widget) {

        var self = this;
        var card = widget.parent.parent.parent;   // flxContainer

        var shrink = kony.ui.makeAffineTransform();
        shrink.scale(0.95, 0.95);

        card.animate(
            kony.ui.createAnimation({
                "100": {
                    transform: shrink,
                    stepConfig: {
                        timingFunction: kony.anim.EASE_OUT_BACK
                    }
                }
            }),
            {
                duration: 0.18,
                fillMode: kony.anim.FILL_MODE_FORWARDS
            },
            {
                animationEnd: function () {

                    var rowData = self.cardData[rowIndex];

                    rowData.showBack = !rowData.showBack;

                    rowData.flxCardFrontView = {
                        isVisible: !rowData.showBack
                    };

                    rowData.flxCardBackView = {
                        isVisible: rowData.showBack
                    };

                    self.cardData[rowIndex] = rowData;

                    // Only update the row after the shrink completes
                    self.view.segCards.setDataAt(rowData, rowIndex);

                }
            }
        );
    },

    onSwipeCards: function (eventobject, sectionNumber, rowNumber) {


        this.updateIndicator(rowNumber);

        this.view.lblNoti.text = Math.floor(rowNumber + 1).toString();


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

        var pageCount = this.view.segCards.data.length;

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
});