"use client"

import { Checkbox, Flex, Paper, Text, TextInput, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import completionAPI from "../../_services/CompletionAPI";
import { ChangeEvent, FormEvent, useState } from "react";
import { GenerationRequest } from "../../_models/GenerationRequest";
import { borderColor } from "./UserInput.helpers";
import { useRouter } from "next/navigation";
import { useSessionId } from "../../_utils/hooks/useSessionId";
import { ChatMessage } from "../../_models/ChatMessage";
import { v4 } from "uuid";

export default function UserInput() {
  const queryClient = useQueryClient();
  const sessionId = useSessionId();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()

  const [message, setMessage] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (request: GenerationRequest) => completionAPI.createCompletion(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({ queryKey: ['session', sessionId] });
  
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(['session']) ?? [];

      queryClient.setQueryData<ChatMessage[]>(['session'], [
        ...previousMessages,
        {
          id: v4(),
          user_id: '123',
          message_content: message,
          message_type: 'USER',
          session_id: sessionId as string,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'LOADING',
          user_id: '123', 
          message_type: 'USER',
          message_content: '',
          session_id: sessionId as string,
          timestamp: new Date().toISOString(),
        }
      ]);
  
      return { previousMessages };
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionId) return; 
    console.log("TEST")
    const chatHistory = queryClient.getQueryData<ChatMessage[]>(['session']) ?? [];
    console.log("Chat History: ", chatHistory)
    mutation.mutate({
      user_id: "123",
      session_id: sessionId,
      message_content: message,
      history: chatHistory
    })

    setMessage("");
  }

  // On first input, an ID should be generated. This should be sent as the session ID, and added to the route as a route param

  return (
    <Paper p='sm' radius={0} style={{ borderTop: `1px solid ${borderColor(colorScheme, theme)}` }}>
      <Flex direction='column' gap='xs'>
        <form onSubmit={handleSubmit}>
          <TextInput
            aria-label="Ask Finn about your Finances"
            variant="filled"
            size="md"
            placeholder="Ask Finn about your finances..."
            value={message}
            onChange={handleChange}
          />
        </form>
        <Flex justify='space-between' w='100%'>
          <Checkbox
            size="xs"
            defaultChecked
            label="Use Graphs"
            color="green"
          />
          <Text
            size="xs"
            c="dimmed"
          >
            View Disclaimer
          </Text>
        </Flex>
      </Flex>
    </Paper>
  )
}