// i18n.js
var i18n = {

    en: {
        LBL_HOME: "Home",
        LBL_USERNAME:"Username",
        LBL_REMEMBER_ME: "Remember me",
        LBL_PROFILE: "Profile",
        LBL_SETTINGS: "Settings",
        LBL_LANGUAGE: "Language",
        BTN_LOGIN: "Login",
        BTN_CANCEL: "Cancel",
        BTN_SAVE: "Save",
        MSG_WELCOME: "Welcome",
        MSG_SUCCESS: "Operation completed successfully.",
        USER_NAME: "Tajdar Raza",
        LBL_HIDE_BAL:"Hide your balance"
    },

    ar: {
        LBL_HOME: "الرئيسية",
        LBL_USERNAME:"اسم المستخدم",
        LBL_REMEMBER_ME: "أذكرني",
        LBL_PROFILE: "الملف الشخصي",
        LBL_SETTINGS: "الإعدادات",
        LBL_LANGUAGE: "اللغة",
        BTN_LOGIN: "تسجيل الدخول",
        BTN_CANCEL: "إلغاء",
        BTN_SAVE: "حفظ",
        MSG_WELCOME: "مرحبًا",
        MSG_SUCCESS: "تمت العملية بنجاح.",
        USER_NAME: "تاجداررضا",
        LBL_HIDE_BAL:"إخفاء الرصيد"
    },

    get: function (key) {
        var locale = kony.i18n.getCurrentLocale();

        if (this[locale] && this[locale][key]) {
            return this[locale][key];
        }

        // Fallback to English
        return this.en[key] || key;
    }
};