//Demo kill-switch. Set to true to fall back to the canned serviceCall() responses so the POC is
//still demoable if the backend environment is unreachable. Leave false for real integration.
var USE_MOCK_SERVICES = false;

//Environment. Must match an entry in QNBConstants.appInitKeys (AppInKs.js) AND agree with the AES
//constants in aslUtil.js. SIT/SIT2/SIT3/SIT4/DEV/DEV2/DEV3 all share the same EncAConstant, so any
//of those is safe with the currently generated aslUtil.js. MOB4/MOB6 use different AES constants and
//need `node envConstants.js <ENV>` re-run before they will decrypt.
var POC_BUILD_TYPE = "SIT";

//Demo shortcut: treat the login response's OTP flag (data.ior) as "N" even when the server says "Y",
//and go straight to the dashboard. The POC has no OTP screen.
//CAVEAT: production's OTP step (op `vlo`) REPLACES gblQNB.atkn with a new token. The pre-OTP token
//we keep here may be rejected by the authenticated dashboard calls. If the dashboard falls back to
//placeholder data and the log shows an auth/session code, this flag is the reason.
//OFF as of 2026-08-03. Bypassing OTP let ior=Y users through on a PRE-OTP token, which the backend
//rejects on every authenticated call. The session then unwinds into Common's session handling, which
//navigates to forms this app does not contain — and from that point navigation is dead for the whole
//session, surfacing much later as "Transfers isn't part of this prototype yet" on an unrelated tap.
//Failing cleanly at login is far better than a half-authenticated session that breaks elsewhere.
//Production's real path is frmSMSPinActivation + op `vlo`, which REPLACES atkn — not built here.
var POC_BYPASS_OTP = false;

//Fawran: when false, the flow stops before rtpPost and jumps straight to the success screen without
//executing the transfer. SIT only, so this is a rehearsal convenience (avoids burning OTP sends
//while practising), not a safety gate. Leave true for the real demo.
var POC_ALLOW_LIVE_TRANSFER = true;

//Fawran: send isNotiCkReq="Y" (server verifies this device's push subscription) or "N" to skip it.
//The production app registers for push via subscribeKMSComposite at startup and can afford "Y";
//this POC does not reliably do so, and a failed check returns GENER_CODE with an empty payload.
//Tested "N" on device — made no difference to the GENER_CODE refusal, so restored to production's
//value. Keep it at true so our request stays byte-identical to callInfoSME for backend comparison.
var POC_FAWRAN_NOTI_CHECK = true;

//rtpInfoNew is currently broken on SIT — confirmed by reproducing the identical failure in the
//production MB app. When true, a failed rtpInfoNew falls back to a stand-in profile so the rest of
//the Fawran flow can be built and exercised against the REAL rtpPurpose / rtpAccList /
//rtpPayPreprocess services.
//
//The real call is still attempted first every time, so the moment the service is fixed this
//silently stops being used — no code change required. Set false to see the raw failure.
//OFF as of 2026-08-03. The stand-in profile hardcodes hasRTP:"Y", which silently defeats the
//enrolment gate on frmFawran: an unenrolled customer walks all the way to rtpPayPreprocess and is
//rejected there with "Sender or receiver is not registered for Fawran" — a confusing place to find
//out. rtpInfoNew appears healthy again, so take the real answer and fail honestly at the gate.
var POC_FAWRAN_MOCK_INFO_ON_FAILURE = false;
