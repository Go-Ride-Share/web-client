import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        primary: '#eec23e',
        secondary: '#e5af0b',
        tertiary: '#c69709',
        accent: '#fefaee',
        background: '#fffefa',
        text: '#373737',
    },
    styles: {
        global: {
            body: {
                bg: 'background',
                color: 'text',
            },
        },
    },
});

export default theme;