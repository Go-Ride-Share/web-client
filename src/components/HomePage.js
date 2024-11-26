import React, { useState } from 'react';
import { Flex, Box, Heading, Stack } from '@chakra-ui/react';
import PostList from './PostList';
import SearchRides from './SearchRides';

const HomePage = () => {
	const [posts, setPosts] = useState(null);

	return (
		<Flex
			direction={{ base: 'column', md: 'row' }}
			p="6"
			w="100%"
			alignItems="stretch"
		>
			<Stack fontFamily="CaviarDreams" mt={"-4"}>
				<Heading as="h2" size="lg" textAlign="center" fontFamily="CaviarDreams" mb={"4"}>
					{'Search For Rides'}
				</Heading>
				<Box flex="2" mr={{ base: 0, md: 6 }} mb={{ base: 6, md: 0 }}>
					<SearchRides setPosts={setPosts} />
				</Box>
			</Stack>
			<Box flex="1" mt="-8">
				<PostList postsProp={posts} />
			</Box>
		</Flex>
	);
};

export default HomePage;
