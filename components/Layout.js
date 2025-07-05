import { Box, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <Box>
      <Flex bg="blue.500" color="white" p={4} align="center">
        <Link href="/">
          <Heading size="md" cursor="pointer">
            Synthetic Data App
          </Heading>
        </Link>
      </Flex>
      <Box p={4}>{children}</Box>
    </Box>
  );
}
