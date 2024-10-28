import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import Post from './Post';
import PostList from './PostList';
import HomePage from './HomePage';
import AllConversationsDrawer from './AllConversations';
import { isLoggedIn } from './Utils.js';

const PageWithNav = ({ login, signup, user, post, posts, homePage }) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn() && (login || signup)) {
			navigate('/');
		}
	}, [login, signup, navigate]);

	return (
		<Box>
			<Nav />
			<Box as="main" p="4">
				{login ? (
					<Login />
				) : signup ? (
					<Signup />
				) : user ? (
					<UserProfile />
				) : post ? (
					<Post />
				) : posts ? (
					<PostList usersRides />
				) : homePage ? (
					<HomePage />
				) : (
					<Outlet />
				)}
			</Box>
			<AllConversationsDrawer /> 
		</Box>
	);
};

PageWithNav.propTypes = {
	login: PropTypes.bool,
	signup: PropTypes.bool,
	user: PropTypes.bool,
	post: PropTypes.bool,
	posts: PropTypes.bool,
	homePage: PropTypes.bool,
};

export default PageWithNav;
