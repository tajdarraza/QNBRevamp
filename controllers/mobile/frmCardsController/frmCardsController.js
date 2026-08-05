define({
    cardData: [],
    onNavigate: function (navData) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        //Was this.onPostShow, which does not exist on this controller — postShow never fired.
        this.view.postShow = this.postShow;
        this.view.onDeviceBack = this.onDeviceBack;
        this.view.imgFooter1.onTouchEnd = this.imgFooter1;

        //Only Home was wired; the rest were dead taps on a screen that is in the demo path.
        this.view.imgFooter2.onTouchEnd = this.onFooterCards;
        this.view.imgFooter3.onTouchEnd = this.onFooterPayments;
        this.view.imgFooter4.onTouchEnd = this.onFooterTransfers;
        this.view.imgFooter5.onTouchEnd = this.onFooterMenu;

        this.view.segCards.onSwipe = this.onSwipeCards;
        this.data = navData;
    },

    //onDeviceBack was assigned above but never defined, so hardware back did nothing here.
    onDeviceBack: function () {
        new kony.mvc.Navigation("frmDashboard").navigate();
    },

    onFooterCards: function () {
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
        try {
            new kony.mvc.Navigation("frmMoreActions").navigate();
        } catch (e) {
            kony.print("frmMenu not available yet :: " + e);
            new kony.mvc.Navigation("frmMoreActions").navigate();
        }
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
        var self = this;
        applyHeaderIdentity(this.view);
        this.hideUnwiredSections();

        //Service-driven. The inline cardData in onInit is only a fallback if the call returns
        //nothing; setCardData() re-attaches the flip/menu handlers either way.
        pocFetchCards(function (rows) {
            if (rows && rows.length) {
                self.cardData = pocMapCardsForCardsScreen(rows);
                kony.print("POC CARDS SCREEN: rendering " + rows.length + " real cards");
            } else {
                //Empty rather than fabricated. Fake cards on a banking screen read as real.
                kony.print("POC CARDS SCREEN: customer has no cards — showing empty state");
                self.cardData = [];
            }
            self.setCardData();
            self.createIndicators();
        });
    },

    //frmCards carries a copy of the dashboard's "My cards" scroller plus an accounts segment and tab
    //strip. None of it is wired by this controller, none of it appears on the Cards screen in the
    //design, and it renders the form's design-time defaults ("Tajdar Raza", 2325-4564-3456-3971).
    //Hide it rather than show fabricated card holders next to the real ones.
    hideUnwiredSections: function () {
        var ids = ["flxCardsHeader", "flxScrollCards", "flxThreeTab", "flxScrollAccounts"];
        for (var i = 0; i < ids.length; i++) {
            try {
                if (this.view[ids[i]]) { this.view[ids[i]].setVisibility(false); }
            } catch (e) {
                kony.print("hideUnwiredSections " + ids[i] + " :: " + e);
            }
        }
    },
    postShow: function () {

    },
    imgFooter1: function () {
        new kony.mvc.Navigation("frmDashboard").navigate();
    },
    onClickPayCard: function () {
        //Design flow is Cards -> Pay card -> CHOOSE YOUR CARD -> Pay card. Going straight to
        //frmPayCard skipped the selection, so it had no card and fell back to the hardcoded
        //45,000/60,000 figures.
        new kony.mvc.Navigation("frmChooseCard").navigate();
    },
    


    setCardData: function () {
        for (var i = 0; i < this.cardData.length; i++) {

            this.cardData[i].imgFlipFrontCard = {
                onTouchEnd: this.flipCard.bind(this, i)
            };

            this.cardData[i].imgFlipBack = {
                onTouchEnd: this.flipCard.bind(this, i)
            };
            //The eye beside the CVV. Bound per row like the flip icons; the segment's widgetdatamap
            //already lists imgCVV, so the handler reaches it.
            this.cardData[i].imgCVV = {
                src: this.cardData[i].revealed ? "eyevisible.png" : "eyeclose.png",
                onTouchEnd: this.onToggleCvv.bind(this, i)
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

    //--- CVV eye toggle -------------------------------------------------------------------------
    //PLACEHOLDER, NOT A REVEAL. The real CVV comes from `cardDisplaySec`, which is gated by
    //biometric or OTP (cardDisplayOtp -> fpStatus). That integration was written and then removed on
    //2026-08-05: the OTP screen it needs is a whole journey production implements as
    //flxVirtualCardOTP, and it is not worth it for the POC. The working service module is kept at
    //scratchpad/CardSecureService.js.reference if it is ever wanted back — including the detail that
    //cost the most to find, that `cuid` comes from the `cardlist` service and from nowhere else.
    //
    //This shows sample digits so the toggle and the design can be demonstrated. NOTHING HERE IS REAL
    //CARD DATA.
    cvvSampleText: "123",

    onToggleCvv: function (rowIndex) {
        var row = this.cardData[rowIndex];
        if (!row) { return; }

        row.revealed = !row.revealed;
        row.lblCVVNum = row.revealed ? this.cvvSampleText : "•••";
        row.imgCVV = {
            src: row.revealed ? "eyevisible.png" : "eyeclose.png",
            onTouchEnd: this.onToggleCvv.bind(this, rowIndex)
        };

        this.cardData[rowIndex] = row;
        try {
            this.view.segCards.setDataAt(row, rowIndex);
        } catch (e) {
            kony.print("POC CARDS: CVV toggle setDataAt :: " + e);
        }
        kony.print("POC CARDS: CVV sample " + (row.revealed ? "shown" : "hidden") +
            " on row " + rowIndex);
    },

    //Guards the double-fire: both imgFlipFrontCard and imgFlipBack carry this handler and a single
    //tap delivers it twice, which would flip and immediately unflip.
    flipBusyRow: -1,

    flipCard: function (rowIndex, widget) {
        var self = this;

        if (this.flipBusyRow === rowIndex) {
            kony.print("POC CARDS: flip row=" + rowIndex + " ignored (duplicate delivery)");
            return;
        }
        //Kony's JS runtime has no setTimeout — the rest of this codebase uses kony.timer.schedule.
        //Guard the timer too: a failed timer must not leave the row permanently locked.
        this.flipBusyRow = rowIndex;
        try {
            kony.timer.schedule("pocFlipUnlock", function () {
                self.flipBusyRow = -1;
                try { kony.timer.cancel("pocFlipUnlock"); } catch (e) { }
            }, 0.4, false);
        } catch (e) {
            kony.print("POC CARDS: flip unlock timer :: " + e);
            this.flipBusyRow = -1;
        }

        var rowData = this.cardData[rowIndex];
        if (!rowData) {
            kony.print("POC CARDS: flipCard has no row " + rowIndex);
            return;
        }

        var swap = function () {
            rowData.showBack = !rowData.showBack;
            rowData.flxCardFrontView = { isVisible: !rowData.showBack };
            rowData.flxCardBackView = { isVisible: rowData.showBack };
            self.cardData[rowIndex] = rowData;
            try {
                self.view.segCards.setDataAt(rowData, rowIndex);
                kony.print("POC CARDS: flipped row " + rowIndex + " showBack=" + rowData.showBack);
            } catch (e) {
                kony.print("POC CARDS: setDataAt failed :: " + e);
            }
        };

        //ANIMATE FIRST, THEN SWAP. The swap calls setDataAt, which re-renders the row — animating
        //afterwards applies the transform to a widget the segment has just rebuilt, so the shrink was
        //invisible. That is the regression the other dev noticed: the animation is still here, it was
        //just running against a dead widget.
        //
        //The original ran the swap from the animation's `animationEnd`, which NEVER FIRES on this
        //build — the card shrank and never turned over. kony.timer does fire (the unlock timer below
        //is proof), so the delay is driven from a timer instead, and a scheduling failure falls
        //straight through to a synchronous swap rather than leaving the card stuck.
        //
        //Pulse down and back in one animation: FILL_MODE_FORWARDS used to leave the card permanently
        //at 0.95, which is why it looked "flatter" after each flip.
        var animated = false;
        try {
            var card = widget;
            for (var up = 0; up < 3 && card && card.parent; up++) { card = card.parent; }
            if (card && typeof card.animate === "function") {
                var shrink = kony.ui.makeAffineTransform();
                shrink.scale(0.95, 0.95);
                var normal = kony.ui.makeAffineTransform();
                normal.scale(1, 1);
                card.animate(
                    kony.ui.createAnimation({
                        "50": { transform: shrink,
                            stepConfig: { timingFunction: kony.anim.EASE_OUT } },
                        "100": { transform: normal,
                            stepConfig: { timingFunction: kony.anim.EASE_OUT_BACK } }
                    }),
                    { duration: 0.28, fillMode: kony.anim.FILL_MODE_REMOVE }, {});
                animated = true;
            } else {
                kony.print("POC CARDS: flip animation skipped — no animatable parent from the icon");
            }
        } catch (e) {
            kony.print("POC CARDS: flip animation skipped :: " + e);
        }

        if (!animated) { swap(); return; }

        //Mid-pulse, so the face changes while the card is small — the turn-over the design implies.
        try {
            var tmr = "pocFlipSwap" + rowIndex;
            kony.timer.schedule(tmr, function () {
                try { kony.timer.cancel(tmr); } catch (e2) { }
                swap();
            }, 0.14, false);
        } catch (e) {
            kony.print("POC CARDS: flip swap timer :: " + e);
            swap();
        }
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

        //Kony returns NULL — not [] — for an empty segment, so this threw the moment the fallback
        //cards were removed and a cardless customer produced an empty list.
        var data = this.view.segCards.data;
        var pageCount = (data && data.length) ? data.length : 0;

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