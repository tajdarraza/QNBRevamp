//Credit-card payment. Mirrors production QNBMBCards/frmPayCardController + frmPayCardConfirmation.
//
//    paycard   -> composite load: cards to pay, accounts to pay FROM, payment-type options
//    prePC     -> pre-validation of the chosen combination
//    confirmPC -> the actual payment
//
//ENVELOPE ASYMMETRY — both carry the SAME four fields, wrapped differently:
//    prePC     body = { e: encUtilA(JSON.stringify({am, a, c, m})) }     <- enveloped
//    confirmPC body = { am, a, c, m }                                     <- PLAIN, not enveloped
//Getting this backwards is silent: the service answers, just not with what you expect.
//(frmPayCardController.js:1411-1426 and frmPayCardConfirmationController.js:91-98.)

var payCardLoaded = null;      //raw `paycard` composite response
var payCardAccounts = [];      //data-accList -> the accounts you can pay FROM
var payCardCards = [];         //data-cclist -> cards WITH THE UID prePC/confirmPC EXPECT
var payCardTypes = [];         //data-types.payTypes -> [{id:"cur"|"min"|"other", value:"..."}]
var payCardCfg = {};           //data-paycardConfig.cfg -> {AmtMinLen, AmtMaxLen}

var payCardDraft = {
    card: null,          //selected credit card (row from getCCListDashboard / paycard)
    ccuid: "",           //-> "c"
    account: null,       //selected debit account
    accuid: "",          //-> "a"
    amount: "",          //-> "am"
    payType: "",         //-> "m"  (full / minimum / other — id comes from the paycard response)
    currency: "QAR",
    prevalidated: null,  //prePC response
    receipt: null        //confirmPC response
};

function payCardResetDraft() {
    payCardDraft.card = null;
    payCardDraft.ccuid = "";
    payCardDraft.account = null;
    payCardDraft.accuid = "";
    payCardDraft.amount = "";
    payCardDraft.payType = "";
    payCardDraft.prevalidated = null;
    payCardDraft.receipt = null;
}

//Session-scoped, exactly like Fawran's: the composite and the draft belong to one login. Module
//state outlives a logout, and a stale card/account uid is the bug that produced
//"Account Details not Found" on the Fawran side.
function payCardResetSession() {
    payCardLoaded = null;
    payCardAccounts = [];
    payCardCards = [];
    payCardTypes = [];
    payCardCfg = {};
    payCardResetDraft();
    kony.print("POC PAYCARD: session caches cleared");
}

function payCardGuard(callback) {
    if (typeof gblQNB === "undefined" || !nullCheck(gblQNB) || !nullCheck(gblQNB.atkn)) {
        kony.print("POC PAYCARD: no auth token");
        callback(false, null);
        return false;
    }
    return true;
}

//COMPOSITE RESPONSES ARE NAMESPACED. `paycard` answers with `status-types` / `data-accList`, not a
//plain `status` / `data` — so a res.status.code check reads a successful call as a failure, which is
//exactly what happened on 2026-08-04. prePC/confirmPC are single ops and do use `status`, so accept
//either shape.
function payCardOk(res) {
    if (!res) { return false; }
    var ok = QNBConstants.serviceResponseCodes.Success;
    if (res.status && res.status.code === ok) { return true; }
    for (var k in res) {
        if (k.indexOf("status") === 0 && res[k] && res[k].code === ok) { return true; }
    }
    return false;
}

//Pulls a namespaced section: payCardSection(res, "accList") finds `data-accList`, falling back to a
//plain `data` for single ops.
function payCardSection(res, name) {
    if (!res) { return null; }
    if (res["data-" + name] !== undefined) { return res["data-" + name]; }
    return res.data;
}

