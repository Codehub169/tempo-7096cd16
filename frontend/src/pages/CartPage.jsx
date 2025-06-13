import React, { useState } from 'react';
import { Box, Flex, Grid, Heading, Text, Button, Image, Icon, HStack, Input, VStack, Divider, Link as ChakraLink, IconButton, useToast, Alert, AlertIcon } from '@chakra-ui/react';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

// Placeholder cart data - replace with actual state management (e.g., Context or Redux)
const initialCartItems = [
  { id: '1', name: 'Barnaby Bear', price: 29.99, quantity: 1, image: 'https://placehold.co/100x100/fddde6/3a3a3a?text=Bear', slug: 'barnaby-bear' }, // Added slug for linking
  { id: '2', name: 'Flippy Penguin', price: 24.99, quantity: 2, image: 'https://placehold.co/100x100/a9def9/3a3a3a?text=Penguin', slug: 'flippy-penguin' },
  { id: '3', name: 'Leo the Lion', price: 32.99, quantity: 1, image: 'https://placehold.co/100x100/fcf6bd/3a3a3a?text=Lion', slug: 'leo-the-lion' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const toast = useToast();

  const handleQuantityChange = (itemId, amount) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      ) // Keep item even if quantity is 0, user must explicitly remove. Or filter: .filter(item => item.quantity > 0) 
    );
  };

  const handleRemoveItem = (itemId) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
    toast({
      title: `${itemToRemove?.name || 'Item'} removed from cart.`,
      status: 'error', // More appropriate for removal
      variant: 'subtle',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
      icon: <FiTrash2 />
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = cartItems.length > 0 ? 5.00 : 0; // Example shipping cost
  const total = subtotal + shippingCost;

  return (
    <Box>
      <Box py={{ base: '3rem', md: '4rem' }} bgGradient="linear(to-br, secondary.100, bg.100)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2.5rem', md: '3rem' }} color="headingColor" fontWeight="bold">
          Your Shopping Cart
        </Heading>
      </Box>

      <Box py={{ base: '3rem', md: '4rem' }} px={{ base: 4, md: 8 }} maxW="1100px" mx="auto">
        {cartItems.length === 0 ? (
          <VStack spacing={6} textAlign="center" bg="white" p={10} borderRadius="20px" boxShadow="lg">
            <Icon as={FiShoppingCart} boxSize="60px" color="primary.300" />
            <Heading size="lg" color="headingColor">Your cart is adorably empty!</Heading>
            <Text color="textColor.600">Looks like you haven't picked any pals to bring home yet.</Text>
            <Button as={RouterLink} to="/shop" variant="gradient" size="lg" mt={4}>
              Find Your New Friend
            </Button>
          </VStack>
        ) : (
          <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1.5fr' }} gap={{base:6, md:8}} alignItems="flex-start">
            {/* Cart Items List */}
            <VStack spacing={5} bg="white" p={{base:4, md:6}} borderRadius="20px" boxShadow="lg" divider={<Divider borderColor="borderColor" />}>
              {cartItems.map(item => (
                <Flex 
                  key={item.id} 
                  align={{base: 'flex-start', sm: 'center'}} 
                  justify="space-between" 
                  w="100%" 
                  direction={{base: 'column', sm: 'row'}}
                  py={3}
                >
                  <Flex align="center" flex={{base: '1', sm: 'auto'}} mb={{base: 4, sm: 0}} width={{base: '100%', sm: 'auto'}}>
                    <Image src={item.image} alt={item.name} boxSize={{base: '70px', md: '90px'}} objectFit="cover" borderRadius="15px" bg="secondary.50" mr={4} />
                    <Box flexGrow={1}>
                      <ChakraLink as={RouterLink} to={`/product/${item.id}`} _hover={{color: 'primary.500'}}>
                        <Heading size="sm" color="headingColor" mb={1} noOfLines={2}>{item.name}</Heading>
                      </ChakraLink>
                      <Text fontSize="md" color="textColor.600">${item.price.toFixed(2)}</Text>
                    </Box>
                  </Flex>
                  
                  <HStack spacing={{base:2, md:3}} flexShrink={0} my={{base: 2, sm: 0}} alignSelf={{base: 'flex-start', sm: 'center'}} pl={{base: '94px', sm:0}}> {/* Align with image for mobile */} 
                    <IconButton icon={<FiMinus />} size="sm" variant="outline" colorScheme="primary" onClick={() => handleQuantityChange(item.id, -1)} isRound aria-label="Decrease quantity" isDisabled={item.quantity <= 1}/>
                    <Input value={item.quantity} readOnly textAlign="center" w="45px" h="38px" focusBorderColor="primary.500" borderRadius="md" />
                    <IconButton icon={<FiPlus />} size="sm" variant="outline" colorScheme="primary" onClick={() => handleQuantityChange(item.id, 1)} isRound aria-label="Increase quantity"/>
                  </HStack>

                  <Text fontWeight="semibold" color="headingColor" fontSize={{base: 'md', sm: 'lg'}} mx={{base:0, sm:4}} my={{base: 2, sm: 0}} minW="70px" textAlign={{base:'right', sm: 'center'}} alignSelf={{base: 'flex-end', sm: 'center'}} pl={{base: '94px', sm:0}}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  
                  <IconButton icon={<FiTrash2 />} variant="ghost" colorScheme="red" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item" size="md" alignSelf={{base: 'flex-end', sm: 'center'}} position={{base: 'absolute', sm: 'static'}} top={5} right={5}/>
                </Flex>
              ))}
            </VStack>

            {/* Order Summary */}
            <Box bg="white" p={{base:5, md:6}} borderRadius="20px" boxShadow="lg" position={{ lg: 'sticky' }} top={{ lg: '120px' }}>
              <Heading size="lg" color="headingColor" mb={6} pb={3} borderBottom="2px solid" borderColor="secondary.200">
                Order Summary
              </Heading>
              <VStack spacing={4} align="stretch" mb={6}>
                <Flex justify="space-between">
                  <Text color="textColor.600" fontSize="md">Subtotal</Text>
                  <Text fontWeight="medium" fontSize="md">${subtotal.toFixed(2)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="textColor.600" fontSize="md">Estimated Shipping</Text>
                  <Text fontWeight="medium" fontSize="md">${shippingCost.toFixed(2)}</Text>
                </Flex>
                <Divider my={2} borderColor="borderColor"/>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="headingColor">Order Total</Heading>
                  <Heading size="lg" color="primary.500">${total.toFixed(2)}</Heading>
                </Flex>
              </VStack>
              <Button as={RouterLink} to="/checkout" variant="gradient" size="lg" w="100%" mt={2}>
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
