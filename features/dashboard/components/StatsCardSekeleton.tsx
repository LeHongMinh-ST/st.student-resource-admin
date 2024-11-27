import { Group, Paper, Skeleton, Stack } from '@mantine/core';
import { Surface } from '@/components';

const StatsCardSekeleton = () => (
  <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
    <Group justify="space-between" align="start">
      <Stack>
        <Skeleton height={16} radius="xl" />
        <Group align="flex-end" gap="xs">
          <Skeleton height={24} radius="xl" />
        </Group>
      </Stack>
      <Skeleton height={50} circle mb="xl" />
    </Group>

    <Skeleton height={16} radius="xl" />
  </Surface>
);

export default StatsCardSekeleton;
