import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.LICHESS_TOKEN;

app.post("/move", async (req, res) => {
  const { gameId, uci } = req.body;

  const r = await fetch(
    `https://lichess.org/api/board/game/${gameId}/move/${uci}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );

  res.sendStatus(r.ok ? 200 : 500);
});

app.get("/stream/:gameId", async (req, res) => {
  const r = await fetch(
    `https://lichess.org/api/board/game/stream/${req.params.gameId}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
  );

  res.setHeader("Content-Type", "application/x-ndjson");
  r.body.pipe(res);
});

app.get("/", (_, res) => res.send("Backend alive"));

app.listen(process.env.PORT || 3000);
    