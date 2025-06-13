import React, { useState, useEffect } from 'react';
import { Box, Flex, Link, HStack, IconButton, Icon, Text, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { GiHeartWings } from 'react-icons/gi'; // Placeholder Logo Icon

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      as={RouterLink} 
      to={to} 
      px={3}
      py={2}
      rounded={'md'}
      fontWeight="medium"
      color={isActive ? 'primary.500' : 'textColor'}
      position="relative"
      onClick={onClick} // Added onClick for drawer links
      _hover={{
        textDecoration: 'none',
        color: 'primary.500',
        _after: { width: '100%' }
      }}
      _after={{
        content: '""',
        position: 'absolute',
        width: isActive ? '100%' : '0',
        height: '3px',
        bottom: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        bgColor: 'accent.500',
        borderRadius: '2px',
        transition: 'width 0.3s ease',
      }}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For mobile drawer
  const cartItemCount = 3; // Placeholder cart count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    // { label: 'About', path: '/about' }, // Future links
    // { label: 'Contact', path: '/contact' },
  ];

  return (
    <Box
      as="header"
      bg="white"
      px={{ base: 4, md: 8 }}
      py={isScrolled ? 2 : 4}
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow={isScrolled ? '0 6px 25px var(--chakra-colors-primary-100)' : '0 4px 20px var(--chakra-colors-primary-100)'}
      transition="padding 0.3s ease, box-shadow 0.3s ease"
      w="full"
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} maxW="container.xl" mx="auto">
        <IconButton
          size={'md'}
          icon={<HamburgerIcon w={6} h={6} />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={onOpen}
          variant="ghost"
        />
        <HStack spacing={8} alignItems={'center'}>
          <Link as={RouterLink} to="/" display="flex" alignItems="center" _hover={{ textDecoration: 'none' }}>
            <Icon as={GiHeartWings} w={10} h={10} color="primary.500" mr={2} />
            <Text fontSize="2xl" fontWeight="bold" color="headingColor" fontFamily="heading">
              Plushie Paradise
            </Text>
          </Link>
          <HStack as={'nav'} spacing={6} display={{ base: 'none', md: 'flex' }}>
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.path}>{item.label}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'} spacing={4}>
          <IconButton
            as={RouterLink}
            to="/login"
            aria-label="Account"
            icon={<Icon as={FaUserCircle} w={6} h={6} />}
            variant="ghost"
            color="textColor"
            _hover={{ color: 'primary.500', transform: 'scale(1.1)' }}
            transition="transform 0.2s"
          />
          <Box position="relative">
            <IconButton
              as={RouterLink}
              to="/cart"
              aria-label="Cart"
              icon={<Icon as={FaShoppingCart} w={6} h={6} />}
              variant="ghost"
              color="textColor"
              _hover={{ color: 'primary.500', transform: 'scale(1.1)' }}
              transition="transform 0.2s"
            />
            {cartItemCount > 0 && (
              <Flex
                position="absolute"
                top="-8px"
                right="-10px"
                bg="accent.500"
                color="white"
                borderRadius="full"
                w="20px"
                h="20px"
                fontSize="xs"
                fontWeight="bold"
                justifyContent="center"
                alignItems="center"
                border="2px solid white"
              >
                {cartItemCount}
              </Flex>
            )}
          </Box>
        </Flex>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Link as={RouterLink} to="/" display="flex" alignItems="center" _hover={{ textDecoration: 'none' }} onClick={onClose}>
              <Icon as={GiHeartWings} w={8} h={8} color="primary.500" mr={2} />
              <Text fontSize="xl" fontWeight="bold" color="headingColor" fontFamily="heading">
                Plushie Paradise
              </Text>
            </Link>
          </DrawerHeader>
          <DrawerBody>
            <VStack as={'nav'} spacing={4} align="stretch">
              {navItems.map((item) => (
                <NavLink key={item.label} to={item.path} onClick={onClose}>{item.label}</NavLink>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
