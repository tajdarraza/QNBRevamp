define(function () {
    return {

        stack: [],

        startFlow: function (formId, params) {
            if (!formId) {
                kony.print("NAV: Invalid root form");
                return false;
            }

            this.stack = [{
                formId: formId,
                params: params || {}
            }];

            kony.print(
                "NAV FLOW START: " +
                formId
            );

            return true;
        },

        navigate: function (formId, params) {
            if (!formId) {
                kony.print("NAV: Invalid form");
                return false;
            }

            params = params || {};

            var current =
                this.stack.length > 0
                    ? this.stack[this.stack.length - 1]
                    : null;

            /*
             * Don't add the same form twice.
             */
            if (current && current.formId === formId) {
                kony.print(
                    "NAV: Already on " + formId
                );
                return false;
            }

            this.stack.push({
                formId: formId,
                params: params
            });

            kony.print(
                "NAV PUSH: " +
                formId +
                " | depth=" +
                this.stack.length
            );

            try {
                new kony.mvc.Navigation(formId)
                    .navigate(params);

                return true;
            } catch (e) {
                /*
                 * Navigation failed.
                 * Restore the previous stack state.
                 */
                this.stack.pop();

                kony.print(
                    "NAV ERROR: " +
                    e.message
                );

                return false;
            }
        },

        goBack: function () {
            if (this.stack.length <= 1) {
                kony.print(
                    "NAV: At flow root"
                );
                return false;
            }

            /*
             * Remove current form.
             */
            this.stack.pop();

            var previous =
                this.stack[this.stack.length - 1];

            if (!previous) {
                kony.print(
                    "NAV: No previous form"
                );
                return false;
            }

            kony.print(
                "NAV POP: " +
                previous.formId +
                " | depth=" +
                this.stack.length
            );

            try {
                new kony.mvc.Navigation(
                    previous.formId
                ).navigate(
                    previous.params || {}
                );

                return true;
            } catch (e) {
                kony.print(
                    "NAV BACK ERROR: " +
                    e.message
                );

                return false;
            }
        },

        replace: function (formId, params) {
            if (!formId) {
                return false;
            }

            params = params || {};

            if (this.stack.length === 0) {
                return this.startFlow(
                    formId,
                    params
                );
            }

            this.stack[
                this.stack.length - 1
            ] = {
                formId: formId,
                params: params
            };

            kony.print(
                "NAV REPLACE: " +
                formId
            );

            try {
                new kony.mvc.Navigation(formId)
                    .navigate(params);

                return true;
            } catch (e) {
                return false;
            }
        },

        canGoBack: function () {
            return this.stack.length > 1;
        },

        getStack: function () {
            return this.stack.slice(0);
        },

        clear: function () {
            this.stack = [];
        }
    };
});