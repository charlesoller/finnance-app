import {
  Button,
  Divider,
  Flex,
  Loader,
  SegmentedControl,
  Tabs,
  Text,
  Tooltip,
} from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import sessionAPI from '../../_services/SessionAPI';
import { SessionData } from '../../_models/SessionData';
import styles from './HistoryMenu.module.css';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Nav from '../Nav/Nav';
import { getDefaultTab, groupSessions, hasData } from './HistoryMenu.utils';
import { TABS } from './HistoryMenu.consts';
import { useMemo, useState } from 'react';
import { formatDate } from '../../_utils/utils';
import ErrorState from '../ErrorState/ErrorState';
import { GroupedSessionData, HistoryGroup } from './HistoryMenu.types';
import { useUserStore } from '../../_stores/UserStore';
import {
  SESSION_INFO_KEY,
  SESSION_KEY,
} from '../../_utils/_hooks/_mutations/queryKeys';
import { useSessionId } from '../../_utils/_hooks/useSessionId';
import { useRouter } from 'next/navigation';

export default function HistoryMenu() {
  const queryClient = useQueryClient();
  const { sessionId } = useSessionId();
  const { token } = useUserStore();
  const router = useRouter();

  const [date, setDate] = useState<HistoryGroup>('today');

  const {
    error,
    isLoading,
    data: sessionData,
  } = useQuery<SessionData[]>({
    queryKey: [SESSION_INFO_KEY],
    queryFn: () => sessionAPI.getSessionInfo(token),
  });

  const groupedSessions = useMemo(() => {
    if (!sessionData?.length) {
      return {} as GroupedSessionData;
    }

    const grouped = groupSessions(sessionData);
    const defaultDate = getDefaultTab(grouped);
    setDate(defaultDate);

    return grouped;
  }, [sessionData]);

  const handleNavigation = () => {
    setTimeout(
      () => queryClient.invalidateQueries({ queryKey: [SESSION_KEY] }),
      200,
    );
  };

  const handleNewSession = () => {
    router.push('/chat');
    handleNavigation();
  };

  return (
    <Flex direction="column" justify="center" w="100%" p="sm">
      <div>
        <Button w="100%" color="green" onClick={handleNewSession}>
          + New Session
        </Button>
        <Divider my="md" />
        {isLoading && <Loader color="green" m="lg" className={styles.loader} />}
        {!isLoading && !error && !sessionData?.length && (
          <Flex
            p="sm"
            gap="xs"
            direction="column"
            justify="center"
            align="center"
          >
            <Text size="md" ta="center">
              No Session History
            </Text>
            <Text c="dimmed" size="xs" ta="center">
              Ask some questions to see your chat history here
            </Text>
          </Flex>
        )}
      </div>
      {!isLoading && !!Object.keys(groupedSessions).length && (
        <Flex h="100%" style={{ overflowY: 'auto' }}>
          <Tabs value={date} w="100%">
            <SegmentedControl
              value={date}
              mb="xs"
              w="100%"
              data={[
                {
                  value: 'today',
                  disabled: !hasData(groupedSessions['today']),
                  label: (
                    <Tooltip
                      disabled={hasData(groupedSessions['today'])}
                      label="You don't have any chat sessions from today"
                    >
                      <Text size="sm">Today</Text>
                    </Tooltip>
                  ),
                },
                {
                  value: 'prevSeven',
                  disabled: !hasData(groupedSessions['prevSeven']),
                  label: (
                    <Tooltip
                      disabled={hasData(groupedSessions['prevSeven'])}
                      label="You don't have any chat sessions from the past week"
                    >
                      <Text size="sm">This Week</Text>
                    </Tooltip>
                  ),
                },
                {
                  value: 'past',
                  disabled: !hasData(groupedSessions['past']),
                  label: (
                    <Tooltip
                      disabled={hasData(groupedSessions['past'])}
                      label="You don't have any chat sessions from more than 7 days ago"
                    >
                      <Text size="sm">Past</Text>
                    </Tooltip>
                  ),
                },
              ]}
              onChange={(v) => setDate(v as HistoryGroup)}
            />

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
