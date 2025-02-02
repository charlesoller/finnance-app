import {
  parseISO,
  isToday,
  isYesterday,
  isWithinInterval,
  subDays,
} from 'date-fns';
import { SessionData } from '../../_models/SessionData';
import { GroupedSessionData, HistoryGroup } from './HistoryMenu.types';
import { capitalize, utcToLocal } from '../../_utils/utils';

export const groupSessions = (sessions: SessionData[]): GroupedSessionData => {
  const today = new Date();
  const yesterday = subDays(today, 1);
  const sevenDaysAgo = subDays(today, 7);
  const thirtyDaysAgo = subDays(today, 30);

  const grouped = {
    today: [] as SessionData[],
    yesterday: [] as SessionData[],
    prevSeven: [] as SessionData[],
    prevThirty: [] as SessionData[],
    past: [] as SessionData[],
  };

  // Breaking into groups
  sessions.forEach((session) => {
    const updatedAt = utcToLocal(session.updated_at);

    if (isToday(updatedAt) || updatedAt > today) {
      grouped.today.push(session);
    } else if (isYesterday(updatedAt)) {
      grouped.yesterday.push(session);
    } else if (
      isWithinInterval(updatedAt, { start: sevenDaysAgo, end: yesterday })
    ) {
      grouped.prevSeven.push(session);
    } else if (
      isWithinInterval(updatedAt, { start: thirtyDaysAgo, end: sevenDaysAgo })
    ) {
      grouped.prevThirty.push(session);
    } else {
      grouped.past.push(session);
    }
  });

  // Sorting by most recent
  Object.keys(grouped).forEach((group) => {
    grouped[group as keyof GroupedSessionData].sort((a, b) => {
      const aDate = parseISO(String(a.updated_at));
      const bDate = parseISO(String(b.updated_at));
      return bDate.getTime() - aDate.getTime(); // Sort in descending order
    });
  });

  return grouped;
};

export const formatTabName = (groupName: HistoryGroup) => {
  if (groupName === 'prevSeven') {
    return 'Last 7 Days';
  }
  if (groupName === 'prevThirty') {
    return 'Last 30 Days';
  }
  return capitalize(groupName);
};

export const getDefaultTab = (data: GroupedSessionData): HistoryGroup => {
  if (data.today.length) return 'today';
  if (data.yesterday.length) return 'yesterday';
  if (data.prevSeven.length) return 'prevSeven';
  if (data.prevThirty.length) return 'prevThirty';
  return 'past';
};
