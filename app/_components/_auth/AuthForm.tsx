import { Button, Flex, PasswordInput, Text, TextInput } from '@mantine/core';
import { isEmail, matches, matchesField, useForm } from '@mantine/form';
import { AuthFormType } from './auth.types';
import { useModalStore } from '../../_stores/ModalStore';
import {
  confirmResetPassword,
  getCurrentUser,
  resetPassword,
  signIn,
  signUp,
} from 'aws-amplify/auth';
import { Dispatch, SetStateAction } from 'react';
import { useFormState } from '../../_utils/_hooks/useFormState';
import { useUserStore } from '../../_stores/UserStore';

interface AuthFormProps {
  type: AuthFormType;
  setType: Dispatch<SetStateAction<AuthFormType>>;
}

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  confirmationCode: string;
}

const PW_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function AuthForm({ type, setType }: AuthFormProps) {
  const { loading, error, startReq, endReq } = useFormState();
  const { setUserData, fetchToken } = useUserStore();
  const { closeAllModals } = useModalStore();

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
    },
    validate: {
      username: isEmail('Invalid email'),
      password:
        type !== 'forgotPassword'
          ? matches(
              PW_REGEX,
              'Password must be at least 8 characters long and include a combination of uppercase letters, lowercase letters, numbers, and special characters',
            )
          : undefined,
      confirmPassword:
        type === 'signUp'
          ? matchesField('password', 'Passwords are not the same')
          : undefined,
    },
  });

  const handleSubmit = async ({
    username,
    password,
    confirmationCode,
  }: FormData) => {
    startReq();

    if (type === 'signIn') {
      await signIn({ username, password })
        .then(() => {
          fetchToken();
          getCurrentUser().then(({ username, userId, signInDetails }) => {
            const email = signInDetails?.loginId || '';
            setUserData({ username, userId, signInDetails, email });
          });
          closeAllModals();
        })
        .catch((e: any) => endReq(e));
    } else if (type === 'signUp') {
      await signUp({ username, password })
        .then(() => {
          fetchToken();
          getCurrentUser().then(({ username, userId, signInDetails }) => {
            const email = signInDetails?.loginId || '';
            setUserData({ username, userId, signInDetails, email });
          });
          closeAllModals();
        })
        .catch((e: any) => endReq(e));
    } else if (type === 'forgotPassword') {
      await resetPassword({ username })
        .then(() => setType('newPassword'))
        .catch((e: any) => endReq(e));
    } else if (type === 'newPassword') {
      await confirmResetPassword({
        username,
        newPassword: password,
        confirmationCode,
      })
        .then(() => setType('signIn'))
        .catch((e: any) => endReq(e));
    }

    endReq();
  };

  const getTitle = () => {
    if (type === 'signIn') {
      return 'Sign In';
    } else if (type === 'signUp') {
      return 'Sign Up';
    } else if (type === 'forgotPassword') {
      return 'Reset Password';
    } else if (type === 'newPassword') {
      return 'Confirm New Password';
    }
  };

  const getDescription = () => {
    if (type === 'signIn') {
      return 'Welcome back!';
    } else if (type === 'signUp') {
      return 'Get started!';
    } else if (type === 'forgotPassword') {
      return "Forgot your password? Enter the associated email, and we'll email you a code if this account exists";
    } else if (type === 'newPassword') {
      return 'Enter the code emailed to you, along with your new password';
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction="column" gap="md">
        <Flex direction="column">
          <Text size="xl">{getTitle()}</Text>
          <Text size="sm">{getDescription()}</Text>
        </Flex>
        <Flex direction="column" gap="md">
          {type !== 'newPassword' && (
            <TextInput
              {...form.getInputProps('username')}
              label="Email"
              placeholder="Email"
              disabled={loading}
            />
          )}
          {type === 'newPassword' && (
            <TextInput
              {...form.getInputProps('confirmationCode')}
              label="One Time Code"
              placeholder="One Time Code"
              disabled={loading}
            />
          )}
          {type !== 'forgotPassword' && (
            <PasswordInput
              {...form.getInputProps('password')}
              label="Password"
              placeholder="Password"
              disabled={loading}
            />
          )}
          {(type === 'signUp' || type === 'newPassword') && (
            <PasswordInput
              {...form.getInputProps('confirmPassword')}
              label="Confirm Password"
              placeholder="Confirm Password"
              disabled={loading}
            />
          )}
        </Flex>
        {!!error.length && (
          <Text c="red" fw="bold" size="sm">
            {error}
          </Text>
        )}
        <Button color="green" type="submit" loading={loading}>
          Submit
        </Button>
      </Flex>
    </form>
  );
}
