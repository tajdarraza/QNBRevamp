define({
    isChecked: false,
    isMask: true,
    isSwitchOn: false,
    isExpanded: true,
    dummy: "",
    loginUserName: "",

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

        //Previously dead taps. Neither destination exists in this POC, so they are handled
        //gracefully rather than left inert — a dead tap during the demo reads as a broken build.
        this.view.lblForgotDetails.onTouchEnd = this.onResetLoginDetails;
        this.view.lblGetStarted.onTouchEnd = this.onGetStarted;
        this.view.lblNewToQNB.onTouchEnd = this.onGetStarted;

    },

    onGetStarted: function () {
        //frmWelcomeScreen IS the "get started" screen in the design flow, and it already exists.
        //Repoint here if a real registration/onboarding journey is added.
        new kony.mvc.Navigation("frmWelcomeScreen").navigate();
    },

    onResetLoginDetails: function () {
        //Real app routes to the forgot-username/password journey (FGTPWD_V1); not built in this POC.
        kony.ui.Alert({
            message: "Resetting login details isn't part of this prototype yet.",
            alertType: constants.ALERT_TYPE_INFO,
            alertTitle: "Reset login details",
            yesLabel: "OK"
        }, {});
    },

    loggedInUser: function () {
        this.view.lblUsernameLogin.isVisible = true;
        this.view.lblMobileBanking.isVisible = false;
        this.view.flxUsernameParent.isVisible = false;
        this.view.flxHideBalance.isVisible = true;
        this.view.flxLoginWelcome.top = "90dp";

        //The label ships with the design-time placeholder "Fulanah Al-Fulaniyyah" and was never
        //populated. Prefer the full name from getLastLogin, fall back to the stored username.
        var display = kony.store.getItem("pocFullName");
        if (!nullCheck(display)) { display = kony.store.getItem("pocUserName"); }
        if (nullCheck(display)) { this.view.lblUsernameLogin.text = display; }
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
        //this.view.flxChckbox.skin = "CopyslFbox0b6c72520c80849";
        this.view.imgCheck.src = "uncheckbox.png";
        //"Remember me" reflects whether a username is currently remembered, rather than resetting to
        //unchecked on every visit. It was previously a skin swap with no effect on anything.
        this.isChecked = nullCheck(kony.store.getItem("pocUserName"));
        this.view.flxChckbox.skin = this.isChecked ?
            "CopyslFbox0f087fc2268764e" : "CopyslFbox0b6c72520c80849";

        //Single-market POC — no country picker behaviour, per product decision.
        this.view.lblCountry.text = "Qatar";

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
        this.view.lblUsernameLogin.text = i18n.get("USER_NAME");
        this.view.lblRememberMe.text = i18n.get("LBL_REMEMBER_ME");
        this.view.lblWelcome.text = i18n.get("MSG_WELCOME");
        this.view.btnLogin.text = i18n.get("BTN_LOGIN");
        this.view.lblHideBalance.text = i18n.get("LBL_HIDE_BAL");
        

        //Driven solely by "remember me". Deliberately NOT gated on isLoggedIn: frmWelcomeScreen's
        //btnLogin sets that flag to false on its way here, so including it would suppress the
        //returning-user layout on exactly the path most users take. It also hides the username
        //field, so a stored username is what makes this layout usable at all.
        if (nullCheck(kony.store.getItem("pocUserName"))) {
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
        var self = this;
        var pass = this.view.txtPassword.text;
        var user = this.view.txtUsername.text;

        this.view.flxError.isVisible = false;

        //On the returning-user path loggedInUser() hides flxUsernameParent, so the field is empty and
        //unreachable — the user is only asked for a password. Fall back to the stored username.
        if (!nullCheck(user)) {
            user = kony.store.getItem("pocUserName");
        }

        if (!nullCheck(user)) {
            self.showLoginError("Please enter your username.");
            return;
        }
        if (!nullCheck(pass)) {
            self.showLoginError("Please enter your password.");
            return;
        }
        this.loginUserName = user;

        if (USE_MOCK_SERVICES) {
            self.runMockLogin();
            return;
        }

        this.view.loading.show(this, "Loading...");
        this.armLoginWatchdog();

        //Two calls: rp fetches the per-session RSA keys, then loginComposite2 sends the credentials
        //encrypted with them. The keys cannot be cached across launches.
        this.callRpService();
    },

    callRpService: function () {
        var self = this;
        try {
            var inputParam = {
                dt: kony.os.deviceInfo().name,
                dm: tab_isTablet(),
                aver: appConfig.appVersion
            };
            invokeServiceAsync(
                QNBConstants.serviceName.rp,
                createHeaderObj("", false),
                encryptPayLoad(inputParam),
                function (status, result) { self.rpCallBack(status, result); }
            );
        } catch (e) {
            commonTryCatchHandler(e, "callRpService,frmLoginController", "");
            self.failLogin("Could not start login: " + e);
        }
    },

    rpCallBack: function (status, result) {
        var self = this;
        try {
            kony.print("POC: rp status=" + status + " opstatus=" + (result && result.opstatus));

            if (result && result.opstatus == "1" && result.errormsg && result.appUpgradeUrl) {
                gblQNB.appUpgradeUrl = result.appUpgradeUrl;
                //The server compares the `aver` we sent (appConfig.appVersion, from the project's
                //appversionkey) against its minimum. Log what we actually sent, and whether the
                //session keys still came back — if they did, the version gate is advisory here.
                kony.print("POC: rp says upgrade required. aver sent=" + appConfig.appVersion +
                    " errormsg=" + result.errormsg +
                    " pk present=" + result.hasOwnProperty("pk") +
                    " k present=" + result.hasOwnProperty("k"));
                self.failLogin("App upgrade required (sent version " + appConfig.appVersion + ").");
                return;
            }
            if (!result || !result.hasOwnProperty("pk") || !result.hasOwnProperty("k")) {
                self.failLogin("Could not fetch session keys (rp).");
                return;
            }

            //Response field `pk` -> gblQNB.pk (password key), response field `k` -> gblQNB.lk
            //(username key). The asymmetric naming is easy to wire backwards; if these are swapped
            //the server rejects the login with a generic error that points nowhere.
            gblQNB.pk = result["pk"];
            gblQNB.lk = result["k"];

            //Proves the native encryption bindings actually loaded on this platform. Needs the real
            //keys, so this is the earliest point it can run.
            try { pocCheckNativeCrypto(gblQNB.lk, gblQNB.pk); } catch (e) { kony.print("[POC-CHECK] " + e); }

            self.callLoginService();
        } catch (e) {
            commonTryCatchHandler(e, "rpCallBack,frmLoginController", "");
            self.failLogin("rp failed: " + e);
        }
    },

    callLoginService: function () {
        var self = this;
        try {
            //Resolved in btnLogin — may have come from storage rather than the (hidden) field.
            var un = this.loginUserName;
            var cd = this.view.txtPassword.text;

            var unEnc = invokeEncUtil(un, gblQNB.lk);          //RSA
            var cdEnc = invokeCodeEncUtil(cd, gblQNB.pk);      //RSA + PBKDF2

            if (!nullCheck(unEnc) || !nullCheck(cdEnc)) {
                self.failLogin("Encryption failed — native binding missing on this platform.");
                return;
            }

            var data = {
                ire: unEnc,
                cd: cdEnc,
                apsa: encUtilA("N"),
                d: encUtilA(getDeviceID()),
                ps: "",
                dt: encUtilA(kony.os.deviceInfo().name),
                gl: nullCheck(QNBConstants.gl) ? QNBConstants.gl : ""
            };

            var headers = {
                "Accept-Language": getLanguageForHeader(),
                "unit": getCurrentUnitValue(),
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            };

            gblQNB.loginMode = "PASS";
            gblQNB.un = un.toUpperCase();

            invokeServiceAsync(
                QNBConstants.serviceName.loginComposite2,
                headers,
                data,
                function (status, result) { self.loginCallBack(status, result); }
            );
        } catch (e) {
            commonTryCatchHandler(e, "callLoginService,frmLoginController", "");
            self.failLogin("Login dispatch failed: " + e);
        }
    },

    loginCallBack: function (status, result) {
        var self = this;
        try {
            self.cancelLoginWatchdog();
            kony.print("POC: loginComposite2 status=" + status +
                " opstatus=" + (result && result.opstatus) +
                " code=" + (result && result.status ? result.status.code : "?"));

            if (!result || (result.opstatus !== 0 && result.opstatus !== "0")) {
                self.failLogin("Login failed (opstatus " + (result && result.opstatus) + ").");
                return;
            }
            if (!result.status || result.status.code !== QNBConstants.serviceResponseCodes.loginSuccess) {
                self.failLogin(nullCheck(result.status && result.status.description) ?
                    result.status.description : "Incorrect username or password. Please try again.");
                return;
            }

            //The user profile is an AES blob, not plain fields.
            var loginParams = {};
            if (nullCheck(result.data) && nullCheck(result.data.eU)) {
                loginParams = JSON.parse(decUtilA(result.data.eU));
            }

            //Third gate: opstatus and status.code can both pass while login is still refused.
            if (loginParams.ila !== "Y") {
                self.failLogin("Login is not permitted for this user.");
                return;
            }

            gblQNB.atkn = result.data.atkn;              //Authorization: Bearer <atkn>
            gblQNB.sersesId = loginParams.cseid;         //injected into every request body as cseid
            gblQNB.login = true;
            gblQNB.uno = loginParams.userNo;
            gblQNB.mmNo = loginParams.maskedMobileNo;

            //Device-registration state. These sit at the TOP level of the response (not inside eU)
            //and are each individually AES-encrypted. Production reads them to decide whether to
            //force device registration after login; the POC skipped that step entirely, so capture
            //them at least so we can see what the server thinks of this device.
            //  r   = devStatus     Y registered / N not / M max devices reached
            //  ide = isDevRegUnit  this unit offers device registration
            //  imd = isMandRegUnit registration is mandatory for this unit
            try {
                if (nullCheck(result.r)) { gblQNB.devStatus = decUtilA(result.r); }
                if (nullCheck(result.ide)) { gblQNB.isDevRegUnit = decUtilA(result.ide); }
                if (nullCheck(result.imd)) { gblQNB.isMandRegUnit = decUtilA(result.imd); }
                kony.print("POC LOGIN: devStatus=" + gblQNB.devStatus +
                    " isDevRegUnit=" + gblQNB.isDevRegUnit +
                    " isMandRegUnit=" + gblQNB.isMandRegUnit +
                    " segId=" + loginParams.si + " otpRequired=" +
                    (nullCheck(result.data.ior) ? decUtilA(result.data.ior) : "n/a"));
            } catch (e) {
                kony.print("POC LOGIN: could not read device-registration flags :: " + e);
            }

            kony.print("POC: atkn set=" + nullCheck(gblQNB.atkn) +
                " cseid set=" + nullCheck(gblQNB.sersesId));

            //OTP branch. Production routes to frmSMSPinActivation, calls op `vlo` and REPLACES atkn.
            //The POC has no OTP form. With POC_BYPASS_OTP we deliberately treat ior as "N" and carry
            //on with the pre-OTP token — which the backend may reject on the authenticated dashboard
            //calls. The log line below is the marker to check first if the dashboard comes back empty.
            var otpRequired = nullCheck(result.data.ior) && decUtilA(result.data.ior) === "Y";
            if (otpRequired) {
                if (!POC_BYPASS_OTP) {
                    kony.print("POC: OTP REQUIRED (ior=Y) — no OTP screen exists in this POC");
                    self.failLogin("This user requires an OTP, which the POC cannot yet collect.");
                    return;
                }
                kony.print("POC: OTP REQUIRED (ior=Y) — BYPASSED by POC_BYPASS_OTP. " +
                    "Token is pre-OTP and may be rejected by authenticated calls.");
            }

            self.hideLoginLoader();
            kony.store.setItem("isLoggedIn", true);

            //"Remember me" decides whether we keep the username. Keeping it drives the returning-user
            //layout (password-only + "Welcome <name>"); clearing it returns to the full login form.
            if (self.isChecked) {
                kony.store.setItem("pocUserName", self.loginUserName);
            } else {
                kony.store.removeItem("pocUserName");
                kony.store.removeItem("pocFullName");
            }
            new kony.mvc.Navigation("frmDashboard").navigate({ hideBalance: self.isSwitchOn });
        } catch (e) {
            commonTryCatchHandler(e, "loginCallBack,frmLoginController", "");
            self.failLogin("Login response parse failed: " + e);
        }
    },

    runMockLogin: function () {
        var self = this;
        this.view.loading.show(this, "Loading...");
        var response = { status: "SUCCESS", message: "Data fetched successfully" };
        serviceCall(response, function () {
            self.hideLoginLoader();
            kony.store.setItem("isLoggedIn", true);
            new kony.mvc.Navigation("frmDashboard").navigate({ hideBalance: self.isSwitchOn });
        }, 2);
    },

    showLoginError: function (msg) {
        this.view.flxUsername.skin = "CopyslFbox0e35759f4fbc44b";
        this.view.flxPassword.skin = "CopyslFbox0e35759f4fbc44b";
        this.view.lblError.text = "" + msg;
        this.view.flxError.isVisible = true;
    },

    failLogin: function (msg) {
        this.cancelLoginWatchdog();
        this.hideLoginLoader();
        kony.print("POC LOGIN FAIL :: " + msg);
        this.showLoginError(msg);
    },

    hideLoginLoader: function () {
        try {
            this.view.loading.hideLoader(this);
        } catch (e) {
            kony.print("hideLoginLoader :: " + e);
        }
    },

    //invokeServiceAsync never fires its callback on no-network, VPN, duplicate-call, maintenance
    //mode or session expiry — without this the login button spins forever with no explanation.
    armLoginWatchdog: function () {
        var self = this;
        kony.timer.schedule("pocLoginWatchdog", function () {
            kony.timer.cancel("pocLoginWatchdog");
            self.hideLoginLoader();
            self.showLoginError("No response from the server. Check network/VPN and retry.");
        }, 45, false);
    },

    cancelLoginWatchdog: function () {
        try {
            kony.timer.cancel("pocLoginWatchdog");
        } catch (e) {
            //not armed
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
            this.view.imgCheck.src = "checkbox.png";
           // this.view.flxChckbox.skin = "CopyslFbox0f087fc2268764e";
            //this.view.imgCheckbox.src = "checkbox_checked.png";
        } else {
            this.view.imgCheck.src = "uncheckbox.png";
            //this.view.flxChckbox.skin = "CopyslFbox0b6c72520c80849";
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