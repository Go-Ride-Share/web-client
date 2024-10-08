import React, { useState, useEffect } from 'react';
import {
	Stack,
	Input,
	Textarea,
	InputGroup,
	InputLeftElement,
	InputLeftAddon,
	IconButton,
	Image,
	Spinner,
	Heading,
	Card,
	Text,
	useTheme,
	Box,
	Flex,
} from '@chakra-ui/react';
import { FiEdit, FiUpload } from 'react-icons/fi';
import CustomButton from './Button';
import { getUser, editUser } from '../api-client/ApiClient';
import DefaultPhoto from '../assets/images/DefaultUserImage.png';

const UserProfile = () => {
	const theme = useTheme();
	const [userData, setUserData] = useState({
		name: '',
		email: '',
		bio: '',
		phone: '',
		photo: null,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [photoPreview, setPhotoPreview] = useState(null);
	const [editableFields, setEditableFields] = useState({
		name: false,
		bio: false,
		phone: false,
		photo: false,
	});
	const [phoneError, setPhoneError] = useState('');
	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			const result = await getUser();
			if (result.error) {
				setError(result.error);
			} else {
				setUserData(result);
				setPhotoPreview(result.photo);
			}
			setLoading(false);
		};
		fetchUserData();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === 'phone') {
			const phoneRegex = /^\d{10}$/;
			if (!phoneRegex.test(value)) {
				setPhoneError('Phone number must be 10 digits.');
			} else {
				setPhoneError('');
			}
		}

		setUserData((prevState) => ({
			...prevState,
			[name]: value,
		}));

		setIsChanged(true);
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoPreview(reader.result);
				setUserData((prevState) => ({ ...prevState, photo: reader.result }));
			};
			reader.readAsDataURL(file);
		}

		setIsChanged(true);
	};

	const toggleEditableField = (field) => {
		setEditableFields((prevState) => ({
			...prevState,
			[field]: !prevState[field],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccessMessage('');

		if (phoneError) {
			setError(phoneError);
			return;
		}

		const result = await editUser(userData);
		if (result.error) {
			setError(result.error);
		} else {
			setSuccessMessage('User information updated successfully.');
			const updatedUserData = await getUser();
			if (updatedUserData.error) {
				setError(updatedUserData.error);
			} else {
				setUserData(updatedUserData);
				setPhotoPreview(updatedUserData.photo);
				setIsChanged(false);
			}
		}
	};

	return (
		<Stack spacing={6} maxW="md" mx="auto" mt="8" fontFamily="CaviarDreams">
			<Heading as="h2" size="lg" textAlign="center" fontFamily="CaviarDreams">
				Your Information
			</Heading>

			<Card
				p="8"
				boxShadow="xl"
				bg={theme.colors.accent}
				color={theme.colors.text}
			>
				{loading && <Spinner size="xl" color={theme.colors.secondary} />}
				<Stack spacing={4}>
					{error && (
						<Text color="red.500" align={'center'}>
							{error}
						</Text>
					)}
					{successMessage && <Text color="green.500">{successMessage}</Text>}

					<Flex alignItems="center" mb={4}>
						<InputGroup>
							<Input
								placeholder="Name"
								type="text"
								name="name"
								value={userData.name}
								onChange={handleInputChange}
								isReadOnly={!editableFields.name}
								bg={theme.colors.background}
								_placeholder={{ color: theme.colors.textLight }}
							/>
						</InputGroup>
						<IconButton
							aria-label="Edit Name"
							icon={<FiEdit />}
							onClick={() => toggleEditableField('name')}
							variant="ghost"
							ml={2}
						/>
					</Flex>

					<Flex alignItems="center" mb={4}>
						<InputGroup>
							<Input
								placeholder="Email Address"
								type="email"
								name="email"
								value={userData.email}
								isReadOnly
								bg={theme.colors.background}
								_placeholder={{ color: theme.colors.textLight }}
							/>
						</InputGroup>
					</Flex>

					<Flex alignItems="center" mb={4}>
						<InputGroup>
							<Textarea
								placeholder="Bio"
								name="bio"
								value={userData.bio}
								onChange={handleInputChange}
								isReadOnly={!editableFields.bio}
								bg={theme.colors.background}
								_placeholder={{ color: theme.colors.textLight }}
							/>
						</InputGroup>
						<IconButton
							aria-label="Edit Bio"
							icon={<FiEdit />}
							onClick={() => toggleEditableField('bio')}
							variant="ghost"
							ml={2}
						/>
					</Flex>

					<Flex alignItems="center" mb={4}>
						<InputGroup>
							<InputLeftAddon>+1</InputLeftAddon>
							<Input
								placeholder="Phone Number"
								type="tel"
								name="phone"
								value={userData.phone}
								onChange={handleInputChange}
								isReadOnly={!editableFields.phone}
								bg={theme.colors.background}
								_placeholder={{ color: theme.colors.textLight }}
							/>
						</InputGroup>
						<IconButton
							aria-label="Edit Phone"
							icon={<FiEdit />}
							onClick={() => toggleEditableField('phone')}
							variant="ghost"
							ml={2}
						/>
					</Flex>
					{phoneError && <Text color="red.500">{phoneError}</Text>}

					<Flex alignItems="center" mb={4}>
						<Box>
							<Image
								src={photoPreview || DefaultPhoto}
								alt="Uploaded Preview"
								boxSize="100px"
								objectFit="cover"
								borderRadius="full"
								mt={4}
							/>
						</Box>
						<IconButton
							aria-label="Edit Photo"
							icon={<FiEdit />}
							onClick={() => toggleEditableField('photo')}
							variant="ghost"
							ml={4}
							mt={4}
						/>
					</Flex>

					{editableFields.photo && (
						<InputGroup mb={4}>
							<InputLeftElement pointerEvents="none">
								<IconButton
									aria-label="Upload Picture"
									icon={<FiUpload />}
									bg="transparent"
									color="gray.500"
									_hover={{ color: theme.colors.secondary }}
								/>
							</InputLeftElement>
							<Input
								type="file"
								accept="image/*"
								onChange={handlePhotoChange}
								bg={theme.colors.background}
								pl="12"
								_placeholder={{ color: theme.colors.textLight }}
							/>
						</InputGroup>
					)}

					<CustomButton
						size="md"
						isDisabled={!isChanged || phoneError}
						onClick={handleSubmit}
					>
						Update Information
					</CustomButton>
				</Stack>
			</Card>
		</Stack>
	);
};

export default UserProfile;
