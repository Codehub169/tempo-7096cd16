import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Button, Divider, Icon, Flex, CircularProgress, useToast, Link as ChakraLink, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiUser, FiBox, FiLogOut, FiSettings, FiHeart, FiAlertCircle } from 'react-icons/fi';

const API_BASE_URL = '/api'; // Changed to relative path

const UserAccountPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to view your account.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/login');
      return;
    }

    const fetchAccountData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch basic user data (if an endpoint exists, e.g. /api/auth/me)
        // For now, let's assume username is in token or can be fetched.
        // If not, we'll use a generic welcome.
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Basic JWT decode
        setUserData({ username: decodedToken.username, userId: decodedToken.userId });

        // Fetch order count
        const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!ordersResponse.ok) throw new Error('Failed to fetch order count');
        const ordersData = await ordersResponse.json();
        setOrderCount(ordersData.length);

      } catch (e) {
        console.error("Failed to fetch account data:", e);
        setError(e.message);
        toast({ title: 'Error loading account', description: e.message, status: 'error', duration: 3000, isClosable: true, position: 'top-right'});
      }
      setIsLoading(false);
    };

    fetchAccountData();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast({ title: 'Logged Out', description: "You've been successfully logged out.", status: 'info', duration: 2000, isClosable: true, position: 'top-right'});
    navigate('/login');
  };

  if (isLoading) {
    return <Flex justify="center" align="center" minH="60vh"><CircularProgress isIndeterminate color="brand.primary" /></Flex>;
  }

  if (error) {
    return (
        <Flex direction="column" align="center" justify="center" minH="60vh" bg="brand.lightBg" py={10} px={4}>
            <Icon as={FiAlertCircle} w={16} h={16} color="red.500" mb={4}/>
            <Heading size="lg" color="brand.heading" mb={2}>Oops! Something went wrong.</Heading>
            <Text color="brand.text" mb={6}>{error}</Text>
            <Button as={RouterLink} to="/" variant="outline" colorScheme="primary">
                Go to Homepage
            </Button>
        </Flex>
    );
  }

  return (
    <Box>
      <Box py={{ base: '2rem', md: '3rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color="brand.heading" fontWeight="bold">
          Welcome, {userData?.username || 'Plushie Pal'}!
        </Heading>
        <Text color="brand.text" mt={1}>Manage your plushie adventures here.</Text>
      </Box>

      <Box maxW="900px" mx="auto" py={{ base: '2rem', md: '3rem' }} px={{ base: 4, md: 0 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            <Stat bg="white" p={6} borderRadius="xl" boxShadow="md">
                <StatLabel display="flex" alignItems="center" color="brand.text"><Icon as={FiBox} mr={2} color="brand.primary"/>Total Orders</StatLabel>
                <StatNumber fontSize="3xl" color="brand.heading">{orderCount}</StatNumber>
                <StatHelpText>Your history of adopted plushies.</StatHelpText>
            </Stat>
            <Stat bg="white" p={6} borderRadius="xl" boxShadow="md">
                <StatLabel display="flex" alignItems="center" color="brand.text"><Icon as={FiHeart} mr={2} color="brand.primary"/>Wishlist</StatLabel>
                <StatNumber fontSize="3xl" color="brand.heading">0</StatNumber>
                <StatHelpText>Coming Soon!</StatHelpText>
            </Stat>
        </SimpleGrid>

        <VStack spacing={6} align="stretch" bg="white" p={{base:6, md:8}} borderRadius="xl" boxShadow="lg">
          <Heading size="lg" color="brand.heading" pb={2} borderBottom="2px solid" borderColor="brand.secondary">
            Account Dashboard
          </Heading>
          
          <Button as={RouterLink} to="/account/orders" leftIcon={<FiBox />} justifyContent="flex-start" variant="ghost" colorScheme="primary" size="lg" _hover={{bg: 'brand.lightBg'}}>
            My Orders
          </Button>
          <Button leftIcon={<FiUser />} justifyContent="flex-start" variant="ghost" colorScheme="primary" size="lg" _hover={{bg: 'brand.lightBg'}} isDisabled>
            Profile Details (Coming Soon)
          </Button>
          <Button leftIcon={<FiSettings />} justifyContent="flex-start" variant="ghost" colorScheme="primary" size="lg" _hover={{bg: 'brand.lightBg'}} isDisabled>
            Account Settings (Coming Soon)
          </Button>
          
          <Divider my={4} borderColor="brand.border"/>

          <Button onClick={handleLogout} leftIcon={<FiLogOut />} justifyContent="flex-start" colorScheme="red" variant="subtle" size="lg">
            Logout
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default UserAccountPage;
