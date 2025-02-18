import { Flex, Loader, Tabs, Text } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import sessionAPI from '../../_services/SessionAPI';
import { SessionData } from '../../_models/SessionData';
import styles from './HistoryMenu.module.css';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Nav from '../Nav/Nav';
import {
  formatTabName,
  getDefaultTab,
  groupSessions,
} from './HistoryMenu.utils';
import { TABS } from './HistoryMenu.consts';
import { useMemo } from 'react';
import { formatDate } from '../../_utils/utils';
import ErrorState from '../ErrorState/ErrorState';
import { GroupedSessionData } from './HistoryMenu.types';
import { useUserStore } from '../../_stores/UserStore';
import {
  SESSION_INFO_KEY,
  SESSION_KEY,
} from '../../_utils/_hooks/_mutations/queryKeys';
import { useSessionId } from '../../_utils/_hooks/useSessionId';

export default function HistoryMenu() {
  const queryClient = useQueryClient();
  const { sessionId } = useSessionId();
  const { token } = useUserStore();

  const {
    error,
    isLoading,
    data: sessionData,
  } = useQuery<SessionData[]>({
    queryKey: [SESSION_INFO_KEY],
    queryFn: () => sessionAPI.getSessionInfo(token),
  });

  const groupedSessions = useMemo(
    () =>
      sessionData?.length
        ? groupSessions(sessionData)
        : ({} as GroupedSessionData),
    [sessionData],
  );

  const handleNavigation = () => {
    // queryClient.setQueryData([SESSION_KEY], [])
    setTimeout(
      () => queryClient.invalidateQueries({ queryKey: [SESSION_KEY] }),
      200,
    );
  };

  return (
    <Flex
      direction="column"
      justify="center"
      w="100%"
      p="sm"
      style={{ overflowY: 'auto' }}
    >
      {isLoading && <Loader color="green" m="lg" className={styles.loader} />}
      {!isLoading && !error && !sessionData?.length && (
        <Flex
          p="sm"
          gap="xs"
          direction="column"
          justify="center"
          align="center"
        >
          <Text size="md">No Session History</Text>
          <Text c="dimmed" size="xs">
            Ask some questions to see your chat history here
          </Text>
        </Flex>
      )}
      {!isLoading && !!Object.keys(groupedSessions).length && (
        <Flex h="100%">
          <Tabs defaultValue={getDefaultTab(groupedSessions)} w="100%">
            <Tabs.List mb="xs">
              {TABS.map(
                (tab) =>
                  // Only renders a tab if that tab would have content
                  !!groupedSessions[tab].length && (
                    <Tabs.Tab
                      key={tab}
                      value={tab}
                      size="xs"
                      p="xs"
                      className={styles.tab}
                      color="green"
                    >
                      {formatTabName(tab)}
                    </Tabs.Tab>
                  ),
              )}
            </Tabs.List>

            {TABS.map((tab) => (
              <Tabs.Panel key={tab} value={tab}>
                {groupedSessions[tab].map((session) => (
                  <Nav
                    key={session.session_id}
                    href={`/chat?sessionId=${session.session_id}`}
                    active={session.session_id === sessionId}
                    label={session.session_name}
                    rightSection={<ArrowRightIcon />}
                    onClick={handleNavigation}
                    description={formatDate(session.updated_at)}
                    w="100%"
                  />
                ))}
              </Tabs.Panel>
            ))}
          </Tabs>
        </Flex>
      )}
      {error && <ErrorState />}
    </Flex>
  );
}
