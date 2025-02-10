import { Button, Flex, Text } from '@mantine/core';

export default function AccountSection() {
  return (
    <Flex direction="column" gap="sm">
      <Text size="sm">Take actions on your account</Text>
      <Flex gap="sm">
        <Button color="orange" variant="light">
          Reset Password
        </Button>
        <Button color="red" variant="light">
          Delete Account
        </Button>
      </Flex>
    </Flex>
  );
}
