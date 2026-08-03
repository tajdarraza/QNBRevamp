//Fawran (RTP) service layer. All ops hit the Fabric service RealTimePayment.
//
//IMPORTANT — THE FLOW IS SERVER-SIDE STATEFUL. rtpVal sends {} and rtpPost sends only {ov: otp};
//neither carries the transfer details. The server holds the pending transfer in session, established
//by rtpPayPreprocess. So the order is mandatory:
//
//    rtpPayPreprocess  ->  rtpVal  ->  rtpPost
//
//Jumping straight to the OTP screen posts against nothing. fawranDraft.preprocessed guards this.
//
//Payload envelope matches the rest of the app: {e: encUtilA(JSON.stringify(params))} for any op that
//carries a body. rtpAccList and rtpVal send an empty object and are NOT enveloped.

//--- cached reference data (per session) ---------------------------------------------------------
var fawranInfo = null;        //rtpInfoNew  -> alias, hasRTP, benAliasTypes
var fawranAccounts = [];      //rtpAccList  -> debit accounts
var fawranPurposes = [];      //rtpPurpose  -> {purposeCode, purposeDesc}

//Has the user already acknowledged the RTP_BL_004 "incomplete transactions" warning this session?
//rtpPayPreprocess runs a notification check when isNotiCkReq is "Y"; RTP_BL_004 IS that check
//firing. Production (frmInstaPayController.js:2260) treats it as an ACKNOWLEDGEMENT PROMPT, not a
//failure: it shows the server's wording, and on dismiss re-calls rtpPayPreprocess with
//isNotiCkReq "N" so the check is skipped and the transfer proceeds.
var fawranNotiAcked = false;

//Is this customer RTPSME-entitled? Decided in fawranFetchInfo; production gates the isCorpBen
//field of rtpPayPreprocess on exactly this.
var fawranIsSme = false;

//--- the transfer being built --------------------------------------------------------------------
var fawranDraft = {
    debitAccount: null,       //selected row from fawranAccounts
    aliasType: "",            //MN / ALI / IBAN / COCR / COER / COCL
    aliasTypeDesc: "",        //display label, used for the field label on the transfer screen
    aliasIsCorp: false,       //came from benAliasTypesCorp -> preprocess isCorpBen "Y"
    aliasValue: "",
    purposeCode: "",          //-> rtpPayPreprocess "p"
    purposeDesc: "",          //-> rtpPayPreprocess "pd"
    subPurposeDesc: "",       //design shows a second dropdown; rtpPurpose returns no sub-list
    amount: "",
    currency: "QAR",
    preprocessed: null,       //rtpPayPreprocess response data — fees, resolved beneficiary name
    otpLength: 6,
    otpRequired: true,     //rtpVal.isOtpRequired; "N" means post without an OTP step
    receipt: null          //rtpPost response — refId, refNo, txnDate
};

function fawranResetDraft() {
    fawranDraft.debitAccount = null;
    fawranDraft.aliasType = "";
    fawranDraft.aliasTypeDesc = "";
    fawranDraft.aliasIsCorp = false;
    fawranDraft.aliasValue = "";
    fawranDraft.purposeCode = "";
    fawranDraft.purposeDesc = "";
    fawranDraft.subPurposeDesc = "";
    fawranDraft.amount = "";
    fawranDraft.preprocessed = null;
    fawranDraft.otpLength = 6;
    fawranDraft.otpRequired = true;
    fawranDraft.receipt = null;
    fawranNotiAcked = false;
}

//Shared guard: every Fawran op needs an auth token and reports transport failures the same way.
function fawranGuard(callback) {
    if (typeof gblQNB === "undefined" || !nullCheck(gblQNB) || !nullCheck(gblQNB.atkn)) {
        kony.print("POC FAWRAN: no auth token");
        callback(false, null);
        return false;
    }
    return true;
}

function fawranOk(res) {
    //Composite ops here report business status under res.status.code; "000000" is success.
    return !!(res && res.status && res.status.code === QNBConstants.serviceResponseCodes.Success);
}

