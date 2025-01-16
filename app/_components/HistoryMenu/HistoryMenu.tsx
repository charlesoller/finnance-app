import { Button, Menu } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import sessionAPI from '../../_services/SessionAPI';
import Link from 'next/link';
import { ChatMessage } from '../../_models/ChatMessage';
import { useSessionId } from '../../_utils/hooks/useSessionId';
import { SessionData } from '../../_models/SessionData';

export default function HistoryMenu() {
  const queryClient = useQueryClient();
  const { sessionId } = useSessionId();

  const { error, data: sessionData } = useQuery<SessionData[]>({
    queryKey: ['sessions'],
    queryFn: () => sessionAPI.getSessionInfo(),
  });

  const handleNavigation = () => {
    queryClient.setQueryData<ChatMessage[]>(
      ['session'],
      [
        {
          message_id: 'LOADING',
          user_id: '123',
          message_type: 'USER',
          message_content: '',
          session_id: sessionId as string,
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
      <Menu.Dropdown>
        {sessionData?.map((session) => (
          <Link key={session.session_id} href={`/chat/${session.session_id}`}>
            <Menu.Item onClick={handleNavigation}>
              {session.session_name}
            </Menu.Item>
          </Link>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
