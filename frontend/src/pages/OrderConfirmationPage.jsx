import React, { useEffect, useRef } from 'react';
import { Box, Heading, Text, Button, VStack, Icon, Center } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { CheckCircleIcon } from '@chakra-ui/icons';

const ConfettiPiece = ({ color, left, animationDelay, size, isSquare }) => {
  const style = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
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

  useEffect(() => {
    const keyframes = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    const styleSheet = document.styleSheets[0];
    try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (e) {
        console.warn("Could not insert @keyframes rule, it might already exist or browser restrictions apply.", e);
    }
  }, []);

  const confettiPieces = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    color: ['primary.500', 'accent.500', 'yellow.300', 'blue.300', 'pink.200'][Math.floor(Math.random() * 5)],
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    size: Math.random() * 8 + 5,
    isSquare: Math.random() > 0.5,
  }));

  return (
    <Box position="relative" minH="calc(100vh - 160px)" overflow="hidden" bg="blue.50" display="flex" alignItems="center" justifyContent="center" py={10}>
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
          boxShadow="0 15px 35px var(--chakra-colors-accent-200)"
          maxW="600px"
          w="full"
        >
          <Icon as={CheckCircleIcon} w={24} h={24} color="accent.500" animation="bounceIn 1s ease-out" />
          <style>
            {`
              @keyframes bounceIn {
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
          <Heading as="h1" size="2xl" color="headingColor">
            Order Confirmed!
          </Heading>
          <Text fontSize="lg" color="textColor" maxW="450px">
            Thank you for your purchase! Your new pals are getting ready to meet you. An email confirmation has been sent to your address.
          </Text>
          <Box
            bg="blue.50"
            border="2px dashed"
            borderColor="accent.500"
            p={4}
            borderRadius="15px"
            fontWeight="600"
            fontSize="lg"
            color="headingColor"
          >
            Your Order Number is: <Text as="span" fontFamily="monospace" color="primary.500">#PP-123456789</Text>
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
