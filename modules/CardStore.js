//Single source of truth for credit-card data across frmDashboard, frmCards and frmChooseCard.
//Previously only the dashboard fetched, and the other two screens rendered hardcoded card holders.
//
//Operation: getCCListDashboard (Fabric service PayCard), Bearer token, empty body.
//Response rows live under res["data-cclist"] and its status under res["status-cclist"] — composite
//ops namespace their status, so res.status.code is NOT the one to read.
//
//Row fields (from the production controller):
//  ebn = embossed/holder name      ctd = card type description   mcn = masked card number
//  cr  = currency                  avb = available balance       cl  = credit limit
//  ob  = outstanding balance       ma  = minimum amount due      pd  = payment due date
//All money fields are display strings, so use amountText()/amountNumber() rather than Number().

var pocCardsRaw = [];
var pocCardsLoaded = false;
var pocCardsInFlight = false;

//callback(rawRows). Fetches once per session and caches; safe to call from any form's preShow.
//Returns the cached rows immediately when already loaded, so navigating between card screens does
//not re-issue the call.
//Same session-scope problem as Fawran: the card list is cached in module state that outlives a
//logout, so a user switch would otherwise show the previous customer's cards.
function pocResetCards() {
    pocCardsRaw = [];
    pocCardsLoaded = false;
    pocCardsInFlight = false;
    kony.print("POC CARDS: cache cleared");
}

function pocFetchCards(callback) {
    try {
        if (pocCardsLoaded) {
            callback(pocCardsRaw);
            return;
        }
        if (!nullCheck(gblQNB) || !nullCheck(gblQNB.atkn)) {
            kony.print("POC CARDS: no auth token — cannot fetch");
            callback([]);
            return;
        }
        if (pocCardsInFlight) {
            //Another screen is already fetching; render from whatever we have rather than queueing.
            callback(pocCardsRaw);
            return;
        }
        pocCardsInFlight = true;

        invokeServiceAsync(
            QNBConstants.serviceName.getCCListDashboard,
            createHeaderObj("", true),
            {},
            function (status, res) {
                pocCardsInFlight = false;
                //Mark the attempt complete even when the list comes back empty. Previously only a
                //non-empty result set this, so an empty list made every card screen re-fire the
                //call on each navigation (14 identical requests in one session).
                pocCardsLoaded = true;
                try {
                    var code = (res && res["status-cclist"]) ? res["status-cclist"].code : "?";
                    kony.print("POC CARDS: getCCListDashboard status=" + status + " code=" + code);

                    var list = (res && res["data-cclist"]) ? res["data-cclist"] : [];
                    if (list.length) {
                        kony.print("POC CARDS: raw[0] = " + JSON.stringify(list[0]));
                        pocCardsRaw = list;
                        pocCardsLoaded = true;
                    } else {
                        //Distinguish "this user has no cards" from "the response shape differs".
                        //Both surface as an empty list, but only one is fixable in code.
                        var keys = [];
                        try { for (var k in res) { if (res.hasOwnProperty(k)) { keys.push(k); } } } catch (e) { }
                        kony.print("POC CARDS: empty card list. opstatus=" + (res && res.opstatus) +
                            " httpStatusCode=" + (res && res.httpStatusCode));
                        kony.print("POC CARDS: response keys = " + keys.join(","));
                        kony.print("POC CARDS: data-cclist present=" + (res && res.hasOwnProperty("data-cclist")) +
                            " type=" + (res ? typeof res["data-cclist"] : "?") +
                            " length=" + (res && res["data-cclist"] ? res["data-cclist"].length : "n/a"));
                        try {
                            kony.print("POC CARDS: full response = " + JSON.stringify(res).substring(0, 1200));
                        } catch (e) {
                            kony.print("POC CARDS: response not serialisable :: " + e);
                        }
                    }
                } catch (e) {
                    kony.print("POC CARDS: parse failed :: " + e);
                }
                callback(pocCardsRaw);
            }
        );
    } catch (e) {
        pocCardsInFlight = false;
        kony.print("POC CARDS: fetch failed :: " + e);
        callback([]);
    }
}

//--- per-screen mappers ------------------------------------------------------------------------
//Each screen wants a different row shape, so the store keeps the raw rows and maps on demand.

//List rows give the number ~80dp, but the server's masked PAN is 16 characters, so it clipped to
//"452338XXXX" — identical on two different cards. The last four digits are the identifying part,
//and they are what the design's "****3456" placeholder was sized for.
//
//The FULL masked number is still carried alongside as `mcn`: payCardResolveCcuid() matches on it to
//find the composite's card uid, and matching a shortened string would silently bring back the
//G-00009 "Account Details not Found" failure.
function maskedShort(mcn) {
    var s = nullCheck(mcn) ? "" + mcn : "";
    return s.length > 4 ? "•••• " + s.substring(s.length - 4) : s;
}

