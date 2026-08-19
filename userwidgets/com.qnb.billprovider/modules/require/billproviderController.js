define(function() {

    return {

        selectedProviderIndex: -1,

        onProviderSelected: null,


        initializeProviders: function() {

               var providerData = [
                {
                    providerName: "Kahramaa",
                    providerIcon: "zakat.png",
                    providerSelect: "uncheckbox.png"
                },
                {
                    providerName: "Ooredoo",
                    providerIcon: "ooredoo.png",
                    providerSelect: "uncheckbox.png"
                },
                {
                    providerName: "Vodafone",
                    providerIcon: "ooredoo.png",
                    providerSelect: "uncheckbox.png"
                },
                {
                    providerName: "Zakat",
                    providerIcon: "zakat.png",
                    providerSelect: "uncheckbox.png"
                },
                {
                    providerName: "Qatar cool",
                    providerIcon: "zakat.png",
                    providerSelect: "uncheckbox.png"
                }
            ];


            this.view.segBillProvider.widgetDataMap = {
                imgProviderIcon: "providerIcon",
                lblProviderName: "providerName",
                imgProviderSelect: "providerSelect"
            };


            this.view.segBillProvider.onRowClick =
                this.onProviderRowClick.bind(this);


            this.view.segBillProvider.setData(providerData);


            this.updateProviderHeight(providerData.length);


            // Hide the list initially
            this.view.flxSegProvider.isVisible = false;

        },


        openProviderList: function () {

    var data = this.view.segBillProvider.data || [];

    this.updateProviderHeight(data.length);

    var startTransform = kony.ui.makeAffineTransform();
    startTransform.scale(0.90, 0.90);

    var endTransform = kony.ui.makeAffineTransform();
    endTransform.scale(1, 1);

    this.view.flxSegProvider.transform = startTransform;
    this.view.flxSegProvider.opacity = 0;
    this.view.flxSegProvider.isVisible = true;

    var animation = kony.ui.createAnimation({
        "0": {
            "opacity": 0,
            "transform": startTransform
        },
        "100": {
            "opacity": 1,
            "transform": endTransform
        }
    });

    this.view.flxSegProvider.animate(
        animation,
        {
            duration: 0.25,
            iterationCount: 1,
            delay: 0,
            fillMode: kony.anim.FILL_MODE_FORWARDS
        },
        {
            animationEnd: function () {
            }
        }
    );
},

animateSelectedRow: function (
    rowIndex,
    providerName
) {

    var segment = this.view.segBillProvider;

    var rowWidget =
        segment.selectedRowItems
            ? segment.selectedRowItems[0]
            : null;

    /*
     * Notify Form after selection.
     */
    if (typeof this.onProviderSelected === "function") {

        this.onProviderSelected(
            providerName
        );
    }

    this.closeProviderList();
},


        closeProviderList: function() {

            this.view.flxSegProvider.isVisible = false;

        },


        updateProviderHeight: function(rowCount) {

            var rowHeight = 48;
            var extraHeight = 20;

            // Segment height
            var segmentHeight = rowCount * rowHeight;

            // Container height
            var containerHeight =
                segmentHeight + extraHeight;


            /*
             * flxSegProvider
             *
             * 4 rows:
             * 48 * 4 = 192
             * 192 + 20 = 212
             */
            this.view.flxSegProvider.height =
                containerHeight + "dp";


            /*
             * Segment itself
             */
            this.view.segBillProvider.height =
                segmentHeight + "dp";


            /*
             * Center Segment inside container
             */
            this.view.segBillProvider.centerX = "50%";
            this.view.segBillProvider.centerY = "50%";

        },


onProviderRowClick: function (
    segment,
    sectionIndex,
    rowIndex
) {

    var data = segment.data;

    if (!data || !data[rowIndex]) {
        return;
    }

    var selectedProvider = data[rowIndex];

    this.selectedProviderIndex = rowIndex;

    var updatedData = [];

    for (var i = 0; i < data.length; i++) {

        updatedData.push({

            providerName:
                data[i].providerName,

            providerIcon:
                data[i].providerIcon,

            providerSelect:
                i === rowIndex
                    ? "checkbox.png"
                    : "uncheckbox.png"
        });
    }

    segment.setData(updatedData);

    var self = this;

    /*
     * Give Segment time to render
     * the selected checkbox.
     */
    kony.timer.schedule(
        "providerSelectionAnimation",
        function () {

            /*
             * Small pulse
             */
            var shrinkTransform =
                kony.ui.makeAffineTransform();

            shrinkTransform.scale(0.97, 0.97);

            var normalTransform =
                kony.ui.makeAffineTransform();

            normalTransform.scale(1, 1);

            var animation =
                kony.ui.createAnimation({

                    "0": {
                        opacity: 1,
                        transform: normalTransform
                    },

                    "50": {
                        opacity: 0.7,
                        transform: shrinkTransform
                    },

                    "100": {
                        opacity: 1,
                        transform: normalTransform
                    }

                });

            self.view.flxSegProvider.animate(
                animation,
                {
                    duration: 0.20,
                    iterationCount: 1,
                    delay: 0,
                    fillMode:
                        kony.anim.FILL_MODE_FORWARDS
                },
                {
                    animationEnd: function () {

                        /*
                         * Notify Form
                         */
                        if (
                            typeof self.onProviderSelected ===
                            "function"
                        ) {

                            self.onProviderSelected(
                                selectedProvider.providerName
                            );
                        }

                        /*
                         * Close AFTER animation
                         */
                        self.closeProviderList();
                    }
                }
            );

        },
        0.05,
        false
    );
},

    };

});