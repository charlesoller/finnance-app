import { Flex } from '@mantine/core';
import { FaceIcon } from '@radix-ui/react-icons';
import HistoryMenu from '../HistoryMenu/HistoryMenu';
import { usePathname } from 'next/navigation';
import Nav from '../Nav/Nav';

export default function SideNav() {
  const pathname = usePathname();

  return (
    <Flex direction="column" gap="xs">
      <Nav
        href="/"
        label="Advisor"
        leftSection={<FaceIcon />}
        active={pathname.includes('chat')}
      />
      <HistoryMenu />
    </Flex>
  );
}
