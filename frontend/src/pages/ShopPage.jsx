import React, { useState, useMemo, useEffect } from 'react';
import { Box, Flex, Heading, Text, Grid, Select, CheckboxGroup, Checkbox, VStack, StackDivider, RadioGroup, Radio, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Button, CircularProgress } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = 'http://localhost:9000/api';

const ShopPage = () => {
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceRange, setPriceRange] = useState([0, 150]); // Client-side filter
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCategories, setSelectedCategories] = useState(['All Pals']);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromQuery = params.get('category');
    if (categoryFromQuery && !selectedCategories.includes(categoryFromQuery)) {
      setSelectedCategories([categoryFromQuery]);
    }
  }, [location.search, selectedCategories]); // Added selectedCategories to dependency array

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCategoriesList(['All Pals', ...data.map(cat => cat.name)]);
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setError(e.message); // Set error state for categories fetch too
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      let query = `?sort=${sortBy}`;
      // Backend doesn't support multiple categories in one query param like 'cat1,cat2'
      // So, if multiple are selected (and not 'All Pals'), we might need to fetch for each or fetch all and filter client-side for categories.
      // For simplicity, if 'All Pals' is not selected, and there's one category, we filter by it.
      // If multiple specific categories are selected, this simple query won't work perfectly without backend changes or more complex client logic.
      // Current backend takes one category name.
      if (!selectedCategories.includes('All Pals') && selectedCategories.length === 1) {
        query += `&category=${encodeURIComponent(selectedCategories[0])}`;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/products${query}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAllProducts(data);
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError(e.message);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [sortBy, selectedCategories]); // Re-fetch when sort or category selection changes

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    // Client-side category filtering if multiple selected, or if 'All Pals' is not selected and query didn't handle it
    if (!selectedCategories.includes('All Pals') && selectedCategories.length > 0) {
        // If more than one category selected, filter client-side (as API takes one category)
        // Or if only one selected, this acts as a safeguard if API didn't filter (e.g., if API behavior changes)
        products = products.filter(product => selectedCategories.includes(product.categoryName));
    } 
    // If 'All Pals' is selected (or selectedCategories is empty, though UI forces 'All Pals' or specific choice), no client-side category filter needed beyond what API returns by default.

    // Client-side price filtering
    products = products.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Sorting is primarily handled by the backend via `sortBy` state feeding into the API query.
    // If any client-side sorting is needed post-fetch (e.g., if API sort is limited), it would go here.
    // The current `sortBy` directly maps to backend sorting options.

    return products;
  }, [allProducts, selectedCategories, priceRange]);

  if (isLoading && allProducts.length === 0 && categoriesList.length === 0) { // Show loader only on initial full load
    return <Flex justify="center" align="center" minH="60vh"><CircularProgress isIndeterminate color="brand.primary" /></Flex>;
  }

  if (error && allProducts.length === 0) { // Show error if products failed and list is empty
    return <Box textAlign="center" py={10}>Error loading products: {error}. Please try refreshing.</Box>;
  }

  return (
    <Box>
      <Box py={{ base: '3rem', md: '4rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2.5rem', md: '3rem' }} color="brand.heading" fontWeight="bold">
          Our Cuddly Collection
        </Heading>
      </Box>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={8} p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
        {/* Filters Sidebar */}
        <Box flex={{ base: '1', lg: '0 0 280px' }} bg="white" p={6} borderRadius="20px" boxShadow="lg" alignSelf="flex-start" position={{lg: 'sticky'}} top={{lg: '120px'}} h={{lg: "calc(100vh - 140px)"}} overflowY={{lg: "auto"}}>
          <VStack spacing={6} align="stretch" divider={<StackDivider borderColor="brand.border" />}>
            <Box>
              <Heading size="md" color="brand.heading" mb={4} pb={2} borderBottom="2px solid" borderColor="brand.secondary">
                Categories
              </Heading>
              {categoriesList.length > 0 ? (
                <CheckboxGroup colorScheme="primary" value={selectedCategories} onChange={setSelectedCategories}>
                  <VStack align="start" spacing={2}>
                    {categoriesList.map(cat => (
                      <Checkbox key={cat} value={cat}>{cat}</Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              ) : (
                <Text fontSize="sm" color="brand.text">Loading categories...</Text>
              )}
            </Box>
            
            <Box>
              <Heading size="md" color="brand.heading" mb={4} pb={2} borderBottom="2px solid" borderColor="brand.secondary">
                Price Range
              </Heading>
              <RangeSlider 
                aria-label={['min', 'max']} 
                defaultValue={[0, 150]} 
                min={0} 
                max={150} // Adjust max based on actual product prices if necessary
                step={5} 
                onChangeEnd={(val) => setPriceRange(val)}
                colorScheme="primary"
              >
                <RangeSliderTrack bg="brand.secondary">
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
              <Heading size="md" color="brand.heading" mb={4} pb={2} borderBottom="2px solid" borderColor="brand.secondary">
                Sort By
              </Heading>
              <RadioGroup onChange={setSortBy} value={sortBy} colorScheme="primary">
                <VStack align="start" spacing={2}>
                  <Radio value="popularity">Popularity</Radio>
                  <Radio value="newest">Newest</Radio>
                  <Radio value="price_asc">Price: Low to High</Radio> 
                  <Radio value="price_desc">Price: High to Low</Radio>
                </VStack>
              </RadioGroup>
            </Box>
          </VStack>
        </Box>

        {/* Product Listing */}
        <Box flex="1">
          <Flex justify="space-between" align="center" mb={6} bg="white" p={4} borderRadius="15px" boxShadow="md" direction={{base: 'column', md: 'row'}}>
            <Text fontWeight="medium" mb={{base:2, md:0}}>Showing {filteredAndSortedProducts.length} results</Text>
            {/* Sort select can be an alternative if preferred */}
          </Flex>
          {isLoading && <Flex justify="center" py={10}><CircularProgress isIndeterminate color="brand.primary" /></Flex>}
          {!isLoading && filteredAndSortedProducts.length > 0 ? (
            <Grid 
              templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={6}
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  category: product.categoryName
                }} />
              ))}
            </Grid>
          ) : (
            !isLoading && <Text textAlign="center" mt={10} fontSize="lg" color="brand.text">
              No plushies match your current filters. Try adjusting them or checking back later for new arrivals!
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ShopPage;
