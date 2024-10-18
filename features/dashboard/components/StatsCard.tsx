import { Group, Paper, PaperProps, Stack, Text } from '@mantine/core';
// import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { Surface } from '@/components';

type StatsCardProps = {
  title: string;
  value: string | number;
  // difference: number;
  icon?: any;
  description?: string;
} & PaperProps;

const StatsCard = ({ title, value, icon: Icon, description }: StatsCardProps) => (
  <StatsCardStyled>
    <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
      <Group justify="space-between" align="start">
        <Stack>
          <Text size="xs" c="dimmed" className="title">
            {title}
          </Text>
          <Group align="flex-end" gap="xs">
            <Text className="value">{value}</Text>
            {/*<Text c={difference > 0 ? 'teal' : 'red'} fz="sm" fw={500} className="diff">*/}
            {/*  <span>{difference}%</span>*/}
            {/*  {difference > 0 ? (*/}
            {/*    <IconArrowUpRight size="1rem" stroke={1.5} />*/}
            {/*  ) : (*/}
            {/*    <IconArrowDownRight size="1rem" stroke={1.5} />*/}
            {/*  )}*/}
            {/*</Text>*/}
          </Group>
        </Stack>
        {Icon && <Icon size={40} className="icon" />}
      </Group>

      {description && (
        <Text fz="xs" c="dimmed" mt={7}>
          {description}
        </Text>
      )}
    </Surface>
  </StatsCardStyled>
);

const StatsCardStyled = styled.div`
  .value {
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1;
  }

  .diff {
    line-height: 1;
    display: flex;
    align-items: center;
  }

  .icon {
    color: var(--mantine-primary-color-light-color);
  }

  .title {
    font-weight: 500;
    text-transform: uppercase;
  }
`;

export default StatsCard;