//--- 1. load ------------------------------------------------------------------------------------
//Production sends an empty, NON-enveloped body. The response carries the lists the payment screen
//needs; its exact field names are dumped below because they are the one thing we cannot read off
//the production controller with confidence — it binds them through segment templates.
function payCardLoad(callback) {
    if (!payCardGuard(callback)) { return; }
    if (payCardLoaded) {
        payCardDefaultAccount();
        payCardResolveCcuid();
        callback(true, payCardLoaded);
        return;
    }
    try {
        var headers = createHeaderObj("", true);

        //QA report accounts coming back for the same service, so the difference is in the request.
        //Production sends an empty body with default headers and NO screenId (frmPayCardController
        //callPayCardCompositeService) — log ours in full so the two can be compared directly.
        //Authorization is deliberately not printed; it is a live bearer token.
        kony.print("POC PAYCARD REQ >>> POST /services/" +
            (serviceConfigMap[QNBConstants.serviceName.paycard] || "?") + "/" +
            QNBConstants.serviceName.paycard);
        kony.print("POC PAYCARD REQ >>> headers channel=" + headers.channel +
            " unit=" + headers.unit +
            " Accept-Language=" + headers["Accept-Language"] +
            " screenId=" + (headers.screenId || "(none)") +
            " serviceId=" + (headers.serviceId || "(none)") +
            " Authorization=" + (headers.Authorization ? "Bearer <set>" : "MISSING"));
        kony.print("POC PAYCARD REQ >>> body = {}   (empty, not enveloped — as production sends it)");

        invokeServiceAsync(QNBConstants.serviceName.paycard, headers, {}, function (status, res) {
            kony.print("POC PAYCARD: paycard status=" + status +
                " code=" + (res && res.status ? res.status.code : "?"));
            if (payCardOk(res)) {
                payCardLoaded = res;
                payCardAccounts = payCardSection(res, "accList") || [];
                payCardCards = payCardSection(res, "cclist") || [];
                var t = payCardSection(res, "types") || {};
                payCardTypes = t.payTypes || [];
                var cfgSec = payCardSection(res, "paycardConfig") || {};
                payCardCfg = cfgSec.cfg || {};
                //Every top-level section, so any list we have not mapped yet is visible.
                kony.print("POC PAYCARD: sections = " + JSON.stringify(Object.keys(res)));
                kony.print("POC PAYCARD: " + payCardAccounts.length + " pay-from accounts" +
                    (payCardAccounts.length ? ", first = " + JSON.stringify(payCardAccounts[0]) : ""));
                for (var k in res) {
                    if (k.indexOf("data-") === 0 && k !== "data-accList") {
                        kony.print("POC PAYCARD: " + k + " = " +
                            JSON.stringify(res[k]).substring(0, 400));
                    }
                }
                //The account list can come back EMPTY even when the call succeeds — say so loudly,
                //with the section's own status, rather than letting it surface later as
                //"No account available to pay from".
                for (var sk in res) {
                    if (sk.indexOf("status-") === 0 || sk.indexOf("opstatus_") === 0) {
                        kony.print("POC PAYCARD: " + sk + " = " + JSON.stringify(res[sk]));
                    }
                }
                if (!payCardAccounts.length) {
                    kony.print("POC PAYCARD: *** data-accList is EMPTY *** raw=" +
                        JSON.stringify(res["data-accList"]));
                }
                payCardDefaultAccount();
                payCardResolveCcuid();
                callback(true, res);
            } else {
                kony.print("POC PAYCARD: load failed :: " + JSON.stringify(res).substring(0, 600));
                callback(false, res);
            }
        });
    } catch (e) {
        kony.print("POC PAYCARD: payCardLoad :: " + e);
        callback(false, null);
    }
}

//--- 2. pre-validate ----------------------------------------------------------------------------
//Picks the customer's favourite debit account, or the first one. Safe to call repeatedly — it only
//fills an empty accuid, so a user's own choice is never overwritten.
function payCardDefaultAccount() {
    if (nullCheck(payCardDraft.accuid) || !payCardAccounts.length) { return; }
    var pick = payCardAccounts[0];
    for (var i = 0; i < payCardAccounts.length; i++) {
        if (payCardAccounts[i].isFavorite === "true") { pick = payCardAccounts[i]; break; }
    }
    payCardDraft.account = pick;
    payCardDraft.accuid = pick.au;
    kony.print("POC PAYCARD: defaulted pay-from to " + pick.af + " (" + pick.ad + ") auid=" + pick.au);
}