//frmDashboard / frmCards 4-slot scroller.
function pocMapCardsForScroller(rows) {
    var out = [];
    for (var i = 0; i < rows.length && i < 4; i++) {
        var c = rows[i];
        out.push({
            id: i + 1,
            cardImage: "card.png",
            accountType: "Credit",
            nickName: nullCheck(c.ctd) ? c.ctd : "Card",
            holderName: nullCheck(c.ebn) ? c.ebn : "",
            cardNumber: nullCheck(c.mcn) ? c.mcn : "",
            dueDay: nullCheck(c.pd) ? ("Due " + c.pd) : "No Due",
            payNow: "Pay Now"
        });
    }
    //The scroller is hardwired to flxCardContainer1..4 and indexes cardData[i] for i<4, so fewer
    //than four would throw on data.cardImage. Pad by cloning the last real card.
    while (out.length > 0 && out.length < 4) {
        var pad = JSON.parse(JSON.stringify(out[out.length - 1]));
        pad.id = out.length + 1;
        out.push(pad);
    }
    return out;
}

//frmCards segCards — the flippable card carousel. Keeps the existing menu labels/icons so the UI is
//unchanged; only the card identity and balance become real. The payload carries no expiry or full
//PAN, so the back face shows the masked number and the expiry is left blank.
function pocMapCardsForCardsScreen(rows) {
    var out = [];
    for (var i = 0; i < rows.length; i++) {
        var c = rows[i];
        var masked = nullCheck(c.mcn) ? c.mcn : "";
        var holder = nullCheck(c.ebn) ? c.ebn : "";
        out.push({
            lblCardName: nullCheck(c.ctd) ? c.ctd : "Credit card",
            lblCardUser: holder,
            lblNameBackCard: holder,
            lblCreditCard: "Credit card",
            //Front face is a narrow row — last four only. The back face is where the full masked
            //number belongs, under its "Card number" caption.
            lblCardNumber: maskedShort(masked),
            mcn: masked,
            lblBackCard: masked,
            imgCard: "qnb_visa.png",
            lblBal: amountText(c.avb),
            lblAvlblBal: "Available balance",
            lblMenu1: "Pay card",
            lblMenu2: "Smart installments",
            lblMenu3: "Case speed",
            lblMenu4: "Menu",
            imgMenu1: "iconplaceholder2.png",
            imgMenu2: "iconplaceholder3.png",
            imgMenu3: "iconplaceholder4.png",
            imgMenu4: "iconplaceholder5.png",
            lblCreditCardBack: "Credit card",
            lblBackCardNumber: "Card number",
            index: i + 1,
            lblExpirationDate: "Expiry Date",
            lblExpiryDate: "",
            showBack: false,
            flxCardFrontView: { isVisible: true },
            flxCardBackView: { isVisible: false }
        });
    }
    return out;
}

//frmChooseCard segment: needs both display strings and numbers for the utilisation bar.
function pocMapCardsForChooser(rows) {
    var out = [];
    for (var i = 0; i < rows.length; i++) {
        var c = rows[i];
        //`ob` comes back identical on every card (an account-level figure), so it is not this
        //card's utilisation — using it made the bar full and showed "437,031.46 out of 750.00".
        //Utilised = credit limit - available credit, clamped so a negative can never render.
        var limit = amountNumber(c.cl);
        var avail = amountNumber(c.avb);
        var used = limit - avail;
        if (!(used > 0)) { used = 0; }
        if (used > limit) { used = limit; }
        kony.print("POC CARDS: " + (c.mcn || "?") + " limit=" + c.cl + " avail=" + c.avb +
            " -> used=" + formatAmount(used) + "  (ob=" + c.ob + " ignored)");
        out.push({
            imgCard: "qnb_visa.png",
            lblCardName: nullCheck(c.ctd) ? c.ctd : "Credit card",
            lblHolderName: nullCheck(c.ebn) ? c.ebn : "",
            lblCardNumber: maskedShort(c.mcn),
            mcn: nullCheck(c.mcn) ? c.mcn : "",
            utilised: used,
            limit: limit,
            lblUtilAmt: formatAmount(used) + " " + (nullCheck(c.cr) ? c.cr : "QAR"),
            lblTotalAmt: "out of " + amountText(c.cl) + " " + (nullCheck(c.cr) ? c.cr : "QAR"),

            //Identity + real figures carried through the selection. Without ccuid the payment
            //services have no idea which card is being paid, and minimum-due was being guessed at
            //5% of the balance because the real value never left this mapper.
            ccuid: nullCheck(c.i) ? c.i : "",
            currency: nullCheck(c.cr) ? c.cr : "QAR",
            outstandingText: nullCheck(c.ob) ? c.ob : "",
            minDueText: nullCheck(c.ma) ? c.ma : ""
        });
    }
    return out;
}
