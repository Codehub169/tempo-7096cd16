import React from 'react';
import { Box, Heading, Text, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

const PrivacyPolicyPage = () => {
  return (
    <Box>
      <Box py={{ base: '2rem', md: '3rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color="brand.heading" fontWeight="bold">
          Privacy Policy
        </Heading>
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="brand.text" />} display="flex" justifyContent="center" mt={2}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to='/' color="brand.primary" _hover={{textDecoration: 'underline'}}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#' color="brand.text">Privacy Policy</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <VStack spacing={5} py={{ base: '2rem', md: '4rem' }} px={{ base: 4, md: 8 }} maxW="800px" mx="auto" align="start" bg="white" my={8} borderRadius="xl" boxShadow="lg" p={8}>
        <Heading as="h2" size="lg" color="brand.heading">Introduction</Heading>
        <Text color="brand.text" lineHeight="tall">
          Welcome to Plushie Paradise! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </Text>
        
        <Heading as="h2" size="lg" color="brand.heading" pt={4}>Information We Collect</Heading>
        <Text color="brand.text" lineHeight="tall">
          We may collect personal identification information (Name, email address, phone number, etc.) and non-personal identification information (browser name, type of computer, etc.).
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>How We Use Your Information</Heading>
        <Text color="brand.text" lineHeight="tall">
          We use the information we collect to operate and maintain our website, process transactions, send you marketing communications, respond to your comments or inquiries, and improve user experience.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>Sharing Your Information</Heading>
        <Text color="brand.text" lineHeight="tall">
          We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>Security of Your Information</Heading>
        <Text color="brand.text" lineHeight="tall">
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>Changes to This Privacy Policy</Heading>
        <Text color="brand.text" lineHeight="tall">
          Plushie Paradise has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>Contacting Us</Heading>
        <Text color="brand.text" lineHeight="tall">
          If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at support@plushieparadise.com.
        </Text>
        <Text color="brand.text" fontSize="sm" pt={6} fontStyle="italic">Last updated: {new Date().toLocaleDateString()}</Text>
      </VStack>
    </Box>
  );
};

export default PrivacyPolicyPage;
