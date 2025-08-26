#!/bin/bash

echo "🔧 Tuya API Step-by-Step Testing"
echo "=================================="
echo ""

# Step 1: Test token generation
echo "🔑 Step 1: Testing Token Generation..."
echo "Running token request..."

TOKEN_RESPONSE=$(curl -s --request GET "https://openapi.tuyaeu.com/v1.0/token?grant_type=1" \
  --header "sign_method: HMAC-SHA256" \
  --header "client_id: xrv3wfan7kceh9d8q7ak" \
  --header "t: 1756235616309" \
  --header "sign: E1369352034EF30E03765C3D9550227DE9E32D155138C1DBE3369E3E143FC1AC")

echo "Token Response:"
echo "$TOKEN_RESPONSE" | jq . 2>/dev/null || echo "$TOKEN_RESPONSE"
echo ""

# Check if token request was successful
if echo "$TOKEN_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Token generation successful!"
    
    # Extract access token
    ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.result.access_token' 2>/dev/null)
    
    if [ "$ACCESS_TOKEN" != "null" ] && [ -n "$ACCESS_TOKEN" ]; then
        echo "🔑 Access Token: $ACCESS_TOKEN"
        echo ""
        
        # Step 2: Test device status
        echo "📱 Step 2: Testing Device Status..."
        echo "Running device status request..."
        
        DEVICE_RESPONSE=$(curl -s --request GET "https://openapi.tuyaeu.com/v1.0/iot-03/devices/bf2e7d7db63ae039f9ye8a/status" \
          --header "sign_method: HMAC-SHA256" \
          --header "client_id: xrv3wfan7kceh9d8q7ak" \
          --header "t: 1756235616309" \
          --header "mode: cors" \
          --header "Content-Type: application/json" \
          --header "sign: D7F7CF0A8DDA56F66B22F7D2CF092C803807CEB8F85C689520D0C434C8B63638" \
          --header "access_token: $ACCESS_TOKEN")
        
        echo "Device Status Response:"
        echo "$DEVICE_RESPONSE" | jq . 2>/dev/null || echo "$DEVICE_RESPONSE"
        echo ""
        
        if echo "$DEVICE_RESPONSE" | grep -q '"success":true'; then
            echo "✅ Device status successful!"
            echo ""
            
            # Step 3: Test Next.js application
            echo "🌐 Step 3: Testing Next.js Application..."
            echo "Testing /api/device-status endpoint..."
            
            APP_RESPONSE=$(curl -s http://localhost:3000/api/device-status)
            echo "Next.js App Response:"
            echo "$APP_RESPONSE" | jq . 2>/dev/null || echo "$APP_RESPONSE"
            echo ""
            
            if echo "$APP_RESPONSE" | grep -q '"success":true'; then
                echo "✅ Next.js application is working correctly!"
                echo "🎉 All tests passed! Your Energy Monitoring System is fully functional."
            else
                echo "❌ Next.js application test failed."
                echo "Check if the application is running: npm run dev"
            fi
        else
            echo "❌ Device status test failed."
        fi
    else
        echo "❌ Could not extract access token from response."
    fi
else
    echo "❌ Token generation failed."
    echo ""
    echo "🔍 Troubleshooting:"
    echo "1. Make sure your IP (27.147.202.146) is whitelisted in Tuya Cloud Console"
    echo "2. Check if your Tuya credentials are correct"
    echo "3. Wait a few minutes after whitelisting IP for changes to take effect"
fi

echo ""
echo "📋 Summary:"
echo "- IP Address: 27.147.202.146"
echo "- API Region: tuyaeu"
echo "- Device ID: bf2e7d7db63ae039f9ye8a"
echo "- Next.js App: http://localhost:3000"


