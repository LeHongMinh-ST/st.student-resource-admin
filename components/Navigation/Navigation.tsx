import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import sidebarNavigationAdmin from '@/constants/sidebarNavigation';
import LinksGroup from '@/components/Navigation/Links/LinksGroup';
import Logo from '@/components/Logo/Logo';
import { SidebarNavigationLinkProp, User } from '@/types';
import UserProfileButton from '@/components/UserProfileButton';
import classes from '@/components/Navigation/navigation.module.scss';

type NavigationProps = {
  user: User;
  onClose: () => void;
};

const Navigation: React.FC<NavigationProps> = ({ onClose, user }) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = sidebarNavigationAdmin.map((navigationItem) => (
    <Box pl={0} mb="md" key={navigationItem.title}>
      <Text tt="uppercase" size="xs" pl="md" fw={500} mb="sm" className={classes.linkHeader}>
        {navigationItem.title}
      </Text>
      {navigationItem.links.map((item: SidebarNavigationLinkProp) => (
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group justify="space-between" style={{ flex: tablet_match ? 'auto' : 1 }}>
            <Logo text="STUDENT VNUA" href="/" className={classes.logo} style={{}} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <Flex className={classes.footer}>
        <UserProfileButton user={user} hasEmail />
      </Flex>
    </nav>
  );
};

export default Navigation;
