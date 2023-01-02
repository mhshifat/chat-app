import { ConversationDocument } from '../conversations/types';
import { UserDocument } from '../users/types';

export interface CreateMessageBody {
  conversationId: string;
  message: string;
  writter?: UserDocument;
}

export interface MessageDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  message: string;
  conversation?: ConversationDocument;
}

export interface GetConversationMessagesParams {
  conversationId: string;
}
