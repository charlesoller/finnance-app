'use client';

import {
  ActionIcon,
  Button,
  Flex,
  Paper,
  Textarea,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, KeyboardEvent, useState } from 'react';
import { GenerationRequest } from '../../_models/GenerationRequest';
import { borderColor } from './UserInput.helpers';
import { ChatMessage } from '../../_models/ChatMessage';
import { v4 } from 'uuid';
import sessionAPI from '../../_services/SessionAPI';
import styles from './UserInput.module.css';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useModalStore } from '../../_stores/ModalStore';
import { useParams } from 'next/navigation';
import { useUserStore } from '../../_stores/UserStore';

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
  const { sessionId } = useParams();
  const { openModal } = useModalStore();
  const { token } = useUserStore();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const [form, setForm] = useState<FormData>(defaultFormState);

  const mutation = useMutation({
    mutationFn: (request: GenerationRequest) =>
      sessionAPI.createChatForSessionId(sessionId as string, token, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['sessionInfo'] });
    },
    onError: () => {
      const previousMessages =
        queryClient.getQueryData<ChatMessage[]>(['session']) ?? [];

      queryClient.setQueryData<ChatMessage[]>(
        ['session'],
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
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] });

      const previousMessages =
        queryClient.getQueryData<ChatMessage[]>(['session']) ?? [];

      queryClient.setQueryData<ChatMessage[]>(
        ['session'],
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
      user_id: '123',
      session_id: sessionId as string,
      history: chatHistory,
      message_content: form.message,
      use_graph: form.useGraph,
    });

    handleForm('message', '');
  };

  return (
    <Paper
      p="sm"
      radius={0}
      style={{ borderTop: `1px solid ${borderColor(colorScheme, theme)}` }}
      className={styles.container}
    >
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
          onClick={() =>
            openModal({
              modal: 'disclaimer',
              title: 'Disclaimer',
              innerProps: {},
            })
          }
          variant="transparent"
          w="fit-content"
        >
          View Disclaimer
        </Button>
      </Flex>
    </Paper>
  );
}
