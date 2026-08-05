define(["APICallController"], function (commonUtil) {

    return {
        navData: null,

        onNavigate: function (data) {
            this.navData = data;
            this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;
            this.view.preShow = this.preShow;

            //"Pay from" was a plain label with no handler — tapping it did nothing, which read as a
            //broken control rather than an unbuilt one. Bound on the row AND the label: a label
            //without a handler does not consume the tap, so binding only the container leaves dead
            //spots over the text.
            this.bindTap("flxSelectedAcc", this.openAccountPicker);
            this.bindTap("lblSelectedAcc", this.openAccountPicker);
            this.bindTap("imgPickerClose", this.closeAccountPicker);
        },

        bindTap: function (id, fn) {
            try {
                if (this.view[id]) {
                    this.view[id].onTouchEnd = fn;
                    kony.print("POC PAYCARD CONFIRM: bound tap on " + id);
                } else {
                    //Never skip in silence — an unbuilt widget and a working one used to look the
                    //same in the log, which is what made the busy overlay take three attempts.
                    kony.print("POC PAYCARD CONFIRM: *** " + id + " MISSING from the form ***");
                }
            } catch (e) { kony.print("POC PAYCARD CONFIRM bindTap " + id + " :: " + e); }
        },

        //--- pay-from picker ------------------------------------------------------------------
        //Ten pre-built rows, hidden by default. Runtime `new kony.ui.Label` ignores its position
        //config in this build — every row landed on the same line — so the rows are static widgets
        //and the controller only sets text, visibility and handlers. Same approach as Fawran.
        pickerRowCount: 10,

        openAccountPicker: function () {
            var self = this;
            kony.print("POC PAYCARD CONFIRM: Pay from tapped, " + payCardAccounts.length +
                " accounts available");
            if (!this.view.flxPickerSheet) {
                kony.print("POC PAYCARD CONFIRM: *** flxPickerSheet MISSING *** rebuild the FORM");
                return;
            }
            if (!payCardAccounts.length) {
                kony.print("POC PAYCARD CONFIRM: no accounts to choose from");
                return;
            }

            try { this.view.lblPickerTitle.text = "Pay from"; } catch (e) { }

            var shown = payCardAccounts.length;
            if (shown > this.pickerRowCount) {
                //Never truncate in silence — say what was dropped.
                kony.print("POC PAYCARD CONFIRM: " + payCardAccounts.length +
                    " accounts but only " + this.pickerRowCount + " picker rows");
                shown = this.pickerRowCount;
            }

            for (var i = 0; i < this.pickerRowCount; i++) {
                var row = this.view["flxPickRow" + i];
                if (!row) { continue; }
                if (i >= shown) { row.setVisibility(false); continue; }

                var acc = payCardAccounts[i];
                this.safeText("lblPickRow" + i, acc.af);
                this.safeText("lblPickSub" + i, acc.ad);
                this.safeText("lblPickAmt" + i, acc.al);
                this.safeText("lblPickCur" + i, acc.cr || payCardDraft.currency);
                row.setVisibility(true);
                row.onTouchEnd = (function (idx) {
                    return function () { self.onAccountPicked(idx); };
                })(i);
            }

            this.view.flxPickerSheet.setVisibility(true);
            this.view.forceLayout();
        },

        closeAccountPicker: function () {
            try {
                this.view.flxPickerSheet.setVisibility(false);
                this.view.forceLayout();
            } catch (e) { kony.print("POC PAYCARD CONFIRM closeAccountPicker :: " + e); }
        },

        //CHANGING THE ACCOUNT INVALIDATES prePC. The pre-validation that let this screen open was
        //run against the previous account, and confirmPC would post against a combination the server
        //never validated. So the new account is re-validated immediately, and a rejection puts the
        //old account back rather than leaving the screen describing a payment that cannot be made.
        onAccountPicked: function (index) {
            var self = this;
            var acc = payCardAccounts[index];
            if (!acc) { return; }

            this.closeAccountPicker();

            var previous = payCardDraft.account;
            if (previous && previous.au === acc.au) { return; }

            payCardDraft.account = acc;
            payCardDraft.accuid = acc.au;
            kony.print("POC PAYCARD CONFIRM: pay-from changed to " + acc.af + " auid=" + acc.au +
                " — re-validating");

            this.busy(true);
            payCardPrevalidate(function (ok, data) {
                self.busy(false);
                if (!ok) {
                    payCardDraft.account = previous;
                    payCardDraft.accuid = previous ? previous.au : "";
                    kony.print("POC PAYCARD CONFIRM: re-validation failed, reverted to " +
                        (previous ? previous.af : "(none)"));
                    var msg = (data && data.status && nullCheck(data.status.description))
                        ? data.status.description
                        : "This payment cannot be made from that account.";
                    kony.ui.Alert({
                        message: msg, alertType: constants.ALERT_TYPE_INFO,
                        alertTitle: "Pay card", yesLabel: "OK"
                    }, {});
                    self.renderReal();
                    return;
                }
                //The server may return a different amount for the new account, and it is the
                //server's figure that gets paid.
                self.renderReal();
                self.updateProgress(self.navData.utilisedAmount, self.navData.totalLimit,
                    self.navData.payAmount);
            });
        },

        //Guarded like the Fawran submit: claimed before the call and never released on success, so a
        //second tap cannot post a second payment. confirmPC carries a dup-guard on the wire too, but
        //that did not stop 8 concurrent posts on the Fawran screen.
        submitting: false,

        btnRevAndConfrm: function () {
            var self = this;
            if (this.submitting) { return; }
            this.submitting = true;
            this.busy(true);

            payCardConfirm(function (ok, data, code) {
                if (!ok) {
                    self.busy(false);
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

        //Common's showLoadingScreen() renders nothing in this app, so the payment posted with no
        //feedback at all — several seconds of a screen that looked like the tap had missed. Own
        //overlay, and it eats taps while confirmPC is in flight.
        //
        //NOT dismissed on success: the success screen replaces this one, and clearing it first shows
        //a live Confirm button for the moment in between.
        busy: function (on) {
            try {
                if (this.view.flxBusy) {
                    if (this.view.lblBusyMsg) {
                        this.view.lblBusyMsg.text = "Making your payment…";
                    }
                    this.view.flxBusy.setVisibility(on);
                    if (on) { this.view.flxBusy.onTouchEnd = function () { }; }
                    this.view.forceLayout();
                    //Read the flag back. "Ran without throwing" is not the same as "is on screen",
                    //and the overlay reported no error while showing nothing.
                    kony.print("POC PAYCARD CONFIRM: busy(" + on + ") applied, isVisible=" +
                        this.view.flxBusy.isVisible);
                } else {
                    //The guard used to skip silently, so a form built without the widget looked
                    //identical to a working one.
                    kony.print("POC PAYCARD CONFIRM: *** flxBusy MISSING from the form *** " +
                        "rebuild the FORM in Visualizer, not just the controller");
                }
            } catch (e) {
                kony.print("POC PAYCARD CONFIRM overlay busy(" + on + ") :: " + e);
            }
            try {
                if (on) { showLoadingScreen(); } else { dismissLoadingScreen(); }
            } catch (e) {
                kony.print("POC PAYCARD CONFIRM busy(" + on + ") :: " + e);
            }
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
            //The overlay is deliberately left up when the payment succeeds, so it has to be cleared
            //on the way in — the success screen's device-back lands straight back here, and the
            //screen would otherwise be stuck behind it. Same for the submit guard: arriving here
            //means a fresh prePC has run, and payCardConfirm refuses a second payment on a spent
            //pre-validation anyway.
            this.busy(false);
            this.submitting = false;

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