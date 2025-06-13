import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, VStack, FormControl, Input, InputGroup, InputLeftElement, Icon, Link, Center, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEnvelope, FaLock } from 'react-icons/fa';
import { GiTeddyBear } from 'react-icons/gi'; // Changed from GiPlushBear

const API_BASE_URL = 'http://localhost:9000/api'; // As seen in the logs

// A simple animation component for background decoration
const AnimatedShape = ({ color, left, animationDelay, animationDuration, size, isSquare }) => {
  const style = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    opacity: 0.5,
    animation: `float ${animationDuration}s linear infinite`,
    left: `${left}%`,
    bottom: '-150px', // Start from below the screen
    animationDelay: `${animationDelay}s`,
    borderRadius: isSquare ? '0%' : '50%',
    zIndex: 0,
  };
  return <Box sx={style} />;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Add keyframes for animations dynamically
  useEffect(() => {
    const keyframes = `
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; } /* Float up and fade out */
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
      }
    `;
    const styleSheet = document.styleSheets[0];
    try {
      // Check if rule already exists to avoid duplication errors during HMR
      if (styleSheet.cssRules && !Array.from(styleSheet.cssRules).some(rule => rule.name === 'float')) {
           styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      }
    } catch (e) {
        // Catch potential errors if browser restricts CSS rule insertion or if it's a non-issue
        console.warn("Could not insert @keyframes rule, it might already exist or browser restrictions apply.", e);
    }
  }, []);

  const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    color: ['brand.primary', 'brand.secondary', 'brand.accent', 'blue.200', 'pink.100'][Math.floor(Math.random() * 5)],
    left: Math.random() * 100,
    animationDelay: Math.random() * 10, // Staggered start times
    animationDuration: Math.random() * 15 + 10, // Varied speeds
    size: Math.random() * 80 + 20, // Varied sizes
    isSquare: Math.random() > 0.5, // Mix of circles and squares
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!username || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields to join the Plushie Paradise!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }
      
      toast({
        title: "Account Created!",
        description: "Welcome to Plushie Paradise! Please login to continue.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create your account. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Box minH="calc(100vh - 160px)" bg="brand.lightBg" display="flex" alignItems="center" justifyContent="center" position="relative" overflow="hidden" py={10}>
      {/* Animated background shapes */}
      <Box position="absolute" top="0" left="0" w="full" h="full" zIndex="0">
        {shapes.map(shape => (
          <AnimatedShape key={shape.id} {...shape} />
        ))}
      </Box>
      <Center w="full" maxW="420px" p={5} zIndex="1"> {/* Ensure form is above background */}
        <VStack
          as="form"
          onSubmit={handleSubmit}
          spacing={6}
          bg="white"
          p={{ base: 8, md: 12 }} // Responsive padding
          borderRadius="30px" // Softer, more playful border radius
          boxShadow="0 15px 35px var(--chakra-colors-brand-accent)" // Themed shadow
          textAlign="center"
          w="full"
          transition="transform 0.3s ease"
          _hover={{ transform: 'translateY(-5px)' }} // Slight lift on hover
        >
          <VStack spacing={3} mb={4}>
            <Icon as={GiTeddyBear} w={20} h={20} color="brand.primary" animation="bounce 1.5s infinite" /> {/* Fixed Icon */}
            <Heading as="h1" size="xl" color="brand.heading">
              Join Plushie Paradise!
            </Heading>
          </VStack>
          
          <FormControl id="username">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaUserPlus} color="brand.primary" />
              </InputLeftElement>
              <Input name="username" type="text" placeholder="Choose your Plushie Name" variant="auth" />
            </InputGroup>
          </FormControl>

          <FormControl id="email">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaEnvelope} color="brand.primary" />
              </InputLeftElement>
              <Input name="email" type="email" placeholder="Your Email Address" variant="auth" />
            </InputGroup>
          </FormControl>

          <FormControl id="password">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaLock} color="brand.primary" />
              </InputLeftElement>
              <Input name="password" type="password" placeholder="Create a Secret Snuggle Key" variant="auth" />
            </InputGroup>
          </FormControl>

          <Button type="submit" variant="gradient" w="full" size="lg" isLoading={isLoading}>
            Get Your Fluff On!
          </Button>

          <Text fontSize="sm">
            Already a member?{' '}
            <Link as={RouterLink} to="/login" color="brand.accent" fontWeight="medium" _hover={{ color: 'brand.primary', textDecoration: 'underline' }}>
              Log In to the Funhouse
            </Link>
          </Text>
        </VStack>
      </Center>
    </Box>
  );
};

export default SignupPage;
