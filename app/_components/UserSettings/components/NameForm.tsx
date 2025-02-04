import styles from '../UserSettings.module.css';

import { Button, Divider, Flex, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useFormState } from '../../../_utils/hooks/useFormState';

export default function NameForm() {
  const { loading, error, startReq, endReq } = useFormState();
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      firstName: '',
      lastName: '',
    },
  });

  const handleSave = () => {
    startReq();

    endReq();
  };

  return (
    <Flex direction="column" gap="sm">
      <Text size="sm">
        Change the first and last name used to refer to yourself in Finnance
      </Text>
      <form>
        <Flex gap="sm">
          <TextInput
            {...form.getInputProps('firstName')}
            label="First Name"
            placeholder="First Name"
            disabled={loading}
            className={styles.nameInput}
          />
          <TextInput
            {...form.getInputProps('lastName')}
            label="Last Name"
            placeholder="Last Name"
            disabled={loading}
            className={styles.nameInput}
          />
        </Flex>
        <Divider my="md" />
        <Flex gap="md" ml="auto" w="fit-content">
          <Button type="button" color="green" variant="subtle">
            Reset
          </Button>
          <Button type="submit" color="green">
            Save
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}
