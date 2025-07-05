
import { Box, Container, SimpleGrid, Text, Link, VStack, Divider, Flex } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="blue.800" color="gray.300" py={16} mt={20}>
      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={10} textAlign="left">
          {/* Product Section */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="bold" color="white">Product</Text>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Why Synjana?</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Features</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Pricing</Link>
          </VStack>

          {/* Company Section */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="bold" color="white">Company</Text>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>About Us</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Careers</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Blog</Link>
          </VStack>

          {/* Resources Section */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="bold" color="white">Resources</Text>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Documentation</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>API Status</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Support</Link>
          </VStack>

          {/* Community Section */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="bold" color="white">Community</Text>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Forum</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Discord</Link>
            <Link href="#" _hover={{ textDecoration: "underline", color: "blue.300" }}>Contact</Link>
          </VStack>
        </SimpleGrid>

        {/* Divider Line */}
        <Divider my={8} borderColor="gray.600" />

        {/* Copyright Section */}
        <Flex justify="center">
          <Text fontSize="sm" textAlign="center">
            © {new Date().getFullYear()} Synjana. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
