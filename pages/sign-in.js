import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Divider,
  HStack,
  Icon,
} from "@chakra-ui/react";
// import { FaGoogle, FaApple, FaMicrosoft, FaPhone } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useUserStore } from "../userStore";

export default function SignInPage() {
  const router = useRouter();
  const [checkingLogin, setCheckingLogin] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");

  const { apiToken, expiry, refreshTokenIfExpiring } = useUserStore();

  const login = async () => {
    setCheckingLogin(true);
    if (apiToken !== "" && Date.now() <= expiry) {
      alert("You are already logged in!");
      return;
    }
    await refreshTokenIfExpiring(formEmail, formPassword);
    setCheckingLogin(false);
    console.log(apiToken);
  }

  return (
    <Box>
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
          {/*  Heading */}
          <Heading as="h2" size="xl" color="blue.900" mb={3}>
            Welcome Back
          </Heading>
          <Text fontSize="md" color="gray.600" mb={5}>
            Sign in to access your account.
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
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              bg="white"
              border="1px solid #CBD5E0"
              borderRadius="10px"
              p={3}
              _placeholder={{ color: "gray.400" }}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              bg="white"
              marginTop="15px"
              border="1px solid #CBD5E0"
              borderRadius="10px"
              p={3}
              _placeholder={{ color: "gray.400" }}
            />

            <Button
              width="full"
              bgGradient="linear(to-r, #4C9FFF, #007BFF)"
              color="white"
              marginTop="15px"
              _hover={{ bgGradient: "linear(to-r, #007BFF, #4C9FFF)", transform: "scale(1.05)" }}
              _active={{ transform: "scale(0.96)" }}
              transition="0.3s ease-in-out"
              p={6}
              borderRadius="12px"
              mb={4}
              onSubmit={() => login()}
              onClick={() => login()}
              isLoading={checkingLogin}
            >
              Sign In
            </Button>
          </FormControl>

          {/*  Sign-Up Option */}
          <Text color="gray.600" fontSize="sm" mb={3}>
            Don't have an account?{" "}
            <Text as="span" color="blue.800" cursor="pointer" fontWeight="bold" onClick={() => router.push("/signup")}>
              Sign Up
            </Text>
          </Text>

          {/*  Divider */}
          <Divider borderColor="gray.300" my={4} />

          {/*  Sign-in Options */}
          {/* <VStack spacing={3}>
            <Button
              width="full"
              leftIcon={<Icon as={FaGoogle} />}
              bg="white"
              color="black"
              border="1px solid #CBD5E0"
              _hover={{ bg: "gray.200", transform: "scale(1.02)" }}
              transition="0.3s ease-in-out"
              p={5}
            >
              Continue with Google
            </Button>

            <Button
              width="full"
              leftIcon={<Icon as={FaMicrosoft} />}
              bg="white"
              color="black"
              border="1px solid #CBD5E0"
              _hover={{ bg: "gray.200", transform: "scale(1.02)" }}
              transition="0.3s ease-in-out"
              p={5}
            >
              Continue with Microsoft Account
            </Button>

            <Button
              width="full"
              leftIcon={<Icon as={FaApple} />}
              bg="white"
              color="black"
              border="1px solid #CBD5E0"
              _hover={{ bg: "gray.200", transform: "scale(1.02)" }}
              transition="0.3s ease-in-out"
              p={5}
            >
              Continue with Apple
            </Button>

            <Button
              width="full"
              leftIcon={<Icon as={FaPhone} />}
              bg="white"
              color="black"
              border="1px solid #CBD5E0"
              _hover={{ bg: "gray.200", transform: "scale(1.02)" }}
              transition="0.3s ease-in-out"
              p={5}
            >
              Continue with Phone
            </Button>
          </VStack> */}
        </Box>
      </Box>
    </Box>
  );
}
