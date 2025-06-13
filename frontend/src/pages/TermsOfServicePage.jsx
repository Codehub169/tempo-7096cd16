import React from 'react';
import { Box, Heading, Text, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

const TermsOfServicePage = () => {
  return (
    <Box>
      <Box py={{ base: '2rem', md: '3rem' }} bgGradient="linear(to-br, brand.secondary, brand.background)" textAlign="center">
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} color="brand.heading" fontWeight="bold">
          Terms of Service
        </Heading>
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="brand.text" />} display="flex" justifyContent="center" mt={2}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to='/' color="brand.primary" _hover={{textDecoration: 'underline'}}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#' color="brand.text">Terms of Service</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <VStack spacing={5} py={{ base: '2rem', md: '4rem' }} px={{ base: 4, md: 8 }} maxW="800px" mx="auto" align="start" bg="white" my={8} borderRadius="xl" boxShadow="lg" p={8}>
        <Heading as="h2" size="lg" color="brand.heading">1. Acceptance of Terms</Heading>
        <Text color="brand.text" lineHeight="tall">
          By accessing and using Plushie Paradise (the "Website"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>2. Products and Sales</Heading>
        <Text color="brand.text" lineHeight="tall">
          All products listed on the Website are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any product at any time for any reason. Prices for all products are subject to change.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>3. User Accounts</Heading>
        <Text color="brand.text" lineHeight="tall">
          To access certain features of the Website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account or password, or any other breach of security.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>4. Intellectual Property</Heading>
        <Text color="brand.text" lineHeight="tall">
          The Website and its original content, features, and functionality are owned by Plushie Paradise and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>5. Limitation of Liability</Heading>
        <Text color="brand.text" lineHeight="tall">
          In no event shall Plushie Paradise, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Website.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>6. Governing Law</Heading>
        <Text color="brand.text" lineHeight="tall">
          These Terms shall be governed and construed in accordance with the laws of our operating jurisdiction, without regard to its conflict of law provisions.
        </Text>

        <Heading as="h2" size="lg" color="brand.heading" pt={4}>7. Changes to Terms</Heading>
        <Text color="brand.text" lineHeight="tall">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </Text>
        
        <Text color="brand.text" fontSize="sm" pt={6} fontStyle="italic">Last updated: {new Date().toLocaleDateString()}</Text>
      </VStack>
    </Box>
  );
};

export default TermsOfServicePage;
