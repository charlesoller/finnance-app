import { Divider, Flex, List, Paper, Text, ListItem } from '@mantine/core';

export default function PrivacyPolicy() {
  return (
    <Paper shadow="md" w="fit-content" h="fit-content" p="md" m="auto">
      <Flex direction="column" gap="md">
        <Text size="xl" fw="bold">
          Privacy Policy
        </Text>
        <Text>
          Finnance is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our application, particularly in connection with Stripe
          Financial Connections.
        </Text>
        <Divider />
        <Text>
          Information We Collect: When you use our application and connect your
          financial accounts via Stripe Financial Connections, we may collect
          the following types of information: Personal Information: Name, email
          address, and other contact details. Financial Data: Bank account
          details, transaction history, and related financial information
          accessed through Stripe Financial Connections.
        </Text>
        <Divider />
        <Text>
          We use the information collected to:
          <List>
            <ListItem>
              Facilitate consolidated account management through Stripe
              Financial Connections.
            </ListItem>
            <ListItem>
              Provide, operate, and improve our application’s features.
            </ListItem>
            <ListItem>
              Give customized AI-generated insight, specific to your personal
              finances
            </ListItem>
          </List>
        </Text>
        <Divider />
        <Text>
          We do not sell your personal information. However, we may share your
          information with:
          <List>
            <ListItem>
              Stripe: To facilitate financial transactions and account
              connections.
            </ListItem>
            <ListItem>
              Service Providers: Who assist in the operation of our services
              under strict confidentiality agreements.
            </ListItem>
            <ListItem>
              Legal Authorities: If required by law, regulation, or legal
              process.
            </ListItem>
          </List>
        </Text>
      </Flex>
    </Paper>
  );
}
