import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';

const PageWithNav = ({ login, signup, user }) => {
	return (
		<Box>
			<Nav />
			<Box as="main" p="4">
				{login ? <Login /> : signup ? <Signup /> : user? <UserProfile /> : <Outlet />}
			</Box>
		</Box>
	);
};

PageWithNav.propTypes = {
	login: PropTypes.bool,
	signup: PropTypes.bool,
};

export default PageWithNav;
