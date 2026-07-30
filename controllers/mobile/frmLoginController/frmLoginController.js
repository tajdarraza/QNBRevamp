define({
    isChecked: false,
    isMask: true,
    isSwitchOn: false,
    isExpanded: true,
    dummy: "",

    onNavigate: function (params) {
        this.view.init = this.onInit;
        this.view.preShow = this.preShow;
        this.view.onDeviceBack = this.onDeviceBack;
        //CopyslFbox0f087fc2268764e
        //CopyslFbox0e35759f4fbc44b red border
    },

    onInit: function () {
        this.view.flxChckbox.onTouchEnd = this.toggleCheckbox;
        this.view.imgVisibility.onTouchEnd = this.toggleMasking;
        this.view.btnLogin.onClick = this.btnLogin;

        //for bottomsheet
        this.view.flxChev.onTouchEnd = this.toggleBottomSheet;
        this.view.flxLifeRewards.onTouchStart = this.onTouchStart;
        this.view.flxLifeRewards.onTouchEnd = this.onTouchEnd;
        this.view.flxFindUs.onTouchStart = this.onTouchStart1;
        this.view.flxFindUs.onTouchEnd = this.onTouchEnd1;
        this.view.flxQNBNews.onTouchStart = this.onTouchStart2;
        this.view.flxQNBNews.onTouchEnd = this.onTouchEnd2;

        //switch
        this.view.flxSwitchWidget.onTouchEnd = this.toggleSwitch.bind(this);

    },

    loggedInUser: function () {
        this.view.lblUsernameLogin.isVisible = true;
        this.view.lblMobileBanking.isVisible = false;
        this.view.flxUsernameParent.isVisible = false;
        this.view.flxHideBalance.isVisible = true;
        this.view.flxLoginWelcome.top = "90dp";
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

    onDeviceBack: function () {
        var isLoggedIn = kony.store.getItem("isLoggedIn");
        if (isLoggedIn) {

        } else {
            new kony.mvc.Navigation("frmWelcomeScreen").navigate();
        }

    },
    preShow: function () {
        this.view.flxChckbox.skin = "CopyslFbox0b6c72520c80849";
        this.view.imgVisibility.src = "trailing_icon.png";
        this.view.flxUsername.skin = "CopyslFbox0gb7ddbb0a9d54d";
        this.view.flxPassword.skin = "CopyslFbox0gb7ddbb0a9d54d";
        this.view.flxUsername.text = "";
        this.view.flxPassword.text = "";
        this.view.flxError.isVisible = false;
        this.view.flxLoginWelcome.top = "40dp";
        this.view.flxSwitchWidget.skin = "sknSwitchOff"
        this.view.imgLangLogo.onTouchEnd = this.localeChange;
        this.view.flxHideBalance.isVisible = false;
        this.view.lblUsername.text = i18n.get("LBL_USERNAME");

        var isLoggedIn = kony.store.getItem("isLoggedIn");
        if (isLoggedIn) {
            this.loggedInUser();
        }



        //for bottomsheet
        this.view.imgChev.src = "iconplaceholder.png";
        this.view.flxBottomSheet.height = "54dp";
        this.view.flxBottomSheet.bottom = "-10dp";

        this.view.flxLifeRewards.skin = "CopyslFbox0a60b503bd4fd4b";
        this.view.flxFindUs.skin = "CopyslFbox0a60b503bd4fd4b";
        this.view.flxQNBNews.skin = "CopyslFbox0a60b503bd4fd4b";
        this.hideLoader(this);
    },

    localeChange: function () {

        try {        //var callAAR = java.import("com.qnb.localeupdate.LocaleUpdate");
            //callAAR.updateLocale("ar");
            this.dummy = "Raza";
            this.view.loading.show(this, "Loading..");
            var currentLocale = kony.i18n.getCurrentLocale();
            var set_locale = "";
            if (currentLocale == "en") {
                set_locale = "ar";
            } else {
                set_locale = "en";
            }
            kony.i18n.setCurrentLocaleAsync(
                set_locale,
                onLocaleChangeSuccess,
                onLocaleChangeFailure
            );

            function onLocaleChangeSuccess() {
                var nav = new kony.mvc.Navigation("frmDummy");
                nav.navigate();
                kony.application.destroyForm("frmLogin");
                kony.application.destroyForm("frmWelcomeScreen");
                kony.application.destroyForm("frmDashboard");
                var currentLocale = kony.i18n.getCurrentLocale();
                kony.store.setItem("current_locale", currentLocale)
                //     kony.application.destroyForm("frmLogin");
                // new kony.mvc.Navigation("frmLogin").navigate();

                kony.timer.schedule("languageChangeTimer", function () {

                    var nav = new kony.mvc.Navigation("frmLogin");
                    nav.navigate();

                    kony.timer.cancel("languageChangeTimer");

                }, 2, false);

            };



            function onLocaleChangeFailure() {
                alert("fail")
                kony.print("Failed to change locale.");
            };
        }
        catch (e) {
            alert(e)
        }

    },

    hideLoader: function () {

        this.view.loading.hideLoader(this);
    },

    btnLogin: function () {
        var pass = this.view.txtPassword.text;
        var user = this.view.txtUsername.text;
        if (pass === "abc") {
            this.view.flxUsername.skin = "CopyslFbox0e35759f4fbc44b";
            this.view.flxPassword.skin = "CopyslFbox0e35759f4fbc44b";
            this.view.lblError.text = "Incorrect username or password. Please try again."

            this.view.flxError.isVisible = true;
            return;
        } else if (pass === "123") {

        }
        else {
            //showLoadingScreen();
            this.view.loading.show(this, "Loading...");

            var response = {
                status: "SUCCESS",
                message: "Data fetched successfully",
                accounts: [
                    {
                        accountNo: "1234567890",
                        balance: "QAR 12,450.75"
                    }
                ]
            };
            serviceCall(response, function (res) {
                var isLoggedIn = kony.store.getItem("isLoggedIn");
                //kony.application.dismissLoadingScreen();

                this.view.loading.hideLoader(this);
                kony.store.setItem("isLoggedIn", true);
                new kony.mvc.Navigation("frmDashboard").navigate({ hideBalance: this.isSwitchOn });
                //alert(JSON.stringify(res));
            }.bind(this), 4);

        }


    },
    toggleMasking: function () {
        this.isMask = !this.isMask;

        if (this.isMask) {
            this.view.txtPassword.secureTextEntry = true;
            this.view.imgVisibility.src = "trailing_icon.png";

            //this.view.imgCheckbox.src = "checkbox_checked.png";
        } else {
            this.view.txtPassword.secureTextEntry = false;
            this.view.imgVisibility.src = "eyevisible.png";
            // this.view.imgCheckbox.src = "checkbox_unchecked.png";
        }
    },

    toggleCheckbox: function () {

        this.isChecked = !this.isChecked;

        if (this.isChecked) {
            this.view.flxChckbox.skin = "CopyslFbox0f087fc2268764e";
            //this.view.imgCheckbox.src = "checkbox_checked.png";
        } else {
            this.view.flxChckbox.skin = "CopyslFbox0b6c72520c80849";
            // this.view.imgCheckbox.src = "checkbox_unchecked.png";
        }

    },

    //for bottomsheet
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

    toggleSwitch: function () {
        try {
            var thumbWidth = this.view.flxThumb.frame.width;
            var switchWidth = this.view.flxSwitchWidget.frame.width;
            var padding = 2;

            var leftOn = switchWidth - thumbWidth - padding;
            if (this.isSwitchOn) {

                this.view.flxThumb.animate(
                    kony.ui.createAnimation({
                        "100": {
                            "left": "2dp"
                        }
                    }),
                    {
                        duration: 0.18,
                        fillMode: kony.anim.FILL_MODE_FORWARDS
                    },
                    {}
                );

                this.view.flxSwitchWidget.skin = "sknSwitchOff";

            } else {

                this.view.flxThumb.animate(
                    kony.ui.createAnimation({
                        "100": {
                            "left": leftOn + "dp"
                        }
                    }),
                    {
                        duration: 0.18,
                        fillMode: kony.anim.FILL_MODE_FORWARDS
                    },
                    {}
                );

                this.view.flxSwitchWidget.skin = "sknSwitchOn";
            }

            this.isSwitchOn = !this.isSwitchOn;
        } catch (e) {
            alert(JSON.stringify(e));
        }


    },

});