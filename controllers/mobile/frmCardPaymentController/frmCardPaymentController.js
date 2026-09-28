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
    this.renderReal();
    if (this.view.rippleanimation) {
      this.view.rippleanimation.reset();
    }
  },

  safeText: function (id, txt) {
    if (txt === null || txt === undefined) {
      return;
    }

    try {
      if (this.view[id]) {
        this.view[id].text = "" + txt;
      }
    } catch (e) {
      kony.print("frmCardPayment safeText " + id + " :: " + e);
    }
  },

  renderReal: function () {
    var card = payCardDraft.card || {};
    var receipt = payCardDraft.receipt || {};
    var cur = payCardDraft.currency || "QAR";
    var nav = this.navData || {};

    var num = "" + (card.lblCardNumber || "");

    this.safeText(
      "lblCardName",
      nullCheck(card.lblCardName)
        ? card.lblCardName.length > 20
          ? card.lblCardName.substring(0, 19) + "…"
          : card.lblCardName
        : "Credit card",
    );

    var holder = "" + (card.lblHolderName || "");

    this.safeText(
      "lblHolderName",
      holder.length > 20 ? holder.substring(0, 19) + "…" : holder,
    );

    this.safeText(
      "lblCardNumber",
      num.length > 4 ? "•••• " + num.substring(num.length - 4) : num,
    );

    /*
     * Payment completed.
     * Subtract the payment from utilised amount.
     */
    var limit = Number(nav.totalLimit) || this.totalLimit;

    var paid = Number(nav.payAmount) || 0;

    var used = (Number(nav.utilisedAmount) || this.utilisedAmount) - paid;

    if (used < 0) {
      used = 0;
    }

    this.safeText("lblUtilAmt", formatAmount(used) + " " + cur);

    this.safeText("lblTotalAmt", formatAmount(limit) + " " + cur);

    try {
      this.view.flxProgressBar.width =
        (limit > 0 ? (used / limit) * 100 : 0) + "%";

      this.view.flxCreditBackProgress.isVisible = false;
    } catch (e) {
      kony.print("frmCardPayment progress :: " + e);
    }

    /*
     * Payment receipt information.
     */
    kony.print(
      "POC PAYCARD SUCCESS: refId=" +
        receipt.r +
        " txnDate=" +
        receipt.d +
        " paid=" +
        paid +
        " " +
        cur +
        " card=" +
        num,
    );
  },

  postShow: function () {
    kony.print("frmCardPayment :: postShow - playing success animation");

    /*
     * Modular ripple animation.
     */
    if (this.view.rippleanimation) {
      this.view.rippleanimation.show({
        type: "success",
        text: "Payment successful",
      });
    } else {
      kony.print("frmCardPayment :: rippleanimation not found");
    }
  },

  onDeviceBack: function () {
    new kony.mvc.Navigation("frmPayCardConfirm").navigate(this.navData);
  },

  onAmountChange: function () {},

  returnToCards: function () {
    new kony.mvc.Navigation("frmCards").navigate();
  },
});
