import {
  Flex,
  Transition,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { borderColor } from '../../_utils/utils';
import { ReactElement } from 'react';

interface SlideDrawerProps {
  children: ReactElement;
  drawerComponent: ReactElement;
  opened: boolean;
  side: 'left' | 'right';
  width?: number;
  p?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 0;
}

export default function SlideDrawer({
  children,
  drawerComponent,
  opened,
  side,
  width = 50,
  p = 'xl',
}: SlideDrawerProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const childWidth = 100 - width;

  return (
    <Flex
      style={{ position: 'relative', overflow: 'hidden' }}
      h={{ base: '93dvh', fallback: '93vh' }}
    >
      {side === 'left' ? (
        <div
          style={{
            transition: 'all 400ms ease',
            width: '100%',
            maxWidth: opened ? '100%' : '1024px',
            margin: '0 auto',
          }}
        >
          <Flex
            direction="column"
            h="100%"
            w={opened ? `${childWidth}%` : '100%'}
            style={{
              overflowY: 'auto',
              transition: 'width 400ms ease',
            }}
            p={p}
            ml={'auto'}
          >
            {children}
          </Flex>
          <Transition
            mounted={opened}
            transition="slide-right"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Flex
                w={`${width}%`}
                style={{
                  ...styles,
                  borderRight: `1px solid ${borderColor(colorScheme, theme)}`,
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  overflow: 'hidden',
                }}
              >
                {drawerComponent}
              </Flex>
            )}
          </Transition>
        </div>
      ) : (
        <div
          style={{
            transition: 'all 400ms ease',
            width: '100%',
            maxWidth: opened ? '100%' : '1024px',
            margin: '0 auto',
          }}
        >
          <Flex
            direction="column"
            h="100%"
            w={opened ? `${childWidth}%` : '100%'}
            style={{
              overflowY: 'auto',
              transition: 'width 400ms ease',
            }}
            p={p}
          >
            {children}
          </Flex>
          <Transition
            mounted={opened}
            transition="slide-left"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Flex
                w={`${width}%`}
                style={{
                  ...styles,
                  borderLeft: `1px solid ${borderColor(colorScheme, theme)}`,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  overflow: 'hidden',
                }}
              >
                {drawerComponent}
              </Flex>
            )}
          </Transition>
        </div>
      )}
    </Flex>
  );
}
