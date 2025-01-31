import { Button, Flex, Loader, Menu, Tabs, Text } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import sessionAPI from '../../_services/SessionAPI';
import { ChatMessage } from '../../_models/ChatMessage';
import { SessionData } from '../../_models/SessionData';
import styles from './HistoryMenu.module.css';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Nav from '../Nav/Nav';
import { formatTabName, groupSessions } from './HistoryMenu.utils';
import { TABS } from './HistoryMenu.consts';
import { useMemo } from 'react';
import { formatDate } from '../../_utils/utils';
import ErrorState from '../ErrorState/ErrorState';
import { GroupedSessionData } from './HistoryMenu.types';
import { useParams } from 'next/navigation';
import { useUserStore } from '../../_stores/UserStore';

export default function HistoryMenu() {
  const queryClient = useQueryClient();
  const { sessionId } = useParams();
  const { token } = useUserStore();

  const {
    error,
    isLoading,
    data: sessionData,
  } = useQuery<SessionData[]>({
    queryKey: ['sessionInfo'],
    queryFn: () => sessionAPI.getSessionInfo(token),
  });

  const groupedSessions = useMemo(
    () =>
      sessionData?.length
        ? groupSessions(sessionData)
        : ({} as GroupedSessionData),
    [sessionData],
  );

  const handleNavigation = (id: string) => {
    queryClient.setQueryData<ChatMessage[]>(
      ['session'],
      [
        {
          message_id: 'LOADING',
          user_id: '123',
          message_type: 'USER',
          message_content: '',
          session_id: id,
          timestamp: new Date().toISOString(),
        },
      ],
    );
  };

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button color="green">History</Button>
      </Menu.Target>
      <Menu.Dropdown className={styles.menu}>
        <Flex direction="column" justify="center">
          {isLoading && (
            <Loader color="green" m="lg" className={styles.loader} />
          )}
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
            <Flex>
              <Tabs defaultValue="today">
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
                  <Tabs.Panel key={tab} value={tab} className={styles.panel}>
                    {groupedSessions[tab].map((session) => (
                      <Nav
                        key={session.session_id}
                        href={`/chat/${session.session_id}`}
                        active={session.session_id === sessionId}
                        label={session.session_name}
                        rightSection={<ArrowRightIcon />}
                        onClick={() => handleNavigation(session.session_id)}
                        description={formatDate(session.updated_at)}
                      />
                    ))}
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Flex>
          )}
          {error && <ErrorState />}
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
}
