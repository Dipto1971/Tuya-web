import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global;

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase() {
  const client = await clientPromise;
  return client.db("tuya");
}

export async function getCollection(collectionName = "device_data") {
  const db = await getDatabase();
  return db.collection(collectionName);
}

export async function insertDeviceData(data) {
  const collection = await getCollection();
  return await collection.insertOne(data);
}

export async function getTodayData(timezone = "Asia/Dhaka") {
  const collection = await getCollection();

  const todayStart = getTodayStartInTimezone(timezone);
  const todayEnd = getTodayEndInTimezone(timezone);

  console.log(`Today start (${timezone}): ${todayStart.toISOString()}`);
  console.log(`Today end (${timezone}): ${todayEnd.toISOString()}`);

  const pipeline = [
    {
      $match: {
        timestamp: { $gte: todayStart, $lte: todayEnd },
      },
    },
    {
      $unwind: "$status",
    },
    {
      $group: {
        _id: {
          hour: {
            $hour: {
              date: "$timestamp",
              timezone: "Asia/Dhaka",
            },
          },
          code: "$status.code",
        },
        value: { $avg: "$status.value" },
      },
    },
    {
      $group: {
        _id: "$_id.hour",
        data: {
          $push: {
            code: "$_id.code",
            value: "$value",
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  return await collection.aggregate(pipeline).toArray();
}

export async function getTodayConsumption(timezone = "Asia/Dhaka") {
  const collection = await getCollection();

  const todayStart = getTodayStartInTimezone(timezone);
  const now = new Date();

  const pipeline = [
    {
      $match: {
        timestamp: { $gte: todayStart, $lte: now },
        "status.code": "switch_1",
        "status.value": true,
      },
    },
    {
      $sort: { timestamp: 1 },
    },
    {
      $group: {
        _id: null,
        totalKwh: {
          $sum: {
            $multiply: [
              {
                $divide: [
                  {
                    $subtract: [
                      {
                        $ifNull: [
                          {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: {
                                    $arrayElemAt: [
                                      {
                                        $slice: [
                                          "$status",
                                          {
                                            $add: [
                                              {
                                                $indexOfArray: [
                                                  "$status.code",
                                                  "switch_1",
                                                ],
                                              },
                                              1,
                                            ],
                                          },
                                        ],
                                      },
                                      0,
                                    ],
                                  },
                                  cond: { $eq: ["$$this.code", "cur_power"] },
                                },
                              },
                              0,
                            ],
                          },
                          { value: 0 },
                        ],
                      }.value,
                      0,
                    ],
                  },
                  1000,
                ],
              },
              {
                $divide: [
                  {
                    $subtract: [
                      {
                        $ifNull: [
                          {
                            $arrayElemAt: [
                              {
                                $slice: [
                                  "$timestamp",
                                  {
                                    $add: [
                                      {
                                        $indexOfArray: [
                                          "$status.code",
                                          "switch_1",
                                        ],
                                      },
                                      1,
                                    ],
                                  },
                                ],
                              },
                              0,
                            ],
                          },
                          { $arrayElemAt: ["$timestamp", 0] },
                        ],
                      },
                      3600000,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
        },
        dataPoints: { $sum: 1 },
      },
    },
  ];

  const result = await collection.aggregate(pipeline).toArray();

  if (result.length === 0) {
    return {
      kwh: 0,
      cost: 0,
      dataPoints: 0,
      message: "No AC ON data found for today",
    };
  }

  const consumption = result[0];
  const totalKwh = consumption.totalKwh;
  const cost = totalKwh * 10; // 10 Taka per unit

  return {
    kwh: parseFloat(totalKwh.toFixed(4)),
    cost: parseFloat(cost.toFixed(2)),
    dataPoints: consumption.dataPoints,
    timeRange: {
      start: todayStart.toISOString(),
      end: now.toISOString(),
      timezone: timezone,
    },
    rate: 10,
    calculationMethod: "Only AC ON Intervals (Riemann Sum)",
  };
}

function getTodayStartInTimezone(timezone) {
  const now = new Date();
  if (timezone === "Asia/Dhaka") {
    const dhakaDate = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    dhakaDate.setUTCHours(0, 0, 0, 0);
    const utcStart = new Date(dhakaDate.getTime() - 6 * 60 * 60 * 1000);
    return utcStart;
  }
  const localDate = new Date(now);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
}

function getTodayEndInTimezone(timezone) {
  const now = new Date();
  if (timezone === "Asia/Dhaka") {
    const dhakaDate = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    dhakaDate.setUTCHours(23, 59, 59, 999);
    const utcEnd = new Date(dhakaDate.getTime() - 6 * 60 * 60 * 1000);
    return utcEnd;
  }
  const localDate = new Date(now);
  localDate.setHours(23, 59, 59, 999);
  return localDate;
}

