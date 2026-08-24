define(function () {

    return {

        configure: function (config) {

            config = config || {};

            // Screen title
            this.view.lblScreenTitle.text = config.title || "";

            // Back action
            this.view.flxBack.onTouchEnd =
                typeof config.backAction === "function"? config.backAction: this.onBackPress.bind(this);

            // Action 1
            if (typeof config.action1 === "function") {

                this.view.flxAction1.isVisible = true;
                this.view.flxAction1.onTouchEnd = config.action1;

                this.view.imgAction1.src = config.action1Image || "closeicon.png";

            } else {

                this.view.flxAction1.isVisible = false;
                this.view.flxAction1.onTouchEnd = null;
            }

            // Action 2
            if (typeof config.action2 === "function") {

                this.view.flxAction2.isVisible = true;
                this.view.flxAction2.onTouchEnd = config.action2;

                this.view.imgAction2.src = config.action2Image || "closeicon.png";

            } else {

                this.view.flxAction2.isVisible = false;
                this.view.flxAction2.onTouchEnd = null;
            }

            // Adjust right spacing
            this.updateActionSpacing();
        },


        updateActionSpacing: function () {

            var action1Visible = this.view.flxAction1.isVisible;
            var action2Visible = this.view.flxAction2.isVisible;

            // Only Action 1 is visible
            if (action1Visible && !action2Visible) {

                this.view.flxAction1.right = "16dp";

            }

            // Only Action 2 is visible
            else if (!action1Visible && action2Visible) {

                this.view.flxAction2.right = "16dp";

            }

            // Both visible OR both hidden
            // Do not change right
        },


        onBackPress: function () {
            try {
                var previousForm = kony.application.getPreviousForm();

                if (previousForm) {
                    new kony.mvc.Navigation(previousForm.id).navigate();
                }
            } catch (e) {
                kony.print("onBackPress catch "+e)
            }

        }
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