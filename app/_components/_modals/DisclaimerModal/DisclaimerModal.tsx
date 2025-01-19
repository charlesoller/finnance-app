import { Flex, List, Text } from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';

export default function DisclaimerModal({
  context,
  id,
  innerProps,
}: ContextModalProps) {
  return (
    <Flex direction="column" gap="md" p="lg">
      <Text>
        The financial advice provided by this app is generated by AI and is for
        informational purposes only. It should not be considered professional
        financial, investment, tax, or legal advice.
      </Text>
      <Text>By using this app, you acknowledge that:</Text>
      <List>
        <List.Item>
          The AI-generated responses may not always be accurate, complete, or up
          to date.
        </List.Item>
        <List.Item>
          You should consult with a qualified financial advisor before making
          any financial decisions.
        </List.Item>
        <List.Item>
          The app and its creators are not responsible for any financial losses
          or decisions made based on the provided information.
        </List.Item>
      </List>
    </Flex>
  );
}
