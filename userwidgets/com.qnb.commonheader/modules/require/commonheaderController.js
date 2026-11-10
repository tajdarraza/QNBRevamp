define(function () {
  return {
    configure: function (config) {
      config = config || {};

      // Screen title
      this.view.lblScreenTitle.text = config.title || "";

      // Back action configuration (Supports function OR a string form name)
      if (typeof config.backAction === "function") {
        // 1. Existing usage: a custom callback function was passed
        this.view.flxBack.onClick = config.backAction;
      } else if (typeof config.backAction === "string") {
        // 2. New modular usage: a form name string was passed directly (e.g., backAction: "frmDashboard")
        this.view.flxBack.onClick = this.onBackPress.bind(this, config.backAction);
      } else {
        // 3. Fallback: nothing passed, use default automatic history
        this.view.flxBack.onClick = this.onBackPress.bind(this, null);
      }

      // Action 1
      if (typeof config.action1 === "function") {
        this.view.flxAction1.isVisible = true;
        this.view.flxAction1.onClick = config.action1;
        this.view.imgAction1.src = config.action1Image || "closeicon.png";
      } else {
        this.view.flxAction1.isVisible = false;
        this.view.flxAction1.onClick = null;
      }

      // Action 2
      if (typeof config.action2 === "function") {
        this.view.flxAction2.isVisible = true;
        this.view.flxAction2.onClick = config.action2;
        this.view.imgAction2.src = config.action2Image || "closeicon.png";
      } else {
        this.view.flxAction2.isVisible = false;
        this.view.flxAction2.onClick = null;
      }

      // Adjust right spacing
      this.updateActionSpacing();
    },

    updateActionSpacing: function () {
      var action1Visible = this.view.flxAction1.isVisible;
      var action2Visible = this.view.flxAction2.isVisible;

      if (action1Visible && !action2Visible) {
        this.view.flxAction1.right = "16dp";
      } else if (!action1Visible && action2Visible) {
        this.view.flxAction2.right = "16dp";
      }
    },

    onBackPress: function (targetFormName) {
      try {
        kony.print("HEADER :: BACK PRESS CALLED");

        // If a form name string was provided, navigate to it directly
        if (targetFormName) {
          kony.print("HEADER :: NAVIGATING TO SPECIFIC FORM = " + targetFormName);
          new kony.mvc.Navigation(targetFormName).navigate();
          return;
        }

        // Otherwise, fall back to automatic previous form history
        var previousForm = kony.application.getPreviousForm();
        if (previousForm && previousForm.id) {
          kony.print("HEADER :: NAVIGATING TO PREVIOUS FORM = " + previousForm.id);
          new kony.mvc.Navigation(previousForm.id).navigate();
        } else {
          kony.print("HEADER :: NO PREVIOUS FORM FOUND");
        }
      } catch (e) {
        kony.print("onBackPress catch " + e);
      }
    },
  };
});

// this.view.commonheader.configure({
//     title: "Screen Title",

//     backAction: function() {
//         // optional
//     },

//     action1: function() {
//         // optional
//     },

//     action1Image: "icon1.png",

//     action2: function() {
//         // optional
//     },

//     action2Image: "icon2.png"
// });
