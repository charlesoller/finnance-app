import { MantineTheme } from "@mantine/core";

export const borderColor = (colorScheme: string, theme: MantineTheme) => {
  if (colorScheme === 'light') {
    return theme.colors.gray[3];
  } else {
    return theme.colors.dark[4];
  }
}