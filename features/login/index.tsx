import { Box, Container, Flex, Paper, Stack, Image } from '@mantine/core';
import { Surface } from '@/components';

const LoginPage = () => (
  <>
    <Container>
      <Stack align="center" justify="center" gap="md">
        <Surface shadow="sm" p={16} radius="md" component={Paper}>
          <Flex justify="center" align="center" gap="md" wrap="wrap">
            <Box>
              <Image src="/images/login.png" alt="logo" />
            </Box>
            <Box>
              <div></div>
            </Box>
          </Flex>
        </Surface>
      </Stack>
    </Container>
  </>
);

export default LoginPage;
