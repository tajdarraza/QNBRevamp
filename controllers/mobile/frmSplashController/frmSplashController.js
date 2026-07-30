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
        //showLoadingScreen();

        this.localeChange();

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
            kony.application.dismissLoadingScreen();
            if (isLoggedIn) {
                new kony.mvc.Navigation("frmLogin").navigate();
            } else {
                new kony.mvc.Navigation("frmWelcomeScreen").navigate();
            }
            //alert(JSON.stringify(res));
        }, 3);
    },

        localeChange: function () {
        
        var savedLocale = kony.store.getItem("current_locale");
        var setLocale = "en";
        if(savedLocale !== null){
            setLocale = savedLocale;
        }
        kony.i18n.setCurrentLocaleAsync(
            setLocale,
            onLocaleChangeSuccess,
            onLocaleChangeFailure
        );

        function onLocaleChangeSuccess() {
             

        }

        function onLocaleChangeFailure() {
            kony.print("Failed to change locale.");
        }
    },

});