//THE CARD UID IS SERVICE-SCOPED. getCCListDashboard and the paycard composite return DIFFERENT `i`
//values for the same physical card — e.g. mcn 452338XXXXXX0869 is 2b75d158… on the dashboard but
//0318ec82… in data-cclist. prePC/confirmPC only recognise the composite's, so sending the dashboard
//uid returns G-00009 "Account Details not Found" — which reads like an ACCOUNT problem but is the
//CARD. Production reads it from data-cclist for exactly this reason (frmPayCardController.js:462).
//
//Matched on the masked card number, the one field both services agree on.
function payCardResolveCcuid() {
    var masked = payCardDraft.card ? payCardDraft.card.lblCardNumber : "";
    if (!nullCheck(masked) || !payCardCards.length) { return; }
    for (var i = 0; i < payCardCards.length; i++) {
        if (payCardCards[i].mcn === masked) {
            if (payCardDraft.ccuid !== payCardCards[i].i) {
                kony.print("POC PAYCARD: ccuid remapped for " + masked +
                    "  dashboard=" + payCardDraft.ccuid + "  composite=" + payCardCards[i].i);
            }
            payCardDraft.ccuid = payCardCards[i].i;
            return;
        }
    }
    kony.print("POC PAYCARD: *** " + masked + " is not in the composite's card list *** " +
        "prePC will reject the dashboard uid");
}

function payCardParams() {
    return {
        am: ("" + payCardDraft.amount).split(",").join(""),   //server wants an unformatted amount
        a: payCardDraft.accuid,
        c: payCardDraft.ccuid,
        m: payCardDraft.payType
    };
}

function payCardPrevalidate(callback) {
    if (!payCardGuard(callback)) { return; }
    payCardResolveCcuid();
    var p = payCardParams();
    if (!nullCheck(p.am) || !nullCheck(p.a) || !nullCheck(p.c)) {
        kony.print("POC PAYCARD: prePC called with an incomplete draft :: " + JSON.stringify(p));
        callback(false, null);
        return;
    }
    try {
        var headers = createHeaderObj("", true);
        kony.print("POC PAYCARD PRE >>> " + JSON.stringify(p));
        var data = { e: encUtilA(JSON.stringify(p)) };     //enveloped
        invokeServiceAsync(QNBConstants.serviceName.prePC, headers, data, function (status, res) {
            var code = (res && res.status) ? res.status.code : "?";
            kony.print("POC PAYCARD: prePC status=" + status + " code=" + code);
            if (payCardOk(res)) {
                payCardDraft.prevalidated = res.data || {};
                kony.print("POC PAYCARD: prePC data = " + JSON.stringify(res.data).substring(0, 600));
                callback(true, res.data, code);
            } else {
                kony.print("POC PAYCARD: prePC rejected :: " +
                    ((res && res.status && res.status.description) ? res.status.description : ""));
                callback(false, res, code);
            }
        });
    } catch (e) {
        kony.print("POC PAYCARD: payCardPrevalidate :: " + e);
        callback(false, null);
    }
}

//--- 3. pay -------------------------------------------------------------------------------------
//Plain body, and the trailing `true` is invokeServiceAsync's duplicate-submission guard. Both match
//production. Do not "tidy" the body into an envelope.
function payCardConfirm(callback) {
    if (!payCardGuard(callback)) { return; }
    if (!payCardDraft.prevalidated) {
        kony.print("POC PAYCARD: refusing to pay — prePC has not run");
        callback(false, null);
        return;
    }
    if (!POC_ALLOW_LIVE_TRANSFER) {
        kony.print("POC PAYCARD: POC_ALLOW_LIVE_TRANSFER is false — skipping confirmPC");
        callback(true, { simulated: true });
        return;
    }
    try {
        var headers = createHeaderObj("", true);
        var p = payCardParams();
        kony.print("POC PAYCARD CONFIRM >>> " + JSON.stringify(p));
        invokeServiceAsync(QNBConstants.serviceName.confirmPC, headers, p, function (status, res) {
            var code = (res && res.status) ? res.status.code : "?";
            kony.print("POC PAYCARD: confirmPC status=" + status + " code=" + code);
            if (payCardOk(res)) {
                payCardDraft.receipt = res.data || {};
                kony.print("POC PAYCARD: receipt = " + JSON.stringify(res.data).substring(0, 600));
                callback(true, res.data, code);
            } else {
                var msg = (res && res.status && res.status.description) ? res.status.description : "";
                kony.print("POC PAYCARD: confirmPC rejected code=" + code + " :: " + msg);
                callback(false, res, code);
            }
        }, true);
    } catch (e) {
        kony.print("POC PAYCARD: payCardConfirm :: " + e);
        callback(false, null);
    }
}