//--- 1. screen boot: alias + entitlement ---------------------------------------------------------
//callback(ok, data). data.hasRTP must be "Y" or the customer is not Fawran-enrolled and the whole
//flow is blocked server-side.
function fawranFetchInfo(callback) {
    if (!fawranGuard(callback)) { return; }
    if (fawranInfo) { callback(true, fawranInfo); return; }
    try {
        var headers = createHeaderObj("", true);
        headers.screenId = "RTPPAY";

        //Production branches on the SME entitlement and the two paths are NOT interchangeable:
        //  RTPSME entitled -> rtpInfoNew, body AES-enveloped as {e: ...{ty, isNotiCkReq}}
        //  otherwise       -> rtpInfo,    body a plain empty object
        //Calling rtpInfoNew for a non-SME customer is answered with status GENER_CODE and an empty
        //aliasTypes list, which is exactly what we saw on device.
        var isSme = false;
        try {
            isSme = checkIfPresented(QNBConstants.menusConfig.TRANSFERS,
                QNBConstants.Entitlements.RTPSME);
        } catch (e) {
            kony.print("POC FAWRAN: RTPSME entitlement check failed, assuming non-SME :: " + e);
        }

        //isNotiCkReq asks the server to verify this device's push subscription. Production sends "Y"
        //because the real app completes subscribeKMSComposite at startup; this POC does not reliably
        //register for push, so that precondition fails server-side and comes back as GENER_CODE with
        //an empty payload — which is exactly the symptom. Send "N" to skip the check.
        var noti = POC_FAWRAN_NOTI_CHECK ? "Y" : "N";
        fawranIsSme = isSme;
        var op = isSme ? QNBConstants.serviceName.rtpInfoNew : QNBConstants.serviceName.rtpInfo;
        var body = isSme ? { e: encUtilA(JSON.stringify({ ty: "", isNotiCkReq: noti })) } : {};
        kony.print("POC FAWRAN: RTPSME=" + isSme + " isNotiCkReq=" + noti +
            " -> using " + (isSme ? "rtpInfoNew" : "rtpInfo"));

        //Session prerequisites, logged next to the failure so they can be read together. Fawran is a
        //payment rail, so an unregistered device is a plausible reason for a server-side refusal —
        //though note the design itself says unregistered devices are allowed at a reduced limit
        //(10,000 QAR vs 50,000), which argues it should not be a hard block.
        kony.print("POC FAWRAN: prereqs devStatus=" + (gblQNB ? gblQNB.devStatus : "?") +
            " isDevRegUnit=" + (gblQNB ? gblQNB.isDevRegUnit : "?") +
            " isMandRegUnit=" + (gblQNB ? gblQNB.isMandRegUnit : "?") +
            " unit=" + getCurrentUnitValue() +
            " atkn=" + (gblQNB && nullCheck(gblQNB.atkn) ? "set" : "MISSING") +
            " cseid=" + (gblQNB && nullCheck(gblQNB.sersesId) ? "set" : "MISSING"));

        //Kony logs responses but never request bodies, so dump ours explicitly. This is what the
        //backend team needs to correlate against their own logs. The Authorization value is
        //deliberately not printed — it is a live bearer token, and X-Kony-RequestId in the response
        //headers is a safer correlation key.
        var plain = isSme ? JSON.stringify({ ty: "", isNotiCkReq: noti }) : "{}  (rtpInfo, not enveloped)";
        kony.print("POC FAWRAN REQ >>> POST /services/" +
            serviceConfigMap[op] + "/" + op);
        kony.print("POC FAWRAN REQ >>> headers channel=" + headers.channel +
            " unit=" + headers.unit +
            " Accept-Language=" + headers["Accept-Language"] +
            " screenId=" + headers.screenId +
            " Authorization=" + (headers.Authorization ? "Bearer <set>" : "MISSING"));
        kony.print("POC FAWRAN REQ >>> body plaintext = " + plain);
        kony.print("POC FAWRAN REQ >>> body on wire   = " + JSON.stringify(body));
        kony.print("POC FAWRAN REQ >>> SDK also appends platform, cseid=" +
            (gblQNB && nullCheck(gblQNB.sersesId) ? gblQNB.sersesId : "MISSING") +
            ", gl=" + (nullCheck(QNBConstants.gl) ? QNBConstants.gl : "(none)"));

        invokeServiceAsync(op, headers, body, function (status, res) {
            kony.print("POC FAWRAN: info status=" + status +
                " code=" + (res && res.status ? res.status.code : "?"));
            if (fawranOk(res) && res.data) {
                fawranInfo = res.data;
                kony.print("POC FAWRAN: hasRTP=" + res.data.hasRTP +
                    " alias=" + res.data.alias + " accNo=" + res.data.accNo);
                callback(true, res.data);
            } else {
                kony.print("POC FAWRAN: info call failed :: " + JSON.stringify(res).substring(0, 700));

                //rtpInfoNew is broken server-side (reproduced in the production app). Probe the rest
                //of the RTP family so we know how much of the flow is actually usable — if only this
                //one operation is down, mocking it unblocks everything downstream.
                fawranProbeRest();

                if (POC_FAWRAN_MOCK_INFO_ON_FAILURE) {
                    kony.print("POC FAWRAN: *** USING STAND-IN PROFILE — rtpInfoNew is down. " +
                        "Alias types below are placeholders, NOT server data. ***");
                    fawranInfo = fawranStandInProfile();
                    callback(true, fawranInfo);
                    return;
                }
                callback(false, res);
            }
        });
    } catch (e) {
        kony.print("POC FAWRAN: fawranFetchInfo :: " + e);
        callback(false, null);
    }
}

