define({

    utilisedAmount: 45000,
    totalLimit: 60000,

    onNavigate: function (navData) {
        this.view.preShow = this.preShow;
        this.view.txtPayAmt.onTextChange = this.onAmountChange;
        this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;

        //Carry the selection from frmChooseCard instead of always using the hardcoded 45000/60000.
        if (navData && navData.totalLimit) {
            this.utilisedAmount = Number(navData.utilisedAmount) || 0;
            this.totalLimit = Number(navData.totalLimit) || 0;
        }
        this.navData = navData;

        //Carry the card's identity into the payment draft. `ccuid` is what prePC/confirmPC send as
        //"c"; without it neither service knows which card is being paid.
        if (navData) {
            payCardDraft.card = navData;
            payCardDraft.ccuid = nullCheck(navData.ccuid) ? navData.ccuid : "";
            payCardDraft.currency = nullCheck(navData.currency) ? navData.currency : "QAR";
            kony.print("POC PAYCARD: selected card ccuid=" +
                (nullCheck(payCardDraft.ccuid) ? payCardDraft.ccuid : "MISSING") +
                " cur=" + payCardDraft.currency);
        }

        //These three were dead — the only way to enter an amount was free text.
        this.view.btnFullBal.onClick = this.onFullBalance;
        this.view.btnMinAmtDue.onClick = this.onMinimumDue;
    },

    preShow: function () {
        //Was hardcoded to the same numbers twice; now reflects the selected card.
        this.view.lblUtilAmt.text = formatAmount(this.utilisedAmount) + " QAR out of";
        this.view.lblTotalAmt.text = formatAmount(this.totalLimit) + " QAR";

        //Spending-limit value ships as the malformed literal "100,00.00 QAR". Drive it from the
        //selected card so it is both correctly formatted and consistent with the bar above it.
        try {
            this.view.CopyLabel0i507f2a0acab40.text = formatAmount(this.totalLimit) + " QAR";
        } catch (e) {
            kony.print("spending limit label :: " + e);
        }

        //Card holder / masked number, when we arrived via Choose your card.
        if (this.navData) {
            if (nullCheck(this.navData.lblHolderName)) {
                this.view.Label0e03101bc02e044.text = this.navData.lblHolderName;
            }
            if (nullCheck(this.navData.lblCardNumber)) {
                this.view.Label0c2de68d6140940.text = "(" + this.navData.lblCardNumber + ")";
            }
        }

        this.updateProgress(0);

        //Loads the real payment options. We need its shape before the screen can offer a
        //"pay from" account or the correct payment-type ids — the response is dumped to the log.
        this.loadPaymentOptions();
    },

    loadPaymentOptions: function () {
        var self = this;
        payCardLoad(function (ok) {
            if (!ok) {
                kony.print("POC PAYCARD: could not load payment options — " +
                    "prePC/confirmPC cannot run without an account to pay from");
                return;
            }
            //AmtMaxLen is a FIELD LENGTH, not a money cap — the same trap as RTP.MaxAmt, which
            //produced the nonsensical "Max 9.00 QAR per transfer" on the Fawran screen.
            try {
                if (nullCheck(payCardCfg.AmtMaxLen)) {
                    self.view.txtPayAmt.maxTextLength = parseInt(payCardCfg.AmtMaxLen, 10);
                    kony.print("POC PAYCARD: amount maxTextLength=" + payCardCfg.AmtMaxLen + " chars");
                }
            } catch (e) { kony.print("POC PAYCARD: maxTextLength :: " + e); }

            //Show which account the payment will debit, now that we know it.
            var a = payCardDraft.account;
            if (a) {
                kony.print("POC PAYCARD: paying from " + a.af + " (" + a.ad + ") " + a.al + " " + a.cr);
            }
            kony.print("POC PAYCARD: payment options loaded, " + payCardTypes.length + " pay types");
        });
    },

    //`m` comes from the server's own list (data-types.payTypes): cur | min | other. Resolved by id
    //so a renamed label cannot silently change what we send.
    payTypeId: function (want) {
        for (var i = 0; i < payCardTypes.length; i++) {
            if (payCardTypes[i].id === want) { return payCardTypes[i].id; }
        }
        return want;
    },

    onFullBalance: function () {
        payCardDraft.payType = this.payTypeId("cur");
        this.setPayAmount(this.utilisedAmount);
    },

    //`ma` (minimum amount due) comes from getCCListDashboard and now survives the chooser, so this
    //no longer has to guess at 5% of the balance. Falls back to the old convention only if the
    //server did not supply one.
    onMinimumDue: function () {
        payCardDraft.payType = this.payTypeId("min");
        var real = amountNumber(this.navData && this.navData.minDueText);
        if (real > 0) {
            kony.print("POC PAYCARD: minimum due from server = " + this.navData.minDueText);
            this.setPayAmount(real);
            return;
        }
        kony.print("POC PAYCARD: no server minimum due — falling back to 5% of the balance");
        this.setPayAmount(Math.round(this.utilisedAmount * 0.05 * 100) / 100);
    },

    setPayAmount: function (amt) {
        this.view.txtPayAmt.text = formatAmount(amt);
        this.onAmountChange();
    },

    btnRevAndConfrm: function () {
        var self = this;

        //Strip separators before coercing. Number("1,000") is 0, which is how the confirm screen
        //used to receive a zero amount while the progress bar showed the right figure.
        var payAmount = Number(("" + this.view.txtPayAmt.text).replace(/,/g, "")) || 0;

        if (payAmount <= 0) { this.warn("Enter an amount to pay."); return; }

        //An amount typed by hand is "other" — the two buttons set their own type.
        if (!nullCheck(payCardDraft.payType)) { payCardDraft.payType = this.payTypeId("other"); }

        payCardDraft.amount = "" + payAmount;

        if (!nullCheck(payCardDraft.ccuid)) {
            //Fallback cards carry no uid, so prePC would be rejected. Say why rather than letting
            //the server return an opaque error.
            this.warn("This card has no server reference, so the payment cannot be validated. " +
                "Sign in as a customer who has a credit card.");
            kony.print("POC PAYCARD: ccuid MISSING — card list was the fallback, not server data");
            return;
        }
        if (!nullCheck(payCardDraft.accuid)) {
            this.warn("No account available to pay from.");
            return;
        }

        this.busy(true);
        payCardPrevalidate(function (ok, data, code) {
            self.busy(false);
            if (!ok) {
                var msg = (data && data.status && nullCheck(data.status.description))
                    ? data.status.description : "This payment could not be validated.";
                self.warn(msg);
                return;
            }
            kony.print("POC PAYCARD: prePC ok, moving to confirmation");
            new kony.mvc.Navigation("frmPayCardConfrmPay").navigate({
                utilisedAmount: self.utilisedAmount,
                totalLimit: self.totalLimit,
                payAmount: payAmount
            });
        });
    },

    warn: function (msg) {
        kony.ui.Alert({
            message: msg,
            alertType: constants.ALERT_TYPE_INFO,
            alertTitle: "Pay card",
            yesLabel: "OK"
        }, {});
    },

    //Common's loader renders nothing in this app (proven on the Fawran screens), so use the same
    //approach: keep the call, and rely on the button state for feedback until an overlay exists.
    busy: function (on) {
        try {
            if (on) { showLoadingScreen(); } else { dismissLoadingScreen(); }
        } catch (e) { kony.print("POC PAYCARD busy :: " + e); }
    },

    onAmountChange: function () {

        var text = this.view.txtPayAmt.text.trim();

        if (text === "") {

            // Default skins
            this.view.btnOtherAmt.skin = "btnSkn32px08217abgWhite";
            this.view.btnRevAndConfrm.skin = "sknBtn50PxA8A1C4BgTrans";

            this.updateProgress(0);

        } else {

            // Active skins
            this.view.btnOtherAmt.skin = "btnSkin32pxWhiteBg2A59BD";
            this.view.btnRevAndConfrm.skin = "sknBtnSansENSemibold16PxWhite";
            this.view.btnRevAndConfrm.focusSkin = "sknBtnSansENSemibold16PxWhite";

            var pay = Number(text.replace(/,/g, "")) || 0;

            this.updateProgress(pay);
        }
    },
    updateProgress: function (payAmount) {

        var currentPercent = (this.utilisedAmount / this.totalLimit) * 100;
        var previewPercent = ((this.utilisedAmount + payAmount) / this.totalLimit) * 100;

        if (previewPercent > 100) {
            previewPercent = 100;
        }

        this.view.flxProgressBar.width = currentPercent + "%";
        this.view.flxCreditBackProgress.width = previewPercent + "%";
        this.view.flxCreditBackProgress.isVisible = (payAmount > 0);

        this.view.flxCardVisual.forceLayout();
    }
});