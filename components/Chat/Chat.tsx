import { Flex } from "@mantine/core";
import Message from "../Message/Message";
import Chart from "../Chart/Chart";
import UserInput from "../UserInput/UserInput";
import NoMessages from "../NoMessages/NoMessages";

export default function Chat() {
  return (
    <Flex direction="column" h="100vh">
      <Flex
        direction="column"
        gap="md"
        p={'1rem'}
        style={{ overflowY: 'auto', height: 'calc(100vh - 180px)' }}
      >
        <NoMessages />
        {/* <Message />
        <Message owner="USER" />
        <Chart />
        <Message owner="USER" />
        <Message /> */}
      </Flex>
      <UserInput />
    </Flex>

  )
}