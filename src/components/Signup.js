import React, { useState } from 'react';
import {
	Stack,
	Image,
	Heading,
	Input,
	Link,
	Textarea,
	Text,
	Card,
	useTheme,
	InputGroup,
	InputRightElement,
	InputLeftElement,
	InputLeftAddon,
	IconButton,
} from '@chakra-ui/react';
import { FiUpload, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/LogoNotYellow.png';
import CustomButton from './Button';
import { createUser } from '../api-client/ApiClient';
import sha256 from 'crypto-js/sha256';

const Signup = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [bio, setBio] = useState('');
	const [phone, setPhone] = useState('');
	const [photo, setPhoto] = useState(null);
	const [passwordError, setPasswordError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [signupError, setSignupError] = useState('');

	const handleNameChange = (e) => setName(e.target.value);

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(e.target.value)) {
			setEmailError('Invalid email format.');
		} else {
			setEmailError('');
		}
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		if (e.target.value.length < 8) {
			setPasswordError('Password must be at least 8 characters.');
		} else if (confirmPassword && e.target.value !== confirmPassword) {
			setPasswordError('Passwords do not match.');
		} else {
			setPasswordError('');
		}
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
		if (password && e.target.value !== password) {
			setPasswordError('Passwords do not match.');
		} else {
			setPasswordError('');
		}
	};

	const handleBioChange = (e) => setBio(e.target.value);

	const handlePhoneChange = (e) => {
		setPhone(e.target.value);
		const phoneRegex = /^\d{10}$/;
		if (!phoneRegex.test(e.target.value)) {
			setPhoneError('Phone number must be 10 digits.');
		} else {
			setPhoneError('');
		}
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhoto(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSignup = async () => {
		const hashedPassword = sha256(password).toString();
		const userRequest = {
			name,
			email,
			password: hashedPassword,
			bio,
			phone,
			photo,
		};

		const result = await createUser(userRequest);
		if (result.error) {
			setSignupError(result.error);
		} else {
			localStorage.setItem('logic_token', result.logic_token);
			localStorage.setItem('db_token', result.db_token);
			localStorage.setItem('user_id', result.user_id);
			localStorage.setItem('user_photo', result.photo);
			navigate('/');
		}
	};

	const isFormValid =
		name &&
		email &&
		password &&
		confirmPassword &&
		bio &&
		phone &&
		password === confirmPassword &&
		!emailError &&
		!phoneError &&
		password.length >= 8;

	return (
		<Stack spacing={6} maxW="md" mx="auto" mt="8" fontFamily="CaviarDreams">
			<Heading as="h2" size="lg" textAlign="center" fontFamily="CaviarDreams">
				Sign up for
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
				<Stack spacing={4}>
					{signupError && <Text color="red.500">{signupError}</Text>}
					<Input
						placeholder="Name"
						type="text"
						value={name}
						onChange={handleNameChange}
						bg={theme.colors.background}
						_placeholder={{ color: theme.colors.textLight }}
					/>
					<Input
						placeholder="Email Address"
						type="email"
						value={email}
						onChange={handleEmailChange}
						bg={theme.colors.background}
						_placeholder={{ color: theme.colors.textLight }}
					/>
					{emailError && <Text color="red.500">{emailError}</Text>}

					<InputGroup>
						<Input
							data-testid="password-input"
							placeholder="Password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={handlePasswordChange}
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
						/>
						<InputRightElement width="3rem">
							<IconButton
								size="sm"
								onClick={() => setShowPassword(!showPassword)}
								icon={showPassword ? <FiEyeOff /> : <FiEye />}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								variant="link"
							/>
						</InputRightElement>
					</InputGroup>

					<InputGroup>
						<Input
							data-testid="confirm-password-input"
							placeholder="Confirm Password"
							type={showConfirmPassword ? 'text' : 'password'}
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
						/>
						<InputRightElement width="3rem">
							<IconButton
								size="sm"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
								aria-label={
									showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
								}
								variant="link"
							/>
						</InputRightElement>
					</InputGroup>
					{passwordError && <Text color="red.500">{passwordError}</Text>}

					<Textarea
						placeholder="Bio (e.g., I travel on weekends and would love to meet people and share rides.)"
						value={bio}
						onChange={handleBioChange}
						bg={theme.colors.background}
						_placeholder={{ color: theme.colors.textLight }}
					/>

					<InputGroup>
						<InputLeftAddon>+1</InputLeftAddon>
						<Input
							placeholder="Phone Number"
							type="tel"
							value={phone}
							onChange={handlePhoneChange}
							bg={theme.colors.background}
							_placeholder={{ color: theme.colors.textLight }}
						/>
					</InputGroup>
					{phoneError && <Text color="red.500">{phoneError}</Text>}

					<InputGroup>
						<InputLeftElement pointerEvents="none">
							<IconButton
								aria-label="Upload Picture"
								icon={<FiUpload />}
								bg="transparent"
								color="gray.500"
								_hover={{ color: theme.colors.secondary }}
								size="lg"
								borderRadius="full"
							/>
						</InputLeftElement>
						<Input
							placeholder="Upload Picture"
							type="file"
							accept="image/*"
							onChange={handlePhotoChange}
							bg={theme.colors.background}
							pl="12"
							_placeholder={{ color: theme.colors.textLight }}
						/>
					</InputGroup>

					{photo && (
						<Image
							src={photo}
							alt="Uploaded Preview"
							boxSize="100px"
							objectFit="cover"
							borderRadius="full"
							mt={4}
						/>
					)}

					<CustomButton
						size="md"
						isDisabled={!isFormValid}
						onClick={handleSignup}
					>
						Sign Up
					</CustomButton>

					<Text textAlign="left">
						Already have an account?{' '}
						<Link as={RouterLink} to="/login" color="blue.500">
							Click here to sign in.
						</Link>
					</Text>
				</Stack>
			</Card>
		</Stack>
	);
};

export default Signup;
