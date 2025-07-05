import { Box, Heading, Text, VStack, Button, Divider, Flex, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaCreditCard, FaArrowLeft, FaDollarSign } from "react-icons/fa";

export default function PaymentsPage() {
    const router = useRouter();

    return (
        <Box
            minH="100vh"
            bgGradient="linear(to-br, #3B0086, #6A0DAD, #A855F7)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={10}
        >
            <Box
                maxW="700px"
                p={10}
                bg="rgba(255, 255, 255, 0.15)"
                backdropFilter="blur(15px)"
                borderRadius="20px"
                boxShadow="0px 15px 50px rgba(0, 0, 0, 0.3)"
                textAlign="center"
                color="white"
            >
                <Heading as="h2" size="xl" mb={6}>
                    Choose a Plan
                </Heading>

                <VStack spacing={6}>
                    {/* Free Plan */}
                    <Box 
                        p={6} 
                        w="full" 
                        bg="rgba(255, 255, 255, 0.2)" 
                        borderRadius="12px" 
                        boxShadow="lg"
                    >
                        <Heading size="md">💡 Free Plan</Heading>
                        <Text mt={2} mb={4}>Limited access to synthetic data generation.</Text>
                        <Divider borderColor="gray.300" />
                        <Text fontWeight="bold" mt={4}>$0 / month</Text>
                        <Button 
                            isDisabled 
                            mt={4} 
                            w="full"
                            colorScheme="gray"
                        >
                            Current Plan
                        </Button>
                    </Box>

                    {/* Pro Plan */}
                    <Box 
                        p={6} 
                        w="full" 
                        bg="rgba(255, 255, 255, 0.25)" 
                        borderRadius="12px" 
                        boxShadow="lg"
                    >
                        <Heading size="md">🚀 Pro Plan</Heading>
                        <Text mt={2} mb={4}>Unlimited synthetic data generation with priority processing.</Text>
                        <Divider borderColor="gray.300" />
                        <Text fontWeight="bold" mt={4}>$19.99 / month</Text>
                        <Button 
                            leftIcon={<Icon as={FaCreditCard} />}
                            colorScheme="blue"
                            mt={4} 
                            w="full"
                            onClick={() => alert("Proceeding to Payment...")}
                        >
                            Subscribe Now
                        </Button>
                    </Box>

                    {/* Enterprise Plan */}
                    <Box 
                        p={6} 
                        w="full" 
                        bg="rgba(255, 255, 255, 0.3)" 
                        borderRadius="12px" 
                        boxShadow="lg"
                    >
                        <Heading size="md">🏢 Enterprise Plan</Heading>
                        <Text mt={2} mb={4}>Custom solutions for large-scale data generation needs.</Text>
                        <Divider borderColor="gray.300" />
                        <Text fontWeight="bold" mt={4}>Contact for Pricing</Text>
                        <Button 
                            leftIcon={<Icon as={FaDollarSign} />}
                            colorScheme="purple"
                            mt={4} 
                            w="full"
                            onClick={() => alert("Contacting Sales...")}
                        >
                            Contact Sales
                        </Button>
                    </Box>

                    {/* Back to Home */}
                    <Button 
                        leftIcon={<Icon as={FaArrowLeft} />}
                        variant="outline" 
                        borderColor="white"
                        color="white"
                        _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
                        transition="0.3s ease-in-out"
                        width="full"
                        p={6}
                        borderRadius="12px"
                        onClick={() => router.push("/")}
                    >
                        Back to Home
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
