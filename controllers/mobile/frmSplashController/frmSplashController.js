define({

    onNavigate: function (params) {
        this.view.init = this.onInit;

        this.view.preShow = this.preShow;
        kony.application.setApplicationProperties({
            statusBarColor: "E4E2ED",
            statusbarStyle: constants.STATUS_BAR_STYLE_DEFAULT,
        });

    },

    onInit: function () {

    },

    preShow: function () {
        var self = this;
        //Day-1 verification. Runs offline and prints a PASS/FAIL block to the device log.
        //Remove this call (and modules/PocSelfCheck.js) once integration is proven.
        try { pocSelfCheck(); } catch (e) { kony.print("[POC-CHECK] harness missing :: " + e); }

        //The locale drives the Accept-Language header on preLoginComp, and the server returns the
        //datai18n bundle for that locale only. So the config call has to wait for the locale to land.
        this.localeChange(function () {
            if (USE_MOCK_SERVICES) {
                self.runMockBootstrap();
            } else {
                self.initializeSDK();
            }
        });
    },

    initializeSDK: function () {
        var self = this;
        try {
            if (!kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY)) {
                self.showFatal(kony.i18n.getLocalizedString("wifiError"));
                return;
            }
            if (detectVPN()) {
                self.showFatal(kony.i18n.getLocalizedString("vpnError"));
                return;
            }
            showLoadingScreen();
            buildType = POC_BUILD_TYPE;
            konyObject = new kony.sdk();
            gblIsMfCallInProgress = true;
            konyObject.init(
                QNBConstants.appInitKeys[buildType].appkey,
                QNBConstants.appInitKeys[buildType].ask,
                QNBConstants.appInitKeys[buildType].appurl,
                function () { self.initializeSuccessCallback(); },
                function (err) { self.initializeErrorCallback(err); }
            );
        } catch (e) {
            commonTryCatchHandler(e, "initializeSDK,frmSplashController", "");
            self.showFatal("SDK init failed: " + e);
        }
    },

    initializeSuccessCallback: function () {
        gblIsMFInitialized = true;
        gblIsMfCallInProgress = false;
        kony.print("POC: Fabric SDK initialised against " + buildType);
        this.getCommonMetaData();
    },

    initializeErrorCallback: function (err) {
        gblIsMfCallInProgress = false;
        kony.print("POC: Fabric SDK init FAILED :: " + JSON.stringify(err));
        this.showFatal("Could not reach " + buildType + ". Check VPN/network.");
    },

    getCommonMetaData: function () {
        var self = this;
        try {
            //Fire-and-forget; populates QNBConstants.gl, which callMF attaches to every later request.
            getPosition();

            var unit = getCurrentUnitValue();
            var deviceName = "ANDROID_PHONE";
            //#ifdef iphone
            deviceName = "IPHONE";
            //#endif

            var inputParam = {
                dt: kony.os.deviceInfo().name,
                dm: tab_isTablet(),
                aver: appConfig.appVersion,
                unit: unit,
                e: encUtilA(JSON.stringify({ unit: unit, deviceName: deviceName }))
            };

            var hdr = {
                "Accept-Language": getLanguageForHeader(),
                "unit": unit,
                "channel": "MB",
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            };

            //invokeServiceAsync does not always invoke its callback (no network, VPN, duplicate-call
            //guard, maintenance mode, session expiry). Without this the splash would hang forever.
            self.armWatchdog();

            invokeServiceAsync(
                QNBConstants.serviceName.preLoginComp,
                hdr,
                inputParam,
                function (status, res) { self.commonMetaDataCallBack(status, res); }
            );
        } catch (e) {
            commonTryCatchHandler(e, "getCommonMetaData,frmSplashController", "");
            self.showFatal("preLoginComp failed to dispatch: " + e);
        }
    },

    commonMetaDataCallBack: function (status, res) {
        var self = this;
        try {
            self.cancelWatchdog();
            kony.print("POC: preLoginComp status=" + status + " opstatus=" + (res && res.opstatus));

            if (!res || (res.opstatus !== 0 && res.opstatus !== "0")) {
                self.showFatal("Config download failed (opstatus " + (res && res.opstatus) + ")");
                return;
            }

            gblQNB.appUpgradeUrl = nullCheck(res.errormsg) ? res.appUpgradeUrl : "";

            //Fans dataFormConfig out into ~40 QNBConstants slots. "launch" suppresses its internal
            //getBanner() call, which the POC does not use.
            assignEntitlment(res, "launch");

            //Server strings override the compiled bundle for the CURRENT locale only, every launch.
            //Without this most Arabic keys fall back to English.
            if (nullCheck(res.datai18n)) {
                kony.i18n.updateResourceBundle(res.datai18n, kony.i18n.getCurrentLocale());
            }

            if (nullCheck(res.response) && nullCheck(res.response.data)) {
                QNBConstants.units = res.response.data;
            }
            if (nullCheck(res.menuConfig)) {
                QNBConstants.menusConfig = res.menuConfig;
            }

            dismissLoadingScreen();
            self.navigateOnward();
        } catch (e) {
            commonTryCatchHandler(e, "commonMetaDataCallBack,frmSplashController", "");
            self.showFatal("Config parse failed: " + e);
        }
    },

    //Mock path retained so the POC is demoable with the backend down. Mirrors the real callback's
    //navigation so switching USE_MOCK_SERVICES does not change the flow.
    runMockBootstrap: function () {
        var self = this;
        var response = {
            status: "SUCCESS",
            message: "Data fetched successfully",
            accounts: [{ accountNo: "1234567890", balance: "QAR 12,450.75" }]
        };
        serviceCall(response, function () {
            kony.application.dismissLoadingScreen();
            self.navigateOnward();
        }, 3);
    },

    navigateOnward: function () {
        var isLoggedIn = kony.store.getItem("isLoggedIn");
        if (isLoggedIn) {
            new kony.mvc.Navigation("frmLogin").navigate();
        } else {
            new kony.mvc.Navigation("frmWelcomeScreen").navigate();
        }
    },

    armWatchdog: function () {
        var self = this;
        kony.timer.schedule("pocSplashWatchdog", function () {
            kony.timer.cancel("pocSplashWatchdog");
            self.showFatal("No response from " + buildType + " (timed out).");
        }, 40, false);
    },

    cancelWatchdog: function () {
        try {
            kony.timer.cancel("pocSplashWatchdog");
        } catch (e) {
            //not armed
        }
    },

    showFatal: function (msg) {
        this.cancelWatchdog();
        dismissLoadingScreen();
        kony.print("POC SPLASH FATAL :: " + msg);
        kony.ui.Alert({
            message: "" + msg,
            alertType: constants.ALERT_TYPE_ERROR,
            alertTitle: "Startup",
            yesLabel: "OK"
        }, {});
    },

    localeChange: function (onDone) {
        var savedLocale = kony.store.getItem("current_locale");
        var setLocale = "en";
        if (savedLocale !== null) {
            setLocale = savedLocale;
        }
        kony.i18n.setCurrentLocaleAsync(
            setLocale,
            onLocaleChangeSuccess,
            onLocaleChangeFailure
        );

        function onLocaleChangeSuccess() {
            if (onDone) { onDone(); }
        }

        function onLocaleChangeFailure() {
            kony.print("Failed to change locale.");
            //Still continue — English is a usable fallback and blocking here would strand the splash.
            if (onDone) { onDone(); }
        }
    },

});
