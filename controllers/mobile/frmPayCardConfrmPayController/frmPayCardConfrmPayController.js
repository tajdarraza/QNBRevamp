define(["APICallController"], function (commonUtil) {

    return {
        navData: null,

        onNavigate: function (data) {
            this.navData = data;
            this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;
            this.view.preShow = this.preShow;

        },

        //Guarded like the Fawran submit: claimed before the call and never released on success, so a
        //second tap cannot post a second payment. confirmPC carries a dup-guard on the wire too, but
        //that did not stop 8 concurrent posts on the Fawran screen.
        submitting: false,

        btnRevAndConfrm: function () {
            var self = this;
            if (this.submitting) { return; }
            this.submitting = true;
            try { showLoadingScreen(); } catch (e) { }

            payCardConfirm(function (ok, data, code) {
                try { dismissLoadingScreen(); } catch (e) { }
                if (!ok) {
                    self.submitting = false;
                    var msg = (data && data.status && nullCheck(data.status.description))
                        ? data.status.description : "The payment could not be completed.";
                    kony.ui.Alert({
                        message: msg, alertType: constants.ALERT_TYPE_INFO,
                        alertTitle: "Pay card", yesLabel: "OK"
                    }, {});
                    return;
                }
                kony.print("POC PAYCARD: confirmPC ok, code=" + code +
                    " receipt = " + JSON.stringify(data).substring(0, 400));
                new kony.mvc.Navigation("frmCardPayment").navigate(self.navData);
            });
        },

        safeText: function (id, txt) {
            if (txt === null || txt === undefined) { return; }
            try { if (this.view[id]) { this.view[id].text = "" + txt; } }
            catch (e) { kony.print("frmPayCardConfrmPay safeText " + id + " :: " + e); }
        },

        //The design sizes this row for short placeholders ("Credit card 1", "****3456"). Real values
        //are much longer — "LIFE VISA PLATINUM RETAIL PLUS" and a 16-character masked number — and
        //they ran straight through the number on the right. Widths were widened/narrowed in the form;
        //these two keep the text inside them.
        shortNumber: function (masked) {
            var s = "" + masked;
            return s.length > 4 ? "•••• " + s.substring(s.length - 4) : s;
        },

        clipName: function (name, max) {
            var s = "" + name;
            return s.length > max ? s.substring(0, max - 1) + "…" : s;
        },

        //The card, holder, masked number, pay-from account and spending limit were the form's
        //design-time placeholders ("Credit card 1", "James Lee", "****3456", "100,00.00 QAR").
        //Only the amount was real, which made the screen look genuine while naming the wrong card.
        renderReal: function () {
            var card = payCardDraft.card || {};
            var acc = payCardDraft.account || {};
            var cur = payCardDraft.currency || "QAR";

            this.safeText("lblCardName", nullCheck(card.lblCardName)
                ? this.clipName(card.lblCardName, 20) : "Credit card");
            this.safeText("lblHolderName", nullCheck(card.lblHolderName)
                ? this.clipName(card.lblHolderName, 20) : "");
            this.safeText("lblCardNumber", nullCheck(card.lblCardNumber)
                ? this.shortNumber(card.lblCardNumber) : "");

            //"Type of payment:" shipped as a bare caption with nothing after it. `m` is an id
            //(cur/min/other); the readable name is the server's own label for that id.
            var typeName = "";
            for (var i = 0; i < payCardTypes.length; i++) {
                if (payCardTypes[i].id === payCardDraft.payType) { typeName = payCardTypes[i].value; }
            }
            this.safeText("lblPayFrom", nullCheck(typeName)
                ? "Type of payment: " + typeName : "Type of payment:");

            //`al` is the formatted balance, `ad` the account type, `af` the formatted number.
            if (nullCheck(acc.af)) {
                this.safeText("lblSelectedAcc",
                    acc.af + (nullCheck(acc.al) ? "  (" + acc.al + " " + (acc.cr || cur) + ")" : ""));
            }

            //Spending limit = the card's credit limit, not a hardcoded figure.
            if (nullCheck(card.limit) || this.navData.totalLimit) {
                var lim = nullCheck(card.limit) ? card.limit : this.navData.totalLimit;
                this.safeText("CopyLabel0i507f2a0acab40", formatAmount(lim) + " " + cur);
            }

            //Full masked number in the log — the display string is only the last four now, and the
            //logs are how a payment gets traced back to a card.
            kony.print("POC PAYCARD CONFIRM: card=" + (card.mcn || card.lblCardNumber) +
                " from=" + acc.af + " amount=" + payCardDraft.amount + " " + cur);
        },

        preShow: function () {
            this.renderReal();
            this.updateProgress(
                this.navData.utilisedAmount,
                this.navData.totalLimit,
                this.navData.payAmount
            );
        },
        updateProgress: function (currentAmount, totalLimit, payAmount) {

            var currentPercent = (currentAmount / totalLimit) * 100;
            var previewPercent = ((currentAmount + payAmount) / totalLimit) * 100;

            if (previewPercent > 100) {
                previewPercent = 100;
            }

            this.view.flxProgressBar.width = currentPercent + "%";
            this.view.flxCreditBackProgress.width = previewPercent + "%";
            this.view.flxCreditBackProgress.isVisible = (payAmount > 0);
            this.view.lblUtilAmt.text = formatAmount(currentAmount) + " QAR";
            this.view.lblTotalAmt.text = formatAmount(totalLimit) + " QAR";
            //Show the server's confirmed amount when prePC returned one — that is what confirmPC will
            //charge, and it does not always equal what was typed.
            this.view.lblPayAmount.text = (nullCheck(payCardDraft.serverAmount)
                ? formatAmount(amountNumber(payCardDraft.serverAmount))
                : this.navData.payAmount.toLocaleString()) + " QAR";
            //commonUtil.callAlert();
            this.view.flxCardVisual.forceLayout();
        },

        onAmountChange: function () {


        },
    }


});