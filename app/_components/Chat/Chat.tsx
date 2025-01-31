'use client';

import { Flex, Loader } from '@mantine/core';
import Message from '../Message/Message';
import Chart from '../Chart/Chart';
import UserInput from '../UserInput/UserInput';
import NoMessages from '../NoMessages/NoMessages';
import { useQuery } from '@tanstack/react-query';
import { useSessionId } from '../../_utils/hooks/useSessionId';
import sessionAPI from '../../_services/SessionAPI';
import { ChatMessage } from '../../_models/ChatMessage';
import { useEffect, useRef } from 'react';
import ScrollButton from '../ScrollButton/ScrollButton';
import { useScrollButton } from '../../_utils/hooks/useScrollButton';
import { MessageOwner } from '../../_utils/types';
import styles from './Chat.module.css';
import ErrorState from '../ErrorState/ErrorState';
import { useModalStore } from '../../_stores/ModalStore';
import { useUserStore } from '../../_stores/UserStore';

export default function Chat() {
  const { sessionId } = useSessionId();
  const { isModalOpen } = useModalStore();
  const { token } = useUserStore();
  const scrollableRef = useRef<HTMLDivElement>(null);

  const { ref, isInViewport, scrollIntoView } = useScrollButton(scrollableRef);

  const {
    error,
    data: messages,
    isLoading = false,
    isPending,
  } = useQuery<ChatMessage[]>({
    queryKey: ['session'],
    queryFn: () => sessionAPI.getSession(sessionId as string, token),
    enabled: Boolean(sessionId),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollIntoView();
    }
  }, [messages, scrollIntoView]);

  return (
    <Flex
      direction="column"
      h={{ base: '100dvh', fallback: '100vh' }}
      pos="relative"
    >
      <Flex
        direction="column"
        gap="md"
        p="1rem"
        className={styles.chatContainer}
        ref={scrollableRef}
      >
        {!isModalOpen('disclaimer') && (
          <ScrollButton
            isVisible={!isLoading && !isPending && !isInViewport}
            onClick={scrollIntoView}
          />
        )}
        {(isLoading || isPending) && (
          <Loader mx="auto" my="auto" color="green" />
        )}
        {(!messages || !messages.length) &&
          !isLoading &&
          !isPending &&
          !error && <NoMessages />}

        {!!messages?.length &&
          messages.map((message, index) => {
            return (
              <Flex
                key={message.message_id || index}
                direction="column"
                gap="md"
              >
                <Message
                  owner={message.message_type.toUpperCase() as MessageOwner}
                  content={message.message_content}
                  loading={message.message_id === 'LOADING'}
                />
                {!!message.graph_data && (
                  <Chart
                    type={message.graph_data.type}
                    data={message.graph_data.data}
                  />
                )}
              </Flex>
            );
          })}

        {error && <ErrorState />}
        <div ref={ref} />
      </Flex>
      <UserInput />
    </Flex>
  );
}
