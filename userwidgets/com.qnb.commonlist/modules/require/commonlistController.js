define(function () {
  return {
    isOpen: false,
    selectedCallback: null,

    postRender: function () {
      this.isOpen = false;
      this.selectedCallback = null;

      this.bindEvents();

      if (this.view.flxOverlay) {
        this.view.flxOverlay.isVisible = false;
      }

      if (this.view.flxBottomSheet) {
        this.view.flxBottomSheet.isVisible = true;
        this.view.flxBottomSheet.bottom = "-100%";
      }

      this.view.isVisible = false;
    },

    bindEvents: function () {
      if (this.view.flxClose) {
        this.view.flxClose.onTouchEnd = this.onClose.bind(this);
      }

      if (this.view.lblCancel) {
        this.view.lblCancel.onTouchEnd = this.onCancel.bind(this);
      }

      if (this.view.segCommonList) {
        this.view.segCommonList.onRowClick = this.onRowClick.bind(this);
      }
    },

    show: function (config) {
      config = config || {};

      kony.print("COMMON LIST :: SHOW :: " + (config.title || ""));

      this.selectedCallback = config.onRowSelected || null;

      if (this.view.lblDesc1) {
        this.view.lblDesc1.text = config.title || "";
      }

      if (this.view.lblDesc2) {
        this.view.lblDesc2.text = config.description2 || "";

        this.view.lblDesc2.isVisible = config.description2Visible === true;
      }

      if (this.view.lblDesc3) {
        this.view.lblDesc3.text = config.description3 || "";
      }

      /*
       * Clear previous data.
       */
      this.view.segCommonList.setData([]);

      /*
       * Set template.
       */
      if (config.template) {
        this.view.segCommonList.rowTemplate = config.template;
      }

      /*
       * Set widget map.
       */
      this.view.segCommonList.widgetDataMap = config.widgetDataMap || {};

      var data = config.data || [];

      var showAccName =
        config.visibleWidgets && config.visibleWidgets.lblAccName === true;

      for (var i = 0; i < data.length; i++) {
        if (
          data[i] &&
          !Array.isArray(data[i]) &&
          data[i].lblAccName !== undefined
        ) {
          data[i].lblAccName = {
            text: data[i].lblAccName || "",
            isVisible: showAccName,
          };
        }
      }

      kony.print("COMMON LIST :: lblAccName enabled = " + showAccName);

      this.view.segCommonList.setData(data);

      this.bindEvents();

      this.isOpen = true;
      this.view.isVisible = true;

      if (this.view.flxOverlay) {
        this.view.flxOverlay.isVisible = true;
      }

      if (this.view.flxBottomSheet) {
        this.view.flxBottomSheet.isVisible = true;
        this.view.flxBottomSheet.bottom = "-100%";
      }

      this.view.forceLayout();

      var animation = kony.ui.createAnimation({
        0: {
          bottom: "-100%",
          stepConfig: {
            timingFunction: kony.anim.EASE_OUT,
          },
        },

        100: {
          bottom: "-16dp",
          stepConfig: {
            timingFunction: kony.anim.EASE_OUT,
          },
        },
      });

      this.view.flxBottomSheet.animate(
        animation,
        {
          duration: 0.35,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },
        {
          animationEnd: function () {
            this.view.flxBottomSheet.bottom = "-16dp";
          }.bind(this),
        },
      );
    },

    hide: function () {
      if (!this.isOpen) {
        this.view.isVisible = false;

        if (this.view.flxOverlay) {
          this.view.flxOverlay.isVisible = false;
        }

        return;
      }

      this.isOpen = false;

      var animation = kony.ui.createAnimation({
        0: {
          bottom: "-16dp",
          stepConfig: {
            timingFunction: kony.anim.EASE_IN,
          },
        },

        100: {
          bottom: "-100%",
          stepConfig: {
            timingFunction: kony.anim.EASE_IN,
          },
        },
      });

      this.view.flxBottomSheet.animate(
        animation,
        {
          duration: 0.28,
          fillMode: kony.anim.FILL_MODE_FORWARDS,
        },
        {
          animationEnd: function () {
            this.view.flxBottomSheet.bottom = "-100%";

            this.view.isVisible = false;

            if (this.view.flxOverlay) {
              this.view.flxOverlay.isVisible = false;
            }
          }.bind(this),
        },
      );
    },

    onRowClick: function (segment, sectionIndex, rowIndex) {
      kony.print("COMMON LIST :: ROW CLICK :: " + rowIndex);

      var data = segment.data || [];
      var rowData = null;

      if (data.length > 0 && !Array.isArray(data[0])) {
        rowData = data[rowIndex];
      } else if (data[sectionIndex] && data[sectionIndex][1]) {
        rowData = data[sectionIndex][1][rowIndex];
      }

      if (!rowData) {
        kony.print("COMMON LIST :: INVALID ROW DATA");
        return;
      }

      if (rowData.lblAccName && typeof rowData.lblAccName === "object") {
        rowData.lblAccName = rowData.lblAccName.text || "";
      }

      kony.print("COMMON LIST :: SELECTED :: " + JSON.stringify(rowData));

      var callback = this.selectedCallback;

      this.selectedCallback = null;

      if (typeof callback === "function") {
        callback(rowData, rowIndex, sectionIndex);
      } else {
        kony.print("COMMON LIST :: CALLBACK IS NULL");
      }

      this.hide();
    },

    onCancel: function () {
      kony.print("COMMON LIST :: CANCEL");

      this.selectedCallback = null;
      this.hide();
    },

    onClose: function () {
      kony.print("COMMON LIST :: CLOSE");

      this.selectedCallback = null;
      this.hide();
    },

    onOverlayClick: function () {
      kony.print("COMMON LIST :: OVERLAY CLICK");

      this.hide();
    },
  };
});
