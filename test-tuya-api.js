import crypto from "crypto";

const TUYA_CLIENT_ID = "xrv3wfan7kceh9d8q7ak";
const TUYA_CLIENT_SECRET = "7c4d783df9c8458d9aeb59b2cf3f9df8";
const TUYA_DEVICE_ID = "bf2e7d7db63ae039f9ye8a";
const BASE_URL = "https://openapi.tuyaeu.com";

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
    const t = Date.now().toString();
    const method = "GET";
    const url = "/v1.0/token?grant_type=1";
    const sign = genSignature({ method, url, t });

    console.log("🔑 Generating Access Token...");
    console.log(`URL: ${BASE_URL}${url}`);
    console.log(`Timestamp: ${t}`);
    console.log(`Signature: ${sign}`);

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: {
        client_id: TUYA_CLIENT_ID,
        sign,
        t,
        sign_method: "HMAC-SHA256",
      },
    });

    console.log(`Response Status: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Token request failed: ${res.status} - ${errorText}`);
      return null;
    }

    const data = await res.json();
    console.log("✅ Token Response:", JSON.stringify(data, null, 2));

    if (!data.success) {
      console.error(`❌ Token request failed: ${data.msg || "Unknown error"}`);
      return null;
    }

    if (!data.result || !data.result.access_token) {
      console.error("❌ Invalid token response structure");
      return null;
    }

    console.log(`✅ Access Token: ${data.result.access_token}`);
    return data.result.access_token;
  } catch (error) {
    console.error("❌ Error getting access token:", error.message);
    return null;
  }
}

async function getDeviceStatus(accessToken) {
  try {
    const t = Date.now().toString();
    const method = "GET";
    const urlPath = `/v1.0/iot-03/devices/${TUYA_DEVICE_ID}/status`;
    const sign = genSignature({ method, url: urlPath, t, accessToken });

    console.log("\n📱 Getting Device Status...");
    console.log(`URL: ${BASE_URL}${urlPath}`);
    console.log(`Timestamp: ${t}`);
    console.log(`Signature: ${sign}`);

    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method: "GET",
      headers: {
        client_id: TUYA_CLIENT_ID,
        sign,
        t,
        sign_method: "HMAC-SHA256",
        access_token: accessToken,
        "Content-Type": "application/json",
      },
    });

    console.log(`Response Status: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `❌ Device status request failed: ${res.status} - ${errorText}`
      );
      return null;
    }

    const data = await res.json();
    console.log("✅ Device Status Response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ Error getting device status:", error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Testing Tuya API...\n");

  // Step 1: Get Access Token
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.log("\n❌ Failed to get access token. Exiting.");
    return;
  }

  // Step 2: Get Device Status
  const deviceStatus = await getDeviceStatus(accessToken);

  if (deviceStatus) {
    console.log("\n✅ API Test Completed Successfully!");
  } else {
    console.log("\n❌ Failed to get device status.");
  }
}

main().catch(console.error);
