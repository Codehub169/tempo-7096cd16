import React from 'react';
import { Box, Flex, Heading, Text, Button, Grid, Image, Link, Icon, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi'; // Example icons

// Placeholder data - replace with actual data fetching
const featuredProducts = [
  {
    id: '1',
    name: 'Barnaby Bear',
    price: '$29.99',
    image: 'https://placehold.co/400x400/fddde6/3a3a3a?text=Barnaby%5CnBear',
    category: 'Forest Friends'
  },
  {
    id: '2',
    name: 'Flippy Penguin',
    price: '$24.99',
    image: 'https://placehold.co/400x400/a9def9/3a3a3a?text=Flippy%5CnPenguin',
    category: 'Ocean Buddies'
  },
  {
    id: '3',
    name: 'Leo the Lion',
    price: '$32.99',
    image: 'https://placehold.co/400x400/fcf6bd/3a3a3a?text=Leo%5CnLion',
    category: 'Jungle Jammers'
  },
  {
    id: '4',
    name: 'Hoppy Bunny',
    price: '$27.99',
    image: 'https://placehold.co/400x400/c3b1e1/3a3a3a?text=Hoppy%5CnBunny',
    category: 'Forest Friends'
  },
];

const categories = [
  {
    name: 'Forest Friends',
    image: 'https://placehold.co/600x800/ff8fab/ffffff?text=Forest%5CnFriends'
  },
  {
    name: 'Ocean Buddies',
    image: 'https://placehold.co/600x800/84d2f6/ffffff?text=Ocean%5CnBuddies'
  },
  {
    name: 'Jungle Jammers',
    image: 'https://placehold.co/600x800/fcf6bd/3a3a3a?text=Jungle%5CnJammers'
  },
];

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-br, secondary.100, bg.100)" py={{ base: '4rem', md: '6rem' }} textAlign="center">
        <VStack spacing={6} maxW="600px" mx="auto" px={4}>
          <Heading as="h1" fontSize={{ base: '2.5rem', md: '3.5rem' }} fontWeight="bold" color="headingColor">
            Find Your Forever Friend
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="textColor.600">
            Discover a world of cuddly, cute, and high-quality plushies waiting for a new home. Your next best friend is just a click away!
          </Text>
          <Button as={RouterLink} to="/shop" variant="gradient" size="lg" _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}>
            Explore the Shop
          </Button>
        </VStack>
      </Box>

      {/* Featured Products Section */}
      <Box py={{ base: '3rem', md: '5rem' }} px={{ base: 4, md: 8 }}>
        <Heading as="h2" size="xl" textAlign="center" mb={{ base: 8, md: 12 }} color="headingColor">
          Featured Pals
        </Heading>
        <Grid 
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={8}
          maxW="1200px" 
          mx="auto"
        >
          {featuredProducts.map((product) => (
            <Link as={RouterLink} to={`/product/${product.id}`} key={product.id} _hover={{ textDecoration: 'none' }}>
              <Box 
                bg="white" 
                borderRadius="20px" 
                boxShadow="lg" 
                overflow="hidden" 
                transition="all 0.3s ease" 
                _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }} 
                cursor="pointer" 
                textAlign="center"
                role="group" // For hover effects on child elements
              >
                <Box bg="secondary.50" p={{base: 4, md: 6}} h={{base: "200px", md: "250px"}} display="flex" alignItems="center" justifyContent="center" overflow="hidden">
                  <Image src={product.image} alt={product.name} objectFit="contain" maxH="100%" transition="transform 0.4s ease" _groupHover={{ transform: 'scale(1.1)' }} />
                </Box>
                <Box p={6}>
                  <Heading as="h3" size="md" color="headingColor" mb={2}>{product.name}</Heading>
                  <Text fontSize="lg" color="primary.500" fontWeight="bold">{product.price}</Text>
                </Box>
              </Box>
            </Link>
          ))}
        </Grid>
      </Box>

      {/* Categories Section */}
      <Box py={{ base: '3rem', md: '5rem' }} bg="white" px={{ base: 4, md: 8 }}>
        <Heading as="h2" size="xl" textAlign="center" mb={{ base: 8, md: 12 }} color="headingColor">
          Explore by Category
        </Heading>
        <Grid 
          templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} 
          gap={8} 
          maxW="1200px" 
          mx="auto"
        >
          {categories.map((category) => (
            <Link as={RouterLink} to="/shop" key={category.name} _hover={{ textDecoration: 'none' }} role="group">
              <Box 
                position="relative" 
                borderRadius="20px" 
                overflow="hidden" 
                h="350px" 
                boxShadow="lg" 
                transition="transform 0.3s ease" 
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <Image src={category.image} alt={category.name} objectFit="cover" w="100%" h="100%" transition="transform 0.5s ease" _groupHover={{ transform: 'scale(1.1)' }}/>
                <Box 
                  position="absolute" 
                  top={0} 
                  left={0} 
                  w="100%" 
                  h="100%" 
                  bgGradient="linear(to-t, blackAlpha.700, transparent)" 
                  display="flex" 
                  alignItems="flex-end" 
                  p={6}
                >
                  <Heading as="h3" size="lg" color="white" fontWeight="semibold">{category.name}</Heading>
                </Box>
              </Box>
            </Link>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
