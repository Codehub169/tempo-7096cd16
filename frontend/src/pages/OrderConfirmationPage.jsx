import React, { useRef } from 'react'; // Removed useEffect as it's no longer needed for keyframes
import { Box, Heading, Text, Button, VStack, Icon, Center } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '@chakra-ui/icons';

const ConfettiPiece = ({ color, left, animationDelay, size, isSquare }) => {
  const style = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color, // Chakra's sx prop will resolve theme color strings
    opacity: 0.7,
    animation: `fall 5s linear infinite`,
    left: `${left}vw`,
    top: '-20px',
    animationDelay: `${animationDelay}s`,
    borderRadius: isSquare ? '0' : '50%',
  };

  return <Box sx={style} />;
};

const OrderConfirmationPage = () => {
  const confettiContainerRef = useRef(null);
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A'; 

  const confettiColors = ['brand.primary', 'brand.accent', 'yellow.300', 'blue.300', 'pink.200'];
  const confettiPieces = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    size: Math.random() * 8 + 5,
    isSquare: Math.random() > 0.5,
  }));

  return (
    <Box position="relative" minH="calc(100vh - 160px)" overflow="hidden" bg="brand.lightBg" display="flex" alignItems="center" justifyContent="center" py={10}>
      <style>
        {`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes bounceIn {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
      <Box ref={confettiContainerRef} position="absolute" top="0" left="0" w="full" h="full" zIndex="1">
        {confettiPieces.map(piece => (
          <ConfettiPiece key={piece.id} {...piece} />
        ))}
      </Box>
      <Center py={10} px={6} position="relative" zIndex="2">
        <VStack
          spacing={6}
          textAlign="center"
          bg="white"
          p={{ base: 8, md: 16 }}
          borderRadius="30px"
          boxShadow="0 15px 35px var(--chakra-colors-brand-accent)" 
          maxW="600px"
          w="full"
        >
          <Icon as={CheckCircleIcon} w={24} h={24} color="brand.accent" animation="bounceIn 1s ease-out" />
          <Heading as="h1" size="2xl" color="brand.heading">
            Order Confirmed!
          </Heading>
          <Text fontSize="lg" color="brand.text" maxW="450px">
            Thank you for your purchase! Your new pals are getting ready to meet you. An email confirmation has been sent to your address.
          </Text>
          <Box
            bg="blue.50" 
            border="2px dashed"
            borderColor="brand.accent"
            p={4}
            borderRadius="15px"
            fontWeight="600"
            fontSize="lg"
            color="brand.heading"
          >
            Your Order Number is: <Text as="span" fontFamily="monospace" color="brand.primary">#{orderId}</Text>
          </Box>
          <Button
            as={RouterLink}
            to="/"
            variant="gradient"
            size="lg"
            px={10}
            py={6}
          >
            Continue Shopping
          </Button>
        </VStack>
      </Center>
    </Box>
  );
};

export default OrderConfirmationPage;
