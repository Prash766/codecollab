import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { EVENTS } from "./events";

const app = express();
const server = createServer(app);
const io = new Server(server);

const userSocketMap: Record<string, string> = {};
type ClientsMap = {
  socketid: string;
  username: string;
};

function getAllConnectClients(roomid: string): Array<ClientsMap> {
  const clients = Array.from(io.sockets.adapter.rooms.get(roomid) || []);
  return clients.map((socketid: string) => {
    return {
      socketid,
      username: userSocketMap[socketid],
    };
  });
}

io.on("connection", (socket) => {
  console.log(`Socket connected`, socket.id);

  socket.on(EVENTS.JOIN, ({ roomid, usernameRecoil }) => {
    userSocketMap[socket.id] = usernameRecoil;
    socket.join(roomid);
    const clients = getAllConnectClients(roomid);
    clients.forEach(({ socketid }) => {
      io.to(socketid).emit(EVENTS.JOINED, {
        clients,
        username: usernameRecoil,
        socketid: socket.id,
      });
    });
  });

  socket.on(EVENTS.CODE_CHANGE, ({ roomid, codeGet }) => {
    socket.in(roomid).emit(EVENTS.CODE_CHANGE, { codeGet });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    let Roomid = "";
    rooms.forEach((roomid) => {
      Roomid = roomid;
      socket.in(roomid).emit(EVENTS.DISCONNECTED, {
        socketid: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave(Roomid);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
