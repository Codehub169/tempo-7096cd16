import React, { useState, useEffect } from 'react';
import { Box, Flex, Grid, Heading, Text, Button, Image, Icon, HStack, Input, useToast, VStack, SimpleGrid, CircularProgress, IconButton } from '@chakra-ui/react';
import { FiShoppingCart, FiMinus, FiPlus, FiCheckCircle } from 'react-icons/fi';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';

const API_BASE_URL = '/api';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Product not found');
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        
        let initialImage = 'https://placehold.co/600x600/ccc/3a3a3a?text=Image+Not+Available'; // Default placeholder
        if (data.images && data.images.length > 0) {
            initialImage = data.images[0];
        } else if (data.imageUrl) {
            initialImage = data.imageUrl;
        }
        setSelectedImage(initialImage);

      } catch (e) {
        console.error("Failed to fetch product:", e);
        setError(e.message);
        toast({
          title: e.message === 'Product not found' ? 'Product not found' : 'Error loading product',
          description: e.message === 'Product not found' ? "We couldn't find the plushie you're looking for." : "Please try again later.",
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
        if (e.message === 'Product not found') navigate('/shop');
      }
      setIsLoading(false);
    };
    if (productId) fetchProduct();
  }, [productId, toast, navigate]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Please login first',
        description: 'You need to be logged in to add items to your cart.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/login');
      return;
    }

    setIsAdded(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      toast({
        title: `${product.name} added to cart!`,
        description: `Quantity: ${quantity}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
        icon: <FiCheckCircle />
      });
    } catch (e) {
      console.error("Failed to add to cart:", e);
      toast({
        title: 'Failed to add to cart',
        description: e.message || 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
    setTimeout(() => setIsAdded(false), 2000); // Reset button state
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <CircularProgress isIndeterminate color="brand.primary" size="80px" thickness="4px" />
      </Flex>
    );
  }

  if (error && !product) {
    return <Box textAlign="center" py={10} fontSize="xl" color="brand.text">{error}. Maybe it's hiding?</Box>;
  }
  if (!product) {
    return <Box textAlign="center" py={10} fontSize="xl" color="brand.text">Plushie not found. Maybe it's hiding?</Box>;
  }

  const displayImages = product.images && product.images.length > 0 ? product.images : 
    (product.imageUrl ? [product.imageUrl] : [
      `https://placehold.co/600x600/${product.id}a/fff?text=${encodeURIComponent(product.name)}+View+1`,
      `https://placehold.co/600x600/${product.id}b/fff?text=${encodeURIComponent(product.name)}+View+2`,
      `https://placehold.co/600x600/${product.id}c/fff?text=${encodeURIComponent(product.name)}+View+3`
    ]);

  const displayThumbnails = product.thumbnails || displayImages.map((img, i) => 
    img.startsWith('https://placehold.co') ? img.replace('600x600', '150x150').replace('?text=', `?text=Thumb ${i+1}%20`) : 
    `https://placehold.co/150x150/ccc/3a3a3a?text=Thumb ${i+1}` // Generic placeholder for non-placehold.co images
  );

  return (
    <Box py={{ base: '3rem', md: '5rem' }} px={{ base: 4, md: 8 }} maxW="1100px" mx="auto">
      <Grid templateColumns={{ base: '1fr', md: '1fr 1.2fr' }} gap={{ base: 8, md: 12, lg:16 }} alignItems="flex-start">
        {/* Product Gallery */}
        <VStack spacing={4} align="stretch" position={{md: "sticky"}} top={{md: "120px"}}>
          <Box bg="white" borderRadius="20px" overflow="hidden" boxShadow="lg" p={2} aspectRatio={1}>
            <Image src={selectedImage} alt={product.name} objectFit="contain" w="100%" h="100%" transition="transform 0.3s ease" _hover={{ transform: 'scale(1.05)' }} />
          </Box>
          {displayImages.length > 1 && (
            <SimpleGrid columns={Math.min(4, displayThumbnails.length)} spacing={3}>
              {displayThumbnails.map((thumb, index) => (
                <Box 
                  key={index} 
                  bg="white" 
                  border="2px solid" 
                  borderColor={selectedImage === displayImages[index] ? 'brand.primary' : 'brand.border'} 
                  borderRadius="10px" 
                  cursor="pointer" 
                  transition="all 0.3s" 
                  overflow="hidden"
                  onClick={() => setSelectedImage(displayImages[index])}
                  _hover={{ borderColor: 'brand.accent', transform: 'scale(1.05)' }}
                  boxShadow={selectedImage === displayImages[index] ? '0 0 0 3px var(--chakra-colors-brand-secondary)' : 'none'}
                  aspectRatio={1}
                >
                  <Image src={thumb} alt={`Thumbnail ${index + 1}`} objectFit="cover" w="100%" h="100%" />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>

        {/* Product Info */}
        <VStack spacing={5} align="stretch" pt={{ md: 2 }}>
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} color="brand.heading" fontWeight="bold" lineHeight="1.2">
            {product.name}
          </Heading>
          <Text fontSize={{ base: 'xl', md: '2xl' }} color="brand.primary" fontWeight="semibold">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </Text>
          {product.stock_quantity > 0 ? (
            <Flex align="center" bg="green.100" color="green.700" px={3} py={1} borderRadius="full" w="fit-content" fontSize="sm" fontWeight="medium">
              <Icon viewBox="0 0 10 10" mr={2} boxSize="8px"><circle cx="5" cy="5" r="5" fill="currentColor"/></Icon>
              In Stock ({product.stock_quantity} available)
            </Flex>
          ) : (
            <Flex align="center" bg="red.100" color="red.700" px={3} py={1} borderRadius="full" w="fit-content" fontSize="sm" fontWeight="medium">
               <Icon viewBox="0 0 10 10" mr={2} boxSize="8px"><circle cx="5" cy="5" r="5" fill="currentColor"/></Icon>
              Out of Stock
            </Flex>
          )}
          <Text color="brand.text" lineHeight="tall" fontSize="md">
            {product.description}
          </Text>
          
          <HStack spacing={3} my={3}>
            <Text fontWeight="medium" color="brand.heading" mr={2}>Quantity:</Text>
            <Flex align="center" border="2px solid" borderColor="brand.border" borderRadius="full" p="2px">
              <IconButton variant="ghost" onClick={() => handleQuantityChange(-1)} icon={<FiMinus />} size="sm" isRound aria-label="Decrease quantity" isDisabled={product.stock_quantity === 0 || quantity <= 1}/>
              <Input 
                value={quantity} 
                readOnly 
                textAlign="center" 
                w="40px" 
                h="30px"
                border="none" 
                focusBorderColor="transparent" 
                fontSize="md" 
                fontWeight="semibold"
                p={0}
                color="brand.heading"
              />
              <IconButton variant="ghost" onClick={() => handleQuantityChange(1)} icon={<FiPlus />} size="sm" isRound aria-label="Increase quantity" isDisabled={product.stock_quantity === 0 || quantity >= product.stock_quantity}/>
            </Flex>
          </HStack>

          <Button 
            variant={isAdded ? "solid" : "gradient"} 
            bg={isAdded ? "green.400" : undefined}
            color={isAdded ? "white" : "white"}
            size="lg" 
            leftIcon={isAdded ? <FiCheckCircle /> : <FiShoppingCart />} 
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || isAdded}
            w={{ base: '100%', md: 'auto' }}
            px={8}
            _hover={!isAdded ? {transform: 'translateY(-2px)', boxShadow:'lg'} : {bg: 'green.500'}}
          >
            {isAdded ? 'Added to Cart!' : 'Add to Cart'}
          </Button>
        </VStack>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;
