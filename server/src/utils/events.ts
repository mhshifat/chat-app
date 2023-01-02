import { Socket } from 'socket.io';
import EventEmitter from "events";

export const eventEmitter = new EventEmitter();
export function handleSocketEvents(socket: Socket) {
  console.log("Socket events configed");

  eventEmitter.on("onConversationCreate", (data) => {
    console.log("onConversationCreate", data);
  })
}