import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Nav from "./Nav";
import Login from "./Login";
import Post from "./Post";
import Signup from "./Signup";

const PageWithNav = ({ login, signup, post }) => {
  return (
    <Box>
      <Nav />
      <Box as="main" p="4">
        {login ? <Login /> : signup ? <Signup /> : post ? <Post /> : <Outlet />}
      </Box>
    </Box>
  );
};

PageWithNav.propTypes = {
	login: PropTypes.bool,
	signup: PropTypes.bool,
	post: PropTypes.bool,
};

export default PageWithNav;
