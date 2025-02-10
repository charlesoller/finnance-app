'use client';

import { Avatar, Button, Flex, Tooltip } from '@mantine/core';
import stripeAPI from '../../../../_services/StripeAPI';
import { useUserStore } from '../../../../_stores/UserStore';
import { useCustomerInfo } from '../../../../_utils/_hooks/useCustomerInfo';

export default function AccountsHeader() {
  useCustomerInfo();
  const { token, email } = useUserStore();

  const handleAuthClick = async () => {
    if (!email) return;
    await stripeAPI.initiateStripeAuth(email, token);
  };

  return (
    <Flex>
      <Button onClick={handleAuthClick} w="fit-content" color="green">
        + Account
      </Button>
      <Tooltip label="Ask Finn a Question">
        <Button leftSection={<Avatar src="./mascot.webp" />} color="green">
          Ask a Question
        </Button>
      </Tooltip>
    </Flex>
  );
}
