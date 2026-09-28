define(function () {
  return {
    transactionData: [],
    visibleCount: 0,
    pageSize: 5,

    onSeeAll: null,

    bindEvents: function () {
      this.view.flxViewMore.onClick = this.onViewMoreClick.bind(this);

      this.view.lblSeeAll.onTouchEnd = this.onSeeAllClick.bind(this);
    },

    configure: function (config) {
      config = config || {};

      this.transactionData = config.data || [];

      this.pageSize = config.pageSize || 5;

      this.onSeeAll = config.onSeeAll || null;

      this.visibleCount = 0;

      this.bindEvents();

      this.loadInitialData();
    },

    loadInitialData: function () {
      this.visibleCount = Math.min(this.pageSize, this.transactionData.length);

      this.renderTransactions();
    },

    renderTransactions: function () {
      var visibleData = this.transactionData.slice(0, this.visibleCount);

      visibleData.forEach(function (item) {
        item.imgTransactionVisible = item.imgTransaction ? true : false;
      });

      this.view.segTransactionList.setData(visibleData);

      this.updateViewMoreVisibility();
    },

    onViewMoreClick: function () {
      this.visibleCount = Math.min(
        this.visibleCount + this.pageSize,
        this.transactionData.length,
      );

      this.renderTransactions();
    },

    updateViewMoreVisibility: function () {
      this.view.flxViewMore.isVisible =
        this.visibleCount < this.transactionData.length;
    },

    onSeeAllClick: function () {
      if (typeof this.onSeeAll === "function") {
        this.onSeeAll();
      }
    },

    setData: function (data) {
      this.transactionData = data || [];

      this.visibleCount = 0;

      this.loadInitialData();
    },

    getData: function () {
      return this.transactionData;
    },
  };
});
