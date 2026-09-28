define({
  postponeSelection: null,
  specialOfferSelection: null,
  selectedLoan: null,
  selectedLoanIndex: null,

  onNavigate: function (navData) {
    this.view.init = this.init;
    this.view.preShow = this.preShow;
    this.view.postShow = this.postShow;

    this.view.commonheader.configure({
      title: "Loan postpone",
      action1: function () {
        new kony.mvc.Navigation("frmLoanDashboard").navigate();
      },
      action2: function () {
        alert("to unlock the feature develop it");
      },
      action2Image: "closeicon.png",
    });

    this.data = navData;

    if (navData && navData.loan) {
      this.selectedLoan = navData.loan;
      this.selectedLoanIndex = navData.loanIndex;

      kony.print(
        "LOAN POSTPONE :: Received loan = " + JSON.stringify(this.selectedLoan),
      );

      kony.print(
        "LOAN POSTPONE :: Received loan index = " + this.selectedLoanIndex,
      );
    }
  },

  init: function () {},

  preShow: function () {
    this.resetDefaultSkin();
    this.populateLoanData();

    // Postpone
    this.view.flxPostpone1.onClick = this.selectPostpone1.bind(this);
    this.view.flxPostpone2.onClick = this.selectPostpone2.bind(this);

    this.view.flxCircle1.onClick = this.selectPostpone1.bind(this);
    this.view.flxCircle2.onClick = this.selectPostpone2.bind(this);

    // Special offer
    this.view.flxSpecialOfferYES.onClick =
      this.selectSpecialOfferYES.bind(this);
    this.view.flxSpecialOfferNO.onClick = this.selectSpecialOfferNO.bind(this);

    this.view.flxOfferCircle1.onClick = this.selectSpecialOfferYES.bind(this);
    this.view.flxOfferCircle2.onClick = this.selectSpecialOfferNO.bind(this);

    // Continue
    this.view.btnContinue.onClick = this.continueLoanPostpone.bind(this);
  },

  postShow: function () {
    kony.print("LOAN POSTPONE :: postShow");
  },

  populateLoanData: function () {
    if (!this.selectedLoan) {
      kony.print("LOAN POSTPONE :: No loan data received");
      return;
    }

    // Due date
    if (this.view.lblDueDate) {
      this.view.lblDueDate.text = this.selectedLoan.dueDate || "";
    }

    // Due amount
    if (this.view.lblDueAmountValue) {
      this.view.lblDueAmountValue.text =
        this.selectedLoan.remainingBalance !== undefined &&
        this.selectedLoan.remainingBalance !== null
          ? this.selectedLoan.remainingBalance
          : "";
    }

    if (this.view.lblTypeOfLoan) {
      this.view.lblTypeOfLoan.text =
        this.selectedLoan.typeOfLoan || this.selectedLoan.loanType || "";
    }

    if (this.view.imgTypeOfLoan) {
      if (this.selectedLoan.imgTypeOfLoan) {
        this.view.imgTypeOfLoan.src = this.selectedLoan.imgTypeOfLoan;
      } else if (this.selectedLoan.loanImage) {
        this.view.imgTypeOfLoan.src = this.selectedLoan.loanImage;
      } else if (this.selectedLoan.typeOfLoanImage) {
        this.view.imgTypeOfLoan.src = this.selectedLoan.typeOfLoanImage;
      }
    }

    kony.print("LOAN POSTPONE :: Due date = " + this.selectedLoan.dueDate);

    kony.print(
      "LOAN POSTPONE :: Due amount = " + this.selectedLoan.remainingBalance,
    );

    kony.print(
      "LOAN POSTPONE :: Type of loan = " + this.selectedLoan.typeOfLoan,
    );

    kony.print(
      "LOAN POSTPONE :: Loan image = " + this.selectedLoan.imgTypeOfLoan,
    );
  },

  resetDefaultSkin: function () {
    this.postponeSelection = null;
    this.specialOfferSelection = null;

    // Postpone
    this.view.flxPostpone1.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
    this.view.flxPostpone2.skin = "sknFlx8pxRoundWhiteBgE4E2ED";

    this.view.flxCircle1.skin = "sknRoundedCornerBorder1PxOutline123391";
    this.view.flxCircle2.skin = "sknRoundedCornerBorder1PxOutline123391";

    // Special offer
    this.view.flxSpecialOfferYES.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
    this.view.flxSpecialOfferNO.skin = "sknFlx8pxRoundWhiteBgE4E2ED";

    this.view.flxOfferCircle1.skin = "sknRoundedCornerBorder1PxOutline123391";
    this.view.flxOfferCircle2.skin = "sknRoundedCornerBorder1PxOutline123391";

    // Continue disabled
    this.view.btnContinue.skin = "sknBtn50PxA8A1C4BgTrans";

    // Current due date
    this.view.lblCurrentDueDate.text = "Current due date";
    this.view.lblCurrentDueDate.skin = "sknLbl34Px50477D";

    // Original due date
    this.view.lblDueDate.skin = "sknLblSansENBold150P1B124B";
  },

  selectPostpone1: function () {
    kony.print("LOAN POSTPONE :: 1 MONTH CLICKED");

    if (this.postponeSelection === "postpone1") {
      this.postponeSelection = null;

      this.view.flxPostpone1.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxCircle1.skin = "sknRoundedCornerBorder1PxOutline123391";

      this.view.lblCurrentDueDate.text = "Current due date";
      this.view.lblCurrentDueDate.skin = "sknLbl34Px50477D";

      this.view.lblDueDate.text = this.selectedLoan.dueDate || "";
      this.view.lblDueDate.skin = "sknLblSansENBold150P1B124B";
    } else {
      this.postponeSelection = "postpone1";

      this.view.flxPostpone1.skin = "skn8PxOutline2a59bdBgE8F0FF";
      this.view.flxCircle1.skin = "sknRoundedCornerBorder4PxOutline123391";

      this.view.flxPostpone2.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxCircle2.skin = "sknRoundedCornerBorder1PxOutline123391";

      this.updateDueDate(1);
    }

    this.updateContinueButton();
  },

  selectPostpone2: function () {
    kony.print("LOAN POSTPONE :: 2 MONTH CLICKED");

    if (this.postponeSelection === "postpone2") {
      this.postponeSelection = null;

      this.view.flxPostpone2.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxCircle2.skin = "sknRoundedCornerBorder1PxOutline123391";

      this.view.lblCurrentDueDate.text = "Current due date";
      this.view.lblCurrentDueDate.skin = "sknLbl34Px50477D";

      this.view.lblDueDate.text = this.selectedLoan.dueDate || "";
      this.view.lblDueDate.skin = "sknLblSansENBold150P1B124B";
    } else {
      this.postponeSelection = "postpone2";

      this.view.flxPostpone2.skin = "skn8PxOutline2a59bdBgE8F0FF";
      this.view.flxCircle2.skin = "sknRoundedCornerBorder4PxOutline123391";

      this.view.flxPostpone1.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxCircle1.skin = "sknRoundedCornerBorder1PxOutline123391";

      this.updateDueDate(2);
    }

    this.updateContinueButton();
  },

  updateDueDate: function (months) {
    kony.print("LOAN POSTPONE :: updateDueDate called");
    kony.print("LOAN POSTPONE :: months = " + months);

    if (!this.selectedLoan || !this.selectedLoan.dueDate) {
      kony.print("LOAN POSTPONE :: dueDate is NULL/EMPTY");
      return;
    }

    var originalDate = this.selectedLoan.dueDate;

    kony.print("LOAN POSTPONE :: ORIGINAL DUE DATE = " + originalDate);

    /*
     * Supports both:
     *
     * "on Apr. 04th"
     * "on May 17th"
     *
     * Dot after month is optional.
     */
    var match = originalDate.match(
      /^on\s+([A-Za-z]{3})\.?\s+(\d{1,2})(?:st|nd|rd|th)?$/i,
    );

    if (!match) {
      kony.print("LOAN POSTPONE :: Unable to parse due date = " + originalDate);
      return;
    }

    var monthText = match[1];
    var day = parseInt(match[2], 10);

    var monthMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    var monthIndex =
      monthMap[
        monthText.charAt(0).toUpperCase() + monthText.substring(1).toLowerCase()
      ];

    if (monthIndex === undefined) {
      kony.print("LOAN POSTPONE :: Invalid month = " + monthText);
      return;
    }

    var year = new Date().getFullYear();

    var date = new Date(year, monthIndex, day);

    kony.print("LOAN POSTPONE :: Parsed date = " + date);

    /*
     * Add selected number of months.
     */
    date.setMonth(date.getMonth() + months);

    var newMonthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var newMonth = newMonthNames[date.getMonth()];

    var newDay = date.getDate();

    /*
     * Add correct ordinal suffix.
     */
    var suffix = "th";

    if (newDay % 100 < 11 || newDay % 100 > 13) {
      if (newDay % 10 === 1) {
        suffix = "st";
      } else if (newDay % 10 === 2) {
        suffix = "nd";
      } else if (newDay % 10 === 3) {
        suffix = "rd";
      }
    }

    var newDueDate = "on " + newMonth + ". " + newDay + suffix;

    kony.print("LOAN POSTPONE :: NEW DUE DATE = " + newDueDate);

    /*
     * Update UI.
     */
    this.view.lblDueDate.text = newDueDate;

    this.view.lblDueDate.skin = "sknLblSansENBold150P2A59BD";

    this.view.lblCurrentDueDate.text = "New due date";

    this.view.lblCurrentDueDate.skin = "sknQNBSansAR35Px2A59BD";

    this.view.forceLayout();

    kony.print("LOAN POSTPONE :: UI UPDATED");
  },

  resetDueDateUI: function () {
    if (!this.selectedLoan) {
      return;
    }

    this.view.lblCurrentDueDate.text = "Current due date";
    this.view.lblCurrentDueDate.skin = "sknLbl34Px50477D";

    this.view.lblDueDate.text = this.selectedLoan.dueDate || "";
    this.view.lblDueDate.skin = "sknLblSansENBold150P1B124B";

    kony.print(
      "LOAN POSTPONE :: Due date restored = " + this.selectedLoan.dueDate,
    );
  },

  parseDueDate: function (dateString) {
    if (!dateString) {
      return null;
    }

    var value = String(dateString).trim();

    kony.print("LOAN POSTPONE :: Raw due date = " + value);

    /*
     * Remove "on "
     */
    value = value.replace(/^on\s+/i, "");

    /*
     * Remove dots from month names.
     *
     * May. 17th -> May 17th
     */
    value = value.replace(/\./g, "");

    /*
     * Remove ordinal suffix from day.
     *
     * 1st  -> 1
     * 2nd  -> 2
     * 3rd  -> 3
     * 17th -> 17
     */
    value = value.replace(/(\d+)(st|nd|rd|th)\b/gi, "$1");

    value = value.trim();

    kony.print("LOAN POSTPONE :: Normalized due date = " + value);

    var parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) {
      kony.print("LOAN POSTPONE :: Unable to parse due date = " + dateString);
      return null;
    }

    return parsedDate;
  },

  formatDueDate: function (date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    return day + "/" + month + "/" + year;
  },

  selectSpecialOfferYES: function () {
    if (this.specialOfferSelection === "yes") {
      this.specialOfferSelection = null;

      this.view.flxSpecialOfferYES.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxOfferCircle1.skin = "sknRoundedCornerBorder1PxOutline123391";
    } else {
      this.specialOfferSelection = "yes";

      this.view.flxSpecialOfferYES.skin = "skn8PxOutline2a59bdBgE8F0FF";
      this.view.flxOfferCircle1.skin = "sknRoundedCornerBorder4PxOutline123391";

      this.view.flxSpecialOfferNO.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxOfferCircle2.skin = "sknRoundedCornerBorder1PxOutline123391";
    }

    this.updateContinueButton();
  },

  selectSpecialOfferNO: function () {
    if (this.specialOfferSelection === "no") {
      this.specialOfferSelection = null;

      this.view.flxSpecialOfferNO.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxOfferCircle2.skin = "sknRoundedCornerBorder1PxOutline123391";
    } else {
      this.specialOfferSelection = "no";

      this.view.flxSpecialOfferNO.skin = "skn8PxOutline2a59bdBgE8F0FF";
      this.view.flxOfferCircle2.skin = "sknRoundedCornerBorder4PxOutline123391";

      this.view.flxSpecialOfferYES.skin = "sknFlx8pxRoundWhiteBgE4E2ED";
      this.view.flxOfferCircle1.skin = "sknRoundedCornerBorder1PxOutline123391";
    }

    this.updateContinueButton();
  },

  updateContinueButton: function () {
    if (
      this.postponeSelection !== null &&
      this.specialOfferSelection !== null
    ) {
      this.view.btnContinue.skin = "sknBtnRounded72px2A59BD";
    } else {
      this.view.btnContinue.skin = "sknBtn50PxA8A1C4BgTrans";
    }
  },

  continueLoanPostpone: function () {
    if (
      this.postponeSelection === null ||
      this.specialOfferSelection === null
    ) {
      kony.print("LOAN POSTPONE :: Selection incomplete");
      return;
    }

    var postponeMonths = this.postponeSelection === "postpone1" ? 1 : 2;

    var navigationData = {
      // Complete loan object
      loan: this.selectedLoan,

      // Loan index
      loanIndex: this.selectedLoanIndex,

      // Loan information
      dueDate: this.selectedLoan.dueDate || "",
      dueAmount: this.selectedLoan.remainingBalance || "",
      typeOfLoan:
        this.selectedLoan.typeOfLoan || this.selectedLoan.loanType || "",

      // Image used on loan card
      imgTypeOfLoan:
        this.selectedLoan.imgTypeOfLoan ||
        this.selectedLoan.loanImage ||
        this.selectedLoan.typeOfLoanImage ||
        "",

      // Postpone information
      originalDueDate: this.selectedLoan.dueDate || "",

      newDueDate: this.view.lblDueDate.text || "",

      postponeSelection: this.postponeSelection,

      postponeMonths: postponeMonths,

      // Fee
      postponeFee: "Free of charge",

      // Special offer
      specialOfferSelection: this.specialOfferSelection,
    };

    kony.print(
      "LOAN POSTPONE :: Confirmation data = " + JSON.stringify(navigationData),
    );

    new kony.mvc.Navigation("frmLoanPostponeUpdate").navigate(navigationData);
  },
});
