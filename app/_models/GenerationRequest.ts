import { ChatMessage } from './ChatMessage';

export interface GenerationRequest {
  user_id: string;
  session_id: string;
  message_content: string;
  history: ChatMessage[];
  use_graph: boolean;
}
