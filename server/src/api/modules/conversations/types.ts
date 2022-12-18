import { MessageDocument } from "../messages/types";
import { UserDocument } from "../users/types";

export interface ConversationBody {
  type: "private" | "group";
  email: string;
  message: string;
}

export interface ConversationDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  type: "private" | "group";
  users?: UserDocument[];
  lastMessageSent?: MessageDocument;
}
