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

app.get("/current-game", async (req, res) => {
  try {
    const r = await fetch(
      "https://lichess.org/api/account/playing",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const data = await r.json();

    if (!data.nowPlaying || data.nowPlaying.length === 0) {
      return res.json({ playing: false });
    }

    const game = data.nowPlaying[0];

    res.json({
      playing: true,
      gameId: game.gameId,
      color: game.color,
      opponent: game.opponent.username,
      rated: game.rated,
      speed: game.speed
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch game" });
  }
});


app.listen(process.env.PORT || 3000);
    