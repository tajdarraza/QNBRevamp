define(["Navigation"], function (Navigation) {
    return {

        onNavigate: function () {
            this.view.init = this.init;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onHide = this.onHide;
            this.view.onDeviceBack = this.backNavigation;
            this.view.commonheader.configure({
                title: "Multi-currency card",
                action1: function () {
                    alert("not yet developed");
                },
            });

        },

        init: function () {
            this.setMultiCurrencyList();
            kony.print("init");
        },

        preShow: function () {
            kony.print("preShow");
        },

        postShow: function () {
            kony.print("postShow");
        },

        onHide: function () {
            kony.print("onHide");
        },
        setMultiCurrencyList: function () {
            // Clean string with each currency on a new line
            var currencyText =
                "· United States Dollar (USD)\n" +
                "· Euro (EUR)\n" +
                "· Great Britain Pound (GBP)\n" +
                "· United Arab Emirates Dirham (AED)\n" +
                "· Swiss Franc (CHF)\n" +
                "· Qatari Riyal (QAR)";

            // Assign text to the label
            this.view.lblMultiCurrencyAvl.text = currencyText;

            // Ensure line wrapping is enabled so newlines are respected

        },
        backNavigation: function () {
            kony.print("backNavigation");
        }
    }
});