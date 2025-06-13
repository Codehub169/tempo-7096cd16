import React, { useState, useMemo } from 'react';
import { Box, Flex, Heading, Text, Grid, Image, Link, Select, CheckboxGroup, Checkbox, VStack, StackDivider, RadioGroup, Radio, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

// Placeholder data - replace with actual data fetching
const allProducts = [
  { id: '1', name: 'Barnaby Bear', price: 29.99, image: 'https://placehold.co/400x400/fddde6/3a3a3a?text=Barnaby', category: 'Forest Friends', popularity: 5, dateAdded: '2024-01-15' },
  { id: '2', name: 'Flippy Penguin', price: 24.99, image: 'https://placehold.co/400x400/a9def9/3a3a3a?text=Flippy', category: 'Ocean Buddies', popularity: 4, dateAdded: '2024-02-10' },
  { id: '3', name: 'Leo the Lion', price: 32.99, image: 'https://placehold.co/400x400/fcf6bd/3a3a3a?text=Leo', category: 'Jungle Jammers', popularity: 3, dateAdded: '2023-12-20' },
  { id: '4', name: 'Hoppy Bunny', price: 27.99, image: 'https://placehold.co/400x400/c3b1e1/3a3a3a?text=Hoppy', category: 'Forest Friends', popularity: 5, dateAdded: '2024-03-01' },
  { id: '5', name: 'Shelly Turtle', price: 22.99, image: 'https://placehold.co/400x400/bde0fe/3a3a3a?text=Shelly', category: 'Ocean Buddies', popularity: 2, dateAdded: '2024-01-25' },
  { id: '6', name: 'Gigi Giraffe', price: 34.99, image: 'https://placehold.co/400x400/ffdfb0/3a3a3a?text=Gigi', category: 'Jungle Jammers', popularity: 4, dateAdded: '2023-11-05' },
  { id: '7', name: 'Wally Whale', price: 39.99, image: 'https://placehold.co/400x400/84d2f6/3a3a3a?text=Wally', category: 'Ocean Buddies', popularity: 3, dateAdded: '2024-02-18' },
  { id: '8', name: 'Foxy Fox', price: 28.99, image: 'https://placehold.co/400x400/ffb347/3a3a3a?text=Foxy', category: 'Forest Friends', popularity: 5, dateAdded: '2024-03-10' },
  { id: '9', name: 'Sparkle Unicorn', price: 45.99, image: 'https://placehold.co/400x400/ead8fc/3a3a3a?text=Sparkle', category: 'Fantasy Creatures', popularity: 5, dateAdded: '2024-03-15' }, 
  { id: '10', name: 'Drago Dragon', price: 49.99, image: 'https://placehold.co/400x400/d3f8e2/3a3a3a?text=Drago', category: 'Fantasy Creatures', popularity: 4, dateAdded: '2024-03-01' },
];

const categoriesList = ['All Pals', 'Forest Friends', 'Ocean Buddies', 'Jungle Jammers', 'Fantasy Creatures'];

const ShopPage = () => {
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCategories, setSelectedCategories] = useState(['All Pals']);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category
    if (!selectedCategories.includes('All Pals') && selectedCategories.length > 0) {
      products = products.filter(product => selectedCategories.includes(product.category));
    }

    // Filter by price
    products = products.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Sort products
    if (sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortBy === 'popularity') { // Default or explicit popularity
      products.sort((a, b) => b.popularity - a.popularity); // Higher popularity first
    }

    return products;
  }, [allProducts, selectedCategories, priceRange, sortBy]);

  return (
    <Box>
      <Box py={{ base: '3rem', md: '4rem' }} bgGradient="linear(to-br, secondary.100, bg.100)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2.5rem', md: '3rem' }} color="headingColor" fontWeight="bold">
          Our Cuddly Collection
        </Heading>
      </Box>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={8} p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
        {/* Filters Sidebar */}
        <Box flex={{ base: '1', lg: '0 0 280px' }} bg="white" p={6} borderRadius="20px" boxShadow="lg" alignSelf="flex-start" position={{lg: 'sticky'}} top={{lg: '120px'}} h={{lg: "calc(100vh - 140px)"}} overflowY={{lg: "auto"}}>
          <VStack spacing={6} align="stretch" divider={<StackDivider borderColor="borderColor" />}>
            <Box>
              <Heading size="md" color="headingColor" mb={4} pb={2} borderBottom="2px solid" borderColor="secondary.200">
                Categories
              </Heading>
              <CheckboxGroup colorScheme="primary" value={selectedCategories} onChange={setSelectedCategories}>
                <VStack align="start" spacing={2}>
                  {categoriesList.map(cat => (
                    <Checkbox key={cat} value={cat}>{cat}</Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </Box>
            
            <Box>
              <Heading size="md" color="headingColor" mb={4} pb={2} borderBottom="2px solid" borderColor="secondary.200">
                Price Range
              </Heading>
              <RangeSlider 
                aria-label={['min', 'max']} 
                defaultValue={[0, 150]} 
                min={0} 
                max={150} 
                step={5} 
                onChangeEnd={(val) => setPriceRange(val)}
                colorScheme="primary"
              >
                <RangeSliderTrack bg="secondary.200">
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb boxSize={5} index={0} />
                <RangeSliderThumb boxSize={5} index={1} />
              </RangeSlider>
              <Flex justify="space-between" mt={2} fontSize="sm">
                <Text>${priceRange[0]}</Text>
                <Text>${priceRange[1]}</Text>
              </Flex>
            </Box>

            <Box>
              <Heading size="md" color="headingColor" mb={4} pb={2} borderBottom="2px solid" borderColor="secondary.200">
                Sort By
              </Heading>
              <RadioGroup onChange={setSortBy} value={sortBy} colorScheme="primary">
                <VStack align="start" spacing={2}>
                  <Radio value="popularity">Popularity</Radio>
                  <Radio value="newest">Newest</Radio>
                  <Radio value="price-asc">Price: Low to High</Radio>
                  <Radio value="price-desc">Price: High to Low</Radio>
                </VStack>
              </RadioGroup>
            </Box>
          </VStack>
        </Box>

        {/* Product Listing */}
        <Box flex="1">
          <Flex justify="space-between" align="center" mb={6} bg="white" p={4} borderRadius="15px" boxShadow="md" direction={{base: 'column', md: 'row'}}>
            <Text fontWeight="medium" mb={{base:2, md:0}}>Showing {filteredAndSortedProducts.length} of {allProducts.length} results</Text>
            {/* Alternative Sort Select (can be enabled if preferred over RadioGroup) */}
            {/* <Select 
              w={{base: '100%', md: 'auto'}} 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              focusBorderColor="primary.500" 
              borderRadius="lg"
            >
              <option value="popularity">Popularity</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </Select> */}
          </Flex>
          <Grid 
            templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            {filteredAndSortedProducts.map((product) => (
              <Link as={RouterLink} to={`/product/${product.id}`} key={product.id} _hover={{ textDecoration: 'none' }} role="group">
                <Box 
                  bg="white" 
                  borderRadius="20px" 
                  boxShadow="lg" 
                  overflow="hidden" 
                  transition="all 0.3s ease" 
                  _hover={{ transform: 'translateY(-10px)', boxShadow: 'xl' }} 
                  cursor="pointer" 
                  textAlign="center"
                >
                  <Box bg="secondary.50" p={{base: 3, md: 4}} h={{base: "180px", md: "220px"}} display="flex" alignItems="center" justifyContent="center" overflow="hidden">
                    <Image src={product.image} alt={product.name} objectFit="contain" maxH="100%" transition="transform 0.4s ease" _groupHover={{ transform: 'scale(1.1)' }} />
                  </Box>
                  <Box p={4}>
                    <Heading as="h3" size="sm" color="headingColor" mb={1} noOfLines={1}>{product.name}</Heading>
                    <Text fontSize="md" color="primary.500" fontWeight="semibold">${product.price.toFixed(2)}</Text>
                  </Box>
                </Box>
              </Link>
            ))}
          </Grid>
          {filteredAndSortedProducts.length === 0 && (
            <Text textAlign="center" mt={10} fontSize="lg" color="textColor.700">
              No plushies match your current filters. Try adjusting them or checking back later for new arrivals!
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ShopPage;
