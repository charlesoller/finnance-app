"use client"

import { Checkbox, Flex, Paper, Text, TextInput, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import completionAPI from "../../_services/CompletionAPI";
import { ChangeEvent, FormEvent, useState } from "react";
import { GenerationRequest } from "../../_models/GenerationRequest";
import { borderColor } from "./UserInput.helpers";

export default function UserInput() {
  const queryClient = useQueryClient();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()

  const [message, setMessage] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (request: GenerationRequest) => completionAPI.createCompletion(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['completions'] });
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      user_id: "123",
      session_id: "456",
      message_content: message,
      history: []
    })
  }

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