//Stand-in for a successful rtpInfoNew, used only while that operation is down on SIT.
//
//Shape is taken from what production actually reads in callInfoSMECallBack / callInfoSendCB, so the
//downstream screens bind to the same field names they will get from the real service:
//  hasRTP, alias, accNo, selectedAliasType, isCorpCust, isModifyAllowed, isDeRegAllowed,
//  benAliasTypes[], benAliasTypesCorp[], aliasTypes[]
//
//The alias-type CODES are PROVISIONAL — the labels come from the design's alias-type dropdown, and
//"MN"/"CRER" are the only two codes observed in production source. Real codes arrive with the real
//service; nothing downstream should hardcode them.
function fawranStandInProfile() {
    return {
        _standIn: true,
        hasRTP: "Y",
        alias: "0123 4567",
        accNo: (fawranAccounts.length && fawranAccounts[0].acNoF) ? fawranAccounts[0].acNoF : "",
        selectedAliasType: "MOB",
        isCorpCust: "N",
        isModifyAllowed: "N",
        isDeRegAllowed: "N",
        //Retail codes confirmed against production: "MOB" (not "MN") and "ALI". Retail rows carry no
        //desc on the wire; the label is derived from `type` client-side.
        benAliasTypes: [
            { type: "MOB" },
            { type: "ALI" },
            { type: "IBAN" }
        ],
        benAliasTypesCorp: [
            { type: "COCL", desc: "Beneficiary commercial license" },
            { type: "COCR", desc: "Beneficiary company registration" },
            { type: "COER", desc: "Beneficiary establishment registration" },
            { type: "IBANB", desc: "IBAN (Business)" }
        ],
        aliasTypes: [{ type: "MOB" }]
    };
}

//One-shot probe of the rest of the RTP family, run when rtpInfoNew fails. rtpInfoNew being down does
//not tell us whether rtpPurpose or rtpAccList are healthy, and that determines how much of the flow
//we can build and exercise in the meantime.
var fawranProbed = false;
function fawranProbeRest() {
    if (fawranProbed) { return; }
    fawranProbed = true;
    kony.print("POC FAWRAN PROBE: rtpInfoNew is down — testing the rest of the RTP family");

    fawranFetchPurposes(function (ok, rows) {
        kony.print("POC FAWRAN PROBE: rtpPurpose -> " + (ok ? "OK, " + rows.length + " purposes" : "FAILED"));
        if (ok && rows.length) {
            kony.print("POC FAWRAN PROBE: purpose[0] = " + JSON.stringify(rows[0]));
        }
    });
    fawranFetchAccounts(function (ok, rows) {
        kony.print("POC FAWRAN PROBE: rtpAccList -> " + (ok ? "OK, " + rows.length + " accounts" : "FAILED"));
        if (ok && rows.length) {
            kony.print("POC FAWRAN PROBE: account[0] = " + JSON.stringify(rows[0]).substring(0, 400));
        }
    });
}

