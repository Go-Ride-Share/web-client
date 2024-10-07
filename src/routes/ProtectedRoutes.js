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
		</Routes>
	);
};

export default ProtectedRoutes;
