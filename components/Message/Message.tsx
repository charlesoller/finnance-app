"use client"

import { Avatar, Container, Flex, Paper, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { ReactElement } from "react";
import { MessageOwner } from "../../utils/types";

interface MessageProps {
  children?: ReactElement;
  owner?: MessageOwner
}

export default function Message({ children, owner = 'agent' }: MessageProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme()

  return (
    <Paper withBorder shadow="md" p="md" bg={owner === 'user' ? theme.colors.green[colorScheme === 'dark' ? 9 : 1] : undefined}>
      <Flex direction="row" gap="md">
        { owner === 'agent' && <Avatar src="mascot.webp" />}
        <Flex direction="column" gap="md" >
          {children}
          <Text>
            Single shot robusta con panna redeye crema acerbic con panna barista irish. Crema coffee as mocha doppio et eu crema. Frappuccino cultivar plunger pot instant cup pumpkin spice, frappuccino arabica café au lait macchiato affogato siphon. Whipped, siphon mocha viennese sit aged doppio arabica con panna viennese.
          </Text>
        </Flex>
        {owner === 'user' && <Avatar name="Demo User" />}
      </Flex>
    </Paper>
  )
}