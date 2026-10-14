define(function () {
    var defaultMenuData = [
        {
            id: "fawran",
            name: "Fawran",
            favLogo: "iconfawran.png",
            optionLogo: "fawran.png",
            isFavourite: true,
            canFavourite: true
        },
        {
            id: "paybill",
            name: "Pay bill",
            favLogo: "paycardbill.png",
            optionLogo: "construct.png",
            isFavourite: true,
            canFavourite: true
        },
        {
            id: "paycard",
            name: "Paycard",
            favLogo: "paycard.png",
            optionLogo: "paycardblue.png",
            isFavourite: false,
            canFavourite: true
        },
        {
            id: "payments",
            name: "Payments",
            favLogo: "icon_payments.png", // Added favLogo just in case it becomes a favorite
            optionLogo: "icon_payments.png",
            isFavourite: false,
            canFavourite: true
        },
        {
            id: "newmenu4",
            name: "New Menu 4",
            favLogo: "iconsquare.png",
            optionLogo: "construct.png",
            isFavourite: false,
            canFavourite: true
        },
        {
            id: "newmenu5",
            name: "New Menu 5",
            favLogo: "iconsquare.png",
            optionLogo: "construct.png",
            isFavourite: false,
            canFavourite: true
        },
        {
            id: "newmenu6",
            name: "New Menu 6",
            favLogo: "iconsquare.png",
            optionLogo: "construct.png",
            isFavourite: false,
            canFavourite: true
        }
    ];

    return {
        getMenuData: function() {
            var storedData = kony.store.getItem("savedMenuData");
            if (storedData) {
                return storedData;
            }
            kony.store.setItem("savedMenuData", defaultMenuData);
            return defaultMenuData;
        },

        saveMenuData: function(data) {
            kony.store.setItem("savedMenuData", data);
        }
    };
});