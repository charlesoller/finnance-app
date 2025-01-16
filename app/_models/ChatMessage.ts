import { MessageOwner } from '../_utils/types';
import { GraphResponse } from './ChartData';

export interface ChatMessage {
  message_id: string;
  user_id: string;
  message_content: string;
  message_type: MessageOwner;
  session_id: string;
  timestamp: string;
  graph_data?: GraphResponse;
}
