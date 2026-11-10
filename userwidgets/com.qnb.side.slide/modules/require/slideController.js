define(function () {
    return {
        isOpen: false,
        selectedCallback: null,
        slideData: [],

        postRender: function () {
            kony.print("SLIDE :: POSTRENDER");

            this.isOpen = false;
            this.selectedCallback = null;
            this.slideData = [];

            this.bindEvents();
            this.reset();
        },

        bindEvents: function () {
            if (!this.view.segSlideList) {
                kony.print("SLIDE :: segSlideList NOT FOUND");
                return;
            }

            this.view.segSlideList.onRowClick =
                this.onSlideRowClick.bind(this);

            kony.print("SLIDE :: SEGMENT ROW CLICK BOUND");
        },

        reset: function () {
            if (!this.view.flxMain) {
                return;
            }

            this.view.isVisible = false;
            this.view.flxMain.isVisible = true;
            this.view.flxMain.opacity = 0;

            var startTransform =
                kony.ui.makeAffineTransform();

            startTransform.scale(0.97, 0.97);
            startTransform.translate(0, -5);

            this.view.flxMain.transform =
                startTransform;

            if (this.view.segSlideList) {
                this.view.segSlideList.opacity = 1;

                var normalTransform =
                    kony.ui.makeAffineTransform();

                normalTransform.scale(1, 1);
                normalTransform.translate(0, 0);

                this.view.segSlideList.transform =
                    normalTransform;
            }
        },

        show: function (config) {
            config = config || {};

            kony.print("SLIDE :: SHOW CALLED");

            this.selectedCallback =
                typeof config.onSelected === "function"
                    ? config.onSelected
                    : null;

            this.slideData = config.data || [];
            this.isOpen = true;

            if (!this.view.segSlideList) {
                kony.print(
                    "SLIDE :: segSlideList NOT FOUND"
                );
                return;
            }

            var segmentData = [];

            for (
                var i = 0;
                i < this.slideData.length;
                i++
            ) {
                var isLast =
                    i === this.slideData.length - 1;

                segmentData.push({
                    name: this.slideData[i].name,
                    logo: this.slideData[i].logo,
                    flxSeperator: {
                        isVisible: !isLast
                    }
                });
            }

            this.view.segSlideList.widgetDataMap = {
                imgIcon: "logo",
                lblName: "name",
                flxSeperator: "flxSeperator"
            };

            this.view.segSlideList.setData(
                segmentData
            );

            this.view.segSlideList.onRowClick =
                this.onSlideRowClick.bind(this);

            kony.print(
                "SLIDE :: ROW CLICK REBOUND"
            );

            kony.print(
                "SLIDE :: DATA :: " +
                JSON.stringify(segmentData)
            );

            this.view.segSlideList.opacity = 1;

            var segmentTransform =
                kony.ui.makeAffineTransform();

            segmentTransform.scale(1, 1);
            segmentTransform.translate(0, 0);

            this.view.segSlideList.transform =
                segmentTransform;

            this.view.isVisible = true;
            this.view.flxMain.isVisible = true;
            
            // forceLayout() removed here to prevent iOS layer conflict

            var startTransform =
                kony.ui.makeAffineTransform();

            startTransform.scale(0.97, 0.97);
            startTransform.translate(0, -5);

            var normalTransform =
                kony.ui.makeAffineTransform();

            normalTransform.scale(1, 1);
            normalTransform.translate(0, 0);

            this.view.flxMain.opacity = 0;
            this.view.flxMain.transform =
                startTransform;

            var animation =
                kony.ui.createAnimation({
                    0: {
                        opacity: 0,
                        transform: startTransform,
                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_OUT
                        }
                    },
                    100: {
                        opacity: 1,
                        transform: normalTransform,
                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_OUT
                        }
                    }
                });

            this.view.flxMain.animate(
                animation,
                {
                    duration: 0.28,
                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        this.view.flxMain.opacity = 1;
                        this.view.flxMain.transform =
                            normalTransform;

                        kony.print(
                            "SLIDE :: SHOW ANIMATION COMPLETE"
                        );
                    }.bind(this)
                }
            );
        },

        onSlideRowClick: function (
            segment,
            sectionIndex,
            rowIndex,
            selectedState
        ) {
            kony.print(
                "SLIDE :: ROW CLICK FIRED"
            );

            kony.print(
                "SLIDE :: SECTION = " +
                sectionIndex +
                " :: ROW = " +
                rowIndex +
                " :: STATE = " +
                selectedState
            );

            if (
                rowIndex === undefined ||
                rowIndex === null
            ) {
                kony.print(
                    "SLIDE :: INVALID ROW INDEX"
                );
                return;
            }

            var selectedItem = null;

            if (
                this.slideData &&
                this.slideData[rowIndex]
            ) {
                selectedItem =
                    this.slideData[rowIndex];
            }

            kony.print(
                "SLIDE :: SELECTED ITEM :: " +
                JSON.stringify(selectedItem)
            );

            var callback =
                this.selectedCallback;

            if (typeof callback !== "function") {
                kony.print(
                    "SLIDE :: NO CALLBACK PROVIDED"
                );
                return;
            }

            this.selectedCallback = null;

            kony.print(
                "SLIDE :: CALLBACK EXECUTING"
            );

            callback(selectedItem);

            this.hide();
        },

        hide: function () {
            if (!this.isOpen) {
                if (this.view) {
                    this.view.isVisible = false;
                }
                return;
            }

            kony.print("SLIDE :: HIDE");

            this.isOpen = false;

            var startTransform =
                kony.ui.makeAffineTransform();

            startTransform.scale(1, 1);
            startTransform.translate(0, 0);

            var endTransform =
                kony.ui.makeAffineTransform();

            endTransform.scale(0.97, 0.97);
            endTransform.translate(0, -4);

            var animation =
                kony.ui.createAnimation({
                    0: {
                        opacity: 1,
                        transform: startTransform,
                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_IN
                        }
                    },
                    100: {
                        opacity: 0,
                        transform: endTransform,
                        stepConfig: {
                            timingFunction:
                                kony.anim.EASE_IN
                        }
                    }
                });

            this.view.flxMain.animate(
                animation,
                {
                    duration: 0.18,
                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        kony.print(
                            "SLIDE :: HIDE ANIMATION COMPLETE"
                        );

                        this.view.isVisible = false;
                        this.reset();
                    }.bind(this)
                }
            );
        },

        toggle: function (config) {
            if (this.isOpen) {
                kony.print(
                    "SLIDE :: TOGGLE -> HIDE"
                );

                this.hide();
            } else {
                kony.print(
                    "SLIDE :: TOGGLE -> SHOW"
                );

                this.show(config || {});
            }
        }
    };
});