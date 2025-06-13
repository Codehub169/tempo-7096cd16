import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { GiHeartWings } from 'react-icons/gi'; // Consistent icon

const NotFoundPage = () => {
  return (
    <Box textAlign="center" py={{ base: '4rem', md: '6rem' }} px={6} bg="brand.background" minH="calc(100vh - 160px)" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={8} bg="white" p={{base: 8, md: 16}} borderRadius="20px" boxShadow="xl" maxW="600px" w="full">
        <Icon as={GiHeartWings} w={24} h={24} color="brand.primary" />
        <Heading as="h1" fontSize={{ base: '2xl', md: '4xl' }} color="brand.heading">
          404 - Plushie Not Found!
        </Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} color="brand.text">
          Oops! It seems the plushie (or page) you were looking for has wandered off on an adventure.
          Don't worry, there are plenty of other cuddly friends waiting for you!
        </Text>
        <Button 
          as={RouterLink} 
          to="/" 
          variant="gradient" 
          size="lg"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        >
          Back to Home Base
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFoundPage;
