import { Avatar, Flex, Paper, Text } from "@mantine/core";

export default function NoMessages() {
  return (
    <Flex align="end" justify="center" p="lg" h="100%">
      <Paper shadow="md" withBorder>
        <Flex direction="column" p="lg" align="center" gap="md">
          <Avatar src="mascot.webp" size="xl" />
          <Text size="xl">How can I help you today?</Text>
        </Flex>
      </Paper>
    </Flex>
  )
}