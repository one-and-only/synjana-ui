import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Divider,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <Box>
      {/*  Navbar */}
      <Navbar />

      {/*  Main Content */}
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-br, #0A0F2C, #153E75)"
        p={6}
      >
        <Box
          maxW="450px"
          p={10}
          bg="white"
          borderRadius="20px"
          boxShadow="0px 10px 30px rgba(0, 0, 0, 0.15)"
          textAlign="center"
          transition="0.3s ease-in-out"
          _hover={{ transform: "scale(1.01)", boxShadow: "lg" }}
          border="1px solid #E0E7FF"
        >
          {/*  Back Button */}
          <Flex justify="flex-start" mb={2}>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              color="blue.800"
              _hover={{ bg: "gray.100" }}
              onClick={() => router.push("/")}
            >
              Back
            </Button>
          </Flex>

          {/*  Heading */}
          <Heading as="h2" size="xl" color="blue.900" mb={3}>
            Create an Account
          </Heading>
          <Text fontSize="md" color="gray.600" mb={5}>
            Sign up to access exclusive features.
          </Text>

          {/*  Email Input */}
          <FormControl mb={4}>
            <HStack mb={1}>
              <FormLabel fontWeight="bold" color="blue.800">
                Email Address
              </FormLabel>
            </HStack>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="white"
              border="1px solid #CBD5E0"
              borderRadius="10px"
              p={3}
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          {/*  Continue Button */}
          <Button
            width="full"
            bgGradient="linear(to-r, #39D98A, #2CA67A)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, #2CA67A, #39D98A)", transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.96)" }}
            transition="0.3s ease-in-out"
            p={6}
            borderRadius="12px"
            mb={4}
          >
            Continue
          </Button>

          {/*  Login Option */}
          <Text color="gray.600" fontSize="sm" mb={3}>
            Already have an account?{" "}
            <Text as="span" color="blue.800" cursor="pointer" fontWeight="bold" onClick={() => router.push("/sign-in")}>
              Login
            </Text>
          </Text>

          {/*  Divider */}
          <Divider borderColor="gray.300" my={4} />
        </Box>
      </Box>
    </Box>
  );
}
