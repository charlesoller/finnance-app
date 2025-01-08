"use client"

import { Flex } from "@mantine/core";
import Message from "../Message/Message";
import Chart from "../Chart/Chart";
import UserInput from "../UserInput/UserInput";
import NoMessages from "../NoMessages/NoMessages";
import { useQuery } from "@tanstack/react-query";
import { useSessionId } from "../../_utils/hooks/useSessionId";
import sessionAPI from "../../_services/SessionAPI";
import { ChatMessage } from "../../_models/ChatMessage";
import { v4 } from "uuid";

export default function Chat() {
  const sessionId = useSessionId();

  const { error, data: messages } = useQuery<ChatMessage[]>({
    queryKey: ['session'],
    queryFn: () => sessionAPI.getSession(sessionId as string),
    enabled: !!sessionId
  })

  return (
    <Flex direction="column" h="100vh">
      <Flex
        direction="column"
        gap="md"
        p={'1rem'}
        style={{ overflowY: 'auto', height: 'calc(100vh - 180px)' }}
      >
        {(!messages || !messages.length) && <NoMessages />}
        {
          !!messages && messages.map(message => {
            if (message.id === "LOADING") {
              return <Message key={v4()} owner={"AI"} loading />
            } else {
              return <Message key={message.id} owner={message.message_type} content={message.message_content} />
            }
          })
        }
      </Flex>
      <UserInput />
    </Flex>

  )
}