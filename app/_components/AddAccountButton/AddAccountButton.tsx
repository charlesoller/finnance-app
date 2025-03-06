import { Button } from '@mantine/core';
import { useConnectAccounts } from '../../_utils/_hooks/_mutations/useConnectAccounts';

export default function AddAccountButton() {
  const { mutation: connectAccounts } = useConnectAccounts();

  const handleAuthClick = async () => {
    connectAccounts.mutate();
  };

  return (
    <Button color="green" radius="md" onClick={handleAuthClick}>
      + Add Account
    </Button>
  );
}
