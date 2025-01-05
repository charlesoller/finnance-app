import { Flex } from "@mantine/core";
import Message from "../Message/Message";
import Chart from "../Chart/Chart";
import UserInput from "../UserInput/UserInput";

export default function Chat() {
  return (
    <Flex direction="column" h="100vh">
      <Flex
        direction="column"
        gap="md"
        p={'1rem'}
        style={{ overflowY: 'auto', height: 'calc(100vh - 180px)' }}
      >
        <Message />
        <Message owner="user" />
        <Chart />
        <Message owner="user" />
        <Message />
      </Flex>
      <UserInput />
    </Flex>

  )
}