import React, { useState } from 'react'; // Removed useEffect as it's no longer needed for keyframes
import { Box, Heading, Text, Button, VStack, FormControl, Input, InputGroup, InputLeftElement, Icon, Link, Center, useToast } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaUserAstronaut, FaKey } from 'react-icons/fa';
import { GiHeartWings } from 'react-icons/gi';

const API_BASE_URL = 'http://localhost:9000/api';

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

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    color: ['brand.primary', 'brand.secondary', 'brand.accent', 'blue.200', 'pink.100'][Math.floor(Math.random() * 5)],
    left: Math.random() * 100,
    animationDelay: Math.random() * 10,
    animationDuration: Math.random() * 15 + 10,
    size: Math.random() * 80 + 20,
    isSquare: Math.random() > 0.5,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both codename and handshake.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      toast({
        title: "Welcome Back!",
        description: "You're successfully logged in.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/'); 
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or server error.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
    setIsLoading(false);
  };

  return (
    <Box minH="calc(100vh - 160px)" bg="brand.lightBg" display="flex" alignItems="center" justifyContent="center" position="relative" overflow="hidden" py={10}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
        `}
      </style>
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
          boxShadow="0 15px 35px var(--chakra-colors-brand-accent)"
          textAlign="center"
          w="full"
          transition="transform 0.3s ease"
          _hover={{ transform: 'translateY(-5px)' }}
        >
          <VStack spacing={3} mb={4}>
            <Icon as={GiHeartWings} w={20} h={20} color="brand.primary" animation="bounce 1.5s infinite" />
            <Heading as="h1" size="xl" color="brand.heading">
              Welcome Back, Pal!
            </Heading>
          </VStack>
          
          <FormControl id="username">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaUserAstronaut} color="brand.primary" />
              </InputLeftElement>
              <Input name="username" type="text" placeholder="Your Secret Codename" variant="auth" />
            </InputGroup>
          </FormControl>

          <FormControl id="password">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaKey} color="brand.primary" />
              </InputLeftElement>
              <Input name="password" type="password" placeholder="Secret Handshake (Password)" variant="auth" />
            </InputGroup>
          </FormControl>

          <Button type="submit" variant="gradient" w="full" size="lg" isLoading={isLoading}>
            Enter the Clubhouse
          </Button>

          <VStack spacing={2} fontSize="sm">
            <Text>
              New here?{' '}
              <Link as={RouterLink} to="/signup" color="brand.accent" fontWeight="medium" _hover={{ color: 'brand.primary', textDecoration: 'underline' }}>
                Join the club!
              </Link>
            </Text>
            <Link as={RouterLink} to="#" color="brand.text" _hover={{ color: 'brand.primary' }}> 
              Forgot your handshake?
            </Link>
            <Link as={RouterLink} to="/" color="brand.text" _hover={{ color: 'brand.primary' }} mt={4}>
              &larr; Back to Main Site
            </Link>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
};

export default LoginPage;
