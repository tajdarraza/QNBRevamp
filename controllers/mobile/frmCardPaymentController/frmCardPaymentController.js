define({

    utilisedAmount: 45000,
    totalLimit: 60000,
    navData: null,

    onNavigate: function (data) {
        this.navData = data;
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;
        this.view.btnReturnCards.onClick = this.returnToCards;
        this.view.onDeviceBack = this.onDeviceBack;
    },

    preShow: function () {
        this.initSuccessAnimation();

    },
    postShow: function () {
        this.playSuccessAnimation();
    },
    onDeviceBack: function(){
        new kony.mvc.Navigation("frmPayCardConfrmPay").navigate(this.navData);
    },
    onAmountChange: function () {


    },

    returnToCards: function () {
        new kony.mvc.Navigation("frmCards").navigate();
    },

    initSuccessAnimation: function () {

        this.view.flxSuccess.opacity = 1;

        this.view.flxRipple.opacity = 0;
        var rippleTransform = kony.ui.makeAffineTransform();
        rippleTransform.scale(0.2, 0.2);
        this.view.flxRipple.transform = rippleTransform;


        var circleTransform = kony.ui.makeAffineTransform();
        circleTransform.scale(0.2, 0.2);
        this.view.flxCircle.transform = circleTransform;


        var whiteTransform = kony.ui.makeAffineTransform();
        whiteTransform.scale(0.2, 0.2);
        this.view.flxWhite.transform = whiteTransform;

        this.view.imgPaymentTick.opacity = 0;
        var tickTransform = kony.ui.makeAffineTransform();
        tickTransform.scale(0.2, 0.2);
        this.view.imgPaymentTick.transform = tickTransform;

    },

    playSuccessAnimation: function () {

        var self = this;

        var rippleStart = kony.ui.makeAffineTransform();
        rippleStart.scale(0.2, 0.2);

        var rippleBig = kony.ui.makeAffineTransform();
        rippleBig.scale(1.45, 1.45);

        var rippleSmall = kony.ui.makeAffineTransform();
        rippleSmall.scale(0.96, 0.96);

        var rippleNormal = kony.ui.makeAffineTransform();
        rippleNormal.scale(1, 1);

        self.view.flxRipple.opacity = 1;
        self.view.flxRipple.transform = rippleStart;

        self.view.flxRipple.animate(

            kony.ui.createAnimation({

                "60": {
                    transform: rippleBig,
                    opacity: 0.45
                },

                "85": {
                    transform: rippleSmall,
                    opacity: 1
                },

                "100": {
                    transform: rippleNormal,
                    opacity: 1
                }

            }),

            {
                duration: 0.9,
                fillMode: kony.anim.FILL_MODE_FORWARDS
            },

            {}

        );


        var circleBig = kony.ui.makeAffineTransform();
        circleBig.scale(1.15, 1.15);

        var circleNormal = kony.ui.makeAffineTransform();
        circleNormal.scale(1, 1);

        self.view.flxCircle.animate(

            kony.ui.createAnimation({

                "50": {
                    transform: circleBig
                },

                "100": {
                    transform: circleNormal
                }

            }),

            {
                duration: 0.45,
                fillMode: kony.anim.FILL_MODE_FORWARDS
            },

            {}

        );

        kony.timer.schedule("whiteCircle", function () {

            self.view.flxWhite.animate(

                kony.ui.createAnimation({

                    "100": {

                        transform: circleNormal

                    }

                }),

                {
                    duration: 0.25,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },

                {}

            );

        }, 0.15, false);



        //------------------------------------
        // Tick
        //------------------------------------

        kony.timer.schedule("tickAnim", function () {

            var tickBig = kony.ui.makeAffineTransform();
            tickBig.scale(1.25, 1.25);
            tickBig.rotate(-15);

            var tickNormal = kony.ui.makeAffineTransform();
            tickNormal.scale(1, 1);

            self.view.imgPaymentTick.opacity = 1;

            self.view.imgPaymentTick.animate(

                kony.ui.createAnimation({

                    "60": {

                        transform: tickBig,
                        opacity: 1

                    },

                    "100": {

                        transform: tickNormal,
                        opacity: 1

                    }

                }),

                {
                    duration: 0.35,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },

                {}

            );

        }, 0.35, false);

    },

});