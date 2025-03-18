import { Divider, Flex } from '@mantine/core';
import GoogleButton from './GoogleButton';

export default function SocialSignIn() {
  return (
    <Flex direction="column">
      <GoogleButton />
      <Divider my="md" />
    </Flex>
  );
}
