import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Data } from "../src/shared/types";

// Hilfsfunktionen um __dirname in ESM zu simulieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Statischer Ordner für HTML-Dateien
app.use(express.static(join(__dirname, "../", "dist")));

function initData() {
  const data: Data = { counter: 0 };
  return data;
}

const data = initData();

function updateData() {
  io.sockets.emit("updateData", data);
}

io.on("connection", (socket) => {
  console.log("\n✅ Neue Verbindung:", socket.id, socket.handshake.address);
  updateData();

  socket.on("disconnect", () => {
    console.log("❌ Verbindung getrennt:", socket.id, socket.handshake.address);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
