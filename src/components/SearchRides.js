import { Card, Text, useTheme } from '@chakra-ui/react';

const SearchRides = () => {
	const theme = useTheme();
	return (
		<Card
			p="4"
			boxShadow="xl"
			w="100%"
			maxW="3xl"
			h="300px"
			mx="auto"
			bg={theme.colors.accent}
			mb="6"
			color={theme.colors.text}
			fontFamily="CaviarDreams"
		>
			<Card
				p="4"
				boxShadow="md"
				w="99%"
				h="99%"
				m="auto"
				bg={theme.colors.background}
				color={theme.colors.text}
			>
				<Text fontSize="lg" color="gray.500" textAlign="center">
					Search and filter rides will be implemented here.
				</Text>
			</Card>
		</Card>
	);
};

export default SearchRides;
