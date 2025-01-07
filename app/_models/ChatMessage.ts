import { MessageOwner } from "../_utils/types";

export interface ChatMessage {
  id: string;
  user_id: string;
  message_content: string;
  message_type: MessageOwner;
  session_id: string;
  timestamp: string;
}