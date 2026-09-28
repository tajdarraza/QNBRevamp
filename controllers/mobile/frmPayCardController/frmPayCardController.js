define({
  utilisedAmount: 45000,
  totalLimit: 60000,
  selectedReturnAccount: null,

  onNavigate: function (navData) {
    this.view.preShow = this.preShow;
    this.view.txtPayAmt.onTextChange = this.onAmountChange;
    this.view.btnRevAndConfrm.onClick = this.btnRevAndConfrm;

    if (navData && navData.totalLimit) {
      this.utilisedAmount = Number(navData.utilisedAmount) || 0;
      this.totalLimit = Number(navData.totalLimit) || 0;
    }

    this.navData = navData;

    if (navData) {
      payCardDraft.card = navData;
      payCardDraft.ccuid = nullCheck(navData.ccuid) ? navData.ccuid : "";
      payCardDraft.currency = nullCheck(navData.currency)
        ? navData.currency
        : "QAR";

      kony.print(
        "POC PAYCARD: selected card ccuid=" +
          (nullCheck(payCardDraft.ccuid) ? payCardDraft.ccuid : "MISSING") +
          " cur=" +
          payCardDraft.currency,
      );
    }

    this.view.btnFullBal.onClick = this.onFullBalance;
    this.view.btnMinAmtDue.onClick = this.onMinimumDue;

    this.bindTap("flxSelectAccount", this.openAccountPicker.bind(this));

    this.bindTap("imgAccountFrom", this.openAccountPicker.bind(this));
  },

  bindTap: function (id, fn) {
    try {
      if (this.view[id]) {
        this.view[id].onTouchEnd = fn;

        kony.print("POC PAYCARD: bound tap on " + id);
      } else {
        kony.print("POC PAYCARD: *** " + id + " MISSING from the form ***");
      }
    } catch (e) {
      kony.print("POC PAYCARD bindTap " + id + " :: " + e);
    }
  },

  openAccountPicker: function () {
    var self = this;

    kony.print(
      "POC PAYCARD: Pay from tapped, " +
        payCardAccounts.length +
        " total accounts",
    );

    if (!payCardAccounts || !payCardAccounts.length) {
      this.warn(
        payCardLoading
          ? "Still loading your accounts. Try again in a moment."
          : "No account available to pay from.",
      );
      return;
    }

    var filteredAccounts = payCardAccounts.filter(function (account) {
      var type = (account.ad || "").toLowerCase();

      return type === "current account" || type === "saving plus";
    });

    kony.print(
      "POC PAYCARD: Savings/Current accounts = " + filteredAccounts.length,
    );

    if (!filteredAccounts.length) {
      this.warn("No Savings or Current account available to pay from.");
      return;
    }

    var accountList = this.getAccountList(filteredAccounts);

    this.view.commonlist.show({
      title: "Pay from",
      description2: "",
      description2Visible: false,
      template: "flxAccountList",

      widgetDataMap: {
        lblAccountList: "lblAccountList",
        lblAccName: "lblAccName",
      },

      data: accountList,

      visibleWidgets: {
        lblAccName: true,
      },

      onRowSelected: function (rowData) {
        if (!rowData) {
          return;
        }

        self.onAccountPickedFromList(rowData.accountIndex, filteredAccounts);
      },
    });
  },

  getAccountList: function (accounts) {
    var list = [];

    accounts = accounts || [];

    for (var i = 0; i < accounts.length; i++) {
      var account = accounts[i];
      kony.print("Raza acc " + JSON.stringify(account));

      list.push({
        lblAccountList: account.af || "",
        lblAccName: account.ad || "",
        accountIndex: i,
        accountData: account,
      });
    }

    kony.print("POC PAYCARD: commonlist account list created = " + list.length);

    return list;
  },

  onAccountPickedFromList: function (index, accounts) {
    var acc = accounts[index];

    if (!acc) {
      kony.print("POC PAYCARD: invalid account index = " + index);
      return;
    }

    payCardDraft.account = acc;
    payCardDraft.accuid = acc.au;

    kony.print(
      "POC PAYCARD: pay-from set to " +
        acc.af +
        " (" +
        acc.ad +
        ") auid=" +
        acc.au,
    );

    this.showSelectedAccount();
  },

  showSelectedAccount: function () {
    var acc = payCardDraft.account;

    if (!acc) {
      return;
    }

    this.setText("lblAccountFrom", acc.af);
  },

  setText: function (id, txt) {
    if (txt === null || txt === undefined) {
      return;
    }

    try {
      if (this.view[id]) {
        this.view[id].text = "" + txt;
      }
    } catch (e) {
      kony.print("POC PAYCARD setText " + id + " :: " + e);
    }
  },

  preShow: function () {
    this.view.commonheader.configure({
      title: "Pay card",
    });

    /*
     * Always close commonlist when this form opens.
     */
    if (this.view.commonlist) {
      this.view.commonlist.isVisible = false;
    }

    this.view.lblUtilAmt.text =
      formatAmount(this.utilisedAmount) + " QAR out of";

    this.view.lblTotalAmt.text = formatAmount(this.totalLimit) + " QAR";

    try {
      this.view.lblSpendingLimit.text = formatAmount(this.totalLimit) + " QAR";
    } catch (e) {
      kony.print("spending limit label :: " + e);
    }

    if (this.navData) {
      if (nullCheck(this.navData.lblHolderName)) {
        this.view.lblCardUserName.text = this.navData.lblHolderName;
      }

      if (nullCheck(this.navData.lblCardNumber)) {
        this.view.lblCardNumber.text = "(" + this.navData.lblCardNumber + ")";
      }
    }

    this.updateProgress(0);

    this.loadPaymentOptions();
  },

  loadPaymentOptions: function () {
    var self = this;

    payCardLoad(function (ok) {
      if (!ok) {
        kony.print(
          "POC PAYCARD: could not load payment options — " +
            "prePC/confirmPC cannot run without an account to pay from",
        );

        return;
      }

      try {
        if (nullCheck(payCardCfg.AmtMaxLen)) {
          self.view.txtPayAmt.maxTextLength = parseInt(
            payCardCfg.AmtMaxLen,
            10,
          );

          kony.print(
            "POC PAYCARD: amount maxTextLength=" + payCardCfg.AmtMaxLen,
          );
        }
      } catch (e) {
        kony.print("POC PAYCARD: maxTextLength :: " + e);
      }

      var a = payCardDraft.account;

      if (a) {
        kony.print(
          "POC PAYCARD: paying from " +
            a.af +
            " (" +
            a.ad +
            ") " +
            a.al +
            " " +
            a.cr,
        );

        self.showSelectedAccount();
      }

      kony.print(
        "POC PAYCARD: payment options loaded, " +
          payCardTypes.length +
          " pay types",
      );
    });
  },

  payTypeId: function (want) {
    for (var i = 0; i < payCardTypes.length; i++) {
      if (payCardTypes[i].id === want) {
        return payCardTypes[i].id;
      }
    }

    return want;
  },

  onFullBalance: function () {
    payCardDraft.payType = this.payTypeId("cur");

    this.setPayAmount(this.utilisedAmount);
  },

  onMinimumDue: function () {
    payCardDraft.payType = this.payTypeId("min");

    var supplied = this.navData && nullCheck(this.navData.minDueText);

    if (supplied) {
      var real = amountNumber(this.navData.minDueText);

      kony.print(
        "POC PAYCARD: minimum due from server = " + this.navData.minDueText,
      );

      if (real <= 0) {
        this.warn("There is nothing due on this card right now.");

        return;
      }

      this.setPayAmount(real);

      return;
    }

    kony.print(
      "POC PAYCARD: server sent no minimum due at all — " +
        "falling back to 5% of the balance.",
    );

    this.setPayAmount(Math.round(this.utilisedAmount * 0.05 * 100) / 100);
  },

  setPayAmount: function (amt) {
    this.view.txtPayAmt.text = formatAmount(amt);

    this.onAmountChange();
  },

  btnRevAndConfrm: function () {
    var self = this;

    var payAmount =
      Number(("" + this.view.txtPayAmt.text).replace(/,/g, "")) || 0;

    if (payAmount <= 0) {
      this.warn("Enter an amount to pay.");

      return;
    }

    if (!nullCheck(payCardDraft.payType)) {
      payCardDraft.payType = this.payTypeId("other");
    }

    payCardDraft.amount = "" + payAmount;

    if (!nullCheck(payCardDraft.ccuid)) {
      this.warn(
        "This card has no server reference, so the payment " +
          "cannot be validated. Sign in as a customer who has a credit card.",
      );

      kony.print(
        "POC PAYCARD: ccuid MISSING — " +
          "card list was the fallback, not server data",
      );

      return;
    }

    if (!nullCheck(payCardDraft.accuid)) {
      if (payCardLoading) {
        this.warn("Still loading your accounts. Try again in a moment.");

        return;
      }

      this.warn("No account available to pay from.");

      return;
    }

    this.busy(true);

    payCardPrevalidate(function (ok, data, code) {
      self.busy(false);

      if (!ok) {
        var msg =
          data && data.status && nullCheck(data.status.description)
            ? data.status.description
            : "This payment could not be validated.";

        self.warn(msg);

        return;
      }

      var serverAmt = amountNumber(payCardDraft.serverAmount);

      if (nullCheck(payCardDraft.serverAmount) && serverAmt <= 0) {
        self.warn(
          "There is nothing due on this card, so there is no payment to make. " +
            "Choose Current balance or enter an amount.",
        );

        return;
      }

      kony.print("POC PAYCARD: prePC ok, moving to confirmation");

      new kony.mvc.Navigation("frmPayCardConfirm").navigate({
        utilisedAmount: self.utilisedAmount,

        totalLimit: self.totalLimit,

        payAmount: serverAmt > 0 ? serverAmt : payAmount,
      });
    });
  },

  warn: function (msg) {
    kony.ui.Alert(
      {
        message: msg,
        alertType: constants.ALERT_TYPE_INFO,
        alertTitle: "Pay card",
        yesLabel: "OK",
      },
      {},
    );
  },

  busy: function (on) {
    try {
      if (this.view.flxBusy) {
        if (this.view.lblBusyMsg) {
          this.view.lblBusyMsg.text = "Checking your payment…";
        }

        this.view.flxBusy.setVisibility(on);

        if (on) {
          this.view.flxBusy.onTouchEnd = function () {};
        }
        this.view.forceLayout();
        kony.print(
          "POC PAYCARD: busy(" +
            on +
            ") applied, isVisible=" +
            this.view.flxBusy.isVisible,
        );
      } else {
        kony.print("POC PAYCARD: *** flxBusy MISSING from the form ***");
      }
    } catch (e) {
      kony.print("POC PAYCARD overlay busy(" + on + ") :: " + e);
    }

    try {
      if (on) {
        showLoadingScreen();
      } else {
        dismissLoadingScreen();
      }
    } catch (e) {
      kony.print("POC PAYCARD busy :: " + e);
    }
  },

  onAmountChange: function () {
    var text = this.view.txtPayAmt.text.trim();

    if (text === "") {
      this.view.btnOtherAmt.skin = "btnSkn32px08217abgWhite";

      this.view.btnRevAndConfrm.skin = "sknBtn50PxA8A1C4BgTrans";

      this.updateProgress(0);
    } else {
      this.view.btnOtherAmt.skin = "btnSkin32pxWhiteBg2A59BD";

      this.view.btnRevAndConfrm.skin = "sknBtnSansENSemibold16PxWhite";

      this.view.btnRevAndConfrm.focusSkin = "sknBtnSansENSemibold16PxWhite";

      var pay = Number(text.replace(/,/g, "")) || 0;

      this.updateProgress(pay);
    }
  },

  updateProgress: function (payAmount) {
    var currentPercent = (this.utilisedAmount / this.totalLimit) * 100;

    var previewPercent =
      ((this.utilisedAmount + payAmount) / this.totalLimit) * 100;

    if (previewPercent > 100) {
      previewPercent = 100;
    }

    this.view.flxProgressBar.width = currentPercent + "%";

    this.view.flxCreditBackProgress.width = previewPercent + "%";

    this.view.flxCreditBackProgress.isVisible = payAmount > 0;

    this.view.flxCardVisual.forceLayout();
  },
});
