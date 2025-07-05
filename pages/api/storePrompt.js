import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    console.log("Received request:", req.method, req.body);

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed. Use POST instead." });
    }

    try {
        const { dataPoints, features, context, distribution, outputFormat, timestamp } = req.body;

       
        if (!dataPoints || !features || !distribution || !outputFormat) {
            console.error("❌ Missing required fields:", req.body);
            return res.status(400).json({ message: "Missing required fields. Ensure all fields are provided." });
        }

        
        const { db } = await connectToDatabase(); 

        if (!db) {
            console.error("❌ MongoDB connection failed!");
            return res.status(500).json({ message: "MongoDB connection failed." });
        }

       
        const collection = db.collection("requests");

       
        const newRequest = {
            dataPoints: Number(dataPoints),
            features: features.trim(),
            context: context?.trim() || "N/A",
            distribution,
            outputFormat,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
        };

        // ✅ Insert into MongoDB
        const result = await collection.insertOne(newRequest);

        console.log("✔ Successfully inserted request:", result.insertedId);

        res.status(201).json({ message: "Request stored successfully!", id: result.insertedId });

    } catch (error) {
        console.error("❌ MongoDB Insert Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
