"use client"

import { ActionIcon, Button, Flex, Loader } from "@mantine/core";
import Message from "../Message/Message";
import Chart from "../Chart/Chart";
import UserInput from "../UserInput/UserInput";
import NoMessages from "../NoMessages/NoMessages";
import { useQuery } from "@tanstack/react-query";
import { useSessionId } from "../../_utils/hooks/useSessionId";
import sessionAPI from "../../_services/SessionAPI";
import { ChatMessage } from "../../_models/ChatMessage";
import { v4 } from "uuid";
import { useScrollButton } from "../../_utils/hooks/useScrollButton";
import { useRef } from "react";
import { ArrowDownIcon } from "@radix-ui/react-icons";

export default function Chat() {
  const { sessionId } = useSessionId();
  const scrollableRef = useRef<HTMLDivElement>(null);

  const { ref, isInViewport, scrollIntoView } = useScrollButton(scrollableRef);

  const { error, data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["session"],
    queryFn: () => sessionAPI.getSession(sessionId as string),
    enabled: !!sessionId,
  });
  console.log(isInViewport)
  return (
    <Flex direction="column" h="100vh">
      <Flex
        direction="column"
        gap="md"
        p="1rem"
        style={{ overflowY: "auto", height: "calc(100vh - 180px)", position: "relative" }}
        ref={scrollableRef}
      >
        {!isInViewport && (
          <Button
            color="gray"
            onClick={() => scrollIntoView()}
            style={{
              position: "fixed",
              bottom: "130px",
              left: "50%",
              right: "50%",
              width: "fit-content",
            }}
            leftSection={
              <ArrowDownIcon />
            }
          >
            Scroll
          </Button>
        )}
        {(!messages || !messages.length) && <NoMessages />}
        {!!messages &&
          messages.map((message) => {
            if (message.id === "LOADING") {
              return <Message key={v4()} owner={"AI"} loading />;
            } else {
              return (
                <Message
                  key={message.id}
                  owner={message.message_type}
                  content={message.message_content}
                />
              );
            }
          })}
        <div ref={ref} />
      </Flex>
      <UserInput />
    </Flex>
  );
}
