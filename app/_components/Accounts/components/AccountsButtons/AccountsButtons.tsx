'use client';

import { Button, Flex } from '@mantine/core';
import { useConnectAccounts } from '../../../../_utils/_hooks/_mutations/useConnectAccounts';

interface AccountsButtonsProps {
  onToggle: () => void;
}

export default function AccountsButtons({ onToggle }: AccountsButtonsProps) {
  const { mutation: connectAccounts } = useConnectAccounts();

  const handleAuthClick = async () => {
    connectAccounts.mutate();
  };

  return (
    <Flex gap="sm" p="sm">
      <Button onClick={handleAuthClick} w="fit-content" color="green">
        + Account
      </Button>
    </Flex>
  );
}
