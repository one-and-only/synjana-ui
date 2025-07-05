
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const { prompt } = req.body;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "system", content: "You are a data generator AI." }, { role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
  
      const data = await response.json();
      const generatedData = data.choices?.[0]?.message?.content || "Error generating data.";
  
      res.status(200).json({ generatedData });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data from OpenAI" });
    }
  }
  