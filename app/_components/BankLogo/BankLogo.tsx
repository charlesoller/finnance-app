import { Avatar } from '@mantine/core';
import { getBankLogoSrc, SupportedBanks } from '../../_utils/utils';
import { IconBuildingBank } from '@tabler/icons-react';

interface BankLogoProps {
  name: SupportedBanks | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function BankLogo({ name, size = 'lg' }: BankLogoProps) {
  return (
    <Avatar size={size} color="initials" name={name} src={getBankLogoSrc(name)}>
      <IconBuildingBank />
    </Avatar>
  );
}
