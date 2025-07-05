import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const client = await clientPromise;
        const db = client.db("SynJana-Test");
        const collection = db.collection("requests");

        const requests = await collection.find({}).sort({ timestamp: -1 }).toArray();
        res.status(200).json(requests);

    } catch (error) {
        console.error("MongoDB Error:", error);
        res.status(500).json({ error: "Failed to retrieve requests" });
    }
}
