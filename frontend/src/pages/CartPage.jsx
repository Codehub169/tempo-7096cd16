import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Grid, Heading, Text, Button, Image, Icon, HStack, Input, VStack, Divider, Link as ChakraLink, IconButton, useToast, Alert, AlertIcon, CircularProgress } from '@chakra-ui/react';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiAlertCircle } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const API_BASE_URL = '/api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please login to view your cart.');
      setIsLoading(false);
      navigate('/login');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            navigate('/login');
            throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Backend returns product_id, quantity, name, price, imageUrl
      setCartItems(data.map(item => ({...item, id: item.product_id}))); // Ensure 'id' field for consistency if components expect it
      setError(null);
    } catch (e) {
      console.error("Failed to fetch cart items:", e);
      setError(e.message);
      toast({ title: 'Error fetching cart', description: e.message, status: 'error', duration: 3000, isClosable: true, position: 'top-right' });
    }
    setIsLoading(false);
  }, [toast, navigate]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      // Refresh cart items from server to ensure consistency
      fetchCartItems(); 
    } catch (e) {
      toast({ title: 'Error updating quantity', description: e.message, status: 'error', duration: 2000, isClosable: true, position: 'top-right' });
    }
  };

  const handleQuantityChange = (itemId, amount) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + amount);
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }

    const itemToRemove = cartItems.find(item => item.id === itemId);
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to remove item');
      // setCartItems(currentItems => currentItems.filter(item => item.id !== itemId)); // Optimistic update removed, fetchCartItems will handle
      fetchCartItems(); // Re-sync with server
      toast({
        title: `${itemToRemove?.name || 'Item'} removed from cart.`,
        status: 'info', 
        variant: 'subtle',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
        icon: <FiTrash2 />
      });
    } catch (e) {
      toast({ title: 'Error removing item', description: e.message, status: 'error', duration: 2000, isClosable: true, position: 'top-right' });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = cartItems.length > 0 ? 5.00 : 0; // Example shipping cost
  const total = subtotal + shippingCost;

  if (isLoading) {
    return <Flex justify="center" align="center" minH="60vh"><CircularProgress isIndeterminate color="brand.primary" /></Flex>;
  }

  if (error && cartItems.length === 0) { // check cartItems.length to avoid showing this if cart just failed to update but still has items
    return (
      <Box textAlign="center" py={10} px={4}>
        <Alert status="error" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={10} borderRadius="md" variant="subtle">
          <AlertIcon as={FiAlertCircle} boxSize="40px" mr={0} />
          <Heading size="md" mt={4} mb={2}>Oops! Couldn't load your cart.</Heading>
          <Text mt={4}>{error}</Text>
          {error.includes('login') && <Button as={RouterLink} to="/login" colorScheme="primary" mt={4}>Login</Button>}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box py={{ base: '3rem', md: '4rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2.5rem', md: '3rem' }} color="brand.heading" fontWeight="bold">
          Your Shopping Cart
        </Heading>
      </Box>

      <Box py={{ base: '3rem', md: '4rem' }} px={{ base: 4, md: 8 }} maxW="1100px" mx="auto">
        {cartItems.length === 0 ? (
          <VStack spacing={6} textAlign="center" bg="white" p={{base: 6, md: 10}} borderRadius="20px" boxShadow="lg">
            <Icon as={FiShoppingCart} boxSize="60px" color="brand.primary" />
            <Heading size="lg" color="brand.heading">Your cart is adorably empty!</Heading>
            <Text color="brand.text">Looks like you haven't picked any pals to bring home yet.</Text>
            <Button as={RouterLink} to="/shop" variant="gradient" size="lg" mt={4}>
              Find Your New Friend
            </Button>
          </VStack>
        ) : (
          <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1.5fr' }} gap={{base:6, md:8}} alignItems="flex-start">
            {/* Cart Items List */}
            <VStack spacing={5} bg="white" p={{base:4, md:6}} borderRadius="20px" boxShadow="lg" divider={<Divider borderColor="brand.border" />}>
              {cartItems.map(item => (
                <Flex 
                  key={item.id} 
                  align={{base: 'flex-start', sm: 'center'}} 
                  justify="space-between" 
                  w="100%" 
                  direction={{base: 'column', sm: 'row'}}
                  py={3}
                  position="relative" // For absolute positioning of remove button on mobile
                >
                  <Flex align="center" flex={{base: '1', sm: 'auto'}} mb={{base: 4, sm: 0}} width={{base: '100%', sm: 'auto'}}>
                    <Image src={item.imageUrl || `https://placehold.co/100x100/ccc/3a3a3a?text=${encodeURIComponent(item.name)}`} alt={item.name} boxSize={{base: '70px', md: '90px'}} objectFit="cover" borderRadius="15px" bg="brand.secondary" mr={4} />
                    <Box flexGrow={1}>
                      <ChakraLink as={RouterLink} to={`/product/${item.product_id}`} _hover={{color: 'brand.primary'}}>
                        <Heading size="sm" color="brand.heading" mb={1} noOfLines={2}>{item.name}</Heading>
                      </ChakraLink>
                      <Text fontSize="md" color="brand.text">${item.price.toFixed(2)}</Text>
                    </Box>
                  </Flex>
                  
                  <HStack spacing={{base:2, md:3}} flexShrink={0} my={{base: 2, sm: 0}} alignSelf={{base: 'flex-start', sm: 'center'}} pl={{base: 'calc(70px + 1rem)', sm:0}}> 
                    <IconButton icon={<FiMinus />} size="sm" variant="outline" colorScheme="primary" onClick={() => handleQuantityChange(item.id, -1)} isRound aria-label="Decrease quantity" isDisabled={item.quantity <= 1}/>
                    <Input value={item.quantity} readOnly textAlign="center" w="45px" h="38px" focusBorderColor="brand.primary" borderRadius="md" />
                    <IconButton icon={<FiPlus />} size="sm" variant="outline" colorScheme="primary" onClick={() => handleQuantityChange(item.id, 1)} isRound aria-label="Increase quantity"/>
                  </HStack>

                  <Text fontWeight="semibold" color="brand.heading" fontSize={{base: 'md', sm: 'lg'}} mx={{base:0, sm:4}} my={{base: 2, sm: 0}} minW="70px" textAlign={{base:'right', sm: 'center'}} alignSelf={{base: 'flex-end', sm: 'center'}} pl={{base: 'calc(70px + 1rem)', sm:0}}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  
                  <IconButton icon={<FiTrash2 />} variant="ghost" colorScheme="red" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item" size="md" alignSelf={{base: 'flex-end', sm: 'center'}} position={{base: 'absolute', sm: 'static'}} top={{base: 2, sm:'auto'}} right={{base:2, sm:'auto'}}/>
                </Flex>
              ))}
            </VStack>

            {/* Order Summary */}
            <Box bg="white" p={{base:5, md:6}} borderRadius="20px" boxShadow="lg" position={{ lg: 'sticky' }} top={{ lg: '120px' }}>
              <Heading size="lg" color="brand.heading" mb={6} pb={3} borderBottom="2px solid" borderColor="brand.secondary">
                Order Summary
              </Heading>
              <VStack spacing={4} align="stretch" mb={6}>
                <Flex justify="space-between">
                  <Text color="brand.text" fontSize="md">Subtotal</Text>
                  <Text fontWeight="medium" fontSize="md">${subtotal.toFixed(2)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="brand.text" fontSize="md">Estimated Shipping</Text>
                  <Text fontWeight="medium" fontSize="md">${shippingCost.toFixed(2)}</Text>
                </Flex>
                <Divider my={2} borderColor="brand.border"/>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="brand.heading">Order Total</Heading>
                  <Heading size="lg" color="brand.primary">${total.toFixed(2)}</Heading>
                </Flex>
              </VStack>
              <Button as={RouterLink} to="/checkout" variant="gradient" size="lg" w="100%" mt={2} isDisabled={cartItems.length === 0}>
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default CartPage;
