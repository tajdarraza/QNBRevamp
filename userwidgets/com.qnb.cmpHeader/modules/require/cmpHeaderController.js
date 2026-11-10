define(function () {
    return {
        currentMode: "normal",
        callbacks: {},
        /*
         * Parent controller example usage:
         *
         * this.view.cmpHeader.configure({
         *     mode: "normal",
         *     firstName: "Mohammad",
         *     lastName: "Raza",
         *     notificationCount: 5,
         *     callbacks: {
         *         initialsNotification: this.onNotificationClick.bind(this),
         *         country: this.onCountryClick.bind(this),
         *         add: this.onAddClick.bind(this),
         *         language: this.onLanguageClick.bind(this)
         *     }
         * });
         */

        initializeHeader: function () {
            kony.print("========================================");
            kony.print("HEADER :: INITIALIZE");

            this.currentMode = "normal";
            this.callbacks = {};

            this.bindEvents();
            this.setNormalMode();

            kony.print("HEADER :: INITIALIZE COMPLETE");
            kony.print("========================================");
        },

        bindEvents: function () {
            kony.print("HEADER :: BIND EVENTS");

            if (this.view.imgLangLogo) {
                this.view.imgLangLogo.onTouchEnd = this.localeChange.bind(this);
                kony.print("HEADER :: LANGUAGE EVENT BOUND");
            } else {
                kony.print("HEADER :: imgLangLogo NOT FOUND");
            }

            if (this.view.flxAddService) {
                this.view.flxAddService.onClick = this.onAddClick.bind(this);
                kony.print("HEADER :: ADD EVENT BOUND");
            }

            if (this.view.flxCountries) {
                this.view.flxCountries.onClick = this.onCountryClick.bind(this);
                kony.print("HEADER :: COUNTRY EVENT BOUND");
            }

            if (this.view.flxInitialsNotifi) {
                this.view.flxInitialsNotifi.onClick =
                    this.onInitialsNotificationClick.bind(this);
                kony.print("HEADER :: INITIALS/NOTIFICATION EVENT BOUND");
            }
        },

        setNormalMode: function () {
            kony.print("HEADER :: SET NORMAL MODE");

            this.currentMode = "normal";

            if (this.view.flxCountries) {
                this.view.flxCountries.isVisible = false;
            }

            if (this.view.imgLangLogo) {
                this.view.imgLangLogo.isVisible = false;
            }

            if (this.view.flxAddService) {
                this.view.flxAddService.isVisible = true;
            }

            if (this.view.imgSearch) {
                this.view.imgSearch.isVisible = true;
                this.view.imgSearch.src = "search_icon.png";
            }

            if (this.view.flxInitialsNotifi) {
                this.view.flxInitialsNotifi.isVisible = true;
            }
        },

        setLoginMode: function () {
            kony.print("HEADER :: SET LOGIN MODE");

            this.currentMode = "login";

            if (this.view.flxCountries) {
                this.view.flxCountries.isVisible = true;
            }

            if (this.view.lblCountry) {
                this.view.lblCountry.text = "Qatar";
            }

            if (this.view.imgLangLogo) {
                this.view.imgLangLogo.isVisible = true;
                this.view.imgLangLogo.src = "globe_language.png";
            }

            if (this.view.flxAddService) {
                this.view.flxAddService.isVisible = false;
            }

            if (this.view.imgSearch) {
                this.view.imgSearch.isVisible = false;
            }

            if (this.view.flxInitialsNotifi) {
                this.view.flxInitialsNotifi.isVisible = false;
            }
        },

        setWelcomeMode: function () {
            kony.print("HEADER :: SET WELCOME MODE");

            this.setLoginMode();
            this.currentMode = "welcome";
        },

        setGuestMode: function () {
            kony.print("HEADER :: SET GUEST MODE");

            this.setLoginMode();
            this.currentMode = "guest";
        },

        configure: function (config) {
            config = config || {};

            kony.print("HEADER :: CONFIGURE");

            this.bindEvents();

            this.callbacks = config.callbacks || {};

            var mode = config.mode || "normal";

            if (mode === "login") {
                this.setLoginMode();
            } else if (mode === "welcome") {
                this.setWelcomeMode();
            } else if (mode === "guest") {
                this.setGuestMode();
            } else {
                this.setNormalMode();
            }

            if (config.country !== undefined) {
                this.setCountry(config.country);
            }

            if (config.firstName !== undefined || config.lastName !== undefined) {
                this.setInitials(config.firstName || "", config.lastName || "");
            }

            if (config.notificationCount !== undefined) {
                this.setNotificationCount(config.notificationCount);
            }
        },

        setCountry: function (countryName) {
            if (!this.view.lblCountry) {
                kony.print("HEADER :: lblCountry NOT FOUND");
                return;
            }

            this.view.lblCountry.text = countryName || "Qatar";
        },

        setInitials: function (firstName, lastName) {
            if (!this.view.lblInitials) {
                return;
            }

            var firstInitial = firstName ? firstName.charAt(0) : "";
            var lastInitial = lastName ? lastName.charAt(0) : "";

            this.view.lblInitials.text = (firstInitial + lastInitial).toUpperCase();
        },

        setNotificationCount: function (count) {
            if (!this.view.lblNoti) {
                return;
            }

            if (count === null || count === undefined) {
                count = 0;
            }

            this.view.lblNoti.text = String(count);
        },

        localeChange: function () {
            kony.print("########################################");
            kony.print("HEADER :: LANGUAGE CLICKED");
            kony.print("HEADER :: CURRENT MODE = " + this.currentMode);

            if (typeof this.callbacks.language === "function") {
                this.callbacks.language();
                return;
            }

            if (
                this.currentMode !== "login" &&
                this.currentMode !== "welcome" &&
                this.currentMode !== "guest"
            ) {
                kony.print("HEADER :: LANGUAGE NOT ALLOWED");
                return;
            }

            try {
                if (this.view.loading) {
                    this.view.loading.show(this, "Loading..");
                }

                var currentLocale = kony.i18n.getCurrentLocale();
                kony.print("HEADER :: CURRENT LOCALE = " + currentLocale);

                var set_locale = (currentLocale === "en") ? "ar" : "en";
                kony.print("HEADER :: CHANGING LOCALE TO = " + set_locale);

                kony.i18n.setCurrentLocaleAsync(
                    set_locale,
                    function () {
                        kony.print("HEADER :: LOCALE CHANGE SUCCESS");

                        var newLocale = kony.i18n.getCurrentLocale();
                        kony.store.setItem("current_locale", newLocale);

                        try {
                            new kony.mvc.Navigation("frmDummy").navigate();
                        } catch (e) {
                            kony.print("HEADER :: DUMMY NAV ERROR = " + e);
                        }

                        try {
                            kony.application.destroyForm("frmLogin");
                            kony.application.destroyForm("frmWelcomeScreen");
                            kony.application.destroyForm("frmDashboard");
                        } catch (e2) {
                            kony.print("HEADER :: DESTROY ERROR = " + e2);
                        }

                        kony.timer.schedule(
                            "languageChangeTimer",
                            function () {
                                kony.print("HEADER :: NAVIGATING TO LOGIN");

                                try {
                                    new kony.mvc.Navigation("frmLogin").navigate();
                                } catch (e3) {
                                    kony.print("HEADER :: LOGIN NAV ERROR = " + e3);
                                }

                                kony.timer.cancel("languageChangeTimer");
                            },
                            2,
                            false,
                        );
                    },
                    function () {
                        kony.print("HEADER :: LOCALE CHANGE FAILED");
                        alert("Failed to change language");
                    },
                );
            } catch (e) {
                kony.print("HEADER :: LOCALE ERROR = " + e);
                alert(e);
            }
        },

        onAddClick: function () {
            kony.print("HEADER :: ADD CLICKED");

            if (typeof this.callbacks.add === "function") {
                this.callbacks.add();
                return;
            }
        },

        onCountryClick: function () {
            kony.print("HEADER :: COUNTRY CLICKED");

            if (typeof this.callbacks.country === "function") {
                this.callbacks.country();
                return;
            }
        },

        onInitialsNotificationClick: function () {
            kony.print("HEADER :: INITIALS/NOTIFICATION CLICKED");

            try {
                new kony.mvc.Navigation("frmMyProfile").navigate();
            } catch (e) {
                kony.print("HEADER :: PROFILE NAV ERROR = " + e);
            }

            if (typeof this.callbacks.initialsNotification === "function") {
                this.callbacks.initialsNotification();
                return;
            }
        },

        setCountryArrow: function (isOpen, animate) {
            if (!this.view.imgArrowDown) {
                kony.print("HEADER :: imgArrowDown NOT FOUND");
                return;
            }

            var image = isOpen ? "iconright.png" : "iconright1.png";
            kony.print("HEADER :: Setting arrow image to: " + image);

            // Direct assignment safe-guarded for iOS rendering thread
            this.view.imgArrowDown.src = image;

            // Force a redraw layout if needed, or let iOS handle it natively
            if (this.view.forceLayout) {
                // Do NOT use forceLayout() on iOS, but setting the src directly 
                // will update the image property cleanly.
            }
        },

        setCountryArrowState: function (isOpen, animate) {
            this.setCountryArrow(
                isOpen,
                animate !== false
            );
        },
    };
});