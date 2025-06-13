import { Box, Image, Text, VStack, LinkBox, LinkOverlay, useColorModeValue, AspectRatio } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const ProductCard = ({ product }) => {
  if (!product) {
    // Handle cases where product data might be missing or loading
    return (
      <Box borderWidth="1px" borderColor="gray.200" borderRadius="2xl" p={4} textAlign="center">
        <Text>Loading product...</Text>
      </Box>
    );
  }

  const { id, name, price, imageUrl, category } = product;

  return (
    <LinkBox
      as="article"
      borderWidth="1px"
      borderColor={useColorModeValue('brand.border', 'gray.700')}
      borderRadius="2xl" // from HTML: border-radius: 20px;
      overflow="hidden"
      bg={useColorModeValue('white', 'gray.800')}
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: 'translateY(-10px)', // from HTML
        shadow: 'xl', // Softer than HTML's custom shadow, but standard Chakra
      }}
      role="group" 
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Box 
        overflow="hidden" 
        bg={useColorModeValue('brand.secondary', 'gray.700')} // from HTML: product-image background-color
        p={{ base: 4, md: 6 }} 
        borderTopRadius="2xl" // Match parent
        flexShrink={0}
      >
        <AspectRatio ratio={1} w="100%">
          <Image
            src={imageUrl || `https://placehold.co/300x300/${useColorModeValue('fddde6', '4A5568')}/${useColorModeValue('3a3a3a', 'whiteAlpha.900')}?text=${encodeURIComponent(name || 'Plushie')}`}
            alt={name || 'Plushie product image'}
            objectFit="cover"
            transition="transform 0.4s ease" // from HTML
            _groupHover={{
              transform: 'scale(1.1)', // from HTML
            }}
            borderRadius="md" // Slightly rounded image corners within its container
          />
        </AspectRatio>
      </Box>
      <VStack p={{base:4, md:6}} spacing={3} align="center" flexGrow={1} justify="space-between" textAlign="center">
        <VStack spacing={1} align="center" w="full">
          {category && (
            <Text fontSize="xs" color="brand.primary" fontWeight="medium" textTransform="uppercase" noOfLines={1}>
              {category}
            </Text>
          )}
          <LinkOverlay as={RouterLink} to={`/product/${id || '0'}`}>
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }} 
              fontWeight="semibold" 
              fontFamily="heading" 
              color={useColorModeValue('brand.heading', 'whiteAlpha.900')}
              lineHeight="short"
              noOfLines={2} // Ensure name doesn't break layout too much
            >
              {name || 'Unnamed Plushie'}
            </Text>
          </LinkOverlay>
        </VStack>
        <Text 
          fontSize={{ base: 'md', md: 'lg' }} 
          fontWeight="bold" 
          color='brand.primary'
        >
          ${price !== undefined ? parseFloat(price).toFixed(2) : '0.00'}
        </Text>
      </VStack>
    </LinkBox>
  );
};

export default ProductCard;
