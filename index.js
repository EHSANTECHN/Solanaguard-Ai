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

  // temporary logic
  const score = Math.floor(Math.random() * 100);

  let risk = "Safe";

  if (score > 70) {
    risk = "High Risk";
  } else if (score > 30) {
    risk = "Suspicious";
  }

  res.json({
    wallet,
    risk,
    score,
    reason: "Initial AI-based wallet analysis"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
