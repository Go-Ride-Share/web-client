import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Login from "./Login";

const PageWithNav = ({ login }) => {
  return (
    <Box>
      <Nav />
      <Box as="main" p="4">
        {login ? <Login /> : <Outlet />}
      </Box>
    </Box>
  );
};

PageWithNav.propTypes = {
  login: PropTypes.bool,
};

export default PageWithNav;
