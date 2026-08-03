//Temporary Day-1 verification harness. Delete this file once integration is proven.
//Call pocSelfCheck() from a controller and read the output in adb logcat / Xcode console.
//It runs entirely offline — no service call — so it isolates "is QNBMBCommon wired up correctly"
//from "can we reach the backend".

function pocSelfCheck() {
    var pass = 0, fail = 0;
    var line = "----------------------------------------";

    function report(ok, label, detail) {
        if (ok) { pass++; } else { fail++; }
        kony.print("[POC-CHECK] " + (ok ? "PASS" : "FAIL") + "  " + label + (detail ? "  :: " + detail : ""));
    }

    function fnExists(name, fn) {
        report(typeof fn === "function", name + "()");
    }

    kony.print(line);
    kony.print("[POC-CHECK] QNBMBCommon wiring self-check");
    kony.print(line);

    //1. Service layer globals — proves the dependency resolved and modules/*.js loaded.
    fnExists("invokeServiceAsync", typeof invokeServiceAsync !== "undefined" ? invokeServiceAsync : null);
    fnExists("createHeaderObj", typeof createHeaderObj !== "undefined" ? createHeaderObj : null);
    fnExists("assignEntitlment", typeof assignEntitlment !== "undefined" ? assignEntitlment : null);
    fnExists("geti18Val", typeof geti18Val !== "undefined" ? geti18Val : null);
    fnExists("nullCheck", typeof nullCheck !== "undefined" ? nullCheck : null);
    fnExists("detectVPN", typeof detectVPN !== "undefined" ? detectVPN : null);
    fnExists("getPosition", typeof getPosition !== "undefined" ? getPosition : null);
    fnExists("tab_isTablet", typeof tab_isTablet !== "undefined" ? tab_isTablet : null);
    fnExists("getLanguageForHeader", typeof getLanguageForHeader !== "undefined" ? getLanguageForHeader : null);
    fnExists("showLoadingScreen", typeof showLoadingScreen !== "undefined" ? showLoadingScreen : null);
    fnExists("dismissLoadingScreen", typeof dismissLoadingScreen !== "undefined" ? dismissLoadingScreen : null);

    //2. Crypto entry points.
    fnExists("encUtilA", typeof encUtilA !== "undefined" ? encUtilA : null);
    fnExists("decUtilA", typeof decUtilA !== "undefined" ? decUtilA : null);
    fnExists("encryptPayLoad", typeof encryptPayLoad !== "undefined" ? encryptPayLoad : null);
    fnExists("invokeEncUtil", typeof invokeEncUtil !== "undefined" ? invokeEncUtil : null);
    fnExists("invokeCodeEncUtil", typeof invokeCodeEncUtil !== "undefined" ? invokeCodeEncUtil : null);

    //3. Constants / globals.
    report(typeof QNBConstants !== "undefined" && QNBConstants !== null, "QNBConstants object");
    report(typeof gblQNB !== "undefined" && gblQNB !== null, "gblQNB declared (globalVariables.json)");
    report(typeof buildType !== "undefined", "buildType", typeof buildType !== "undefined" ? buildType : "undefined");

    try {
        var keys = QNBConstants.appInitKeys[POC_BUILD_TYPE];
        var host = keys && keys.appurl ? keys.appurl.split("/")[2] : "?";
        report(!!(keys && keys.appkey && keys.ask && keys.appurl),
            "appInitKeys[" + POC_BUILD_TYPE + "]", "host " + host);
    } catch (e) {
        report(false, "appInitKeys[" + POC_BUILD_TYPE + "]", "" + e);
    }

    try {
        var enc = QNBConstants.EncAConstant;
        report(!!(enc && enc.sl && enc.psph && enc.ive && enc.itr && enc.ks),
            "EncAConstant present (aslUtil.js)", "itr=" + (enc ? enc.itr : "?"));
    } catch (e) {
        report(false, "EncAConstant present", "" + e);
    }

    //4. Operation registry.
    try {
        var n = 0, k;
        for (k in serviceConfigMap) { if (serviceConfigMap.hasOwnProperty(k)) { n++; } }
        report(n > 500, "serviceConfigMap loaded", n + " operations");
        report(serviceConfigMap["preLoginComp"] === "metaDataOrc",
            "preLoginComp -> metaDataOrc", "" + serviceConfigMap["preLoginComp"]);
        report(serviceConfigMap["loginComposite2"] === "commonOrc",
            "loginComposite2 -> commonOrc", "" + serviceConfigMap["loginComposite2"]);
    } catch (e) {
        report(false, "serviceConfigMap", "" + e);
    }

    //5. AES round-trip. This is the real proof that aslUtil.js constants + CryptoJS work together.
    //If this fails, every encrypted payload would fail server-side regardless of connectivity.
    try {
        var plain = JSON.stringify({ unit: "PRD", deviceName: "IPHONE" });
        var ct = encUtilA(plain);
        var back = decUtilA(ct);
        report(back === plain, "AES encUtilA/decUtilA round-trip",
            "ciphertext " + (ct ? ct.length : 0) + " chars");
    } catch (e) {
        report(false, "AES round-trip", "" + e);
    }

    //6. i18n. Confirms the bundle shipped and geti18Val resolves. Note geti18Val returns "" on a
    //miss rather than the key, so an empty result here means the key is absent, not that i18n is broken.
    try {
        report(typeof kony.i18n.getCurrentLocale() === "string", "i18n locale",
            kony.i18n.getCurrentLocale());
    } catch (e) {
        report(false, "i18n locale", "" + e);
    }

    kony.print(line);
    kony.print("[POC-CHECK] RESULT  pass=" + pass + "  fail=" + fail);
    kony.print(line);

    return { pass: pass, fail: fail };
}

//Native RSA check. Separate because it needs a real public key from the `rp` service response,
//so it can only run after that call. Pass gblQNB.lk / gblQNB.pk in.
function pocCheckNativeCrypto(lk, pk) {
    kony.print("[POC-CHECK] native crypto -----------------");
    try {
        var u = invokeEncUtil("TESTUSER", lk);
        kony.print("[POC-CHECK] " + (u && u.length > 0 ? "PASS" : "FAIL") +
            "  invokeEncUtil (RSA, username)  :: " + (u ? u.length + " chars" : "empty/null"));
    } catch (e) {
        kony.print("[POC-CHECK] FAIL  invokeEncUtil threw :: " + e);
    }
    try {
        var c = invokeCodeEncUtil("TESTPASS", pk);
        kony.print("[POC-CHECK] " + (c && c.length > 0 ? "PASS" : "FAIL") +
            "  invokeCodeEncUtil (RSA+PBKDF2, password)  :: " + (c ? c.length + " chars" : "empty/null"));
    } catch (e) {
        kony.print("[POC-CHECK] FAIL  invokeCodeEncUtil threw :: " + e);
    }
}
