import axios from "axios";
import { RegisterFormValues } from "../components/modules/auth/RegisterForm/RegisterForm";
import { LoginFormValues } from "../components/modules/auth/LoginForm/LoginForm";
import { UserDocument } from "../store/authSlice";
import { CreateConversationFormValues } from "../components/modules/Chat/CreateChatModal/CreateChatModal";
import { ConversationDocument } from "../store/conversationSlice";
import { GetMessagesParams, MessageDocument } from "../store/messageSlice";
import { CreateMessageFormValues, UpdateMessageFormValues } from "../components/modules/Chat/ChatMessagesHolder/ChatMessagesHolderInput";

const { REACT_APP_API_SERVER } = process.env;
export const httpClient = axios.create({
  baseURL: `http://${REACT_APP_API_SERVER}:8000`,
  withCredentials: true
});

export interface HttpResponse<T> {
  success: boolean;
  result: T
};

// Auth APIS
export const fetchLoggedInUser = () => httpClient
  .get<HttpResponse<UserDocument | null>>("/api/users/me");
export const signOutLoggedInUser = () => httpClient
  .delete<HttpResponse<UserDocument | null>>("/api/users/me");
export const registerUser = (values: RegisterFormValues) => httpClient
  .post<HttpResponse<UserDocument>>("/api/users/register", values);
export const loginUser = (values: LoginFormValues) => httpClient
  .post<HttpResponse<UserDocument>>("/api/users/login", values);

// Users API
export const getFriends = (query: string) => httpClient
  .get<HttpResponse<UserDocument[]>>("/api/users/friends", { params: { search: query } });

// Conversations API
export const getConversations = () => httpClient
  .get<HttpResponse<ConversationDocument[]>>("/api/conversations");
export const createConversation = (values: CreateConversationFormValues) => httpClient
  .post<HttpResponse<ConversationDocument>>("/api/conversations", values);

// Messages API
export const getMessages = (params: GetMessagesParams) => httpClient
  .get<HttpResponse<MessageDocument[]>>("/api/messages", {
    params
  });
export const createMessage = (values: CreateMessageFormValues) => httpClient
  .post<HttpResponse<MessageDocument>>("/api/messages", values);
export const updateMessage = (id: MessageDocument["id"], values: UpdateMessageFormValues) => httpClient
  .patch<HttpResponse<MessageDocument>>(`/api/messages/${id}`, values);
export const deleteMessage = (id: MessageDocument["id"]) => httpClient
  .delete<HttpResponse<MessageDocument>>(`/api/messages/${id}`);