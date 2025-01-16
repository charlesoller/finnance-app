'use client';

import {
  Avatar,
  Flex,
  Loader,
  Paper,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { ReactElement } from 'react';
import { MessageOwner } from '../../_utils/types';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import 'katex/dist/katex.min.css';

interface MessageProps {
  children?: ReactElement;
  owner?: MessageOwner;
  content?: string;
  loading?: boolean;
  isGraph?: boolean;
  fitContent?: boolean;
}

export default function Message({
  children,
  owner = 'AI',
  content,
  loading = false,
  isGraph = false,
  fitContent = true,
}: MessageProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Paper
      withBorder
      radius="lg"
      shadow="md"
      p="md"
      w={fitContent ? 'fit-content' : undefined}
      bg={
        owner === 'USER'
          ? theme.colors.green[colorScheme === 'dark' ? 9 : 1]
          : undefined
      }
      ml={owner === 'USER' ? 'auto' : undefined}
    >
      dfadf
      <Flex direction="row" gap="md">
        {owner === 'AI' && <Avatar src="/mascot.webp" />}
        {!isGraph ? (
          <Flex direction="column" gap="md">
            {loading ? (
              <Loader color="green" />
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {content}
              </ReactMarkdown>
            )}
          </Flex>
        ) : (
          children
        )}
        {owner === 'USER' && <Avatar name="Demo User" ml="auto" />}
      </Flex>
    </Paper>
  );
}
