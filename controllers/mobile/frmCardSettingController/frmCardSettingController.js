define({
    isChecked: false,

    onNavigate: function (params) {
        this.view.init = this.onInit;
        //this.view.preShow = this.preShow;
        //this.view.onDeviceBack = this.onDeviceBack;
    },

    onInit: function () {

    },
    preShow: function(){
        this.setSettingsData();
    },
    onDeviceBack: function(){
        var prevForm = kony.application.getPreviousForm();

        new kony.mvc.Navigation(prevForm).navigate();
    },


 setSettingsData: function () {

    var data = [

        [
            {
                lblHeader: "Financial services"
            },

            [
                {
                    imgSetting: "leading.png",
                    lblSettingName: "Digital wallet",
                    imgTrailIcon: "traling.png",
                    flxSettingOption:{skin:""},
                },
                {
                    imgSetting: "settingmenu2.png",
                    lblSettingName: "Click to pay",
                    imgTrailIcon: "traling.png",
                    flxSettingOption:{skin:""},
                    
                },
                {
                    imgSetting: "settingmenu3.png",
                    lblSettingName: "Payment holiday",
                    imgTrailIcon: "traling.png",
                     flxSettingOption:{skin:""},
                },
            ]
        ],

        [
            {
                lblHeader: "Credit limits"
            },

            [
                {
                    imgSetting: "settingmenu3.png",
                    lblSettingName: "Temporarily increase limit",
                    imgTrailIcon: "traling.png",
                    flxSettingOption:{skin:""},
                },
                {
                    imgSetting: "settingmenu2.png",
                    lblSettingName: "Permanently increase limit",
                    imgTrailIcon: "traling.png",
                    flxSettingOption:{skin:""},
                },
            ]
        ],

        [
            {
                lblHeader: "Card management"
            },

            [
                {
                    imgSetting: "settingmenu2.png",
                    lblSettingName: "Permanently increase limit",
                    imgTrailIcon: "traling.png",
                },
            ]
        ]

    ];

    this.view.segCardSetting.widgetDataMap = {
        lblSettingHeader: "lblHeader",
        flxSettingOption: "flxSettingOption",

        lblSettingName: "lblSettingName",
        imgTrailIcon: "imgTrailIcon",
        imgSetting: "imgSetting"
    };

    this.view.segCardSetting.setData(data);
},

 });