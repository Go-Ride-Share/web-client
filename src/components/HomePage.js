import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import PostList from './PostList';
import SearchRides from './SearchRides';

const HomePage = () => {
	return (
		<Flex
			direction={{ base: 'column', md: 'row' }}
			p="6"
			w="100%"
			alignItems="stretch"
		>
			<Box flex="2" mr={{ base: 0, md: 6 }} mb={{ base: 6, md: 0 }} mt={10}>
				<SearchRides />
			</Box>

			<Box flex="1" mt="-8">
				<PostList />
			</Box>
		</Flex>
	);
};

export default HomePage;
