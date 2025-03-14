'use client';

import { ActionIcon, Button, Flex, Paper, Textarea } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, KeyboardEvent, useState } from 'react';
import { GenerationRequest } from '../../_models/GenerationRequest';
import { ChatMessage } from '../../_models/ChatMessage';
import { v4 } from 'uuid';
import styles from './UserInput.module.css';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useModalStore } from '../../_stores/ModalStore';
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '../../_stores/UserStore';
import { DISCLAIMER_MODAL } from '../_modals';
import {
  SESSION_INFO_KEY,
  SESSION_KEY,
} from '../../_utils/_hooks/_mutations/queryKeys';
import { useStreamingFilter } from '../../_utils/_hooks/useStreamingFilter';
import agentAPI from '../../_services/AgentAPI';
import { useChatContextStore } from '../../_stores/ChatContextStore';
// import { useStreamAgentResponse, useStreamResponse } from '../../_utils/_hooks/useStreamResponse';

type FormField = 'message' | 'useGraph';
type FormDataType = string | boolean;
interface FormData {
  message: string;
  useGraph: boolean;
}
const defaultFormState: FormData = {
  message: '',
  useGraph: true,
};

export default function UserInput() {
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();
  const { token, userId } = useUserStore();
  const { getContext } = useChatContextStore();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [form, setForm] = useState<FormData>(defaultFormState);
  const { handleChunk, isValidChunk, reset, isGraph } = useStreamingFilter();

  const handleMessage = (msg: string) => {
    const messages =
      queryClient.getQueryData<ChatMessage[]>([SESSION_KEY]) ?? [];

    handleChunk(msg);

    if (isValidChunk(msg)) {
      queryClient.setQueryData<ChatMessage[]>(
        [SESSION_KEY],
        messages.map((message) => {
          const fullMessage = message.message_content + msg;
          if (message.message_id === 'LOADING') {
            return {
              ...message,
              message_content: fullMessage.replace(/\\n/g, '\n'),
            };
          }
          return message;
        }),
      );
    }
    if (
      isGraph.current &&
      !messages.some((msg) => msg.message_id === 'LOADING_GRAPH')
    ) {
      queryClient.setQueryData<ChatMessage[]>(
        [SESSION_KEY],
        [
          ...messages,
          {
            message_id: 'LOADING_GRAPH',
            user_id: '123',
            message_type: 'AI',
            message_content: '',
            session_id: sessionId as string,
            timestamp: new Date().toISOString(),
          },
        ],
      );
    }
  };

  const mutation = useMutation({
    mutationFn: (request: GenerationRequest) => {
      return agentAPI.createChat(token, request, handleMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSION_KEY] });
      queryClient.invalidateQueries({ queryKey: [SESSION_INFO_KEY] });
      reset();
    },
    onError: () => {
      const previousMessages =
        queryClient.getQueryData<ChatMessage[]>([SESSION_KEY]) ?? [];

      queryClient.setQueryData<ChatMessage[]>(
        [SESSION_KEY],
        [
          ...previousMessages,
          {
            message_id: 'ERROR',
            user_id: '123',
            message_type: 'AI',
            message_content: 'Something went wrong... retrying',
            session_id: sessionId as string,
            timestamp: new Date().toISOString(),
          },
        ],
      );
    },
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({ queryKey: [SESSION_KEY, sessionId] });

      const previousMessages =
        queryClient.getQueryData<ChatMessage[]>([SESSION_KEY]) ?? [];

      queryClient.setQueryData<ChatMessage[]>(
        [SESSION_KEY],
        [
          ...previousMessages,
          {
            message_id: v4(),
            user_id: '123',
            message_content: form.message,
            message_type: 'USER',
            session_id: sessionId as string,
            timestamp: new Date().toISOString(),
          },
          {
            message_id: 'LOADING',
            user_id: '123',
            message_type: 'AI',
            message_content: '',
            session_id: sessionId as string,
            timestamp: new Date().toISOString(),
          },
        ],
      );

      return { previousMessages };
    },
    retry: false,
  });

  const handleForm = (field: FormField, newData: FormDataType) => {
    setForm((prev) => ({ ...prev, [field]: newData }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const formEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
      });
      e.currentTarget.form?.dispatchEvent(formEvent);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionId) return;

    const chatHistory =
      queryClient.getQueryData<ChatMessage[]>(['session']) ?? [];

    mutation.mutate({
      user_id: userId,
      session_id: sessionId as string,
      history: chatHistory,
      message_content: form.message,
      context: getContext(),
    });

    handleForm('message', '');
  };

  return (
    <Paper p="sm" radius={0} className={styles.container}>
      <Flex direction="column" gap="xs">
        <form onSubmit={handleSubmit}>
          <Textarea
            aria-label="Ask Finn about your Finances"
            variant="filled"
            size="md"
            placeholder="Ask Finn about your finances..."
            value={form.message}
            onChange={(e) => handleForm('message', e.target.value)}
            onKeyDown={handleKeyDown}
            autosize
            minRows={1}
            maxRows={20}
            rightSection={
              <ActionIcon color="green" type="submit" mb="auto" mt="6px">
                <PaperPlaneIcon />
              </ActionIcon>
            }
          />
        </form>
        <Button
          size="xs"
          c="dimmed"
          onClick={() => openModal(DISCLAIMER_MODAL)}
          variant="transparent"
          w="fit-content"
        >
          View Disclaimer
        </Button>
      </Flex>
    </Paper>
  );
}
