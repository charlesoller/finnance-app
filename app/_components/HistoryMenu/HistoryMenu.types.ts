import { SessionData } from '../../_models/SessionData';

export type HistoryGroup =
  | 'today'
  | 'yesterday'
  | 'prevSeven'
  | 'prevThirty'
  | 'past';

export type GroupedSessionData = {
  [K in HistoryGroup]: SessionData[];
};
