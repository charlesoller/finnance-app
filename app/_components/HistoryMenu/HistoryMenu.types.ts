import { SessionData } from '../../_models/SessionData';

export type HistoryGroup = 'today' | 'prevSeven' | 'past';

export type GroupedSessionData = {
  [K in HistoryGroup]: SessionData[];
};
