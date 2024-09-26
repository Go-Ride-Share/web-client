import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Nav from './Nav';

const PageWithNav = () => {
  return (
    <Box>
      <Nav />
      
      <Box as="main" p="4">
        <Outlet />
      </Box>
    </Box>
  );
};

export default PageWithNav;
