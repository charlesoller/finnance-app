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
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { useUserLanding } from '../_utils/hooks/useUserLanding';

const oxygen = Oxygen({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-oxygen',
  display: 'swap',
});

Amplify.configure(outputs);

export default function RootLayout({ children }: { children: any }) {
  useUserLanding();

  const [opened, { toggle }] = useDisclosure();
  const [colorScheme, setColorScheme] = useLocalStorage<AppColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

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
      <body
        style={{
          overflow: 'hidden',
        }}
      >
        <MantineProvider theme={theme} forceColorScheme={colorScheme}>
          <QueryClientProvider client={queryClient}>
            <ModalsProvider modals={MODALS}>
              <AppShell
                w="100%"
                header={{ height: 60 }}
                navbar={{
                  width: 150,
                  breakpoint: 'sm',
                  collapsed: { mobile: !opened },
                }}
              >
                <AppShell.Header>
                  <Header opened={opened} toggle={toggle} />
                </AppShell.Header>
                <AppShell.Navbar p="sm">
                  <SideNav />
                </AppShell.Navbar>
                <AppShell.Main>{children}</AppShell.Main>
              </AppShell>
            </ModalsProvider>
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
