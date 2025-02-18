import { Button, Flex, Text } from '@mantine/core';
import { useDisconnectAccount } from '../../../_utils/_hooks/_mutations/useDisconnectAccount';
import { useParams } from 'next/navigation';
import { useModalStore } from '../../../_stores/ModalStore';

export default function ConfirmDisconnectModal() {
  const { accountId } = useParams();
  const { mutation: disconnectAccount } = useDisconnectAccount();
  const { closeAllModals } = useModalStore();

  const handleDisconnect = () => {
    if (!accountId || typeof accountId !== 'string') return;
    disconnectAccount.mutate(accountId);
    closeAllModals();
  };

  return (
    <Flex direction="column" gap="md" p="md">
      <Text>
        Disconnecting this account will{' '}
        <b>remove all information about it from you account</b>, including
        balances and transactions.
      </Text>
      <Text>
        If you want to view this information again, you will have to reintegrate
        this account with Stripe.
      </Text>
      <Button color="red" mt="md" onClick={handleDisconnect}>
        Disconnect Account
      </Button>
    </Flex>
  );
}
