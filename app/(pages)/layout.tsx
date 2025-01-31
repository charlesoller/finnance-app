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
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { useAuth } from '../_utils/hooks/useAuth';

const oxygen = Oxygen({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-oxygen',
  display: 'swap',
});

Amplify.configure(outputs);

export default function RootLayout({ children }: { children: any }) {
  useAuth();
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
      <body>
        <MantineProvider theme={theme} forceColorScheme={colorScheme}>
          <QueryClientProvider client={queryClient}>
            <ModalsProvider modals={MODALS}>
              <div
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                <Authenticator>
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
                </Authenticator>
              </div>
            </ModalsProvider>
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
