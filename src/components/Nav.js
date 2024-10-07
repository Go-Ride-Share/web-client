import { React } from 'react';
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
import logo from '../assets/images/LogoNotBlack.png';
import DefaultPhoto from '../assets/images/DefaultUserImage.png';

const Nav = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const userPhoto = localStorage.getItem('user_photo');

	const isLoggedIn = () => {
		return (
			localStorage.getItem('logic_token') &&
			localStorage.getItem('db_token') &&
			localStorage.getItem('user_id')
		);
	};

	const handleSignOut = () => {
		localStorage.removeItem('logic_token');
		localStorage.removeItem('db_token');
		localStorage.removeItem('user_id');
		localStorage.removeItem('user_photo');
		navigate('/');
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
				<Link
					as={RouterLink}
					to="/post"
					fontSize="lg"
					fontWeight="bold"
					color={theme.colors.text}
					mr="4"
				>
					Post a Ride
				</Link>
				{isLoggedIn() ? (
					<>
						<Button
							onClick={handleSignOut}
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
							Sign Out
						</Button>
						<Menu>
							<MenuButton
								as={IconButton}
								aria-label="Options"
								icon={
									<Image
										src={userPhoto || DefaultPhoto}
										boxSize="40px"
										objectFit="cover"
										borderRadius="full"
										quality={100}
										mb={2}
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
								>
									Edit Account
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
