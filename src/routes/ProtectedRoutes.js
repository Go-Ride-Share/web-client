import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageWithNav from '../components/PageWithNav';

const ProtectedRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<PageWithNav homePage />} />
			<Route path="/login" element={<PageWithNav login />} />
			<Route path="/signup" element={<PageWithNav signup />} />
			<Route path="/user" element={<PageWithNav user />} />
      <Route path="/createPost" element={<PageWithNav createPost />} />
			<Route path="/userPosts" element={<PageWithNav userPosts />} />
			<Route path="/post/:postId" element={<PageWithNav post />} />
			<Route path="/editPost/:postId" element={<PageWithNav editPost />} />
		</Routes>
	);
};

export default ProtectedRoutes;
