import { ConversationDocument } from '../conversations/types';

export interface CreateMessageBody {
  conversationId: string;
  message: string;
}

export interface MessageDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  message: string;
  conversation?: ConversationDocument;
}
