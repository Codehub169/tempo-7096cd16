import { Box, Container, Flex, HStack, IconButton, Link, Stack, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { GiHeartWings } from 'react-icons/gi'; // Consistent with Header.jsx placeholder

const Footer = () => {
  return (
    <Box bg="brand.secondary" color="brand.text" py={{ base: 10, md: 16 }}>
      <Container maxW="container.xl">
        <VStack spacing={{ base: 6, md: 8 }} align="center">
          <RouterLink to="/">
            <Flex align="center" color="brand.heading">
              <GiHeartWings size="40px" color="var(--chakra-colors-brand-primary)" />
              <Text fontSize="2xl" fontWeight="bold" ml={2} fontFamily="heading">
                Plushie Paradise
              </Text>
            </Flex>
          </RouterLink>

          <HStack spacing={{ base: 4, md: 8 }} wrap="wrap" justify="center">
            <Link as={RouterLink} to="/" _hover={{ color: 'brand.primary' }} fontWeight="medium">
              Home
            </Link>
            <Link as={RouterLink} to="/shop" _hover={{ color: 'brand.primary' }} fontWeight="medium">
              Shop
            </Link>
            <Link as={RouterLink} to="/privacy-policy" _hover={{ color: 'brand.primary' }} fontWeight="medium">
              Privacy Policy
            </Link>
            <Link as={RouterLink} to="/terms-of-service" _hover={{ color: 'brand.primary' }} fontWeight="medium">
              Terms of Service
            </Link>
          </HStack>

          <HStack spacing={5}>
            <IconButton
              as="a"
              href="#" // Placeholder social media link
              aria-label="Facebook"
              icon={<FaFacebookF />}
              isRound
              variant="ghost"
              color="brand.text"
              _hover={{ bg: 'brand.lightBg', color: 'brand.primary' }}
              size="lg"
            />
            <IconButton
              as="a"
              href="#" // Placeholder social media link
              aria-label="Instagram"
              icon={<FaInstagram />}
              isRound
              variant="ghost"
              color="brand.text"
              _hover={{ bg: 'brand.lightBg', color: 'brand.primary' }}
              size="lg"
            />
            <IconButton
              as="a"
              href="#" // Placeholder social media link
              aria-label="Twitter"
              icon={<FaTwitter />}
              isRound
              variant="ghost"
              color="brand.text"
              _hover={{ bg: 'brand.lightBg', color: 'brand.primary' }}
              size="lg"
            />
          </HStack>

          <Text fontSize="sm" pt={6} borderTopWidth={1} borderColor="rgba(255, 143, 171, 0.3)" w="full" textAlign="center">
            &copy; {new Date().getFullYear()} Plushie Paradise. All Rights Reserved. Designed with &hearts;.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
