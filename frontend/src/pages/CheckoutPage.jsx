import React, { useState } from 'react';
import { Box, Flex, Heading, Text, Button, VStack, HStack, Input, FormControl, FormLabel, Grid, Image, Divider, Link as ChakraLink, useSteps, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, useToast, Icon } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiHome, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi'; // Added more icons

const steps = [
  { title: 'Shipping', description: 'Your Delivery Address', icon: FiHome },
  { title: 'Payment', description: 'Secure Card Details', icon: FiCreditCard },
  { title: 'Review', description: 'Confirm Your Order', icon: FiPackage },
];

// Placeholder cart items for review step - ideally fetched from cart context/state
const cartItemsForReview = [
  { id: '1', name: 'Barnaby Bear', price: 29.99, quantity: 1, image: 'https://placehold.co/80x80/fddde6/3a3a3a?text=Bear' },
  { id: '2', name: 'Flippy Penguin', price: 24.99, quantity: 2, image: 'https://placehold.co/80x80/a9def9/3a3a3a?text=Penguin' },
  { id: '3', name: 'Leo the Lion', price: 32.99, quantity: 1, image: 'https://placehold.co/80x80/fcf6bd/3a3a3a?text=Lion' },
];
const subtotalReview = cartItemsForReview.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shippingReview = cartItemsForReview.length > 0 ? 5.00 : 0;
const totalReview = subtotalReview + shippingReview;

const CheckoutPage = () => {
  const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  const navigate = useNavigate();
  const toast = useToast();

  // Form state (simplified for prototype)
  const [shippingInfo, setShippingInfo] = useState({ email: '', fname: '', lname: '', address: '', city: '', state: '', zip: '' });
  const [paymentInfo, setPaymentInfo] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' });

  const handlePlaceOrder = () => {
    // Simulate order placement
    console.log("Order placed with:", { shippingInfo, paymentInfo, orderTotal: totalReview });
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
    setTimeout(() => navigate('/confirmation'), 2500);
  };

  const handleInputChange = (panel, e) => {
    const { name, value } = e.target;
    if (panel === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [name]: value }));
    }
    if (panel === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  }

  return (
    <Box bg="bg.50" minH="100vh">
      <Flex direction="column" align="center" py={{base:4, md:8}} >
        <ChakraLink as={RouterLink} to="/" display="flex" alignItems="center" _hover={{textDecor: 'none'}} mb={{base:4, md:8}}>
            <Image src="/vite.svg" alt="Plushie Paradise Logo" boxSize={{base: "40px", md: "50px"}} mr={2} /> {/* Placeholder logo */}
            <Heading size={{base: "md", md: "lg"}} color="headingColor">Plushie Paradise Checkout</Heading>
        </ChakraLink>
        <Box w={{base: '95%', md: '80%'}} maxW="900px" bg="white" borderRadius="xl" boxShadow="lg" p={{base:0, md:4}}>
            <Stepper index={activeStep} colorScheme="primary" size={{base: 'sm', md: 'md'}} orientation={{base: 'vertical', md: 'horizontal'}} gap={{base:0, md:2}} p={{base:4, md:6}}>
            {steps.map((step, index) => (
                <Step key={index} onClick={() => setActiveStep(index)} cursor="pointer" style={{gap: '0.5rem'}}>
                <StepIndicator>
                    <StepStatus
                    complete={<Icon as={step.icon} />}
                    incomplete={<StepNumber />}
                    active={<Icon as={step.icon} color="primary.500"/>}
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

      <Box maxW="900px" mx="auto" p={{ base: 4, md: 6 }} mt={{base:2, md:0}}>
        {/* Shipping Panel */}
        {activeStep === 0 && (
          <Box bg="white" p={{base:5, md:8}} borderRadius="xl" boxShadow="lg">
            <Heading size="lg" color="headingColor" mb={6} display="flex" alignItems="center"><Icon as={FiTruck} mr={3} color="primary.500"/>Shipping Information</Heading>
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
            <Heading size="lg" color="headingColor" mb={6} display="flex" alignItems="center"><Icon as={FiCreditCard} mr={3} color="primary.500"/>Payment Details</Heading>
            <Text mb={4} color="textColor.500">This is a placeholder payment form. No real payment will be processed.</Text>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5}>
              <FormControl isRequired gridColumn={{ md: '1 / -1' }}><FormLabel>Name on Card</FormLabel><Input name="cardName" placeholder="Cuddly Friend" value={paymentInfo.cardName} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
              <FormControl isRequired gridColumn={{ md: '1 / -1' }}><FormLabel>Card Number</FormLabel><Input name="cardNumber" type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete="cc-number" maxLength="19" placeholder="•••• •••• •••• ••••" value={paymentInfo.cardNumber} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
              <FormControl isRequired><FormLabel>Expiry Date</FormLabel><Input name="expiry" placeholder="MM / YY" value={paymentInfo.expiry} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
              <FormControl isRequired><FormLabel>CVC</FormLabel><Input name="cvc" placeholder="•••" maxLength="4" value={paymentInfo.cvc} onChange={(e) => handleInputChange('payment', e)}/></FormControl>
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
            <Heading size="lg" color="headingColor" mb={6} display="flex" alignItems="center"><Icon as={FiPackage} mr={3} color="primary.500"/>Review Your Order</Heading>
            <VStack spacing={4} align="stretch" divider={<Divider borderColor="borderColor" />}>
              {cartItemsForReview.map(item => (
                <Flex key={item.id} align="center" justify="space-between" py={2}>
                  <HStack spacing={4}>
                    <Image src={item.image} alt={item.name} boxSize={{base: "60px", md: "80px"}} objectFit="cover" borderRadius="md" bg="secondary.50" />
                    <Box>
                      <Text fontWeight="semibold" color="headingColor" fontSize={{base: "sm", md: "md"}}>{item.name}</Text>
                      <Text fontSize={{base: "xs", md: "sm"}} color="textColor.500">Qty: {item.quantity}</Text>
                    </Box>
                  </HStack>
                  <Text fontWeight="semibold" color="headingColor" fontSize={{base: "sm", md: "md"}}>${(item.price * item.quantity).toFixed(2)}</Text>
                </Flex>
              ))}
            </VStack>
            <Divider my={6} borderColor="borderColor"/>
            <VStack spacing={3} align="stretch" mb={6}>
                <Flex justify="space-between"><Text color="textColor.600" fontSize="md">Subtotal</Text><Text fontWeight="medium" fontSize="md">${subtotalReview.toFixed(2)}</Text></Flex>
                <Flex justify="space-between"><Text color="textColor.600" fontSize="md">Shipping</Text><Text fontWeight="medium" fontSize="md">${shippingReview.toFixed(2)}</Text></Flex>
                <Divider my={2} borderColor="borderColor"/>
                <Flex justify="space-between" align="center"><Heading size="md" color="headingColor">Order Total</Heading><Heading size="lg" color="primary.500">${totalReview.toFixed(2)}</Heading></Flex>
            </VStack>
            <Flex justify="space-between" mt={8}>
              <Button variant="outline" colorScheme="primary" onClick={goToPrevious} size="lg">Back to Payment</Button>
              <Button variant="gradient" onClick={handlePlaceOrder} size="lg">Place Order & Cuddle Up</Button>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CheckoutPage;
