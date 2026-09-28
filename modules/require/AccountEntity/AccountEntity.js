define({
    accounts: [],
    lastUpdated: null,

    setAccounts: function (data) {
        alert("setacc"+JSON.stringify(data));
        this.accounts = data || [];
        this.lastUpdated = new Date().getTime();

        kony.print("ACCOUNT ENTITY: stored " + this.accounts.length + " accounts");
    },

    getAccounts: function () {
        return this.accounts || [];
    },

    getSavingsAccounts: function () {
        return this.accounts.filter(function (account) {
            return account.accountType === "Savings";
        });
    },

    getCurrentAccounts: function () {
        return this.accounts.filter(function (account) {
            return account.accountType === "Current";
        });
    },

    getAccountById: function (accountId) {
        for (var i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].accountId === accountId) {
                return this.accounts[i];
            }
        }

        return null;
    },

    hasData: function () {
        return this.accounts.length > 0;
    },

    clear: function () {
        this.accounts = [];
        this.lastUpdated = null;
    }
});