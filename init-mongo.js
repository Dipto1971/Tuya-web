// MongoDB initialization script for Tuya Alternative
// This script runs when the MongoDB container starts for the first time

// Switch to the tuya database
db = db.getSiblingDB("tuya");

// Create collections with proper indexes
db.createCollection("device_data");
db.createCollection("users");
db.createCollection("devices");
db.createCollection("energy_consumption");
db.createCollection("system_logs");

// Create indexes for better performance
db.device_data.createIndex({ timestamp: 1 });
db.device_data.createIndex({ deviceId: 1, timestamp: 1 });
db.device_data.createIndex({ "status.code": 1 });

db.energy_consumption.createIndex({ date: 1 });
db.energy_consumption.createIndex({ deviceId: 1, date: 1 });

db.system_logs.createIndex({ timestamp: 1 });
db.system_logs.createIndex({ level: 1, timestamp: 1 });

// Insert sample device configuration
db.devices.insertOne({
  deviceId: "sample_device_001",
  name: "Living Room Smart Plug",
  type: "smart_plug",
  model: "Tuya Smart Plug",
  location: "Living Room",
  createdAt: new Date(),
  updatedAt: new Date(),
  status: "active",
  configuration: {
    maxPower: 2200, // watts
    voltage: 220, // volts
    frequency: 50, // Hz
  },
});

// Insert sample user
db.users.insertOne({
  username: "admin",
  email: "admin@tuya-alternative.com",
  role: "admin",
  createdAt: new Date(),
  lastLogin: new Date(),
  preferences: {
    timezone: "Asia/Dhaka",
    currency: "BDT",
    language: "en",
  },
});

// Insert sample energy consumption data
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

db.energy_consumption.insertMany([
  {
    deviceId: "sample_device_001",
    date: yesterday,
    totalKwh: 2.45,
    peakPower: 1200,
    averagePower: 450,
    cost: 24.5,
    dataPoints: 288, // 5-minute intervals for 24 hours
    createdAt: new Date(),
  },
  {
    deviceId: "sample_device_001",
    date: today,
    totalKwh: 1.23,
    peakPower: 1100,
    averagePower: 380,
    cost: 12.3,
    dataPoints: 144, // Partial day data
    createdAt: new Date(),
  },
]);

// Insert sample system log
db.system_logs.insertOne({
  timestamp: new Date(),
  level: "info",
  message: "Database initialized successfully",
  service: "mongodb",
  details: {
    collections: [
      "device_data",
      "users",
      "devices",
      "energy_consumption",
      "system_logs",
    ],
    indexes: "created",
    sampleData: "inserted",
  },
});

print("✅ MongoDB initialization completed successfully!");
print(
  "📊 Created collections: device_data, users, devices, energy_consumption, system_logs"
);
print("🔍 Created indexes for optimal performance");
print("📝 Inserted sample data for testing");
