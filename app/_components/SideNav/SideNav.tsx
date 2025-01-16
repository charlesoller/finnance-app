import { Flex, NavLink } from '@mantine/core';
import { FaceIcon } from '@radix-ui/react-icons';
import HistoryMenu from '../HistoryMenu/HistoryMenu';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname();

  return (
    <Flex direction="column">
      <NavLink
        href="/"
        label="Advisor"
        leftSection={<FaceIcon />}
        color="green"
        active={pathname.includes('chat')}
      />
      {/* <NavLink
        href="#required-for-focus"
        label="My Finances"
        color="green"
        leftSection={<BackpackIcon />}
      /> */}
      <HistoryMenu />
    </Flex>
  );
}
