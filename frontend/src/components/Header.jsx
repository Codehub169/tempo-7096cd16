import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Link, HStack, IconButton, Icon, Text, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack, Button } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { GiHeartWings } from 'react-icons/gi'; // Placeholder Logo Icon

const API_BASE_URL = 'http://localhost:9000/api';

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
      color={isActive ? 'brand.primary' : 'brand.text'}
      position="relative"
      onClick={onClick} 
      _hover={{
        textDecoration: 'none',
        color: 'brand.primary',
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
        bgColor: 'brand.accent',
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation(); // To re-fetch cart count on navigation
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setCartItemCount(0);
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const items = await response.json();
        setCartItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
      } else if (response.status === 401 || response.status === 403) {
        // Token might be invalid or expired
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setCartItemCount(0);
        // Optionally navigate to login or show a toast
      } else {
        setCartItemCount(0); // Default to 0 on other errors
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartItemCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [location, fetchCartCount]); // Re-fetch on location change (e.g., after login/logout or cart update)

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to storage changes to update login state (e.g. if token removed in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('authToken');
            setIsLoggedIn(!!token);
            if (token) fetchCartCount(); else setCartItemCount(0);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [fetchCartCount]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    // localStorage.removeItem('userData'); // if you stored user data
    setIsLoggedIn(false);
    setCartItemCount(0);
    navigate('/login');
  };

  return (
    <Box
      as="header"
      bg="white"
      px={{ base: 4, md: 8 }}
      py={isScrolled ? 2 : 4}
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow={isScrolled ? '0 6px 25px var(--chakra-colors-brand-shadow)' : '0 4px 20px var(--chakra-colors-brand-shadow)'}
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
            <Icon as={GiHeartWings} w={10} h={10} color="brand.primary" mr={2} />
            <Text fontSize="2xl" fontWeight="bold" color="brand.heading" fontFamily="heading">
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
          {isLoggedIn ? (
            <Button onClick={handleLogout} variant="ghost" colorScheme="primary" size="sm">Logout</Button>
          ) : (
            <IconButton
              as={RouterLink}
              to="/login"
              aria-label="Account"
              icon={<Icon as={FaUserCircle} w={6} h={6} />}
              variant="ghost"
              color="brand.text"
              _hover={{ color: 'brand.primary', transform: 'scale(1.1)' }}
              transition="transform 0.2s"
            />
          )}
          <Box position="relative">
            <IconButton
              as={RouterLink}
              to="/cart"
              aria-label="Cart"
              icon={<Icon as={FaShoppingCart} w={6} h={6} />}
              variant="ghost"
              color="brand.text"
              _hover={{ color: 'brand.primary', transform: 'scale(1.1)' }}
              transition="transform 0.2s"
            />
            {isLoggedIn && cartItemCount > 0 && (
              <Flex
                position="absolute"
                top="-8px"
                right="-10px"
                bg="brand.accent"
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
              <Icon as={GiHeartWings} w={8} h={8} color="brand.primary" mr={2} />
              <Text fontSize="xl" fontWeight="bold" color="brand.heading" fontFamily="heading">
                Plushie Paradise
              </Text>
            </Link>
          </DrawerHeader>
          <DrawerBody>
            <VStack as={'nav'} spacing={4} align="stretch">
              {navItems.map((item) => (
                <NavLink key={item.label} to={item.path} onClick={onClose}>{item.label}</NavLink>
              ))}
              {isLoggedIn && <Button onClick={() => { handleLogout(); onClose(); }} variant="outline" colorScheme="primary" w="full" mt={4}>Logout</Button>}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
