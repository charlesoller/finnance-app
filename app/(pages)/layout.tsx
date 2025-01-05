"use client"

import "@mantine/core/styles.css";
import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
  AppShell,
  Burger,
  ActionIcon,
  Text,
  Flex,
} from "@mantine/core";
import { theme } from "../../theme";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { AppColorScheme } from "../../utils/types";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Oxygen } from 'next/font/google'
import SideNav from "../../components/SideNav/SideNav";


// export const metadata = {
//   title: "Mantine Next.js template",
//   description: "I am using Mantine with Next.js!",
// };

const oxygen = Oxygen({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-oxygen',
  display: 'swap',
})

export default function RootLayout({ children }: { children: any }) {
  const [opened, { toggle }] = useDisclosure();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = () => {
    if (colorScheme === 'dark') setColorScheme('light');
    if (colorScheme === 'light') setColorScheme('dark');
  }

  return (
    <html lang="en" {...mantineHtmlProps} className={oxygen.className}>
      <head>
        <ColorSchemeScript
          forceColorScheme={colorScheme as AppColorScheme}
        />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ overflow: 'hidden' }}>
        <MantineProvider theme={theme} forceColorScheme={colorScheme as AppColorScheme}>
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 150,
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }}
          >
            <AppShell.Header>
              <Flex align='center' justify='space-between' h='100%' p='0.5em'>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Text fw={700} size="xl">Finnance</Text>
                <ActionIcon
                  variant="outline"
                  color={colorScheme === 'dark' ? 'yellow' : 'blue'}
                  onClick={toggleColorScheme}
                  title="Toggle color scheme"
                >
                  {colorScheme === 'dark' ? (
                    <SunIcon style={{ width: 18, height: 18 }} />
                  ) : (
                    <MoonIcon style={{ width: 18, height: 18 }} />
                  )}
                </ActionIcon>
              </Flex>
            </AppShell.Header>

            <AppShell.Navbar p="sm">
              <SideNav />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
