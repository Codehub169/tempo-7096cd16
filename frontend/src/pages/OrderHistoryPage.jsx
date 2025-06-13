import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Button, Divider, Icon, Flex, CircularProgress, useToast, Link as ChakraLink, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiBox, FiAlertCircle, FiEye, FiArrowLeft } from 'react-icons/fi';
import { ChevronRightIcon } from '@chakra-ui/icons';

const API_BASE_URL = '/api'; // Changed to relative path

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ title: 'Authentication Required', description: 'Please login to view your order history.', status: 'warning', duration: 3000, isClosable: true, position: 'top-right' });
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            navigate('/login');
            throw new Error('Authentication failed. Please login again.');
          }
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (e) {
        console.error("Failed to fetch orders:", e);
        setError(e.message);
        toast({ title: 'Error loading orders', description: e.message, status: 'error', duration: 3000, isClosable: true, position: 'top-right'});
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [navigate, toast]);

  if (isLoading) {
    return <Flex justify="center" align="center" minH="60vh"><CircularProgress isIndeterminate color="brand.primary" /></Flex>;
  }

  if (error) {
    return (
        <Flex direction="column" align="center" justify="center" minH="60vh" bg="brand.lightBg" py={10} px={4}>
            <Icon as={FiAlertCircle} w={16} h={16} color="red.500" mb={4}/>
            <Heading size="lg" color="brand.heading" mb={2}>Oops! Something went wrong.</Heading>
            <Text color="brand.text" mb={6}>{error}</Text>
            <Button as={RouterLink} to="/account" variant="outline" colorScheme="primary">
                Back to Account
            </Button>
        </Flex>
    );
  }

  return (
    <Box>
      <Box py={{ base: '2rem', md: '3rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color="brand.heading" fontWeight="bold">
          My Order History
        </Heading>
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="brand.text" />} display="flex" justifyContent="center" mt={2}>
            <BreadcrumbItem>
                <BreadcrumbLink as={RouterLink} to='/' color="brand.primary" _hover={{textDecoration: 'underline'}}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink as={RouterLink} to='/account' color="brand.primary" _hover={{textDecoration: 'underline'}}>Account</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href='#' color="brand.text">Order History</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Box maxW="1000px" mx="auto" py={{ base: '2rem', md: '3rem' }} px={{ base: 4, md: 0 }}>
        {orders.length === 0 ? (
          <VStack spacing={6} textAlign="center" bg="white" p={{base: 6, md: 10}} borderRadius="20px" boxShadow="lg">
            <Icon as={FiBox} boxSize="60px" color="brand.primary" />
            <Heading size="lg" color="brand.heading">No Orders Yet!</Heading>
            <Text color="brand.text">You haven't adopted any plushies yet. Time to find some new friends!</Text>
            <Button as={RouterLink} to="/shop" variant="gradient" size="lg" mt={4}>
              Shop for Plushies
            </Button>
          </VStack>
        ) : (
          <Box bg="white" p={{base:4, md:6}} borderRadius="20px" boxShadow="lg">
            <TableContainer>
              <Table variant="simple" colorScheme="pink">
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>Date</Th>
                    <Th>Total</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.map(order => (
                    <Tr key={order.id} _hover={{bg: 'brand.lightBg'}}>
                      <Td fontWeight="medium" color="brand.primary">#{order.id}</Td>
                      <Td>{new Date(order.order_date).toLocaleDateString()}</Td>
                      <Td>${parseFloat(order.total_amount).toFixed(2)}</Td>
                      <Td>
                        <Tag size="md" variant="subtle" colorScheme={order.status === 'Confirmed' ? 'green' : 'yellow'}>
                          {order.status}
                        </Tag>
                      </Td>
                      <Td>
                        <IconButton 
                            icon={<FiEye />} 
                            aria-label="View Order" 
                            variant="ghost" 
                            colorScheme="primary" 
                            onClick={() => toast({title: 'Coming Soon!', description: 'Detailed order view is under construction.', status: 'info', duration: 2000, isClosable: true})} // Placeholder, added isClosable
                            />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <Flex justify="center" mt={8}>
             <Button as={RouterLink} to="/account" variant="outline" colorScheme="primary" leftIcon={<FiArrowLeft />}>
                Back to My Account
            </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default OrderHistoryPage;
