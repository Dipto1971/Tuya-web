import crypto from "crypto";

const { TUYA_CLIENT_ID, TUYA_CLIENT_SECRET, TUYA_API_REGION } = process.env;

const BASE_URL = `https://openapi.${TUYA_API_REGION}.com`;

let cachedToken = null;
let cachedTokenExpire = 0;

function genSignature({ method, url, body, t, accessToken = "" }) {
  const contentHash = crypto
    .createHash("sha256")
    .update(body || "")
    .digest("hex");
  const stringToSign = [method, contentHash, "", url].join("\n");
  const signStr = TUYA_CLIENT_ID + accessToken + t + stringToSign;
  return crypto
    .createHmac("sha256", TUYA_CLIENT_SECRET)
    .update(signStr)
    .digest("hex")
    .toUpperCase();
}

async function getAccessToken() {
  try {
    const now = Date.now();
    if (cachedToken && now < cachedTokenExpire) return cachedToken;

    const t = now.toString();
    const method = "GET";
    const url = "/v1.0/token?grant_type=1";
    const sign = genSignature({ method, url, t });

    console.log(`Making token request to: ${BASE_URL}${url}`);
    console.log(`Headers:`, {
      client_id: TUYA_CLIENT_ID,
      sign,
      t,
      sign_method: "HMAC-SHA256",
    });

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: {
        client_id: TUYA_CLIENT_ID,
        sign,
        t,
        sign_method: "HMAC-SHA256",
      },
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

export async function fetchDeviceStatus(deviceId) {
  try {
    const token = await getAccessToken();
    const t = Date.now().toString();
    const method = "GET";
    const urlPath = `/v1.0/iot-03/devices/${deviceId}/status`;
    const sign = genSignature({ method, url: urlPath, t, accessToken: token });

    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method: "GET",
      headers: {
        client_id: TUYA_CLIENT_ID,
        sign,
        t,
        sign_method: "HMAC-SHA256",
        access_token: token,
      },
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

export async function controlDeviceSwitch(deviceId, switchState) {
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
          value: switchState,
        },
      ],
    });

    console.log(`Making request to: ${BASE_URL}${urlPath}`);
    console.log(`Request body: ${body}`);

    const sign = genSignature({
      method,
      url: urlPath,
      body,
      t,
      accessToken: token,
    });

    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method: "POST",
      headers: {
        client_id: TUYA_CLIENT_ID,
        sign,
        t,
        sign_method: "HMAC-SHA256",
        access_token: token,
        "Content-Type": "application/json",
      },
      body,
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
