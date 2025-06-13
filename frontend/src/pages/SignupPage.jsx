import React, { useEffect, useRef } from 'react';
import { Box, Heading, Text, Button, VStack, FormControl, Input, InputGroup, InputLeftElement, Icon, Link, Center, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEnvelope, FaLock } from 'react-icons/fa'; // More specific icons
import { GiPlushBear } from 'react-icons/gi'; // Example for logo

const AnimatedShape = ({ color, left, animationDelay, animationDuration, size, isSquare }) => {
  const style = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    opacity: 0.5,
    animation: `float ${animationDuration}s linear infinite`,
    left: `${left}%`,
    bottom: '-150px',
    animationDelay: `${animationDelay}s`,
    borderRadius: isSquare ? '0%' : '50%',
    zIndex: 0,
  };
  return <Box sx={style} />;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Keyframes are likely already injected by LoginPage, but ensure they exist
    const keyframes = `
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0%; }
        100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
      }
    `;
    const styleSheet = document.styleSheets[0];
    try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (e) {
        console.warn("Could not insert @keyframes rule, it might already exist or browser restrictions apply.", e);
    }
  }, []);

  const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    color: ['primary.200', 'secondary.200', 'accent.200', 'blue.200', 'pink.100'][Math.floor(Math.random() * 5)],
    left: Math.random() * 100,
    animationDelay: Math.random() * 10,
    animationDuration: Math.random() * 15 + 10,
    size: Math.random() * 80 + 20,
    isSquare: Math.random() > 0.5,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!username || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields to join.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Creating account...",
      status: "info",
      duration: 1500,
      isClosable: true,
    });
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Account Created!",
        description: "Welcome to the Plushie Pals club!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate('/login'); // Redirect to login page after signup
    }, 1500);
  };

  return (
    <Box minH="calc(100vh - 160px)" bg="blue.50" display="flex" alignItems="center" justifyContent="center" position="relative" overflow="hidden" py={10}>
      <Box position="absolute" top="0" left="0" w="full" h="full" zIndex="0">
        {shapes.map(shape => (
          <AnimatedShape key={shape.id} {...shape} />
        ))}
      </Box>
      <Center w="full" maxW="420px" p={5} zIndex="1">
        <VStack
          as="form"
          onSubmit={handleSubmit}
          spacing={6}
          bg="white"
          p={{ base: 8, md: 12 }}
          borderRadius="30px"
          boxShadow="0 15px 35px var(--chakra-colors-accent-200)"
          textAlign="center"
          w="full"
          transition="transform 0.3s ease"
          _hover={{ transform: 'translateY(-5px)' }}
        >
          <VStack spacing={3} mb={4}>
            <Icon as={GiPlushBear} w={20} h={20} color="primary.500" animation="bounce 1.5s infinite" />
            <Heading as="h1" size="xl" color="headingColor">
              Join the Club!
            </Heading>
          </VStack>
          
          <FormControl id="username">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaUserPlus} color="primary.400" />
              </InputLeftElement>
              <Input name="username" type="text" placeholder="Create a Codename" variant="auth" />
            </InputGroup>
          </FormControl>

          <FormControl id="email">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaEnvelope} color="primary.400" />
              </InputLeftElement>
              <Input name="email" type="email" placeholder="Your Email Address" variant="auth" />
            </InputGroup>
          </FormControl>

          <FormControl id="password">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaLock} color="primary.400" />
              </InputLeftElement>
              <Input name="password" type="password" placeholder="Create a Secret Handshake" variant="auth" />
            </InputGroup>
          </FormControl>

          <Button type="submit" variant="gradient" w="full" size="lg">
            Become a Pal
          </Button>

          <Text fontSize="sm">
            Already a member?{' '}
            <Link as={RouterLink} to="/login" color="accent.500" fontWeight="medium" _hover={{ color: 'primary.500', textDecoration: 'underline' }}>
              Enter the Clubhouse
            </Link>
          </Text>
        </VStack>
      </Center>
    </Box>
  );
};

export default SignupPage;
