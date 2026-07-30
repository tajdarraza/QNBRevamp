define({

    //Type your controller code here 
    isExpanded: true,
    onNavigate: function (params) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });

    },

    onInit: function () {
        this.view.flxChev.onTouchEnd = this.toggleBottomSheet;
        this.view.flxLifeRewards.onTouchStart = this.onTouchStart;
        this.view.flxLifeRewards.onTouchEnd = this.onTouchEnd;
        this.view.flxFindUs.onTouchStart = this.onTouchStart1;
        this.view.flxFindUs.onTouchEnd = this.onTouchEnd1;
        this.view.flxQNBNews.onTouchStart = this.onTouchStart2;
        this.view.flxQNBNews.onTouchEnd = this.onTouchEnd2;
        this.view.btnLogin.onClick = this.btnLogin;


    },

    isLoggedIn: function () {
        var isLoggedIn = kony.store.getItem("isLoggedIn");
        if (isLoggedIn) {
            new kony.mvc.Navigation("frmLogin").navigate();
        }
    },

    preShow: function () {

        this.view.imgChev.src = "iconplaceholder.png";
        this.view.flxBottomSheet.height = "54dp";
        this.view.flxBottomSheet.bottom = "-10dp";

        this.view.flxLifeRewards.skin = "CopyslFbox0a60b503bd4fd4b";
        this.view.flxFindUs.skin = "CopyslFbox0a60b503bd4fd4b";
        this.view.flxQNBNews.skin = "CopyslFbox0a60b503bd4fd4b";

    },
    btnLogin: function () {
        try {
            new kony.mvc.Navigation("frmLogin").navigate();
            kony.store.setItem("isLoggedIn", false);
        } catch (e) {
            alert(e)
        }

        //kony.mvc.Navigation("frmLogin").navigate();
    },


    onTouchStart: function () {
        this.view.flxLifeRewards.skin = "CopyslFbox0f369f5672c6747";
    },

    onTouchStart1: function () {
        this.view.flxFindUs.skin = "CopyslFbox0f369f5672c6747";
    },
    onTouchStart2: function () {
        this.view.flxQNBNews.skin = "CopyslFbox0f369f5672c6747";
    },

    onTouchEnd: function () {
        this.view.flxLifeRewards.skin = "CopyslFbox0a60b503bd4fd4b";//CopyslFbox0i21eea9109f042
    },
    onTouchEnd1: function () {
        this.view.flxFindUs.skin = "CopyslFbox0a60b503bd4fd4b";//CopyslFbox0i21eea9109f042

    },
    onTouchEnd2: function () {
        this.view.flxQNBNews.skin = "CopyslFbox0a60b503bd4fd4b";//CopyslFbox0i21eea9109f042
    },

    toggleBottomSheet: function () {
        try {

            if (this.isExpanded) {

                // Change icon to UP (expand icon)
                this.view.imgChev.src = "iconplaceholder.png";

                this.collapseBottomSheet();

            } else {

                // Change icon to DOWN (collapse icon)
                this.view.imgChev.src = "icondown.png";

                this.expandBottomSheet();
            }

            this.isExpanded = !this.isExpanded;

        } catch (e) {
            alert("toggleBottomSheet " + e)
        }

    },
    collapseBottomSheet: function () {
        try {
            var self = this;

            this.view.flxBottomSheet.animate(
                kony.ui.createAnimation({
                    "100": {
                        "height": "238dp",
                        "bottom": "-10dp"
                    }
                }),
                {
                    duration: 0.3,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        self.view.imgChev.src = "icondown.png";
                    }
                }
            );
        } catch (e) {
            alert("collapseBottomSheet " + e)
        }
    },
    expandBottomSheet: function () {
        try {
            var self = this;

            this.view.flxBottomSheet.animate(
                kony.ui.createAnimation({
                    "100": {
                        "height": "54dp",
                        "bottom": "-10dp"
                    }
                }),
                {
                    duration: 0.3,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {
                        self.view.imgChev.src = "iconplaceholder.png";
                    }
                }
            );
        } catch (e) {
            alert("expandBottomSheet " + e)
        }
    },
    onChevronPress: function () {
        try {
            var anim = kony.ui.createAnimation({
                "100": {
                    "bottom": "-190dp"
                }
            });

            this.view.flxBottomSheet.animate(
                anim,
                {
                    duration: 0.3,
                    fillMode: kony.anim.FILL_MODE_FORWARDS
                },
                null
            );
        } catch (e) {
            alert(e)
        }

    },

});