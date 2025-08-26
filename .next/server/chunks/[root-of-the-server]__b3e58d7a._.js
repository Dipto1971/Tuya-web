module.exports = {

"[project]/.next-internal/server/app/api/switch/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/src/lib/tuya.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "controlDeviceSwitch": ()=>controlDeviceSwitch,
    "fetchDeviceStatus": ()=>fetchDeviceStatus
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const { TUYA_CLIENT_ID, TUYA_CLIENT_SECRET, TUYA_API_REGION } = process.env;
const BASE_URL = `https://openapi.${TUYA_API_REGION}.com`;
let cachedToken = null;
let cachedTokenExpire = 0;
function genSignature({ method, url, body, t, accessToken = "" }) {
    const contentHash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(body || "").digest("hex");
    const stringToSign = [
        method,
        contentHash,
        "",
        url
    ].join("\n");
    const signStr = TUYA_CLIENT_ID + accessToken + t + stringToSign;
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac("sha256", TUYA_CLIENT_SECRET).update(signStr).digest("hex").toUpperCase();
}
async function getAccessToken() {
    try {
        const now = Date.now();
        if (cachedToken && now < cachedTokenExpire) return cachedToken;
        const t = now.toString();
        const method = "GET";
        const url = "/v1.0/token?grant_type=1";
        const sign = genSignature({
            method,
            url,
            t
        });
        console.log(`Making token request to: ${BASE_URL}${url}`);
        console.log(`Headers:`, {
            client_id: TUYA_CLIENT_ID,
            sign,
            t,
            sign_method: "HMAC-SHA256"
        });
        const res = await fetch(`${BASE_URL}${url}`, {
            method: "GET",
            headers: {
                client_id: TUYA_CLIENT_ID,
                sign,
                t,
                sign_method: "HMAC-SHA256"
            }
        });
        console.log(`Token response status: ${res.status}`);
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Token request failed: ${res.status} - ${errorText}`);
            throw new Error(`Token request failed: ${res.status}`);
        }
        const data = await res.json();
        console.log(`Token response data:`, JSON.stringify(data, null, 2));
        if (!data.success) {
            throw new Error(`Token request failed: ${data.msg || "Unknown error"}`);
        }
        if (!data.result || !data.result.access_token) {
            throw new Error("Invalid token response structure");
        }
        cachedToken = data.result.access_token;
        cachedTokenExpire = now + data.result.expire_time * 1000 - 60000;
        // refresh 1 min before expiry
        console.log("Token obtained successfully");
        return cachedToken;
    } catch (error) {
        console.error("Error getting access token:", error.message);
        throw error;
    }
}
async function fetchDeviceStatus(deviceId) {
    try {
        const token = await getAccessToken();
        const t = Date.now().toString();
        const method = "GET";
        const urlPath = `/v1.0/iot-03/devices/${deviceId}/status`;
        const sign = genSignature({
            method,
            url: urlPath,
            t,
            accessToken: token
        });
        const res = await fetch(`${BASE_URL}${urlPath}`, {
            method: "GET",
            headers: {
                client_id: TUYA_CLIENT_ID,
                sign,
                t,
                sign_method: "HMAC-SHA256",
                access_token: token
            }
        });
        if (!res.ok) {
            throw new Error(`Device status request failed: ${res.status}`);
        }
        const data = await res.json();
        return data.result; // returns array of status
    } catch (error) {
        console.error("Error in fetchDeviceStatus:", error.message);
        throw error;
    }
}
async function controlDeviceSwitch(deviceId, switchState) {
    try {
        const token = await getAccessToken();
        const t = Date.now().toString();
        const method = "POST";
        const urlPath = `/v1.0/iot-03/devices/${deviceId}/commands`;
        // Prepare the request body for standard device control
        const body = JSON.stringify({
            commands: [
                {
                    code: "switch_1",
                    value: switchState
                }
            ]
        });
        console.log(`Making request to: ${BASE_URL}${urlPath}`);
        console.log(`Request body: ${body}`);
        const sign = genSignature({
            method,
            url: urlPath,
            body,
            t,
            accessToken: token
        });
        const res = await fetch(`${BASE_URL}${urlPath}`, {
            method: "POST",
            headers: {
                client_id: TUYA_CLIENT_ID,
                sign,
                t,
                sign_method: "HMAC-SHA256",
                access_token: token,
                "Content-Type": "application/json"
            },
            body
        });
        if (!res.ok) {
            throw new Error(`Device control request failed: ${res.status}`);
        }
        const data = await res.json();
        console.log(`Tuya API response status: ${res.status}`);
        console.log(`Tuya API response data:`, JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Error in controlDeviceSwitch:", error.message);
        throw error;
    }
}
}),
"[project]/src/app/api/switch/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tuya$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tuya.js [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const { state } = await request.json();
        if (typeof state !== "boolean") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Invalid state parameter. Must be true (on) or false (off)"
            }, {
                status: 400
            });
        }
        const deviceId = process.env.TUYA_DEVICE_ID;
        if (!deviceId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Device ID not configured"
            }, {
                status: 500
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tuya$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["controlDeviceSwitch"])(deviceId, state);
        console.log("Tuya API response:", JSON.stringify(result, null, 2));
        if (result && result.success !== false) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: `Device switched ${state ? "on" : "off"} successfully`,
                data: result
            });
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Failed to control device switch",
                data: result
            }, {
                status: 500
            });
        }
    } catch (error) {
        console.error("Error controlling device switch:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to control device switch",
            details: error.message
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__b3e58d7a._.js.map