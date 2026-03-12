import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Data } from "../src/shared/types";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../src/shared/socketEvents";

import dgram from "node:dgram";
import { Buffer } from "node:buffer";

import net from "net";

import rtpmidi from "./node-rtpmidi";

// Hilfsfunktionen um __dirname in ESM zu simulieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LIGHT_IP = "0.0.0.0";
const LIGHT_PORT = 6004;

const AUDIO_IP = "127.0.0.1";
const AUDIO_PORT = 5004;

const GFX_IP = "127.0.0.1";
const GFX_PORT = 7788;

//for grandma communication
const udpClient = dgram.createSocket("udp4");

//for xpression communication
const tcpClient = new net.Socket();

//for audio communication
const rtpmidiSession = rtpmidi.manager.createSession({
  localName: "Buzzer",
  bonjourName: "Node Buzzer",
  port: 5006,
});

rtpmidiSession.end(() => {
  console.log("rtp midi rtpmidiSession ended");
});

//TEST COMMANDS VIA LOOP OUT SERVER
//---
// var tcpServer = net.createServer(function (socket) {
//   socket.write("Echo server\r\n");
//   socket.pipe(socket);
// });

// tcpServer.on("connection", (socket) => {
//   console.log("CONNECTED: " + socket.remoteAddress + ":" + socket.remotePort);
//   socket.on("data", function (data) {
//     console.log(`${data}`);
//   });
// });

// tcpServer.listen(GFX_PORT, GFX_IP);

// udpClient.bind({
//   address: LIGHT_IP,
//   port: LIGHT_PORT,
// });

// udpClient.on("message", (msg, rinfo) => {
//   console.log(
//     `server got: ${Buffer.from(msg.buffer)} from ${rinfo.address}:${rinfo.port}`,
//   );
// });
//---
//TEST COMMANDS VIA LOOP OUT SERVER

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Statischer Ordner für HTML-Dateien
app.use(express.static(join(__dirname, "../", "dist")));

function initData() {
  const data: Data = {
    counter: 0,
    stopwatches: [
      {
        milliseconds: 0,
        isRunning: false,
      },
      {
        milliseconds: 0,
        isRunning: false,
      },
    ],
  };
  return data;
}

const data = initData();

rtpmidiSession.connect({ address: AUDIO_IP, port: AUDIO_PORT });

tcpClient.connect(GFX_PORT, GFX_IP, () => {
  console.log("connected to Xpression!");
  onBuzzerPressed(0);
});

tcpClient.on("error", (error) => {
  console.log("trying to connect ot xpression", error);
});

function updateData() {
  io.sockets.emit("updateData", data);
}

function startStopwatch(index: number) {
  if (index < 0 || index > 1) return;
  const stopwatch = data.stopwatches[index];

  if (stopwatch.isRunning) return;
  stopwatch.isRunning = true;
  stopwatch.startTime = Date.now() - stopwatch.milliseconds;

  io.sockets.emit("updateStopwatch", index, stopwatch);
}

function pauseStopwatch(index: number) {
  if (index < 0 || index > 1) return;
  const stopwatch = data.stopwatches[index];
  if (!stopwatch.isRunning) return;
  // Calculate final milliseconds based on when it started
  const now = Date.now();
  if (stopwatch.startTime !== null) {
    stopwatch.milliseconds = now - stopwatch.startTime!;
  }
  stopwatch.isRunning = false;

  io.sockets.emit("updateStopwatch", index, stopwatch);
}

function stopStopwatch(index: number) {
  if (index < 0 || index > 1) return;
  const stopwatch = data.stopwatches[index];
  stopwatch.milliseconds = 0;
  stopwatch.isRunning = false;
  stopwatch.startTime = undefined;

  io.sockets.emit("updateStopwatch", index, stopwatch);
}

function onBuzzerPressed(buzzerIndex: number) {
  console.log("buzzer Pressed", buzzerIndex);

  pauseStopwatch(buzzerIndex);
  triggerLight(buzzerIndex);
  triggerAudio(buzzerIndex);
  triggerGFX(buzzerIndex);

  function triggerLight(buzzerIndex: number) {
    const grandMA2MSC = Buffer.from([
      0x47, 0x4d, 0x41, 0x00, 0x4d, 0x53, 0x43, 0x00,
    ]);
    const messageLength = Buffer.from([0x13, 0x00, 0x00, 0x00]);
    const macroIndex = buzzerIndex === 0 ? 0x01 : 0x02;
    const command = Buffer.from([
      0xf0,
      0x7f,
      0x7f,
      0x02,
      0x7f,
      0x07,
      macroIndex,
      0xf7,
    ]);

    //trigger macro 1 on grandma via MSC over ethernet
    udpClient.send(
      [grandMA2MSC, messageLength, command],
      LIGHT_PORT,
      LIGHT_IP,
      (err) => {
        if (err) {
          console.log("error sending message to light!", err);
        } else {
          console.log("light message send!");
        }
        // udpClient.close();
      },
    );
  }

  function triggerAudio(buzzerIndex: number) {
    const noteIndex = buzzerIndex === 0 ? 0x00 : 0x01;
    const velocity = 0x7f; //vollausschlag
    const noteOn = 0x90;
    const noteOff = 0x80;
    rtpmidiSession.sendMessage([noteOn, noteIndex, velocity]);
    //rtpmidiSession.sendMessage([noteOff, noteIndex, velocity]);
  }

  function triggerGFX(buzzerIndex: number) {
    const takeid = 1;
    const buffer = 0;
    const layer = 1;

    //trigger XPression graphic via RossTalk (TCP Message ASCII encoded)
    try {
      tcpClient.write(`TAKE ${takeid}:${buffer}:${layer}`);
    } catch (error) {
      console.log(error);
    }
  }
}

io.on("connection", (socket) => {
  console.log("\n✅ Neue Verbindung:", socket.id, socket.handshake.address);
  updateData();

  socket.on("stopwatchPlay", (index) => {
    console.log(`▶️ Stopwatch ${index} started`);
    startStopwatch(index);
  });

  socket.on("stopwatchPause", (index) => {
    console.log(`⏸️ Stopwatch ${index} paused`);
    pauseStopwatch(index);
  });

  socket.on("stopwatchStop", (index) => {
    console.log(`⏹️ Stopwatch ${index} stopped`);
    stopStopwatch(index);
  });

  socket.on("buzzerPressed", (buzzerIndex) => {
    onBuzzerPressed(buzzerIndex);
  });

  socket.on("disconnect", () => {
    console.log("❌ Verbindung getrennt:", socket.id, socket.handshake.address);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
