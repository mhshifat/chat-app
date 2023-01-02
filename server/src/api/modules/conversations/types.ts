import { MessageDocument } from "../messages/types";
import { UserDocument } from "../users/types";

export interface ConversationBody {
  type: "private" | "group";
  email: string;
  message: string;
  name?: string;
}

export interface ConversationDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  type: "private" | "group";
  creator?: UserDocument;
  users?: UserDocument[];
  lastMessageSent?: MessageDocument;
  name?: string;
}
