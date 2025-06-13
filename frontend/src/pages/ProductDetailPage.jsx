import React, { useState, useEffect } from 'react';
import { Box, Flex, Grid, Heading, Text, Button, Image, Icon, HStack, Input, useToast, VStack, SimpleGrid, CircularProgress } from '@chakra-ui/react';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';

// Placeholder data - replace with actual data fetching logic (e.g., API call)
const productsData = {
  '1': { name: 'Barnaby Bear', price: 29.99, description: 'Meet Barnaby, the friendliest bear in the woods! Made from super-soft, eco-friendly materials, he\'s perfect for hugs and adventures. His charming, hand-stitched smile is guaranteed to brighten any day.', stock: true, images: ['https://placehold.co/600x600/fddde6/3a3a3a?text=Barnaby+1', 'https://placehold.co/600x600/fddde6/3a3a3a?text=Barnaby+2', 'https://placehold.co/600x600/fddde6/3a3a3a?text=Barnaby+3', 'https://placehold.co/600x600/fddde6/3a3a3a?text=Barnaby+4'], thumbnails: ['https://placehold.co/150x150/fddde6/3a3a3a?text=1', 'https://placehold.co/150x150/fddde6/3a3a3a?text=2', 'https://placehold.co/150x150/fddde6/3a3a3a?text=3', 'https://placehold.co/150x150/fddde6/3a3a3a?text=4'] },
  '2': { name: 'Flippy Penguin', price: 24.99, description: 'Flippy is a playful penguin ready to waddle into your heart. Soft, squishy, and always up for fun!', stock: true, images: ['https://placehold.co/600x600/a9def9/3a3a3a?text=Flippy+1', 'https://placehold.co/600x600/a9def9/3a3a3a?text=Flippy+2', 'https://placehold.co/600x600/a9def9/3a3a3a?text=Flippy+3'], thumbnails: ['https://placehold.co/150x150/a9def9/3a3a3a?text=1', 'https://placehold.co/150x150/a9def9/3a3a3a?text=2', 'https://placehold.co/150x150/a9def9/3a3a3a?text=3'] },
  '3': { name: 'Leo the Lion', price: 32.99, description: 'Leo the Lion is king of cuddles! With his majestic mane and gentle roar, he\'s ready for royal adventures.', stock: false, images: ['https://placehold.co/600x600/fcf6bd/3a3a3a?text=Leo+1'], thumbnails: ['https://placehold.co/150x150/fcf6bd/3a3a3a?text=1'] },
  // Add other products as needed from ShopPage data for consistency
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching product data with a delay
    const timer = setTimeout(() => {
      const fetchedProduct = productsData[productId];
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images[0]);
      } else {
        // Handle product not found, e.g. redirect to 404 or show message
        toast({
          title: 'Product not found',
          description: "We couldn't find the plushie you're looking for.",
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/shop'); // Or to a 404 page
      }
      setIsLoading(false);
    }, 500); // 0.5 second delay
    return () => clearTimeout(timer);
  }, [productId, toast, navigate]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    // Placeholder for add to cart logic (e.g., dispatch to context/redux)
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    toast({
      title: `${product.name} added to cart!`,
      description: `Quantity: ${quantity}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      variant: 'subtle',
    });
    setTimeout(() => setIsAdded(false), 2000); // Reset button state
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <CircularProgress isIndeterminate color="primary.500" size="80px" thickness="4px" />
      </Flex>
    );
  }

  if (!product) {
    // This case should ideally be handled by the redirect in useEffect, but as a fallback:
    return <Box textAlign="center" py={10} fontSize="xl" color="textColor.700">Plushie not found. Maybe it's hiding?</Box>;
  }

  return (
    <Box py={{ base: '3rem', md: '5rem' }} px={{ base: 4, md: 8 }} maxW="1100px" mx="auto">
      <Grid templateColumns={{ base: '1fr', md: '1fr 1.2fr' }} gap={{ base: 8, md: 12, lg:16 }} alignItems="flex-start">
        {/* Product Gallery */}
        <VStack spacing={4} align="stretch" position="sticky" top="120px">
          <Box bg="white" borderRadius="20px" overflow="hidden" boxShadow="lg" p={2} aspectRatio={1}>
            <Image src={selectedImage} alt={product.name} objectFit="contain" w="100%" h="100%" transition="transform 0.3s ease" _hover={{ transform: 'scale(1.05)' }} />
          </Box>
          {product.images.length > 1 && (
            <SimpleGrid columns={Math.min(4, product.thumbnails.length)} spacing={3}>
              {product.thumbnails.map((thumb, index) => (
                <Box 
                  key={index} 
                  bg="white" 
                  border="2px solid" 
                  borderColor={selectedImage === product.images[index] ? 'primary.500' : 'borderColor'} 
                  borderRadius="10px" 
                  cursor="pointer" 
                  transition="all 0.3s" 
                  overflow="hidden"
                  onClick={() => setSelectedImage(product.images[index])}
                  _hover={{ borderColor: 'accent.400', transform: 'scale(1.05)' }}
                  boxShadow={selectedImage === product.images[index] ? '0 0 0 3px var(--chakra-colors-secondary-200)' : 'none'}
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
          <Heading as="h1" fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} color="headingColor" fontWeight="bold" lineHeight="1.2">
            {product.name}
          </Heading>
          <Text fontSize={{ base: 'xl', md: '2xl' }} color="primary.500" fontWeight="semibold">
            ${product.price.toFixed(2)}
          </Text>
          {product.stock ? (
            <Flex align="center" bg="green.100" color="green.700" px={3} py={1} borderRadius="full" w="fit-content" fontSize="sm" fontWeight="medium">
              <Icon viewBox="0 0 10 10" mr={2} boxSize="8px"><circle cx="5" cy="5" r="5" fill="currentColor"/></Icon>
              In Stock
            </Flex>
          ) : (
            <Flex align="center" bg="red.100" color="red.700" px={3} py={1} borderRadius="full" w="fit-content" fontSize="sm" fontWeight="medium">
               <Icon viewBox="0 0 10 10" mr={2} boxSize="8px"><circle cx="5" cy="5" r="5" fill="currentColor"/></Icon>
              Out of Stock
            </Flex>
          )}
          <Text color="textColor.600" lineHeight="tall" fontSize="md">
            {product.description}
          </Text>
          
          <HStack spacing={3} my={3}>
            <Text fontWeight="medium" color="headingColor" mr={2}>Quantity:</Text>
            <Flex align="center" border="2px solid" borderColor="borderColor" borderRadius="full" p="2px">
              <Button variant="ghost" onClick={() => handleQuantityChange(-1)} icon={<FiMinus />} size="sm" isRound aria-label="Decrease quantity"isDisabled={!product.stock}/>
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
                color="headingColor"
              />
              <Button variant="ghost" onClick={() => handleQuantityChange(1)} icon={<FiPlus />} size="sm" isRound aria-label="Increase quantity" isDisabled={!product.stock}/>
            </Flex>
          </HStack>

          <Button 
            variant={isAdded ? "solid" : "gradient"} 
            colorScheme={isAdded ? "green" : "primary"} // Chakra specific for solid variant
            bg={isAdded ? "accent.300" : undefined} // Custom for added state if using variant="solid"
            color={isAdded ? "headingColor" : "white"}
            size="lg" 
            leftIcon={isAdded ? undefined : <FiShoppingCart />} 
            onClick={handleAddToCart}
            disabled={!product.stock || isAdded}
            w={{ base: '100%', md: 'auto' }}
            px={8}
            _hover={!isAdded ? {transform: 'translateY(-2px)', boxShadow:'lg'} : {bg: 'accent.400'}}
          >
            {isAdded ? 'Added to Cart!' : 'Add to Cart'}
          </Button>
        </VStack>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;
