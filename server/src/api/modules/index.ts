import { userRouter } from "./users";
import { messageRouter } from "./messages";
import { conversationRouter } from "./conversations";

export const API_ROUTES = {
  "users": userRouter,
  "messages": messageRouter,
  "conversations": conversationRouter,
}