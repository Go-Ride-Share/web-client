import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
	Flex,
	Box,
	Button,
	Link,
	Image,
	useTheme,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { FiLogOut } from 'react-icons/fi';
import { isLoggedIn } from './Utils.js';
import logo from '../assets/images/LogoNotBlack.png';
import DefaultPhoto from '../assets/images/DefaultUserImage.png';

const Nav = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [userPhoto, setUserPhoto] = useState(DefaultPhoto);

	useEffect(() => {
		const storedPhoto = localStorage.getItem('user_photo');
		const photoToUse =
			storedPhoto && storedPhoto !== 'null' ? storedPhoto : DefaultPhoto;

		setUserPhoto(photoToUse);
	}, []);

	const handleSignOut = () => {
		localStorage.removeItem('logic_token');
		localStorage.removeItem('db_token');
		localStorage.removeItem('user_id');
		localStorage.removeItem('user_photo');
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith('conversation_')) {
				localStorage.removeItem(key);
			}
		});
		if (window.location.pathname === '/') {
			window.location.reload();
		} else {
			navigate('/');
		}
	};

	const handleEditAccount = () => {
		navigate('/user');
	};

	const handleViewPosts = () => {
		navigate('/userPosts');
	};

	return (
		<Flex
			as="nav"
			align="center"
			justify="space-between"
			padding="0.5rem"
			bg={theme.colors.primary}
			color={theme.colors.white}
			boxShadow="md"
			fontFamily="CaviarDreams"
		>
			<Link as={RouterLink} to="/">
				<Image
					src={logo}
					alt="Go App Logo"
					boxSize="40px"
					objectFit="contain"
					quality={100}
				/>
			</Link>

			<Box>
				{isLoggedIn() && (
					<Link
						as={RouterLink}
						to="/createPost"
						fontSize="lg"
						fontWeight="bold"
						color={theme.colors.text}
						mr="4"
					>
						Post a Ride
					</Link>
				)}
				{isLoggedIn() ? (
					<>
						<Button
							onClick={handleViewPosts}
							bg={theme.colors.secondary}
							color={theme.colors.text}
							_hover={{
								bg: theme.colors.tertiary,
								boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
							}}
							mr="4"
							width="8rem"
							boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
						>
							My Posts
						</Button>
						<Menu>
							<MenuButton
								as={IconButton}
								aria-label="Options"
								icon={
									<Image
										src={userPhoto}
										boxSize="30px"
										objectFit="cover"
										borderRadius="full"
										quality={100}
									/>
								}
								bg={theme.colors.secondary}
								color={theme.colors.text}
								_hover={{
									bg: theme.colors.tertiary,
									boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
								}}
								boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
							/>
							<MenuList
								bg={theme.colors.tertiary}
								color={theme.colors.text}
								boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
							>
								<MenuItem
									bg={theme.colors.secondary}
									color={theme.colors.text}
									_hover={{
										bg: theme.colors.tertiary,
										boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
									}}
									boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
									icon={<EditIcon />}
									onClick={handleEditAccount}
								>
									Edit Account
								</MenuItem>
								<MenuItem
									bg={theme.colors.secondary}
									color={theme.colors.text}
									_hover={{
										bg: theme.colors.tertiary,
										boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
									}}
									boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
									icon={<FiLogOut />}
									onClick={handleSignOut}
								>
									Sign Out
								</MenuItem>
							</MenuList>
						</Menu>
					</>
				) : (
					<Button
						as={RouterLink}
						to="/login"
						bg={theme.colors.secondary}
						color={theme.colors.text}
						_hover={{
							bg: theme.colors.tertiary,
							boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)',
						}}
						mr="4"
						width="8rem"
						boxShadow="inset 0 0 5px rgba(0, 0, 0, 0.3)"
					>
						Sign In
					</Button>
				)}
			</Box>
		</Flex>
	);
};

export default Nav;
