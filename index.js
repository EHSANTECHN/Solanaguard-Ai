import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("SolGuard AI Backend Running 🚀");
});

app.post("/check", async (req, res) => {

  const { wallet } = req.body;

  try {

    // Fetch Solana wallet transactions
    const url =
      `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=${process.env.HELIUS_API_KEY}`;

    const response = await fetch(url);

    const txs = await response.json();

    let score = 10;
    let risk = "Safe";

    if (txs.length > 20) {
      score = 45;
      risk = "Suspicious";
    }

    if (txs.length > 100) {
      score = 80;
      risk = "High Risk";
    }

    // AI Explanation
    const ai = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content:
            `Analyze this Solana wallet risk.
            Transactions: ${txs.length}
            Risk Score: ${score}
            Risk Level: ${risk}`
        }
      ]
    });

   const explanation =
  ai?.choices?.[0]?.message?.content ||
  "AI analysis unavailable";

 res.json({
  wallet: wallet || "Unknown",
  transactions: txs?.length || 0,
  risk: risk || "Unknown",
  score: score || 0,
  explanation:
    explanation || "No AI explanation"
});

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to analyze wallet"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
