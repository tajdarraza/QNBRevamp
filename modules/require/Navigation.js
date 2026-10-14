define({

    stack: [],

    push: function (formName) {
        this.stack.push(formName);

        kony.print(
            "NAV STACK PUSH: " +
            formName +
            " | stack=" +
            JSON.stringify(this.stack)
        );
    },

    pop: function () {
        if (this.stack.length > 0) {
            var formName = this.stack.pop();

            kony.print(
                "NAV STACK POP: " +
                formName +
                " | stack=" +
                JSON.stringify(this.stack)
            );

            return formName;
        }

        return null;
    },

    navigateTo: function (formName, data) {
        kony.print("NAV GO: " + formName);

        try {
            var nav = new kony.mvc.Navigation(formName);
            nav.navigate(data);
        } catch (e) {
            kony.print(
                "NAV GO ERROR: " +
                formName +
                " :: " +
                e
            );
        }
    },

    goBack: function () {
        if (this.stack.length <= 1) {
            kony.print("NAV BACK: no previous form");
            return;
        }

        // Remove current form
        this.stack.pop();

        // Get previous form
        var previousForm =
            this.stack[this.stack.length - 1];

        kony.print(
            "NAV BACK -> " +
            previousForm +
            " | stack=" +
            JSON.stringify(this.stack)
        );

        this.navigateTo(previousForm);
    },

    getStack: function () {
        return this.stack;
    }

});