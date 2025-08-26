// Simple client-side test for API endpoints
async function testClientAPI() {
  console.log("Testing client-side API access...");

  try {
    // Test device status
    console.log("Testing /api/device-status...");
    const deviceResponse = await fetch("/api/device-status");
    console.log(
      "Device status response:",
      deviceResponse.status,
      deviceResponse.statusText
    );

    if (deviceResponse.ok) {
      const deviceData = await deviceResponse.json();
      console.log("Device status data:", deviceData);
    } else {
      console.error("Device status failed:", deviceResponse.status);
    }

    // Test today consumption
    console.log("Testing /api/today-consumption...");
    const consumptionResponse = await fetch("/api/today-consumption");
    console.log(
      "Consumption response:",
      consumptionResponse.status,
      consumptionResponse.statusText
    );

    if (consumptionResponse.ok) {
      const consumptionData = await consumptionResponse.json();
      console.log("Consumption data:", consumptionData);
    } else {
      console.error("Consumption failed:", consumptionResponse.status);
    }

    // Test switch status
    console.log("Testing /api/switch-status...");
    const switchResponse = await fetch("/api/switch-status");
    console.log(
      "Switch response:",
      switchResponse.status,
      switchResponse.statusText
    );

    if (switchResponse.ok) {
      const switchData = await switchResponse.json();
      console.log("Switch data:", switchData);
    } else {
      console.error("Switch status failed:", switchResponse.status);
    }
  } catch (error) {
    console.error("Client-side test error:", error);
  }
}

// Run the test
testClientAPI();

