import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Textarea, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, useToast, CircularProgress, Alert, AlertIcon, Icon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Divider, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiPackage, FiAlertCircle, FiTag } from 'react-icons/fi'; // Added FiTag
import { ChevronRightIcon } from '@chakra-ui/icons';

const API_BASE_URL = '/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryName: '',
    stock_quantity: '',
    popularity: '0',
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
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

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setFetchError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setProductFormData(prev => ({ ...prev, categoryName: data[0].name }));
      } else {
        setProductFormData(prev => ({ ...prev, categoryName: '' }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setFetchError(error.message);
      toast({ title: 'Error', description: `Could not load categories: ${error.message}`, status: 'error', duration: 3000, isClosable: true });
    }
    setIsLoadingCategories(false);
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductNumberInputChange = (name, valueAsString, valueAsNumber) => {
    setProductFormData(prev => ({ ...prev, [name]: valueAsString }));
  };

  const handleNewCategoryInputChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingProduct(true);

    if (!productFormData.name || !productFormData.description || !productFormData.price || !productFormData.categoryName || !productFormData.stock_quantity) {
      toast({ title: 'Missing Fields', description: 'Please fill all required fields for the product.', status: 'warning', duration: 3000, isClosable: true });
      setIsSubmittingProduct(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      setIsSubmittingProduct(false);
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
          ...productFormData,
          price: parseFloat(productFormData.price),
          stock_quantity: parseInt(productFormData.stock_quantity),
          popularity: parseInt(productFormData.popularity) || 0,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add product');
      }

      toast({ title: 'Product Added!', description: `${productFormData.name} has been successfully added.`, status: 'success', duration: 3000, isClosable: true });
      setProductFormData({
        name: '', description: '', price: '', imageUrl: '', categoryName: categories.length > 0 ? categories[0].name : '', stock_quantity: '', popularity: '0',
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({ title: 'Error Adding Product', description: error.message, status: 'error', duration: 4000, isClosable: true });
    }
    setIsSubmittingProduct(false);
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingCategory(true);

    if (!newCategoryName.trim()) {
      toast({ title: 'Missing Field', description: 'Please enter a category name.', status: 'warning', duration: 3000, isClosable: true });
      setIsSubmittingCategory(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      setIsSubmittingCategory(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add category');
      }

      toast({ title: 'Category Added!', description: `${newCategoryName.trim()} has been successfully added.`, status: 'success', duration: 3000, isClosable: true });
      setNewCategoryName('');
      fetchCategories(); // Refresh category list
    } catch (error) {
      console.error('Error adding category:', error);
      toast({ title: 'Error Adding Category', description: error.message, status: 'error', duration: 4000, isClosable: true });
    }
    setIsSubmittingCategory(false);
  };


  return (
    <Box>
      <Box py={{ base: '2rem', md: '3rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color="brand.heading" fontWeight="bold">
          Admin Panel
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
          <VStack spacing={10} align="stretch">
            {/* Add New Category Form */}
            <VStack as="form" onSubmit={handleAddCategorySubmit} spacing={6} bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow="lg">
                <Heading size="lg" color="brand.heading" display="flex" alignItems="center" w="full">
                    <Icon as={FiTag} mr={3} color="brand.primary" /> Add New Category
                </Heading>
                <FormControl isRequired>
                    <FormLabel>Category Name</FormLabel>
                    <HStack>
                        <Input name="newCategoryName" value={newCategoryName} onChange={handleNewCategoryInputChange} placeholder="e.g., Mythical Creatures" />
                        <Button 
                            type="submit" 
                            variant="solid"
                            colorScheme="pink"
                            leftIcon={<FiPlusCircle />}
                            isLoading={isSubmittingCategory}
                            loadingText="Adding..."
                            px={6}
                        >
                            Add
                        </Button>
                    </HStack>
                </FormControl>
            </VStack>

            <Divider />

            {/* Add New Product Form */}
            <VStack as="form" onSubmit={handleAddProductSubmit} spacing={6} bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow="lg">
              <Heading size="lg" color="brand.heading" display="flex" alignItems="center" w="full">
                <Icon as={FiPackage} mr={3} color="brand.primary" /> Add New Product
              </Heading>

              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input name="name" value={productFormData.name} onChange={handleProductInputChange} placeholder="e.g., Cuddly Teddy Bear" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" value={productFormData.description} onChange={handleProductInputChange} placeholder="Detailed description of the plushie..." />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price ($)</FormLabel>
                <NumberInput min={0.01} precision={2} name="price" value={productFormData.price} onChange={(valueString) => handleProductNumberInputChange('price', valueString)}>
                  <NumberInputField placeholder="e.g., 29.99" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Image URL (Optional)</FormLabel>
                <Input name="imageUrl" value={productFormData.imageUrl} onChange={handleProductInputChange} placeholder="https://example.com/image.jpg" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select name="categoryName" value={productFormData.categoryName} onChange={handleProductInputChange} placeholder={categories.length === 0 ? "No categories found/add one first" : "Select category"} isDisabled={categories.length === 0}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Stock Quantity</FormLabel>
                <NumberInput min={0} name="stock_quantity" value={productFormData.stock_quantity} onChange={(valueString) => handleProductNumberInputChange('stock_quantity', valueString)}>
                  <NumberInputField placeholder="e.g., 50" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Popularity (Optional)</FormLabel>
                <NumberInput min={0} defaultValue={0} name="popularity" value={productFormData.popularity} onChange={(valueString) => handleProductNumberInputChange('popularity', valueString)}>
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
                isLoading={isSubmittingProduct}
                loadingText="Adding Product..."
                size="lg"
                w="full"
                isDisabled={categories.length === 0 || isLoadingCategories}
              >
                Add Product
              </Button>
            </VStack>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AdminPage;
