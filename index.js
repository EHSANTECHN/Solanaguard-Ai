import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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
      Array.isArray(txs)
        ? txs.length
        : 0;

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

    let explanation = "";

    if (risk === "Safe") {

      explanation =
        "✅ This wallet shows normal transaction behavior with low suspicious activity.";

    }

    else if (risk === "Suspicious") {

      explanation =
        "⚠️ This wallet has unusually high transaction activity and should be reviewed carefully before interacting.";

    }

    else if (risk === "High Risk") {

      explanation =
        "🚨 This wallet demonstrates risky transaction patterns often associated with scam or malicious activity.";

    }

    res.json({

      wallet,

      transactions: txCount,

      risk,

      score,

      explanation

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      error: "Failed to analyze wallet"

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
