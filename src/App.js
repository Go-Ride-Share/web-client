import React from 'react';
import Router from './routes/Router';
import './assets/styles/fonts.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as RouterProvider } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import theme from './theme';

function App() {
	return (
		<ChakraProvider theme={theme}>
			<RouterProvider>
				<LoadScript
					libraries={['places']}
					googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
				>
					<Router />
				</LoadScript>
			</RouterProvider>
		</ChakraProvider>
	);
}

export default App;
