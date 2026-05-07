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

  try {

    const { wallet } = req.body;

    const heliusUrl =
      `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=${process.env.HELIUS_API_KEY}`;

    const txResponse =
      await fetch(heliusUrl);

    const txs =
      await txResponse.json();

    const txCount =
      Array.isArray(txs) ? txs.length : 0;

    let risk = "Safe";
    let score = 10;

    if (txCount > 20) {
      risk = "Suspicious";
      score = 45;
    }

    if (txCount > 100) {
      risk = "High Risk";
      score = 80;
    }

    let explanation =
      "Wallet appears normal.";

    try {

      const ai =
        await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [
          {
            role: "user",
            content:
              `Analyze this Solana wallet.

              Transactions: ${txCount}
              Risk: ${risk}
              Score: ${score}`
          }
        ]

      });

      explanation =
        ai?.choices?.[0]?.message?.content ||
        explanation;

    } catch (aiError) {

      console.log(aiError);

      explanation =
        "AI explanation unavailable.";

    }

    res.json({

      wallet,

      transactions: txCount,

      risk,

      score,

      explanation

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Backend failed"
    });

  }

});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});
