function showLoadingScreen() {
    try {
        kony.application.showLoadingScreen(
            "",
            "",
            constants.LOADING_SCREEN_POSITION_FULL_SCREEN,
            true,
            true,
            null
        );
    } catch (Error) {
        alert("Exception is showLoadingScreen::::: " + Error);
    }
}

function formatAmount(amount) {

    amount = Number(amount) || 0;

    var parts = amount.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
}
