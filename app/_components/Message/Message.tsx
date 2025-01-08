"use client"

import { Avatar, Container, Flex, Loader, Paper, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { ReactElement } from "react";
import { MessageOwner } from "../../_utils/types";

interface MessageProps {
  children?: ReactElement;
  owner?: MessageOwner;
  content?: string;
  loading?: boolean;
}

export default function Message({ children, owner = 'AI', content, loading = false }: MessageProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper withBorder shadow="md" p="md" bg={owner === 'USER' ? theme.colors.green[colorScheme === 'dark' ? 9 : 1] : undefined}>
      <Flex direction="row" gap="md">
        {owner === 'AI' && <Avatar src="/mascot.webp" />}
        <Flex direction="column" gap="md" >
          {children}
          <Text>
            { loading ? <Loader /> : content }
          </Text>
        </Flex>
        {owner === 'USER' && <Avatar name="Demo User" ml='auto' />}
      </Flex>
    </Paper>
  )
}