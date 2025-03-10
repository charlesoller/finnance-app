'use client';

import { ActionIcon, Flex, Loader, Tooltip } from '@mantine/core';
import Message from '../Message/Message';
import Chart from '../Chart/Chart';
import UserInput from '../UserInput/UserInput';
import NoMessages from '../NoMessages/NoMessages';
import { useQuery } from '@tanstack/react-query';
import { useSessionId } from '../../_utils/_hooks/useSessionId';
import sessionAPI from '../../_services/SessionAPI';
import { ChatMessage } from '../../_models/ChatMessage';
import { useEffect, useRef } from 'react';
import ScrollButton from '../ScrollButton/ScrollButton';
import { useScrollButton } from '../../_utils/_hooks/useScrollButton';
import { MessageOwner } from '../../_utils/types';
import styles from './Chat.module.css';
import ErrorState from '../ErrorState/ErrorState';
import { useModalStore } from '../../_stores/ModalStore';
import { useUserStore } from '../../_stores/UserStore';
import HistoryMenu from '../HistoryMenu/HistoryMenu';
import { SESSION_KEY } from '../../_utils/_hooks/_mutations/queryKeys';
import SlideDrawer from '../SlideDrawer/SlideDrawer';
import { useDisclosure } from '@mantine/hooks';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

interface ChatContentProps {
  showHistoryMenu: boolean;
  opened: boolean;
  toggle: () => void;
}

function ChatContent({ showHistoryMenu, opened, toggle }: ChatContentProps) {
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
    isFetching,
  } = useQuery<ChatMessage[]>({
    queryKey: [SESSION_KEY],
    queryFn: () => sessionAPI.getSession(sessionId as string, token),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollIntoView();
    }
  }, [messages, scrollIntoView]);

  return (
    <>
      <Flex
        direction="column"
        gap="md"
        p="1rem"
        className={styles.chatContainer}
        ref={scrollableRef}
      >
        {showHistoryMenu && (
          <div className={styles.historyButton}>
            <Tooltip label="View History" position="right">
              <ActionIcon onClick={toggle} color="green" radius="xl" size="xl">
                <ChatBubbleIcon />
              </ActionIcon>
            </Tooltip>
          </div>
        )}
        {!isModalOpen('disclaimer') && (
          <ScrollButton
            isVisible={!isLoading && !isPending && !isInViewport}
            onClick={scrollIntoView}
            left={opened ? 62 : 45}
          />
        )}
        {(isLoading || isPending) && (
          <Loader mx="auto" my="auto" color="green" />
        )}
        {!messages?.length && !isLoading && !isPending && !error && (
          <NoMessages />
        )}
        {!!messages?.length &&
          messages.map((message, index) => {
            return (
              <Flex
                key={message.message_id || index}
                direction="column"
                gap="md"
              >
                <Message
                  owner={message.message_type?.toUpperCase() as MessageOwner}
                  content={message.message_content}
                  loading={
                    (message.message_id === 'LOADING' &&
                      !message.message_content.length) ||
                    message.message_id === 'LOADING_GRAPH'
                  }
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
    </>
  );
}

interface ChatProps {
  showHistoryMenu?: boolean;
}

export default function Chat({ showHistoryMenu = true }: ChatProps) {
  const [opened, { toggle }] = useDisclosure();

  return showHistoryMenu ? (
    <SlideDrawer
      opened={opened}
      side="left"
      drawerComponent={<HistoryMenu />}
      width={30}
      p={0}
    >
      <ChatContent
        showHistoryMenu={showHistoryMenu}
        opened={opened}
        toggle={toggle}
      />
    </SlideDrawer>
  ) : (
    <Flex direction="column" h="100%" w={'100%'}>
      <ChatContent
        showHistoryMenu={showHistoryMenu}
        opened={opened}
        toggle={toggle}
      />
    </Flex>
  );
}
