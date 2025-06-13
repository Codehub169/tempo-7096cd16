import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer'; // Assuming Footer will be created later

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box as="main" flexGrow={1} pt="80px"> {/* Add padding top to prevent overlap with sticky header */}
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
