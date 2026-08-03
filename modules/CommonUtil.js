//showLoadingScreen() is provided by QNBMBCommon/modules/commonUtils.js and pairs with its
//dismissLoadingScreen(); the local copy that used to live here shadowed it depending on load order.

function formatAmount(amount) {

    amount = Number(amount) || 0;

    var parts = amount.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
}

//Money fields from these services arrive as DISPLAY STRINGS ("12,450.75"), not numbers — production
//concatenates them straight into markup. Running one through formatAmount() gives Number("12,450.75")
//= NaN = 0, which silently zeroes every balance. Use these two instead.
function amountText(v) {
    if (v === null || v === undefined || v === "") { return "0.00"; }
    if (typeof v === "number") { return formatAmount(v); }
    return "" + v;
}

//Numeric value of the same field, for arithmetic (progress bars, percentages).
function amountNumber(v) {
    if (v === null || v === undefined || v === "") { return 0; }
    if (typeof v === "number") { return v; }
    return Number(("" + v).replace(/,/g, "")) || 0;
}

//Header avatar initials. The forms ship "FF" as a design-time default and nothing ever replaced it.
//"Michele Qureshi" -> "MQ"; a single-word name yields one letter.
function initialsFromName(name) {
    if (!nullCheck(name)) { return ""; }
    var parts = ("" + name).replace(/\s+/g, " ").trim().split(" ");
    if (parts.length === 0 || parts[0] === "") { return ""; }
    var out = parts[0].charAt(0);
    if (parts.length > 1) { out += parts[parts.length - 1].charAt(0); }
    return out.toUpperCase();
}

//Best available human name for the signed-in user: full name from getLastLogin, else the remembered
//full name, else the username.
function currentUserName() {
    if (typeof gblQNB !== "undefined" && gblQNB && nullCheck(gblQNB.fln)) { return gblQNB.fln; }
    var stored = kony.store.getItem("pocFullName");
    if (nullCheck(stored)) { return stored; }
    return kony.store.getItem("pocUserName");
}

//Sets the header avatar initials on any form that has an lblInitials. Several forms ship "FF" as a
//design default; pass the controller's this.view.
function applyHeaderIdentity(view) {
    try {
        var name = currentUserName();
        if (nullCheck(name) && view && view.lblInitials) {
            view.lblInitials.text = initialsFromName(name);
        }
    } catch (e) {
        kony.print("applyHeaderIdentity :: " + e);
    }
}

//Shared "this isn't built in the prototype yet" response, so dead taps never appear in a demo.
function pocNotBuilt(title) {
    kony.ui.Alert({
        message: (title || "This") + " isn't part of this prototype yet.",
        alertType: constants.ALERT_TYPE_INFO,
        alertTitle: title || "Coming soon",
        yesLabel: "OK"
    }, {});
}
