import { ActionIcon, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { AppColorScheme } from '../../_utils/types';
import { IconMoon, IconSun } from '@tabler/icons-react';

export default function LightDarkToggle() {
  const [colorScheme, setColorScheme] = useLocalStorage<AppColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = () => {
    if (colorScheme === 'dark') setColorScheme('light');
    if (colorScheme === 'light') setColorScheme('dark');
  };

  return (
    <Tooltip
      label={colorScheme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode'}
    >
      <ActionIcon
        variant="subtle"
        color={colorScheme === 'dark' ? 'yellow' : 'blue'}
        onClick={toggleColorScheme}
        title="Toggle color scheme"
        size="lg"
        radius="xl"
      >
        {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
      </ActionIcon>
    </Tooltip>
  );
}
