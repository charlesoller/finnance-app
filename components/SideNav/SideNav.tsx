import { Flex, NavLink } from "@mantine/core";
import { ArchiveIcon, FaceIcon, GearIcon } from "@radix-ui/react-icons";

export default function SideNav() {
  return (
    <Flex direction='column'>
      <NavLink
        href="#required-for-focus"
        label="Advisor"
        leftSection={<FaceIcon />}
        color="green"
        active
      />
      <NavLink
        href="#required-for-focus"
        label="Manage"
        color="green"
        leftSection={<GearIcon />}
      />
      <NavLink
        href="#required-for-focus"
        label="History"
        color="green"
        leftSection={<ArchiveIcon />}
      />
    </Flex>
  )
}