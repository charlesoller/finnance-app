import { Flex, Text } from '@mantine/core';
import { CrossCircledIcon } from '@radix-ui/react-icons';

export default function ErrorState() {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="md"
      m="auto"
      p="md"
      style={{ textAlign: 'center' }}
    >
      <CrossCircledIcon color="red" width={64} height={64} />
      <Text size="lg" fw={500}>
        Something went wrong. Please refresh and try again.
      </Text>
    </Flex>
  );
}
