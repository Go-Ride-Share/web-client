import React, { useState } from 'react';
import {
	Stack,
	Image,
	Heading,
	Input,
	Link,
	Text,
	Card,
	useTheme,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/LogoNotYellow.png';
import CustomButton from './Button';
import { login } from '../api-client/ApiClient';
import SHA256 from 'crypto-js/sha256';

const Login = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleEmailChange = (e) => setEmail(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);

	const handleLogin = async () => {
		const hashedPassword = SHA256(password).toString();
		const result = await login({ email, password: hashedPassword });
		if (result.error) {
			setError(result.error);
		} else {
			localStorage.setItem('logic_token', result.logic_token);
			localStorage.setItem('db_token', result.db_token);
			setError('');
			navigate('/');
		}
	};

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

			<Card
				p="8"
				boxShadow="xl"
				bg={theme.colors.accent}
				color={theme.colors.text}
			>
				<Stack spacing={6}>
					{error && <Text color="red.500">{error}</Text>}
					<Input
						placeholder="Email Address"
						type="email"
						value={email}
						onChange={handleEmailChange}
						bg={theme.colors.background}
						_placeholder={{ color: theme.colors.textLight }}
					/>
					<Input
						placeholder="Password"
						type="password"
						value={password}
						onChange={handlePasswordChange}
						bg={theme.colors.background}
						_placeholder={{ color: theme.colors.textLight }}
					/>
					<CustomButton
						bg={theme.colors.secondary}
						color={theme.colors.text}
						_hover={{
							bg: theme.colors.tertiary,
							boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
						}}
						boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
						size="md"
						isDisabled={!email || !password}
						onClick={handleLogin}
					>
						Login
					</CustomButton>
					<Text textAlign="left">
						Don't have an account?{' '}
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
