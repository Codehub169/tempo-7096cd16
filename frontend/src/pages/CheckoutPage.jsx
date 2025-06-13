import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Heading, Text, Button, VStack, HStack, Input, FormControl, FormLabel, Grid, Image, Divider, Link as ChakraLink, useSteps, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, useToast, Icon, CircularProgress } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiHome, FiPackage, FiTruck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; 
import { GiHeartWings } from 'react-icons/gi';

const API_BASE_URL = '/api';

const steps = [
  { title: 'Shipping', description: 'Your Delivery Address', icon: FiHome },
  { title: 'Payment', description: 'Secure Card Details', icon: FiCreditCard },
  { title: 'Review', description: 'Confirm Your Order', icon: FiPackage },
];

const CheckoutPage = () => {
  const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  const navigate = useNavigate();
  const toast = useToast();

  const [shippingInfo, setShippingInfo] = useState({ email: '', fname: '', lname: '', address: '', city: '', state: '', zip: '' });
  const [paymentInfo, setPaymentInfo] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' });
  const [cartItemsForReview, setCartItemsForReview] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  const fetchCartForReview = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setCartError('Please login to proceed to checkout.');
      setIsLoadingCart(false);
      navigate('/login');
      return;
    }
    setIsLoadingCart(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCartItemsForReview(data.map(item => ({...item, id: item.product_id })));
      if (data.length === 0) {
        toast({ title: 'Your cart is empty!', description: 'Please add items to your cart before checking out.', status: 'warning', duration: 3000, isClosable: true, position: 'top' });
        navigate('/shop');
      }
      setCartError(null);
    } catch (e) {
      console.error("Failed to fetch cart for review:", e);
      setCartError(e.message);
      toast({ title: 'Error fetching cart', description: e.message, status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
    setIsLoadingCart(false);
  }, [toast, navigate]);

  useEffect(() => {
    fetchCartForReview();
  }, [fetchCartForReview]);

  const subtotalReview = cartItemsForReview.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingReview = cartItemsForReview.length > 0 ? 5.00 : 0;
  const totalReview = subtotalReview + shippingReview;

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }

    if (Object.values(shippingInfo).some(val => val.trim() === '')) {
        toast({ title: 'Missing Shipping Information', description: 'Please fill all required shipping fields.', status: 'warning', duration: 3000, isClosable: true, position: 'top'});
        setActiveStep(0); 
        return;
    }
    if (Object.values(paymentInfo).some(val => val.trim() === '')) {
        toast({ title: 'Missing Payment Information', description: 'Please fill all required payment fields.', status: 'warning', duration: 3000, isClosable: true, position: 'top'});
        setActiveStep(1);
        return;
    }

    const orderPayload = {
      shippingAddress: shippingInfo,
      items: cartItemsForReview.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      })),
      totalAmount: totalReview,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
      const orderData = await response.json(); 
      
      toast({
        title: 'Order Successfully Placed!',
        description: 'Your plushie pals are on their way. Redirecting to confirmation...', 
        status: 'success',
        duration: 2500,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
        icon: <Icon as={FiCheckCircle} w={6} h={6} color="green.500"/>
      });
      setTimeout(() => navigate('/confirmation', { state: { orderId: orderData.orderId, totalAmount: totalReview } }), 2500);
    } catch (e) {
      console.error("Failed to place order:", e);
      toast({ title: 'Order Placement Failed', description: e.message, status: 'error', duration: 4000, isClosable: true, position: 'top' });
    }
  };

  const handleInputChange = (panel, e) => {
    const { name, value } = e.target;
    if (panel === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [name]: value }));
    }
    if (panel === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  if (isLoadingCart) {
    return <Flex justify="center" align="center" minH="80vh"><CircularProgress isIndeterminate color="brand.primary" /></Flex>;
  }

  if (cartError) {
     return (
      <Box textAlign="center" py={10} maxW="600px" mx="auto" px={4}>
        <Alert status="error" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={10} borderRadius="md" variant="subtle">
          <AlertIcon as={FiAlertCircle} boxSize="40px" mr={0} />
          <Heading size="md" mt={4} mb={2}>Could not load cart</Heading>
          <Text mt={4}>{cartError}</Text>
          {cartError.includes('login') && <Button as={RouterLink} to="/login" colorScheme="primary" mt={6}>Login</Button>}
          <Button as={RouterLink} to="/shop" variant="outline" mt={4}>Back to Shop</Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg="brand.lightBg" minH="100vh">
      <Flex direction="column" align="center" py={{base:4, md:8}} >
        <ChakraLink as={RouterLink} to="/" display="flex" alignItems="center" _hover={{textDecor: 'none'}} mb={{base:4, md:8}}>
            <Icon as={GiHeartWings} w={{base: 10, md: 12}} h={{base: 10, md: 12}} color="brand.primary" mr={2} />
            <Heading size={{base: "md", md: "lg"}} color="brand.heading">Plushie Paradise Checkout</Heading>
        </ChakraLink>
        <Box w={{base: '95%', md: '80%'}} maxW="900px" bg="white" borderRadius="xl" boxShadow="lg" p={{base:0, md:4}}>
            <Stepper index={activeStep} colorScheme="primary" size={{base: 'sm', md: 'md'}} orientation={{base: 'vertical', md: 'horizontal'}} gap={{base:0, md:2}} p={{base:4, md:6}}>
            {steps.map((step, index) => (
                <Step key={index} onClick={() => activeStep > index ? setActiveStep(index) : null} cursor={activeStep > index ? "pointer" : "default"} style={{gap: '0.5rem'}}>
                <StepIndicator>
                    <StepStatus
                    complete={<Icon as={step.icon} />}
                    incomplete={<StepNumber />}
                    active={<Icon as={step.icon} color="brand.primary"/>}
                    />
                </StepIndicator>
                <Box flexShrink='0' textAlign="left">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
                </Step>
            ))}
            </Stepper>
        </Box>
      </Flex>

      <Box maxW="900px" mx="auto" p={{ base: 4, md: 6 }} mt={{base:2, md:0}} pb={10}>
        {/* Shipping Panel */}
        {activeStep === 0 && (
          <Box bg="white" p={{base:5, md:8}} borderRadius="xl" boxShadow="lg">
            <Heading size="lg" color="brand.heading" mb={6} display="flex" alignItems="center"><Icon as={FiTruck} mr={3} color="brand.primary"/>Shipping Information</Heading>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5}>
              <FormControl isRequired><FormLabel>Email Address</FormLabel><Input name="email" type="email" placeholder="you@example.com" value={shippingInfo.email} onChange={(e) => handleInputChange('shipping', e)} /></FormControl>
              <FormControl isRequired><FormLabel>First Name</FormLabel><Input name="fname" placeholder="Cuddly" value={shippingInfo.fname} onChange={(e) => handleInputChange('shipping', e)}/></FormControl>
              <FormControl isRequired><FormLabel>Last Name</FormLabel><Input name="lname" placeholder="Friend" value={shippingInfo.lname} onChange={(e) => handleInputChange('shipping', e)}/></FormControl>
              <FormControl isRequired gridColumn={{ md: '1 / -1' }}><FormLabel>Address</FormLabel><Input name="address" placeholder="123 Fluffy Lane" value={shippingInfo.address} onChange={(e) => handleInputChange('shipping', e)}/></FormControl>
              <FormControl isRequired><FormLabel>City</FormLabel><Input name="city" placeholder="Hugsville" value={shippingInfo.city} onChange={(e) => handleInputChange('shipping', e)}/></FormControl>
              <FormControl isRequired><FormLabel>State/Province</FormLabel><Input name="state" placeholder="Joy" value={shippingInfo.state} onChange={(e) => handleInputChange('shipping', e)}/></FormControl>
              <FormControl isRequired><FormLabel>ZIP/Postal Code</FormLabel><Input name="zip" placeholder="12345" value={shippingInfo.zip} onChange={(e) => handleInputChange('shipping', e)}/></FormControl>
            </Grid>
            <Flex justify="space-between" mt={8}>
              <Button as={RouterLink} to="/cart" variant="outline" colorScheme="primary" size="lg">Back to Cart</Button>
              <Button variant="gradient" onClick={goToNext} size="lg">Continue to Payment</Button>
            </Flex>
          </Box>
        )}

        {/* Payment Panel */}
        {activeStep === 1 && (
          <Box bg="white" p={{base:5, md:8}} borderRadius="xl" boxShadow="lg">
            <Heading size="lg" color="brand.heading" mb={6} display="flex" alignItems="center"><Icon as={FiCreditCard} mr={3} color="brand.primary"/>Payment Details</Heading>
            <Text mb={4} color="brand.text">This is a placeholder payment form. No real payment will be processed.</Text>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5}>
              <FormControl isRequired gridColumn={{ md: '1 / -1' }}><FormLabel>Name on Card</FormLabel><Input name="cardName" placeholder="Cuddly Friend" value={paymentInfo.cardName} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
              <FormControl isRequired gridColumn={{ md: '1 / -1' }}><FormLabel>Card Number</FormLabel><Input name="cardNumber" type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete="cc-number" maxLength="19" placeholder="ullullullull ullullullull ullullullull ullullullull" value={paymentInfo.cardNumber} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
              <FormControl isRequired><FormLabel>Expiry Date</FormLabel><Input name="expiry" placeholder="MM / YY" value={paymentInfo.expiry} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
              <FormControl isRequired><FormLabel>CVC</FormLabel><Input name="cvc" placeholder="ullullull" maxLength="4" value={paymentInfo.cvc} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
            </Grid>
            <Flex justify="space-between" mt={8}>
              <Button variant="outline" colorScheme="primary" onClick={goToPrevious} size="lg">Back to Shipping</Button>
              <Button variant="gradient" onClick={goToNext} size="lg">Review Order</Button>
            </Flex>
          </Box>
        )}

        {/* Review Panel */}
        {activeStep === 2 && (
          <Box bg="white" p={{base:5, md:8}} borderRadius="xl" boxShadow="lg">
            <Heading size="lg" color="brand.heading" mb={6} display="flex" alignItems="center"><Icon as={FiPackage} mr={3} color="brand.primary"/>Review Your Order</Heading>
            {cartItemsForReview.length > 0 ? (
              <VStack spacing={4} align="stretch" divider={<Divider borderColor="brand.border" />}>
                {cartItemsForReview.map(item => (
                  <Flex key={item.id} align="center" justify="space-between" py={2}>
                    <HStack spacing={4}>
                      <Image src={item.imageUrl || `https://placehold.co/80x80/ccc/fff?text=${encodeURIComponent(item.name)}`} alt={item.name} boxSize={{base: "60px", md: "80px"}} objectFit="cover" borderRadius="md" bg="brand.secondary" />
                      <Box>
                        <Text fontWeight="semibold" color="brand.heading" fontSize={{base: "sm", md: "md"}}>{item.name}</Text>
                        <Text fontSize={{base: "xs", md: "sm"}} color="brand.text">Qty: {item.quantity}</Text>
                      </Box>
                    </HStack>
                    <Text fontWeight="semibold" color="brand.heading" fontSize={{base: "sm", md: "md"}}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </Flex>
                ))}
              </VStack>
            ) : (
                <Text>Your cart is empty. Please add items before reviewing.</Text>
            )}
            <Divider my={6} borderColor="brand.border"/>
            <VStack spacing={3} align="stretch" mb={6}>
                <Flex justify="space-between"><Text color="brand.text" fontSize="md">Subtotal</Text><Text fontWeight="medium" fontSize="md">${subtotalReview.toFixed(2)}</Text></Flex>
                <Flex justify="space-between"><Text color="brand.text" fontSize="md">Shipping</Text><Text fontWeight="medium" fontSize="md">${shippingReview.toFixed(2)}</Text></Flex>
                <Divider my={2} borderColor="brand.border"/>
                <Flex justify="space-between" align="center"><Heading size="md" color="brand.heading">Order Total</Heading><Heading size="lg" color="brand.primary">${totalReview.toFixed(2)}</Heading></Flex>
            </VStack>
            <Flex justify="space-between" mt={8}>
              <Button variant="outline" colorScheme="primary" onClick={goToPrevious} size="lg">Back to Payment</Button>
              <Button variant="gradient" onClick={handlePlaceOrder} size="lg" isDisabled={cartItemsForReview.length === 0}>
                Place Order & Cuddle Up
              </Button>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CheckoutPage;
