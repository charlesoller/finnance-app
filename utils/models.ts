import { MessageOwner } from "./types";

export interface GenerationRequest {
  user_id: string;
  session_id: string;
  message_content: string;
  history: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message_content: string;
  message_type: MessageOwner;
  session_id: string;
  timestamp: string;
}