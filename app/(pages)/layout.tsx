'use client';

import '@mantine/core/styles.css';
import React from 'react';
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
  AppShell,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { theme } from '../../theme';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { AppColorScheme } from '../_utils/types';
import { Oxygen } from 'next/font/google';
import SideNav from '../_components/SideNav/SideNav';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../_services/QueryClient';
import Header from '../_components/Header/Header';
import { MODALS } from '../_components/_modals';

const oxygen = Oxygen({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-oxygen',
  display: 'swap',
});

export default function RootLayout({ children }: { children: any }) {
  const [opened, { toggle }] = useDisclosure();
  const [colorScheme, setColorScheme] = useLocalStorage<AppColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = () => {
    if (colorScheme === 'dark') setColorScheme('light');
    if (colorScheme === 'light') setColorScheme('dark');
  };

  return (
    <html lang="en" {...mantineHtmlProps} className={oxygen.className}>
      <head>
        <ColorSchemeScript forceColorScheme={colorScheme as AppColorScheme} />
        <link rel="shortcut icon" href="/mascot.webp" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ overflow: 'hidden' }}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme} forceColorScheme={colorScheme}>
            <ModalsProvider modals={MODALS}>
              <AppShell
                header={{ height: 60 }}
                navbar={{
                  width: 150,
                  breakpoint: 'sm',
                  collapsed: { mobile: !opened },
                }}
              >
                <AppShell.Header>
                  <Header
                    opened={opened}
                    toggle={toggle}
                    colorScheme={colorScheme}
                    toggleColorScheme={toggleColorScheme}
                  />
                </AppShell.Header>
                <AppShell.Navbar p="sm">
                  <SideNav />
                </AppShell.Navbar>
                <AppShell.Main>{children}</AppShell.Main>
              </AppShell>
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
