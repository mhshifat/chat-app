import { Socket } from 'socket.io';
import events from "events";
import { UserDocument } from '../api/modules/users/types';

const socketsMap = new Map();
export const eventEmitter = new events.EventEmitter();
export function handleSocketEvents(socket: Socket) {
  console.log("Socket events configed");
  eventEmitter.removeAllListeners();

  socket.on("systemJoined", (userId) => {
    socketsMap.set(`users-${userId}`, socket);
    console.log("socketsMapJoin", [...socketsMap.entries()].map(array => [array[0], array[1].id]));
  })
  
  socket.on("systemOut", (userId) => {
    socketsMap.delete(`users-${userId}`);
    console.log("socketsMapLeave", [...socketsMap.entries()].map(array => [array[0], array[1].id]));
  })

  eventEmitter.on("onConversationCreate", (conversation) => {
    const users = conversation?.users?.filter?.((u: UserDocument) => String(u.id) !== String(conversation.creator.id)) || [];
    users.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket?.emit?.("onConversationCreate", conversation);
    });
  })

  eventEmitter.on("onParticipentAddToConversationCreate", (conversation) => {
    const users = conversation?.users?.filter?.((u: UserDocument) => String(u.id) !== String(conversation.creator.id)) || [];
    users.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket?.emit?.("onParticipentAddToConversationCreate", conversation);
    });
  })

  eventEmitter.on("onMessageCreate", ({ message, conversation }) => {
    const users = conversation?.users?.filter?.((u: UserDocument) => String(u.id) !== String(message.writter.id)) || [];
    users.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket?.emit?.("onMessageCreate", { message, conversation });
    });
  })

  eventEmitter.on("onMessageUpdate", ({ message, conversation }) => {
    const users = conversation?.users?.filter?.((u: UserDocument) => String(u.id) !== String(message.writter.id)) || [];
    users.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket?.emit?.("onMessageUpdate", { message, conversation });
    });
  })

  eventEmitter.on("onMessageDelete", ({ message, conversation }) => {
    const users = conversation?.users?.filter?.((u: UserDocument) => String(u.id) !== String(message.writter.id)) || [];
    users.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket?.emit?.("onMessageDelete", { message, conversation });
    });
  })

  socket.on('isTyping', ({ typingUser, toUsers, conversation }) => {
    toUsers.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket?.emit("isTyping", { typingUser, conversation });
    })
  })

  socket.on('stopedTyping', ({ toUsers, conversation }) => {
    toUsers.forEach((u: UserDocument) => {
      const uSocket = socketsMap.get(`users-${u.id}`);
      uSocket?.emit("stopedTyping", { conversation });
    })
  })

  socket.on('getOnlineUsers', (socketId) => {
    const [userIdentifier, userSocket] = [...socketsMap.entries()].find((array) => String(array[1].id) === String(socketId)) || [];
    if (!userIdentifier || !userSocket) return;
    const onlineUsersId = [...socketsMap.entries()].map(array => array[0]).map(text => text.split("-")[1]);
    
    userSocket.emit("getOnlineUsers", onlineUsersId);
  })

  socket.on('disconnect', () => {
    console.log(socket.id + ' user disconnected');
    const filteredSocket = [...socketsMap.entries()].find((array) => String(array[1].id) === String(socket.id));
    if (filteredSocket) socketsMap.delete(filteredSocket[0]);
    console.log("socketsMapDis", [...socketsMap.entries()].map(array => [array[0], array[1].id]));
    eventEmitter.removeAllListeners();
  });
}