//--- 2. debit accounts ---------------------------------------------------------------------------
//Rows carry: acNoF (formatted no.), cn (customer name), atdsc (type desc), unitd, cur, accBal, auid.
//auid is the account identifier rtpPayPreprocess needs.
function fawranFetchAccounts(callback) {
    if (!fawranGuard(callback)) { return; }
    if (fawranAccounts.length) { callback(true, fawranAccounts); return; }
    try {
        var headers = createHeaderObj("", true);
        //No body on this one — not enveloped.
        invokeServiceAsync(QNBConstants.serviceName.rtpAccList, headers, {}, function (status, res) {
            kony.print("POC FAWRAN: rtpAccList status=" + status +
                " code=" + (res && res.status ? res.status.code : "?"));
            if (fawranOk(res) && res.data && res.data.length) {
                fawranAccounts = res.data;
                kony.print("POC FAWRAN: " + res.data.length + " debit accounts");
                callback(true, fawranAccounts);
            } else {
                kony.print("POC FAWRAN: no debit accounts :: " + JSON.stringify(res).substring(0, 600));
                callback(false, res);
            }
        });
    } catch (e) {
        kony.print("POC FAWRAN: fawranFetchAccounts :: " + e);
        callback(false, null);
    }
}

//--- 3. remittance purposes ----------------------------------------------------------------------
function fawranFetchPurposes(callback) {
    if (!fawranGuard(callback)) { return; }
    if (fawranPurposes.length) { callback(true, fawranPurposes); return; }
    try {
        var headers = createHeaderObj("", true);
        var data = { e: encUtilA(JSON.stringify({ rc: "RTP" })) };

        invokeServiceAsync(QNBConstants.serviceName.rtpPurpose, headers, data, function (status, res) {
            kony.print("POC FAWRAN: rtpPurpose status=" + status +
                " code=" + (res && res.status ? res.status.code : "?"));
            if (fawranOk(res) && res.data && res.data.length) {
                fawranPurposes = res.data;
                kony.print("POC FAWRAN: " + res.data.length + " purposes");
                callback(true, fawranPurposes);
            } else {
                kony.print("POC FAWRAN: no purposes :: " + JSON.stringify(res).substring(0, 600));
                callback(false, res);
            }
        });
    } catch (e) {
        kony.print("POC FAWRAN: fawranFetchPurposes :: " + e);
        callback(false, null);
    }
}

//--- 4. beneficiary lookup + fee quote -----------------------------------------------------------
//Resolves the beneficiary name and returns fees. Establishes the server-side pending transfer that
//rtpVal and rtpPost then act on — so this MUST run before either of them.
//Block codes RTP_BL_003 / RTP_BL_004 come back here when the amount breaches a server-side limit.
function fawranPreprocess(callback) {
    if (!fawranGuard(callback)) { return; }
    try {
        var d = fawranDraft;
        if (!d.debitAccount || !nullCheck(d.aliasValue) || !nullCheck(d.amount)) {
            kony.print("POC FAWRAN: preprocess called with an incomplete draft");
            callback(false, null);
            return;
        }

        var headers = createHeaderObj("", true);
        headers.screenId = "RTPREG01";

        var inputParam = {
            act: "PAY",
            aT: d.aliasType,
            aV: d.aliasValue,
            c: d.currency,
            amt: ("" + d.amount).split(",").join(""),   //server wants an unformatted amount
            p: d.purposeCode,
            pd: d.purposeDesc,
            auid: d.debitAccount.auid,
            isAFSHF: "N",
            isNotiCkReq: fawranNotiAcked ? "N" : "Y",   //see fawranNotiAcked
            br: "Y"
        };

        //Production adds these two and we were omitting both (frmInstaPayController rtpPreprocess).
        //isCorpBen tells the server which alias namespace to resolve aV in; without it a corporate
        //alias is looked up as a retail one and the beneficiary is not found.
        if (fawranIsSme) {
            inputParam.isCorpBen = d.aliasIsCorp ? "Y" : "N";
        }
        //Corporate DEBIT customers additionally identify which corporate alias is paying.
        var info = fawranInfo || {};
        if (info.isCorpCust === "Y" && nullCheck(info.alias)) {
            inputParam.corpDbtAlias = info.alias;
        }

        //auid is the debit-account identifier. If it is missing the server answers "Account details
        //not found", which reads like a beneficiary problem but is not — so check it explicitly.
        if (!nullCheck(inputParam.auid)) {
            kony.print("POC FAWRAN: *** auid MISSING on the selected debit account *** row = " +
                JSON.stringify(d.debitAccount).substring(0, 400));
        }

        //Log the enrolment state alongside the payload. "Sender or receiver is not registered for
        //Fawran" is ambiguous by design — this line says which half we can already rule out.
        var pi = fawranInfo || {};
        kony.print("POC FAWRAN PREPROCESS >>> sender hasRTP=" + pi.hasRTP +
            " alias=" + pi.alias + " standIn=" + (pi._standIn ? "YES(!)" : "no") +
            " isSme=" + fawranIsSme + " aliasIsCorp=" + d.aliasIsCorp);
        kony.print("POC FAWRAN PREPROCESS >>> " + JSON.stringify(inputParam));
        var data = { e: encUtilA(JSON.stringify(inputParam)) };

        invokeServiceAsync(QNBConstants.serviceName.rtpPayPreprocess, headers, data, function (status, res) {
            var code = (res && res.status) ? res.status.code : "?";
            kony.print("POC FAWRAN: rtpPayPreprocess status=" + status + " code=" + code);
            if (fawranOk(res) && res.data) {
                fawranDraft.preprocessed = res.data;
                kony.print("POC FAWRAN: quote = " + JSON.stringify(res.data).substring(0, 600));
                callback(true, res.data, code);
            } else {
                //Surface the server's own message — limit breaches and unknown aliases land here.
                var msg = (res && res.status && res.status.description) ? res.status.description : "";
                kony.print("POC FAWRAN: preprocess rejected code=" + code + " msg=" + msg);
                callback(false, res, code);
            }
        });
    } catch (e) {
        kony.print("POC FAWRAN: fawranPreprocess :: " + e);
        callback(false, null);
    }
}

