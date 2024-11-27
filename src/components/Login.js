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
	Button,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/images/LogoNotYellow.png';
import CustomButton from './Button';
import { passwordLogin, googleLogin } from '../api-client/ApiClient';
import SHA256 from 'crypto-js/sha256';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import googleLogo from '../assets/images/google.svg';

const Login = () => {
	const theme = useTheme();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailChange = (e) => setEmail(e.target.value);
	const handlePasswordChange = (e) => setPassword(e.target.value);

	const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

	const handlePasswordLogin = async () => {
		setIsLoading(true);
		setError('');
		const hashedPassword = SHA256(password).toString();

		try {
			const result = await passwordLogin({ email, password: hashedPassword });
			if (result.error) {
				setError(result.error);
			} else {
				const { logic_token, db_token, user_id } = result;

				if (logic_token && db_token && user_id) {
					localStorage.setItem('logic_token', logic_token);
					localStorage.setItem('db_token', db_token);
					localStorage.setItem('user_id', user_id);
					localStorage.setItem('user_photo', result.photo);

					window.location.href = '/';
				} else {
					setError('Login failed: Missing required token data.');
				}
			}
		} catch (error) {
			setError('An error occurred during login.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuccessfullGoogleSignIn = async (googleResponse) => {
		setIsLoading(true);
		setError('');

		try {
			const result = await googleLogin(googleResponse.code);
			if (result.error) {
				setError(result.error);
			} else {
				const { logic_token, db_token, user_id } = result;

				if (logic_token && db_token && user_id) {
					localStorage.setItem('logic_token', logic_token);
					localStorage.setItem('db_token', db_token);
					localStorage.setItem('user_id', user_id);
					localStorage.setItem('user_photo', result.photo);

					window.location.href = '/';
				} else {
					setError('Login failed: Missing required token data.');
				}
			}
		} catch (error) {
			setError('An error occurred during login.');
		} finally {
			setIsLoading(false);
		}
	};

	const GoogleSignIn = () => {
		const login = useGoogleLogin({
			flow: 'auth-code', // Use authorization code flow
			onSuccess: handleSuccessfullGoogleSignIn,
			onError: () => {
				setIsLoading(false);
			},
			scope:
				'openid profile https://www.googleapis.com/auth/user.phonenumbers.read',
		});

		return (
			<Button
				onClick={login}
				leftIcon={<Image src={googleLogo} alt="Google logo" boxSize="20px" />}
				bg={'white'}
				color={theme.colors.text}
				_hover={{
					bg: 'white',
					boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
				}}
				boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
				size="md"
			>
				Login with Google
			</Button>
		);
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
						isDisabled={!email || !password || isLoading}
						onClick={handlePasswordLogin}
					>
						{isLoading ? (
							<span className="loading-dots">Logging in...</span>
						) : (
							'Login'
						)}
					</CustomButton>
					<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
						<GoogleSignIn />
					</GoogleOAuthProvider>
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
