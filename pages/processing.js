import { useEffect } from "react";
import { Box, Heading, Text, Spinner, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function ProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("generatedData"));
    
    if (storedData && storedData.generatedData !== "Unable to generate synthetic data.") {
      setTimeout(() => router.push("/results"), 3000);
    } else {
      setTimeout(() => router.push("/results"), 2000);
    }
  }, []);

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} textAlign="center">
      <VStack spacing={4}>
        <Heading>Generating Data...</Heading>
        <Spinner size="xl" />
        <Text>Please wait while we process your request.</Text>
      </VStack>
    </Box>
  );
}
