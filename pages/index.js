
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  Icon,
  SimpleGrid,
  Container,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaRocket, FaHistory, FaChartLine, FaDatabase, FaCogs } from "react-icons/fa";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

export default function HomePage() {
  const router = useRouter();

  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Box
        minH="90vh"
        bgGradient="linear(to-br, #091C48, #123972)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        p={10}
      >
        <Container
          maxW="850px"
          p={12}
          bg="white"
          borderRadius="15px"
          boxShadow="2xl"
          textAlign="center"
          transform="translateY(-30px)"
        >
          <Heading as="h1" size="2xl" fontWeight="bold" mb={4} color="blue.800">
            Empower AI with High-Quality Synthetic Data
          </Heading>
          <Text fontSize="lg" mb={6} color="gray.700">
            Secure, scalable, and customizable synthetic datasets to supercharge your AI models.
          </Text>

          {/* Action Buttons */}
          <HStack spacing={6} justify="center">
            <Button
              size="lg"
              colorScheme="blue"
              leftIcon={<Icon as={FaRocket} />}
              onClick={() => router.push("/data-request")}
            >
              Generate Data
            </Button>
            <Button
              size="lg"
              colorScheme="green"
              leftIcon={<Icon as={FaHistory} />}
              onClick={() => router.push("/history")}
            >
              View History
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box bg="gray.100" py={16} px={10} textAlign="center">
        <Heading size="2xl" mb={10} color="blue.700">
          Why Choose Synjana?
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="md"
            transition="0.3s"
            _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
          >
            <Icon as={FaChartLine} boxSize={12} color="blue.500" mb={4} />
            <Heading size="lg" color="blue.600">
              Advanced Analytics
            </Heading>
            <Text color="gray.600" mt={2}>Gain deeper insights from structured synthetic data.</Text>
          </Box>

          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="md"
            transition="0.3s"
            _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
          >
            <Icon as={FaDatabase} boxSize={12} color="green.500" mb={4} />
            <Heading size="lg" color="green.600">
              Secure Storage
            </Heading>
            <Text color="gray.600" mt={2}>Ensure complete privacy with robust encryption.</Text>
          </Box>

          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="md"
            transition="0.3s"
            _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
          >
            <Icon as={FaCogs} boxSize={12} color="purple.500" mb={4} />
            <Heading size="lg" color="purple.600">
              Customizable Models
            </Heading>
            <Text color="gray.600" mt={2}>Easily configure synthetic data to match your needs.</Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Call to Action Section */}
      <Box bg="blue.700" py={16} textAlign="center" color="white">
        <Heading size="2xl" mb={4}>Ready to Get Started?</Heading>
        <Text fontSize="lg" mb={6}>
          Generate high-quality synthetic data today and take your AI models to the next level.
        </Text>
        <Button size="lg" colorScheme="whiteAlpha" onClick={() => router.push("/data-request")}>
          Generate Now
        </Button>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
