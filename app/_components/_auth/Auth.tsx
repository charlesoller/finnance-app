import { Avatar, Button, Divider, Flex, Text } from '@mantine/core';
import AuthForm from './AuthForm';
import { useState } from 'react';
import { AuthFormType } from './auth.types';

export default function Auth() {
  const [authState, setAuthState] = useState<AuthFormType>('signIn');

  const getSISUText = () => {
    if (authState === 'signIn') {
      return 'Create Account';
    }

    return 'Sign In';
  };

  const handleSISUClick = () => {
    setAuthState((prev: AuthFormType) =>
      prev === 'signIn' ? 'signUp' : 'signIn',
    );
  };

  return (
    <Flex direction="column">
      <Flex gap="md" align="center" mb="md">
        <Avatar src="/mascot.webp" size="lg" />
        <Text size="xl" fw="bold">
          {"Hello, I'm Finn!"}
        </Text>
      </Flex>
      <Divider mb="md" />
      <AuthForm type={authState} setType={setAuthState} />
      {authState !== 'newPassword' && <Divider my="md" />}
      <Flex justify="space-between" mt="sm">
        {authState !== 'newPassword' && (
          <Button
            color="dimmed"
            size="xs"
            variant="transparent"
            onClick={handleSISUClick}
          >
            {getSISUText()}
          </Button>
        )}
        {authState !== 'forgotPassword' && authState !== 'newPassword' && (
          <Button
            color="dimmed"
            size="xs"
            variant="transparent"
            onClick={() => setAuthState('forgotPassword')}
          >
            Forgot Password?
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
