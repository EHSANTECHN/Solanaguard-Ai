import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SolGuard AI Backend Running 🚀");
});

app.post("/check", async (req, res) => {

  const { wallet } = req.body;

  try {

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

    res.json({
      wallet,
      transactions: txs.length,
      risk,
      score,
      reason: "AI analyzed on-chain wallet activity"
    });

  } catch (err) {

    res.status(500).json({
      error: "Failed to analyze wallet"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
