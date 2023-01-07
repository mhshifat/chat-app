import { Socket } from 'socket.io';
import events from "events";
import { UserDocument } from '../api/modules/users/types';

const socketsMap = new Map();
export const eventEmitter = new events.EventEmitter();
export function handleSocketEvents(socket: Socket) {
  console.log("Socket events configed");

  socket.on("systemJoined", (userId) => {
    socketsMap.set(`users-${userId}`, socket);
  })
  
  socket.on("systemOut", (userId) => {
    socketsMap.delete(`users-${userId}`);
  })

  eventEmitter.on("onConversationCreate", (data) => {
    console.log("onConversationCreate", data);
  })

  eventEmitter.on("onMessageCreate", ({ message, conversation }) => {
    const users = conversation?.users?.filter?.((u: UserDocument) => String(u.id) !== String(message.writter.id)) || [];
    users.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket.emit("onMessageCreate", { message, conversation });
    });
  })

  socket.on('disconnect', () => {
    console.log(socket.id + ' user disconnected');
    const filteredSocket = [...socketsMap.entries()].find((array) => String(array[1].id) !== String(socket.id));
    if (filteredSocket) socketsMap.delete(filteredSocket[0]);
    eventEmitter.removeAllListeners();
  });
}