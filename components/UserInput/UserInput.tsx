"use client"

import { Checkbox, Flex, Paper, Text, Textarea, useMantineColorScheme, useMantineTheme } from "@mantine/core";

export default function UserInput() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()

  const borderColor = () => {
    if (colorScheme === 'light') {
      return theme.colors.gray[3];
    } else {
      return theme.colors.dark[4];
    }
  }
  return (
    <Paper p='sm' radius={0} shadow="md" style={{ borderTop: `1px solid ${borderColor()}` }}>
      <Flex direction='column' gap='xs'>
        <Textarea
          aria-label="Ask Finn about your Finances"
          variant="filled"
          size="md"
          placeholder="Ask Finn about your finances..."
        />
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