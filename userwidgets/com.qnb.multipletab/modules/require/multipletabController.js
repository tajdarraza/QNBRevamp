define(function () {
  return {
    selectedIndex: 0,
    tabConfig: [],
    onTabSelected: null,

    // Default skins
    defaultSelectedFlxSkin: "sknFlxTabQNBSemiBold16Px2a59bd",

    defaultSelectedLblSkin: "sknLblQNBSemibold80PWhite",

    defaultUnselectedFlxSkin: "slFbox",

    defaultUnselectedLblSkin: "sknLblQNBSemibold80P1b124b",

    defaultFlxFourTabSkin: "sknFlx32pxRoundWhiteBgE4E2ED",

    flxFourTabSkin: null,

    initialize: function (config) {
      config = config || {};

      this.selectedIndex =
        config.selectedIndex !== undefined ? config.selectedIndex : 0;

      this.onTabSelected = config.onTabSelected || null;

      this.tabConfig = config.tabs || [];

      this.flxFourTabSkin = config.flxFourTabSkin || this.defaultFlxFourTabSkin;

      this.setupTabs();
    },

    setupTabs: function () {
      var enabledTabs = this.getEnabledTabs();

      this.updateContainerSkin();

      this.updateTabText();

      this.updateTabVisibility(enabledTabs);

      this.updateTabWidths(enabledTabs);

      this.bindTabEvents(enabledTabs);

      this.setSelectedTab(this.selectedIndex, false);
    },

    updateContainerSkin: function () {
      if (!this.view.flxFourTab) {
        return;
      }

      this.view.flxFourTab.skin =
        this.flxFourTabSkin || this.defaultFlxFourTabSkin;
    },

    updateTabText: function () {
      for (var i = 0; i < this.tabConfig.length; i++) {
        var tab = this.tabConfig[i];

        var lblWidget = this.view[tab.lbl];

        if (!lblWidget) {
          continue;
        }

        if (tab.text !== undefined) {
          lblWidget.text = tab.text;
        }
      }
    },

    updateTabVisibility: function (enabledTabs) {
      var enabledMap = {};

      for (var i = 0; i < enabledTabs.length; i++) {
        enabledMap[enabledTabs[i].flx] = true;
      }

      for (var j = 0; j < this.tabConfig.length; j++) {
        var tab = this.tabConfig[j];

        var flxWidget = this.view[tab.flx];

        if (!flxWidget) {
          continue;
        }

        flxWidget.isVisible = !!enabledMap[tab.flx];
      }
    },

    updateTabWidths: function (enabledTabs) {
      if (!enabledTabs.length) {
        return;
      }

      /*
       * Your Visualizer layout has:
       *
       * Tab 1 -> Left 2%
       *
       * Every tab after Tab 1
       * -> Right 2%
       *
       * Therefore:
       *
       * 4 tabs:
       * 2 + 23 + 23 + 23 + 23
       * + 2 + 2 + 2 = 100%
       *
       * We only change WIDTH.
       *
       * Left/Right positioning remains
       * controlled by Visualizer.
       */

      var tabCount = enabledTabs.length;

      var totalSpacing = 2 + (tabCount - 1) * 2;

      var tabWidth = (100 - totalSpacing) / tabCount;

      for (var i = 0; i < enabledTabs.length; i++) {
        var tab = enabledTabs[i];

        var flxWidget = this.view[tab.flx];

        if (!flxWidget) {
          continue;
        }

        flxWidget.width = tabWidth + "%";
      }

      if (this.view.flxFourTab) {
        this.view.flxFourTab.forceLayout();
      }
    },

    bindTabEvents: function (enabledTabs) {
      var self = this;

      for (var i = 0; i < enabledTabs.length; i++) {
        (function (tab) {
          var flxWidget = self.view[tab.flx];

          if (!flxWidget) {
            return;
          }

          flxWidget.onClick = function () {
            self.handleTabClick(tab);
          };
        })(enabledTabs[i]);
      }
    },

    handleTabClick: function (tab) {
      var index = this.getTabIndex(tab);

      if (index === -1) {
        return;
      }

      this.setSelectedTab(index, true);
    },

    setSelectedTab: function (index, triggerCallback) {
      if (triggerCallback === undefined) {
        triggerCallback = true;
      }

      var enabledTabs = this.getEnabledTabs();

      if (!enabledTabs.length) {
        return;
      }

      if (index < 0 || index >= enabledTabs.length) {
        index = 0;
      }

      this.selectedIndex = index;

      for (var i = 0; i < enabledTabs.length; i++) {
        this.updateTabSkin(enabledTabs[i], i === index);
      }

      if (triggerCallback && typeof this.onTabSelected === "function") {
        this.onTabSelected(enabledTabs[index], index);
      }
    },

    updateTabSkin: function (tab, isSelected) {
      var flxWidget = this.view[tab.flx];

      var lblWidget = this.view[tab.lbl];

      if (!flxWidget) {
        return;
      }

      var selectedFlxSkin = tab.selectedFlxSkin || this.defaultSelectedFlxSkin;

      var unselectedFlxSkin =
        tab.unselectedFlxSkin || this.defaultUnselectedFlxSkin;

      var selectedLblSkin = tab.selectedLblSkin || this.defaultSelectedLblSkin;

      var unselectedLblSkin =
        tab.unselectedLblSkin || this.defaultUnselectedLblSkin;

      flxWidget.skin = isSelected ? selectedFlxSkin : unselectedFlxSkin;

      if (lblWidget) {
        lblWidget.skin = isSelected ? selectedLblSkin : unselectedLblSkin;
      }
    },

    getEnabledTabs: function () {
      var enabledTabs = [];

      for (var i = 0; i < this.tabConfig.length; i++) {
        if (this.tabConfig[i].enabled !== false) {
          enabledTabs.push(this.tabConfig[i]);
        }
      }

      return enabledTabs;
    },

    getTabIndex: function (tab) {
      var enabledTabs = this.getEnabledTabs();

      for (var i = 0; i < enabledTabs.length; i++) {
        if (enabledTabs[i] === tab) {
          return i;
        }
      }

      return -1;
    },

    getSelectedTab: function () {
      var enabledTabs = this.getEnabledTabs();

      if (this.selectedIndex >= 0 && this.selectedIndex < enabledTabs.length) {
        return enabledTabs[this.selectedIndex];
      }

      return null;
    },

    refresh: function () {
      this.setupTabs();
    },

    reset: function () {
      this.selectedIndex = 0;

      this.tabConfig = [];

      this.onTabSelected = null;

      this.flxFourTabSkin = this.defaultFlxFourTabSkin;

      if (this.view.flxFourTab) {
        this.view.flxFourTab.skin = this.defaultFlxFourTabSkin;
      }
    },
  };
});
