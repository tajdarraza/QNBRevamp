define(function () {

    return {

        show: function (self, message) {

            self.view.loading.isVisible = true;
            // self.view.loading.lblLoading.text = message || "Loading...";

            // self.view.loading.flxOverlay.isVisible = true;

            // this.startRotation(self);

            self.view.loading.lblLoading.text = message || "Loading...";
            self.view.loading.flxOverlay.isVisible = true;

            //this.isAnimating = true;

            //this.animateDot1();
        },

        hideLoader: function (self) {
            this.isAnimating = false;

            self.view.loading.isVisible = false;

        },

        startRotation: function (self) {

            var transform = kony.ui.makeAffineTransform();
            transform.rotate(360);

            this.view.imgLoader.animate(
                kony.ui.createAnimation({
                    "100": {
                        "transform": transform
                    }
                }),
                {
                    duration: 1,
                    iterationCount: 0, // infinite
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {}
            );
        },

        animateDot1: function () {

            if (!this.isAnimating) return;

            var self = this;
            self.view.flxDot1.skin = "sknDotsLoading";
            self.view.flxDot1.animate(
                kony.ui.createAnimation({
                    "50": {
                        width: "12dp",
                        height: "12dp"
                    },
                    "100": {
                        width: "8dp",
                        height: "8dp"
                    }
                }),
                {
                    duration: 0.3,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        self.view.flxDot1.skin = "sknDotsLoading2";
                        self.animateDot2();
                    }
                }
            );
        }, animateDot2: function () {

            if (!this.isAnimating) return;

            var self = this;
            self.view.flxDot2.skin = "sknDotsLoading";
            self.view.flxDot2.animate(
                kony.ui.createAnimation({
                    "50": {
                        width: "12dp",
                        height: "12dp"
                    },
                    "100": {
                        width: "8dp",
                        height: "8dp"
                    }
                }),
                {
                    duration: 0.3,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        self.view.flxDot2.skin = "sknDotsLoading2";
                        self.animateDot3();
                    }
                }
            );
        }, animateDot3: function () {

            if (!this.isAnimating) return;

            var self = this;
            self.view.flxDot3.skin = "sknDotsLoading";
            self.view.flxDot3.animate(
                kony.ui.createAnimation({
                    "50": {
                        width: "12dp",
                        height: "12dp"
                    },
                    "100": {
                        width: "8dp",
                        height: "8dp"
                    }
                }),
                {
                    duration: 0.3,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        self.view.flxDot3.skin = "sknDotsLoading2";
                        self.animateDot1();
                    }
                }
            );
        }
    };
});