import { Flex, Box, Text, UnstyledButton, UnstyledButtonProps } from '@mantine/core';
import { IconApps } from '@tabler/icons-react';
import Link from 'next/link';
import classes from '@/components/Logo/logo.module.scss';

type LogoProps = {
  width?: string | number;
  height?: string | number;
  href?: string;
  text?: string;
} & UnstyledButtonProps;

const Logo: React.FC<LogoProps> = ({ width, height, text, href = '', ...others }) => (
  <Box w={width || '100%'}>
    <UnstyledButton component={Link} href={href} className={classes.logo} {...others}>
      <Flex justify="flex-start" align="center" gap={12}>
        <IconApps />
        <Text fw={700}>{text}</Text>
      </Flex>
    </UnstyledButton>
  </Box>
);
export default Logo;
