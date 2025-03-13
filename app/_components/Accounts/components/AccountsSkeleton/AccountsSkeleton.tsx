import { Flex, Skeleton } from '@mantine/core';

export default function AccountsSkeleton() {
  return (
    <Flex direction="column" gap="md">
      <Skeleton height={100} radius={'md'} />
      <Skeleton height={100} radius={'md'} />
      <Skeleton height={100} radius={'md'} />
    </Flex>
  );
}
