define(function () {

    return {

        /*
         * =====================================================
         * STATE
         * =====================================================
         */

        currentMode: "normal",


        /*
         * =====================================================
         * COMPONENT INITIALIZATION
         * =====================================================
         *
         * Call this from the parent controller:
         *
         * this.view.cmpHeader.configure({
         *     mode: "guest",
         *     country: "Qatar"
         * });
         *
         */

        initializeHeader: function () {

            kony.print(
                "========================================"
            );

            kony.print(
                "HEADER :: INITIALIZE"
            );


            this.currentMode = "normal";


            /*
             * Bind events
             */

            this.bindEvents();


            /*
             * Default state
             */

            this.setNormalMode();


            kony.print(
                "HEADER :: INITIALIZE COMPLETE"
            );

            kony.print(
                "========================================"
            );
        },


        /*
         * =====================================================
         * BIND EVENTS
         * =====================================================
         */

        bindEvents: function () {

            kony.print(
                "HEADER :: BIND EVENTS"
            );


            /*
             * LANGUAGE
             */

            if (this.view.imgLangLogo) {

                this.view.imgLangLogo.onTouchEnd =
                    this.localeChange.bind(this);

                kony.print(
                    "HEADER :: LANGUAGE EVENT BOUND"
                );

            } else {

                kony.print(
                    "HEADER :: imgLangLogo NOT FOUND"
                );
            }


            /*
             * ADD
             */

            if (this.view.imgAdd) {

                this.view.imgAdd.onTouchEnd =
                    this.onAddClick.bind(this);

                kony.print(
                    "HEADER :: ADD EVENT BOUND"
                );
            }


            /*
             * COUNTRY
             */

            if (this.view.flxCountries) {

                this.view.flxCountries.onTouchEnd =
                    this.onCountryClick.bind(this);

                kony.print(
                    "HEADER :: COUNTRY EVENT BOUND"
                );
            }
        },


        /*
         * =====================================================
         * NORMAL MODE
         * =====================================================
         */

        setNormalMode: function () {

            kony.print(
                "HEADER :: SET NORMAL MODE"
            );

            this.currentMode = "normal";


            if (this.view.flxCountries) {

                this.view.flxCountries.isVisible = false;
            }


            if (this.view.imgLangLogo) {

                this.view.imgLangLogo.isVisible = false;
            }


            if (this.view.imgAdd) {

                this.view.imgAdd.isVisible = true;
            }


            if (this.view.imgSearch) {

                this.view.imgSearch.isVisible = true;
                this.view.imgSearch.src = "search_icon.png";
            }


            if (this.view.flxInitialsNotifi) {

                this.view.flxInitialsNotifi.isVisible = true;
            }
        },


        /*
         * =====================================================
         * LOGIN MODE
         * =====================================================
         */

        setLoginMode: function () {

            kony.print(
                "HEADER :: SET LOGIN MODE"
            );

            this.currentMode = "login";


            if (this.view.flxCountries) {

                this.view.flxCountries.isVisible = true;
            }


            if (this.view.lblCountry) {

                this.view.lblCountry.text = "Qatar";
            }


            if (this.view.imgLangLogo) {

                this.view.imgLangLogo.isVisible = true;

                this.view.imgLangLogo.src =
                    "globe_language.png";
            }


            if (this.view.imgAdd) {

                this.view.imgAdd.isVisible = false;
            }


            if (this.view.imgSearch) {

                this.view.imgSearch.isVisible = false;
            }


            if (this.view.flxInitialsNotifi) {

                this.view.flxInitialsNotifi.isVisible = false;
            }
        },


        /*
         * =====================================================
         * WELCOME MODE
         * =====================================================
         */

        setWelcomeMode: function () {

            kony.print(
                "HEADER :: SET WELCOME MODE"
            );

            this.setLoginMode();

            this.currentMode = "welcome";
        },


        /*
         * =====================================================
         * GUEST MODE
         * =====================================================
         *
         * Guest behaves like Login/Welcome.
         */

        setGuestMode: function () {

            kony.print(
                "HEADER :: SET GUEST MODE"
            );

            this.setLoginMode();

            this.currentMode = "guest";
        },


        /*
         * =====================================================
         * CONFIGURE
         * =====================================================
         */

        configure: function (config) {

            config = config || {};


            kony.print(
                "HEADER :: CONFIGURE"
            );


            /*
             * IMPORTANT:
             *
             * Make sure events are bound whenever
             * configure() is called.
             */

            this.bindEvents();


            var mode =
                config.mode || "normal";


            if (mode === "login") {

                this.setLoginMode();

            } else if (mode === "welcome") {

                this.setWelcomeMode();

            } else if (mode === "guest") {

                this.setGuestMode();

            } else {

                this.setNormalMode();
            }


            /*
             * Country
             */

            if (
                config.country !== undefined
            ) {

                this.setCountry(
                    config.country
                );
            }


            /*
             * Initials
             */

            if (
                config.firstName !== undefined ||
                config.lastName !== undefined
            ) {

                this.setInitials(
                    config.firstName || "",
                    config.lastName || ""
                );
            }


            /*
             * Notification
             */

            if (
                config.notificationCount !== undefined
            ) {

                this.setNotificationCount(
                    config.notificationCount
                );
            }
        },


        /*
         * =====================================================
         * COUNTRY
         * =====================================================
         */

        setCountry: function (countryName) {

            if (!this.view.lblCountry) {

                kony.print(
                    "HEADER :: lblCountry NOT FOUND"
                );

                return;
            }


            this.view.lblCountry.text =
                countryName || "Qatar";
        },


        /*
         * =====================================================
         * INITIALS
         * =====================================================
         */

        setInitials: function (
            firstName,
            lastName
        ) {

            if (!this.view.lblInitials) {

                return;
            }


            var firstInitial =
                firstName
                    ? firstName.charAt(0)
                    : "";


            var lastInitial =
                lastName
                    ? lastName.charAt(0)
                    : "";


            this.view.lblInitials.text =
                (
                    firstInitial +
                    lastInitial
                ).toUpperCase();
        },


        /*
         * =====================================================
         * NOTIFICATION
         * =====================================================
         */

        setNotificationCount: function (count) {

            if (!this.view.lblNoti) {

                return;
            }


            if (
                count === null ||
                count === undefined
            ) {

                count = 0;
            }


            this.view.lblNoti.text =
                String(count);
        },


        /*
         * =====================================================
         * LANGUAGE
         * =====================================================
         */

        localeChange: function () {

            kony.print(
                "########################################"
            );

            kony.print(
                "HEADER :: LANGUAGE CLICKED"
            );

            kony.print(
                "HEADER :: CURRENT MODE = " +
                this.currentMode
            );


            /*
             * Safety check
             */

            if (
                this.currentMode !== "login" &&
                this.currentMode !== "welcome" &&
                this.currentMode !== "guest"
            ) {

                kony.print(
                    "HEADER :: LANGUAGE NOT ALLOWED"
                );

                return;
            }


            try {

                if (this.view.loading) {

                    this.view.loading.show(
                        this,
                        "Loading.."
                    );
                }


                var currentLocale =
                    kony.i18n.getCurrentLocale();


                kony.print(
                    "HEADER :: CURRENT LOCALE = " +
                    currentLocale
                );


                var set_locale;


                if (currentLocale === "en") {

                    set_locale = "ar";

                } else {

                    set_locale = "en";
                }


                kony.print(
                    "HEADER :: CHANGING LOCALE TO = " +
                    set_locale
                );


                var self = this;


                kony.i18n.setCurrentLocaleAsync(
                    set_locale,

                    function () {

                        kony.print(
                            "HEADER :: LOCALE CHANGE SUCCESS"
                        );


                        var newLocale =
                            kony.i18n.getCurrentLocale();


                        kony.store.setItem(
                            "current_locale",
                            newLocale
                        );


                        /*
                         * Keep your existing navigation flow
                         */

                        try {

                            new kony.mvc.Navigation(
                                "frmDummy"
                            ).navigate();

                        } catch (e) {

                            kony.print(
                                "HEADER :: DUMMY NAV ERROR = " +
                                e
                            );
                        }


                        /*
                         * Destroy forms
                         */

                        try {

                            kony.application.destroyForm(
                                "frmLogin"
                            );

                            kony.application.destroyForm(
                                "frmWelcomeScreen"
                            );

                            kony.application.destroyForm(
                                "frmDashboard"
                            );

                        } catch (e2) {

                            kony.print(
                                "HEADER :: DESTROY ERROR = " +
                                e2
                            );
                        }


                        /*
                         * Navigate to Login
                         */

                        kony.timer.schedule(
                            "languageChangeTimer",

                            function () {

                                kony.print(
                                    "HEADER :: NAVIGATING TO LOGIN"
                                );


                                try {

                                    new kony.mvc.Navigation(
                                        "frmLogin"
                                    ).navigate();

                                } catch (e3) {

                                    kony.print(
                                        "HEADER :: LOGIN NAV ERROR = " +
                                        e3
                                    );
                                }


                                kony.timer.cancel(
                                    "languageChangeTimer"
                                );

                            },

                            2,

                            false
                        );

                    },

                    function () {

                        kony.print(
                            "HEADER :: LOCALE CHANGE FAILED"
                        );

                        alert(
                            "Failed to change language"
                        );
                    }
                );

            } catch (e) {

                kony.print(
                    "HEADER :: LOCALE ERROR = " +
                    e
                );

                alert(e);
            }
        },


        /*
         * =====================================================
         * ADD
         * =====================================================
         */

        onAddClick: function () {

            kony.print(
                "HEADER :: ADD CLICKED"
            );
        },


        /*
         * =====================================================
         * COUNTRY
         * =====================================================
         */

        onCountryClick: function () {

            kony.print(
                "HEADER :: COUNTRY CLICKED"
            );
        }
    };
});