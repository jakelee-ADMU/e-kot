const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// simple in-memory store for now (swap to Redis later)
const store = new Map();

app.get("/positions", (_req, res) => {
  res.json([...store.values()]);
});

app.post("/ingest", (req, res) => {
  const { id, lat, lng, timestamp } = req.body || {};
  if (!id || typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "bad payload" });
  }
  const pos = { id, lat, lng, updatedAt: timestamp ?? Date.now() };
  store.set(id, pos);
  io.emit("locationUpdate", pos);
  res.json({ ok: true });
});

io.on("connection", () => console.log("socket client connected"));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("API listening on " + PORT));
