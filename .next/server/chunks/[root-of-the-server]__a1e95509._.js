module.exports = {

"[project]/.next-internal/server/app/api/today-consumption/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
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
"[externals]/mongodb [external] (mongodb, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}}),
"[project]/src/lib/mongodb.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__,
    "getCollection": ()=>getCollection,
    "getDatabase": ()=>getDatabase,
    "getTodayConsumption": ()=>getTodayConsumption,
    "getTodayData": ()=>getTodayData,
    "insertDeviceData": ()=>insertDeviceData
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
if (!process.env.MONGO_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}
const uri = process.env.MONGO_URI;
const options = {};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = ("TURBOPACK ident replacement", globalThis);
    if (!globalWithMongo._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else //TURBOPACK unreachable
;
const __TURBOPACK__default__export__ = clientPromise;
async function getDatabase() {
    const client = await clientPromise;
    return client.db("tuya");
}
async function getCollection(collectionName = "device_data") {
    const db = await getDatabase();
    return db.collection(collectionName);
}
async function insertDeviceData(data) {
    const collection = await getCollection();
    return await collection.insertOne(data);
}
async function getTodayData(timezone = "Asia/Dhaka") {
    const collection = await getCollection();
    const todayStart = getTodayStartInTimezone(timezone);
    const todayEnd = getTodayEndInTimezone(timezone);
    console.log(`Today start (${timezone}): ${todayStart.toISOString()}`);
    console.log(`Today end (${timezone}): ${todayEnd.toISOString()}`);
    const pipeline = [
        {
            $match: {
                timestamp: {
                    $gte: todayStart,
                    $lte: todayEnd
                }
            }
        },
        {
            $unwind: "$status"
        },
        {
            $group: {
                _id: {
                    hour: {
                        $hour: {
                            date: "$timestamp",
                            timezone: "Asia/Dhaka"
                        }
                    },
                    code: "$status.code"
                },
                value: {
                    $avg: "$status.value"
                }
            }
        },
        {
            $group: {
                _id: "$_id.hour",
                data: {
                    $push: {
                        code: "$_id.code",
                        value: "$value"
                    }
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ];
    return await collection.aggregate(pipeline).toArray();
}
async function getTodayConsumption(timezone = "Asia/Dhaka") {
    const collection = await getCollection();
    const todayStart = getTodayStartInTimezone(timezone);
    const now = new Date();
    const pipeline = [
        {
            $match: {
                timestamp: {
                    $gte: todayStart,
                    $lte: now
                },
                "status.code": "switch_1",
                "status.value": true
            }
        },
        {
            $sort: {
                timestamp: 1
            }
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
                                                                                                    "switch_1"
                                                                                                ]
                                                                                            },
                                                                                            1
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            },
                                                                            0
                                                                        ]
                                                                    },
                                                                    cond: {
                                                                        $eq: [
                                                                            "$$this.code",
                                                                            "cur_power"
                                                                        ]
                                                                    }
                                                                }
                                                            },
                                                            0
                                                        ]
                                                    },
                                                    {
                                                        value: 0
                                                    }
                                                ]
                                            }.value,
                                            0
                                        ]
                                    },
                                    1000
                                ]
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
                                                                                    "switch_1"
                                                                                ]
                                                                            },
                                                                            1
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            0
                                                        ]
                                                    },
                                                    {
                                                        $arrayElemAt: [
                                                            "$timestamp",
                                                            0
                                                        ]
                                                    }
                                                ]
                                            },
                                            3600000
                                        ]
                                    },
                                    1
                                ]
                            }
                        ]
                    }
                },
                dataPoints: {
                    $sum: 1
                }
            }
        }
    ];
    const result = await collection.aggregate(pipeline).toArray();
    if (result.length === 0) {
        return {
            kwh: 0,
            cost: 0,
            dataPoints: 0,
            message: "No AC ON data found for today"
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
            timezone: timezone
        },
        rate: 10,
        calculationMethod: "Only AC ON Intervals (Riemann Sum)"
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
}),
"[project]/src/app/api/today-consumption/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const timezone = searchParams.get("timezone") || "Asia/Dhaka";
        const consumption = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTodayConsumption"])(timezone);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: consumption
        });
    } catch (error) {
        console.error("Error calculating today's consumption:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to calculate today's consumption",
            details: error.message
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a1e95509._.js.map