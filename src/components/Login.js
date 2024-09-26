import React from "react";
import {
  Stack,
  Image,
  Heading,
  Input,
  Button,
  Link,
  Text,
  Card,
  useTheme,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import logo from "../assets/images/LogoNotYellow.png";

const Login = () => {
  const theme = useTheme();

  return (
    <Stack spacing={6} maxW="md" mx="auto" mt="8" fontFamily="CaviarDreams">
      <Heading as="h2" size="lg" textAlign="center" fontFamily="CaviarDreams">
        Sign in to
        <Image
          src={logo}
          alt="Go App"
          boxSize="60px"
          display="inline-block"
          objectFit="contain"
          verticalAlign="middle"
          quality={100}
          ml="2"
        />
      </Heading>

      <Card p="8" boxShadow="xl" bg={theme.colors.accent}>
        <Stack spacing={6}>
          <Input
            placeholder="Email Address"
            type="email"
            bg={theme.colors.background}
          />
          <Input
            placeholder="Password"
            type="password"
            bg={theme.colors.background}
          />
          <Button
            bg={theme.colors.secondary}
            color={theme.colors.text}
            _hover={{
              bg: theme.colors.tertiary,
              boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)",
            }}
            boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
            size="md"
          >
            Login
          </Button>
          <Text textAlign="left">
            Don't have an account?{" "}
            <Link as={RouterLink} to="/signup" color="blue.500">
              Click here to create an account.
            </Link>
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
};

export default Login;