//--- 5. send the SMS OTP -------------------------------------------------------------------------
//Empty body. Acts on the pending transfer the server is already holding.
function fawranSendOtp(callback) {
    if (!fawranGuard(callback)) { return; }
    if (!fawranDraft.preprocessed) {
        kony.print("POC FAWRAN: refusing to send OTP — no preprocessed transfer in session");
        callback(false, null);
        return;
    }
    try {
        var headers = createHeaderObj("", true);
        headers.screenId = "RTPPAY";
        invokeServiceAsync(QNBConstants.serviceName.rtpVal, headers, {}, function (status, res) {
            kony.print("POC FAWRAN: rtpVal status=" + status +
                " code=" + (res && res.status ? res.status.code : "?"));
            if (fawranOk(res) && res.data) {
                if (nullCheck(res.data.otpLength)) {
                    fawranDraft.otpLength = parseInt(res.data.otpLength, 10) || 6;
                }
                //Production branches on isOtpRequired: "N" means the server does NOT want an OTP for
                //this transfer and rtpPost is called immediately. Showing an OTP screen anyway would
                //strand the user on a code that will never arrive.
                fawranDraft.otpRequired = (res.data.isOtpRequired !== "N");
                kony.print("POC FAWRAN: rtpVal ok, isOtpRequired=" + res.data.isOtpRequired +
                    " length=" + fawranDraft.otpLength);
                callback(true, res.data);
            } else {
                callback(false, res);
            }
        });
    } catch (e) {
        kony.print("POC FAWRAN: fawranSendOtp :: " + e);
        callback(false, null);
    }
}

function fawranResendOtp(callback) {
    if (!fawranGuard(callback)) { return; }
    try {
        var headers = createHeaderObj("", true);
        headers.screenId = "RTPPAY";
        invokeServiceAsync(QNBConstants.serviceName.rtpResend, headers, {}, function (status, res) {
            kony.print("POC FAWRAN: rtpResend status=" + status);
            callback(fawranOk(res), res);
        });
    } catch (e) {
        kony.print("POC FAWRAN: fawranResendOtp :: " + e);
        callback(false, null);
    }
}

