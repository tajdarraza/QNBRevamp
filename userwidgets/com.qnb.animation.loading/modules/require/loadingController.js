define(function () {

    return {

        nativeView: null,
        nativeContainer: null,
        isLoading: false,
        animationType: "skeleton1",

        show: function (animationType) {

            kony.print(
                "LOADING :: SHOW :: type=" +
                animationType
            );

            this.animationType =
                animationType || "skeleton1";

            this.isLoading = true;
            this.view.isVisible = true;

            if (this.nativeView) {

                kony.print(
                    "LOADING :: NATIVE VIEW ALREADY READY"
                );

                this.showLottie();

                return;
            }

            if (this.nativeContainer) {

                kony.print(
                    "LOADING :: NATIVE CONTAINER EXISTS, WAITING"
                );

                return;
            }

            this.createNativeContainer();
        },

        createNativeContainer: function () {

            var self = this;

            kony.print(
                "LOADING :: CREATING NATIVE CONTAINER"
            );

            var basicprop = {
                id: "NativeContainer1",
                zIndex: 999,
                top: "0%",
                left: "0%",
                width: "100%",
                height: "100%",

                onCreated: function (nativeView) {

                    kony.print(
                        "LOADING :: NATIVE VIEW CREATED"
                    );

                    kony.print(
                        "LOADING :: NATIVE VIEW = " +
                        nativeView
                    );

                    self.nativeView = nativeView;

                    if (self.isLoading) {

                        kony.print(
                            "LOADING :: STARTING LOTTIE :: type=" +
                            self.animationType
                        );

                        self.showLottie();
                    }
                },

                onCleanup: function () {

                    kony.print(
                        "LOADING :: NATIVE CONTAINER CLEANUP"
                    );

                    self.nativeView = null;
                }
            };

            this.nativeContainer =
                new kony.ui.NativeContainer(
                    basicprop
                );

            this.view.add(
                this.nativeContainer
            );

            kony.print(
                "LOADING :: NATIVE CONTAINER ADDED"
            );
        },

        showLottie: function () {

            if (!this.nativeView) {

                kony.print(
                    "LOADING :: NATIVE VIEW NOT READY"
                );

                return;
            }

            try {

                var QNBLottie =
                    java.import(
                        "com.qnb.myanimation.QNBLottie"
                    );

                kony.runOnMainThread(
                    function () {

                        QNBLottie.showSkeleton(
                            this.nativeView,
                            this.animationType
                        );

                        kony.print(
                            "LOADING :: LOTTIE SHOW REQUESTED :: type=" +
                            this.animationType
                        );

                    }.bind(this)
                );

            } catch (e) {

                kony.print(
                    "LOADING :: LOTTIE ERROR :: " +
                    e
                );
            }
        },

        hide: function () {

            kony.print(
                "LOADING :: HIDE"
            );

            this.isLoading = false;

            if (this.nativeView) {

                try {

                    var QNBLottie =
                        java.import(
                            "com.qnb.myanimation.QNBLottie"
                        );

                    kony.runOnMainThread(
                        function () {

                            QNBLottie.hideSkeleton(
                                this.nativeView
                            );

                            kony.print(
                                "LOADING :: LOTTIE HIDDEN"
                            );

                        }.bind(this)
                    );

                } catch (e) {

                    kony.print(
                        "LOADING :: HIDE ERROR :: " +
                        e
                    );
                }
            }

            this.view.isVisible = false;
        }
    };
});
