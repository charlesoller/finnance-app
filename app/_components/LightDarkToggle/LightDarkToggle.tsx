import styles from './LightDarkToggle.module.css';
import { ActionIcon } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { AppColorScheme } from '../../_utils/types';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

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
    <ActionIcon
      variant="outline"
      color={colorScheme === 'dark' ? 'yellow' : 'blue'}
      onClick={toggleColorScheme}
      title="Toggle color scheme"
      size="lg"
    >
      {colorScheme === 'dark' ? (
        <SunIcon className={styles.sun} />
      ) : (
        <MoonIcon className={styles.moon} />
      )}
    </ActionIcon>
  );
}
