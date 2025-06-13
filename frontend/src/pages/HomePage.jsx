import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Grid, Image, Link, Icon, VStack, CircularProgress } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // Assuming ProductCard can be used here

const API_BASE_URL = 'http://localhost:9000/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productsResponse = await fetch(`${API_BASE_URL}/products?sort=popularity`); // Fetches all, sorted by popularity
        if (!productsResponse.ok) throw new Error(`HTTP error! status: ${productsResponse.status}`);
        const productsData = await productsResponse.json();
        setFeaturedProducts(productsData.slice(0, 4)); // Take top 4 popular as featured

        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        if (!categoriesResponse.ok) throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
        const categoriesData = await categoriesResponse.json();
        // Assuming categoriesData is an array of {id, name}
        // For display, we might need to map it to match the previous structure if it had image placeholders.
        // For now, using names and generating placeholder images.
        setCategories(categoriesData.map(cat => ({ 
            name: cat.name, 
            // Using placeholder images as backend doesn't provide category images
            image: `https://placehold.co/600x800/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${encodeURIComponent(cat.name)}`
        })).slice(0,3)); // Show 3 categories

      } catch (e) {
        console.error("Failed to fetch homepage data:", e);
        setError(e.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <Flex justify="center" align="center" minH="60vh"><CircularProgress isIndeterminate color="brand.primary" /></Flex>;
  }

  if (error) {
    return <Box textAlign="center" py={10}>Error loading page: {error}. Please try refreshing.</Box>;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-br, brand.secondary, brand.background)" py={{ base: '4rem', md: '6rem' }} textAlign="center">
        <VStack spacing={6} maxW="600px" mx="auto" px={4}>
          <Heading as="h1" fontSize={{ base: '2.5rem', md: '3.5rem' }} fontWeight="bold" color="brand.heading">
            Find Your Forever Friend
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="brand.text">
            Discover a world of cuddly, cute, and high-quality plushies waiting for a new home. Your next best friend is just a click away!
          </Text>
          <Button as={RouterLink} to="/shop" variant="gradient" size="lg" _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}>
            Explore the Shop
          </Button>
        </VStack>
      </Box>

      {/* Featured Products Section */}
      <Box py={{ base: '3rem', md: '5rem' }} px={{ base: 4, md: 8 }}>
        <Heading as="h2" size="xl" textAlign="center" mb={{ base: 8, md: 12 }} color="brand.heading">
          Featured Pals
        </Heading>
        {featuredProducts.length > 0 ? (
          <Grid 
            templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
            gap={8}
            maxW="1200px" 
            mx="auto"
          >
            {featuredProducts.map((product) => (
              // Using ProductCard component for consistency if available and suitable
              // ProductCard expects product.imageUrl, product.price (number)
              <ProductCard key={product.id} product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl, // Ensure this matches ProductCard prop
                category: product.categoryName // Ensure this matches ProductCard prop
              }} />
            ))}
          </Grid>
        ) : (
          <Text textAlign="center">No featured products available at the moment.</Text>
        )}
      </Box>

      {/* Categories Section */}
      <Box py={{ base: '3rem', md: '5rem' }} bg="white" px={{ base: 4, md: 8 }}>
        <Heading as="h2" size="xl" textAlign="center" mb={{ base: 8, md: 12 }} color="brand.heading">
          Explore by Category
        </Heading>
        {categories.length > 0 ? (
          <Grid 
            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} 
            gap={8} 
            maxW="1200px" 
            mx="auto"
          >
            {categories.map((category) => (
              <Link as={RouterLink} to={`/shop?category=${encodeURIComponent(category.name)}`} key={category.name} _hover={{ textDecoration: 'none' }} role="group">
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
        ) : (
          <Text textAlign="center">No categories to display.</Text>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
