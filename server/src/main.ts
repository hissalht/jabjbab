import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
  serveClient: false,
});

io.on("connection", (socket) => {
  console.log("Socket connected with id", socket.id);

  const ROOM = "the-room";
  socket.join(ROOM);

  socket.on("sdp-offer", (offer: any) => {
    console.log("🚀 ~ file: main.ts ~ line 19 ~ socket.on ~ offer", offer);
    socket.to(ROOM).emit("sdp-offer", offer);
  });

  socket.on("sdp-answer", (answer: any) => {
    console.log("🚀 ~ file: main.ts ~ line 24 ~ socket.on ~ answer", answer);
    socket.to(ROOM).emit("sdp-answer", answer);
  });

  socket.on("ice-candidate", (offer: any) => {
    console.log("🚀 ~ file: main.ts ~ line 27 ~ socket.on ~ offer", offer);
    socket.to(ROOM).emit("ice-candidate", offer);
  });
});

function emitRoomUpdate(room: string, id: string) {
  if (room === id) {
    return;
  }
  const sockets = io.of("/").adapter.rooms.get(room)!;
  io.to(room).emit("room-update", {
    room,
    sockets: Array.from(sockets.values()),
  });
}

io.of("/").adapter.on("join-room", emitRoomUpdate);
io.of("/").adapter.on("leave-room", emitRoomUpdate);

io.listen(4000);
console.log("Listening on port", 4000);
