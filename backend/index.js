import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from 'node:path';
import { Server } from 'socket.io';
import { Socket } from 'node:dgram';

import cors from "cors";
const app = express();

app.use(cors({
  origin: "*",
}));



const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const __dirname = dirname(fileURLToPath(import.meta.url));

// serve frontend
app.use(express.static(path.join(__dirname, 'public')));

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return  Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
     (socketId) => {
      return {
        socketId,
        username :userSocketMap[socketId],
      }
     }
  ) //
}

//connection is instatiated to be ma



//fixed
io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);

  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log(clients)
    console.log(roomId)

    // broadcast to everyone in room
    io.to(roomId).emit("joined", {
      clients,
      username,
      socketId: socket.id,
    });
  });

  socket.on("disconnecting", () => {
    const username = userSocketMap[socket.id];

    // remove user BEFORE recalculating clients
    delete userSocketMap[socket.id];

    socket.rooms.forEach((roomId) => {
      if (roomId === socket.id) return;

      const clients = getAllConnectedClients(roomId);

      io.to(roomId).emit("disconnected", {
        socketId: socket.id,
        username,
        clients,
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected : ${socket.id}`);
  });

  
  //code sync logic
  socket.on("code-change",({roomId,code})=>{
    // console.log("code recieve dfrom" , roomId);
    // console.log("code length ", code.length)
     socket.to(roomId).emit("code-changed", { code });
  })

  // here i listend to the new joinee and sending the code to him
  socket.on("sync-code",({code,socketId})=>{
    io.to(socketId).emit("code-changed", { code });
  })


});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server is running at port : ${PORT}`);
});

