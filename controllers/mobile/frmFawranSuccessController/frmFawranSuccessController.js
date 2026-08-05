define({

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.postShow = this.postShow;
        this.view.onDeviceBack = this.onDeviceBack;
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });
    },

    preShow: function () {
        this.initSuccessAnimation();
        this.bindActions();
        this.render();
    },

    postShow: function() {
        this.playSuccessAnimation();
    },

    //The transfer is done and the server has consumed the pending transfer. Going "back" to the OTP
    //screen would post against nothing, so hardware back leaves the flow entirely.
    onDeviceBack: function () {
        this.finish("frmDashboard");
    },

    safeTap: function (id, fn) {
        try { if (this.view[id]) { this.view[id].onTouchEnd = fn; } }
        catch (e) { kony.print("frmFawranSuccess safeTap " + id + " :: " + e); }
    },

    safeText: function (id, txt) {
        if (txt === null || txt === undefined) { return; }
        try { if (this.view[id]) { this.view[id].text = "" + txt; } }
        catch (e) { kony.print("frmFawranSuccess safeText " + id + " :: " + e); }
    },

    bindActions: function () {
        var self = this;
        this.safeTap("imgClose", function () { self.finish("frmFawran"); });
        //Container and caption both, for the same reason as the review screen's CTA.
        this.safeTap("flxBtnDone", function () { self.finish("frmFawran"); });
        this.safeTap("lblBtnDone", function () { self.finish("frmFawran"); });
        this.safeTap("lblAnother", function () { self.showReceipt(); });
    },

    //Always clear the draft on the way out. Leaving a completed transfer in fawranDraft would let the
    //next run re-use a stale preprocessed reference and post the wrong thing.
    finish: function (formName) {
        fawranResetDraft();
        new kony.mvc.Navigation(formName).navigate();
    },

    //The design's card carries no reference numbers, but refId / refNo / txnDate are the only proof
    //the transfer actually happened — so they live behind "Get receipt" rather than being dropped.
    showReceipt: function () {
        var r = fawranDraft.receipt || {};
        var cur = fawranDraft.currency || "QAR";
        var acc = (fawranDraft.debitAccount && nullCheck(fawranDraft.debitAccount.acNoF))
            ? fawranDraft.debitAccount.acNoF : "—";
        var lines = [];
        if (nullCheck(r._message)) { lines.push(r._message, ""); }
        lines = lines.concat([
            "Transaction reference no.",
            nullCheck(r.refId) ? r.refId : "—",
            "",
            "Fawran reference no.",
            nullCheck(r.refNo) ? r.refNo : "—",
            "",
            "Date and time",
            nullCheck(r.txnDate) ? r.txnDate : "—",
            "",
            "Transfer from",
            acc,
            "",
            "Total debit amount",
            formatAmount(fawranTotalDebit()) + " " + cur
        ]);
        kony.ui.Alert({
            message: lines.join("\n"),
            alertType: constants.ALERT_TYPE_INFO,
            alertTitle: "Receipt",
            yesLabel: "Close"
        }, {});
    },

    render: function () {
        var r = fawranDraft.receipt || {};
        var cur = fawranDraft.currency || "QAR";

        kony.print("POC FAWRAN SUCCESS: receipt fields = " + JSON.stringify(r).substring(0, 500));

        //Fixed heading, per the design. RTP_0012 / RTP_0014 are accepted-but-qualified outcomes and
        //the server's own wording ("initiated" rather than "sent") is more precise, so it is not
        //discarded — it is shown under Get receipt instead of on the headline.
        this.safeText("lblSuccessMsg", "Money transfer successfully");

        //Card mirrors the design: beneficiary alias, main purpose, sub-purpose, total debit.
        this.safeText("lblTxnRef", nullCheck(fawranDraft.aliasValue) ? fawranDraft.aliasValue : "—");
        this.safeText("lblFawranRef",
            nullCheck(fawranDraft.purposeDesc) ? fawranDraft.purposeDesc : "—");
        this.safeText("lblTxnDate",
            nullCheck(fawranDraft.subPurposeDesc) ? fawranDraft.subPurposeDesc : "—");
        this.safeText("lblRcptTotal", formatAmount(fawranTotalDebit()) + " " + cur);
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
