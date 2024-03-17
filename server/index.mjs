import express from "express";
import { Server } from "socket.io";
import http from "http";

const PORT = 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join", (data) => {
    socket.join(data);
    console.log(`joined room ID room: ${data}. userID: ${socket.id}`);
  });

  socket.on("message", (data) => {
    console.log("message received", data);
    socket.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