//--- 6. execute the transfer ---------------------------------------------------------------------
//The trailing `true` is invokeServiceAsync's duplicate-submission guard: a second tap while the
//first is in flight is dropped rather than double-posted. Keep it.
function fawranSubmit(otpValue, callback) {
    if (!fawranGuard(callback)) { return; }
    if (!fawranDraft.preprocessed) {
        kony.print("POC FAWRAN: refusing to post — no preprocessed transfer in session");
        callback(false, null);
        return;
    }
    if (!POC_ALLOW_LIVE_TRANSFER) {
        kony.print("POC FAWRAN: POC_ALLOW_LIVE_TRANSFER is false — skipping rtpPost");
        callback(true, { simulated: true });
        return;
    }
    try {
        var headers = createHeaderObj("", true);
        headers.screenId = "RTPADD";
        headers.serviceId = "RTPTRPOST";
        var data = { e: encUtilA(JSON.stringify({ ov: otpValue })) };

        invokeServiceAsync(QNBConstants.serviceName.rtpPost, headers, data, function (status, res) {
            var code = (res && res.status) ? res.status.code : "?";
            kony.print("POC FAWRAN: rtpPost status=" + status + " code=" + code);
            //RTP_0012 and RTP_0014 are SUCCESS, not errors. Production shows the server's own
            //description as the success message and still renders the receipt (frmInstaPayController
            //rtpPostCallBack) — they are accepted-but-qualified outcomes, e.g. pending settlement.
            if (fawranOk(res) || code === "RTP_0012" || code === "RTP_0014") {
                kony.print("POC FAWRAN: transfer completed, code=" + code);
                var d = res.data || {};
                if (code === "RTP_0012" || code === "RTP_0014") {
                    d._message = (res.status && res.status.description) ? res.status.description : "";
                }
                callback(true, d, code);
            } else {
                var msg = (res && res.status && res.status.description) ? res.status.description : "";
                kony.print("POC FAWRAN: rtpPost rejected code=" + code + " :: " + msg);
                callback(false, res, code);
            }
        }, true);
    } catch (e) {
        kony.print("POC FAWRAN: fawranSubmit :: " + e);
        callback(false, null);
    }
}

//--- helpers for the UI --------------------------------------------------------------------------

//CONFIRMED against the live service 2026-08-03:
//    rtpPayPreprocess -> data = {"benName":"...","trFee":"0.00"}
//The fee key is trFee. The earlier probe list (fee/fees/chrg) never matched it, so the fee read as
//zero — invisible while fees are 0.00, but it would have understated the total debit on any
//chargeable transfer. Probes kept behind trFee in case other backend builds differ.
function fawranFeeRaw() {
    var p = fawranDraft.preprocessed || {};
    if (p.trFee !== undefined) { return p.trFee; }
    if (p.fee !== undefined) { return p.fee; }
    if (p.fees !== undefined) { return p.fees; }
    if (p.chrg !== undefined) { return p.chrg; }
    return 0;
}

function fawranTotalDebit() {
    return amountNumber(fawranDraft.amount) + amountNumber(fawranFeeRaw());
}

function fawranFeeText() {
    return amountText(fawranFeeRaw());
}

//Beneficiary name resolved by rtpPayPreprocess. benName is the confirmed key.
function fawranBenName() {
    var p = fawranDraft.preprocessed || {};
    return p.benName || p.bnfName || p.name || p.bName || "";
}


//Called when the user dismisses the RTP_BL_004 warning. The next rtpPayPreprocess then sends
//isNotiCkReq "N". Deliberately NOT set automatically on the failure: the whole point of the code is
//that a human has been shown the warning.
function fawranAckNotiWarning() {
    fawranNotiAcked = true;
    kony.print("POC FAWRAN: RTP_BL_004 acknowledged — retrying preprocess with isNotiCkReq=N");
}


//How the OTP screen should react to an rtpPost failure code. Production splits these three ways
//(frmInstaPayController rtpPostCallBack): a bad code lets the user try again on the same screen,
//while an exhausted attempt counter or an OTP limit sends them back to the start of the flow.
//"retry" = clear the field and stay. "restart" = the pending transfer is gone, go back to Fawran.
function fawranOtpFailureAction(code) {
    var c = QNBConstants.serviceResponseCodes || {};
    if (code === c.wrongOTP || code === c.incorectOTP || code === c.expiredOTP) { return "retry"; }
    if (code === c.exceededWrongOTPAttempts || code === c.trWrongOTP || code === c.otpLimit) {
        return "restart";
    }
    return "restart";
}
