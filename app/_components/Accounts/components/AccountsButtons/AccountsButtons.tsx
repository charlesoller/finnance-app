'use client';

import { Avatar, Button, Flex, Tooltip } from '@mantine/core';
import { useCustomerInfo } from '../../../../_utils/_hooks/useCustomerInfo';
import { useConnectAccounts } from '../../../../_utils/_hooks/_mutations/useConnectAccounts';

interface AccountsButtonsProps {
  onToggle: () => void;
}

export default function AccountsButtons({ onToggle }: AccountsButtonsProps) {
  useCustomerInfo();

  const { mutation: connectAccounts } = useConnectAccounts();

  const handleAuthClick = async () => {
    connectAccounts.mutate();
  };

  return (
    <Flex gap="sm" p="sm">
      <Button onClick={handleAuthClick} w="fit-content" color="green">
        + Account
      </Button>
      <Tooltip label="Ask Finn a Question">
        <Button
          leftSection={<Avatar src="./mascot.webp" />}
          color="green"
          onClick={onToggle}
        >
          Ask a Question
        </Button>
      </Tooltip>
    </Flex>
  );
}
