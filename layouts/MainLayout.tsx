import {
  AppShell,
  Container,
  UnstyledButton,
  ActionIcon,
  Avatar,
  Burger,
  Group,
  Menu,
  rem,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
  Box,
} from '@mantine/core';
import {
  IconCircleHalf2,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { UserProfileButton, Navigation } from '@/components';
import classes from './main-layout.module.scss';
import { User } from '@/types';
import Link from 'next/link';
import router from 'next/router';

type MainLayoutProps = {
  className?: string;
  children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  const theme = useMantineTheme();
  const laptop_match = useMediaQuery('(min-width: 769px)');
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const [isOpen, { toggle: onOpen }] = useDisclosure(laptop_match);
  const user: User = {} as User;

  return (
    <div id="main-layout" className={className}>
      <AppShell
        layout="alt"
        header={{ height: 60 }}
        footer={{ height: 60 }}
        navbar={{
          width: 250,
          breakpoint: 'md',
          collapsed: { mobile: !isOpen, desktop: isOpen },
        }}
        padding={0}
      >
        <AppShell.Header
          style={{
            height: rem(60),
            border: 'none',
            boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
          }}
        >
          <Container fluid py="sm" px="lg">
            <Group justify="space-between">
              <Group gap={0}>
                <Tooltip label="Toggle side navigation">
                  <Burger opened={isOpen} onClick={onOpen} size="sm" color={theme.primaryColor} />
                </Tooltip>
              </Group>
              <Group>
                {mobile_match && (
                  <ActionIcon>
                    <IconSearch size={20} />
                  </ActionIcon>
                )}
                <Menu shadow="lg" width={200}>
                  <Menu.Target>
                    <Tooltip label="Chọn giao diện">
                      <ActionIcon variant="light">
                        {colorScheme === 'auto' ? (
                          <IconCircleHalf2 size={20} />
                        ) : colorScheme === 'dark' ? (
                          <IconMoonStars size={20} />
                        ) : (
                          <IconSunHigh size={20} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label tt="uppercase" ta="center" fw={600}>
                      Chọn giao diện
                    </Menu.Label>
                    <Menu.Item
                      leftSection={<IconSunHigh size={16} />}
                      onClick={() => setColorScheme('light')}
                    >
                      Sáng
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconMoonStars size={16} />}
                      onClick={() => setColorScheme('dark')}
                    >
                      Tối
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <Menu shadow="lg" width={200}>
                  <Menu.Target>
                    <Tooltip label="User Account">
                      <ActionIcon radius={'xl'} color={theme.primaryColor}>
                        <Avatar
                          src={user?.thumbnail}
                          variant="filled"
                          size="md"
                          radius={'xl'}
                          color={theme.primaryColor}
                        />
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label tt="uppercase" ta="center" fw={600}>
                      Tài khoản
                    </Menu.Label>
                    <Menu.Item>
                      <UserProfileButton user={user} />
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconPower size={20} />}
                      onClick={() => router.push(new URL('/logout'))}
                    >
                      Đăng xuất
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Navbar>
          <Navigation user={user} onClose={onOpen} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Box py="lg" px="md" className={classes.main}>
            {children}
          </Box>
        </AppShell.Main>
        <AppShell.Footer p="md">
          <Container fluid px="lg">
            <Group justify="space-between">
              <UnstyledButton c="dimmed" fz="sm" component={Link} href={'/'} target="_blank">
                &copy;&nbsp;{new Date().getFullYear()}&nbsp;ST Team - Khoa công nghệ thông tin - Học
                viện Nông nghiệp Việt Nam
              </UnstyledButton>
            </Group>
          </Container>
        </AppShell.Footer>
      </AppShell>
    </div>
  );
};

export default MainLayout;
