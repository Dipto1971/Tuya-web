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

function generateCurlCommands() {
  const t = Date.now().toString();

  // Generate token request
  const tokenUrl = "/v1.0/token?grant_type=1";
  const tokenSign = genSignature({ method: "GET", url: tokenUrl, t });

  console.log("🔑 CURL Command to Get Access Token:");
  console.log("```bash");
  console.log(`curl --request GET "${BASE_URL}${tokenUrl}" \\`);
  console.log(`  --header "sign_method: HMAC-SHA256" \\`);
  console.log(`  --header "client_id: ${TUYA_CLIENT_ID}" \\`);
  console.log(`  --header "t: ${t}" \\`);
  console.log(`  --header "sign: ${tokenSign}"`);
  console.log("```\n");

  // Generate device status request (with placeholder token)
  const deviceUrl = `/v1.0/iot-03/devices/${TUYA_DEVICE_ID}/status`;
  const deviceSign = genSignature({
    method: "GET",
    url: deviceUrl,
    t,
    accessToken: "YOUR_ACCESS_TOKEN_HERE",
  });

  console.log(
    "📱 CURL Command to Get Device Status (replace YOUR_ACCESS_TOKEN_HERE):"
  );
  console.log("```bash");
  console.log(`curl --request GET "${BASE_URL}${deviceUrl}" \\`);
  console.log(`  --header "sign_method: HMAC-SHA256" \\`);
  console.log(`  --header "client_id: ${TUYA_CLIENT_ID}" \\`);
  console.log(`  --header "t: ${t}" \\`);
  console.log(`  --header "mode: cors" \\`);
  console.log(`  --header "Content-Type: application/json" \\`);
  console.log(`  --header "sign: ${deviceSign}" \\`);
  console.log(`  --header "access_token: YOUR_ACCESS_TOKEN_HERE"`);
  console.log("```\n");

  console.log("📋 Instructions:");
  console.log("1. First run the token command to get an access token");
  console.log("2. Copy the access_token from the response");
  console.log(
    "3. Replace 'YOUR_ACCESS_TOKEN_HERE' in the device status command"
  );
  console.log("4. Run the device status command");
  console.log(
    "\n⚠️  Note: Your IP must be whitelisted in Tuya Cloud Console first!"
  );
}

generateCurlCommands();


