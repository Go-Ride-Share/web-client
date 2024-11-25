import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import CreatePost from './CreatePost';
import Post from './Post';
import PostList from './PostList';
import HomePage from './HomePage';
import AllConversationsDrawer from './AllConversations';
import { isLoggedIn } from './Utils.js';

const PageWithNav = ({
	login,
	signup,
	user,
	createPost,
	userPosts,
	homePage,
	post,
	editPost
}) => {
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
				) : createPost ? (
					<CreatePost />
				) : post ? (
					<Post />
				) : userPosts ? (
					<PostList usersRides />
				) : editPost ? (
					<CreatePost edit/>
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
	createPost: PropTypes.bool,
	editPost: PropTypes.bool,
	userPosts: PropTypes.bool,
	homePage: PropTypes.bool,
};

export default PageWithNav;
