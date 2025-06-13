import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Textarea, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, useToast, CircularProgress, Alert, AlertIcon, Icon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiPackage, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { ChevronRightIcon } from '@chakra-ui/icons';

const API_BASE_URL = '/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryName: '',
    stock_quantity: '',
    popularity: '0',
  });
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to access the admin panel.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setFetchError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryName: data[0].name })); // Default to first category
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setFetchError(error.message);
        toast({ title: 'Error', description: `Could not load categories: ${error.message}`, status: 'error', duration: 3000, isClosable: true });
      }
      setIsLoadingCategories(false);
    };
    fetchCategories();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (name, valueAsString, valueAsNumber) => {
    setFormData(prev => ({ ...prev, [name]: valueAsString }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.description || !formData.price || !formData.categoryName || !formData.stock_quantity) {
      toast({ title: 'Missing Fields', description: 'Please fill all required fields.', status: 'warning', duration: 3000, isClosable: true });
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          popularity: parseInt(formData.popularity) || 0,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add product');
      }

      toast({ title: 'Product Added!', description: `${formData.name} has been successfully added.`, status: 'success', duration: 3000, isClosable: true });
      // Reset form or navigate away
      setFormData({
        name: '', description: '', price: '', imageUrl: '', categoryName: categories.length > 0 ? categories[0].name : '', stock_quantity: '', popularity: '0',
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({ title: 'Error Adding Product', description: error.message, status: 'error', duration: 4000, isClosable: true });
    }
    setIsSubmitting(false);
  };

  return (
    <Box>
      <Box py={{ base: '2rem', md: '3rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color="brand.heading" fontWeight="bold">
          Admin Panel - Add New Product
        </Heading>
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="brand.text" />} display="flex" justifyContent="center" mt={2}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to='/' color="brand.primary" _hover={{ textDecoration: 'underline' }}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#' color="brand.text">Admin Panel</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Box maxW="700px" mx="auto" py={{ base: '2rem', md: '3rem' }} px={{ base: 4, md: 0 }}>
        {isLoadingCategories && <Flex justify="center" py={10}><CircularProgress isIndeterminate color="brand.primary" /></Flex>}
        {fetchError && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            <Text>Error loading categories: {fetchError}. Please ensure categories exist or try refreshing.</Text>
          </Alert>
        )}
        {!isLoadingCategories && !fetchError && (
          <VStack as="form" onSubmit={handleSubmit} spacing={6} bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow="lg">
            <Heading size="lg" color="brand.heading" display="flex" alignItems="center">
              <Icon as={FiPackage} mr={3} color="brand.primary" /> New Product Details
            </Heading>

            <FormControl isRequired>
              <FormLabel>Product Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Cuddly Teddy Bear" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed description of the plushie..." />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price ($)</FormLabel>
              <NumberInput min={0.01} precision={2} name="price" value={formData.price} onChange={(valueString) => handleNumberInputChange('price', valueString)}>
                <NumberInputField placeholder="e.g., 29.99" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Image URL (Optional)</FormLabel>
              <Input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select name="categoryName" value={formData.categoryName} onChange={handleInputChange} placeholder={categories.length === 0 ? "No categories found" : "Select category"} isDisabled={categories.length === 0}>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Stock Quantity</FormLabel>
              <NumberInput min={0} name="stock_quantity" value={formData.stock_quantity} onChange={(valueString) => handleNumberInputChange('stock_quantity', valueString)}>
                <NumberInputField placeholder="e.g., 50" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Popularity (Optional)</FormLabel>
              <NumberInput min={0} name="popularity" value={formData.popularity} onChange={(valueString) => handleNumberInputChange('popularity', valueString)}>
                <NumberInputField placeholder="e.g., 100" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Button 
              type="submit" 
              variant="gradient" 
              leftIcon={<FiPlusCircle />} 
              isLoading={isSubmitting}
              loadingText="Adding Product..."
              size="lg"
              w="full"
              isDisabled={categories.length === 0 || isLoadingCategories}
            >
              Add Product
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
