import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Link, HStack, IconButton, Icon, Text, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, VStack, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { GiHeartWings } from 'react-icons/gi';
import { FiLogOut, FiUser, FiBox } from 'react-icons/fi';

const API_BASE_URL = '/api'; // Changed to relative path

const NavLink = ({ to, children, onClick, isExternal }) => {
  const location = useLocation();
  const isActive = !isExternal && location.pathname === to;
  return (
    <Link 
      as={isExternal ? 'a' : RouterLink} 
      to={isExternal ? undefined : to}
      href={isExternal ? to : undefined}
      target={isExternal ? '_blank' : undefined}
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
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [username, setUsername] = useState('');

  const fetchCartAndUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setCartItemCount(0);
      setIsLoggedIn(false);
      setUsername('');
      return;
    }
    setIsLoggedIn(true);
    try {
        // Decode username from token (basic client-side decode)
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUsername(decodedToken.username || 'User');

      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const items = await response.json();
        setCartItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUsername('');
        setCartItemCount(0);
        navigate('/login');
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart/user data:', error);
      setCartItemCount(0);
      // Potentially handle token parsing error more gracefully
      if (error instanceof SyntaxError || (error.message && error.message.includes('token'))) {
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);
          setUsername('');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartAndUser();
  }, [location, fetchCartAndUser]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
        if (event.key === 'authToken') {
            const token = localStorage.getItem('authToken');
            setIsLoggedIn(!!token);
            if (token) fetchCartAndUser(); else { setCartItemCount(0); setUsername(''); }
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCartAndUser]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUsername('');
    setCartItemCount(0);
    navigate('/login');
    if(isOpen) onClose(); // Close mobile drawer if open
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
        <Flex alignItems={'center'} spacing={{base: 2, md: 4}}>
          {isLoggedIn ? (
            <Menu>
              <MenuButton 
                as={Button} 
                rounded={'full'} 
                variant={'link'} 
                cursor={'pointer'} 
                minW={0}
                px={1}
                _hover={{textDecoration: 'none'}}
                _active={{boxShadow: 'none'}}
                rightIcon={<ChevronDownIcon color="brand.text"/>}
                >
                <HStack>
                    <Icon as={FaUserCircle} w={6} h={6} color="brand.primary"/>
                    <Text display={{base: 'none', sm: 'inline'}} fontWeight="medium" color="brand.text">{username}</Text>
                </HStack>
              </MenuButton>
              <MenuList zIndex="popover" bg="white" borderColor="brand.border" boxShadow="lg">
                <MenuItem as={RouterLink} to="/account" icon={<Icon as={FiUser} w={4} h={4} color="brand.primary"/>}>
                  My Account
                </MenuItem>
                <MenuItem as={RouterLink} to="/account/orders" icon={<Icon as={FiBox} w={4} h={4} color="brand.primary"/>}>
                  Order History
                </MenuItem>
                <MenuDivider borderColor="brand.border"/>
                <MenuItem onClick={handleLogout} icon={<Icon as={FiLogOut} w={4} h={4} color="red.500"/>} color="red.500" fontWeight="medium">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <IconButton
              as={RouterLink}
              to="/login"
              aria-label="Login/Signup"
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

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="brand.border">
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
              <Divider my={3} borderColor="brand.border"/>
              {isLoggedIn ? (
                <>
                  <Button as={RouterLink} to="/account" leftIcon={<FiUser/>} justifyContent="flex-start" variant="ghost" onClick={onClose} w="full">My Account</Button>
                  <Button as={RouterLink} to="/account/orders" leftIcon={<FiBox/>} justifyContent="flex-start" variant="ghost" onClick={onClose} w="full">Order History</Button>
                  <Button onClick={handleLogout} variant="outline" colorScheme="red" w="full" mt={4} leftIcon={<FiLogOut/>}>Logout</Button>
                </>
              ) : (
                <Button as={RouterLink} to="/login" variant="gradient" onClick={onClose} w="full">Login / Signup</Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
