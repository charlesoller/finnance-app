import { Button, Menu } from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import sessionAPI from "../../_services/SessionAPI";
import Link from "next/link";
import { ChatMessage } from "../../_models/ChatMessage";
import { useSessionId } from "../../_utils/hooks/useSessionId";

export default function HistoryMenu() {
  const queryClient = useQueryClient();
  const { sessionId } = useSessionId();

  const { error, data: ids } = useQuery<string[]>({
    queryKey: ['sessions'],
    queryFn: () => sessionAPI.getSessionIds(),
  })
  
  const handleNavigation = () => {
    queryClient.setQueryData<ChatMessage[]>(['session'], [
      {
        id: 'LOADING',
        user_id: '123', 
        message_type: 'USER',
        message_content: '',
        session_id: sessionId as string,
        timestamp: new Date().toISOString()
      }
    ])
  }

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button>
          History
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {
          ids?.map(id => (
            <Link key={id} href={`/chat/${id}`}>
              <Menu.Item onClick={handleNavigation}>
                {id}
              </Menu.Item>
            </Link>
          ))
        }
      </Menu.Dropdown>
    </Menu>
  )
}