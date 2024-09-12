import {
  Anchor,
  Breadcrumbs,
  Divider,
  Paper,
  PaperProps,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { ReactNode } from 'react';
import { IconMoonStars, IconSunHigh } from '@tabler/icons-react';
import Link from 'next/link';
import { Surface } from '@/components';
import { User } from '@/types';

type PageHeaderProps = {
  title: string;
  user: User;
  hasGreetings?: boolean;
  withActions?: ReactNode;
  breadcrumbItems?: any;
} & PaperProps;

const PageHeader = (props: PageHeaderProps) => {
  const { hasGreetings, user, withActions, breadcrumbItems, title, ...others } = props;
  const theme = useMantineTheme();
  const getHours = new Date().getHours();

  const greetingMessage =
    getHours < 12 ? 'Chào buổi sáng!' : getHours <= 18 ? 'Chào buổi chiều!' : 'Chào buổi tối!';

  const GreetingIcon =
    getHours >= 7 && getHours <= 18 ? (
      <IconSunHigh size={40} color={theme.colors.yellow[5]} />
    ) : (
      <IconMoonStars size={40} color={theme.colors.blue[9]} />
    );

  const BreadcrumbsComponent = (
    <Breadcrumbs separator="→">
      {breadcrumbItems?.map((item: { title: string; href: string }, index: number) => (
        <Anchor component={Link} href={item.href} key={index}>
          {item.title}
        </Anchor>
      ))}
    </Breadcrumbs>
  );

  return (
    <>
      <Surface shadow="sm" p={16} radius="md" component={Paper} {...others}>
        {hasGreetings ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {GreetingIcon}
              <Stack gap={4}>
                <Title order={3}>{greetingMessage}</Title>
                <Text>
                  Chúc bạn có một ngày làm việc hiệu quả, {user.last_name} {user.first_name}
                </Text>
              </Stack>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Stack>
              <Title order={3}>{title}</Title>
              {BreadcrumbsComponent}
            </Stack>
            {withActions && <div>{withActions}</div>}
          </div>
        )}
      </Surface>
      <Divider />
    </>
  );
};

export default PageHeader;
