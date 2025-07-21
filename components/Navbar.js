
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  VStack,
  Collapse,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [apiToken, setApiToken] = useState(null);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Generate Data", href: "/data-request" },
    { label: "History", href: "/history" },
  ];

  const dropdownLinks = [
    {
      label: "Products",
      items: [
        { name: "Synthetic Data", href: "/synthetic-data" },
        { name: "Data Validation", href: "/data-validation" },
      ],
    },
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem("apiToken");
    
    if (storedToken === null) return;

    const expiry = localStorage.getItem("tokenExpiry");
    if (expiry === null) return;

    if (parseInt(expiry) < Date.now()) {
      localStorage.removeItem("apiToken");
      localStorage.removeItem("tokenExpiry");
    }

    setApiToken(storedToken);
  }, []);

  return (
    <Box position="fixed" top="0" w="100%" bg="white" boxShadow="md" zIndex="1000">
      <Flex px={10} py={4} align="center" justify="space-between">
        {/* Logo */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="blue.600"
          cursor="pointer"
          onClick={() => router.push("/")}
        >
          Synjana
        </Text>

        {/* Desktop Navigation */}
        <Flex display={{ base: "none", md: "flex" }} align="center" gap={6}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              fontSize="lg"
              fontWeight={router.pathname === link.href ? "bold" : "medium"}
              color={router.pathname === link.href ? "blue.500" : "gray.700"}
              _hover={{ color: "blue.600" }}
              borderBottom={router.pathname === link.href ? "2px solid blue" : "none"}
              pb={1}
            >
              {link.label}
            </Link>
          ))}

          {/* Dropdown Menus */}
          {dropdownLinks.map((dropdown, index) => (
            <Menu key={index} onOpen={() => setDropdownOpen(index)} onClose={() => setDropdownOpen(null)}>
              <MenuButton
                as={Button}
                variant="ghost"
                colorScheme="gray"
                fontSize="lg"
                _hover={{ color: "blue.600" }}
                rightIcon={<ChevronDownIcon />}
              >
                {dropdown.label}
              </MenuButton>
              <MenuList boxShadow="lg">
                {dropdown.items.map((item, idx) => (
                  <MenuItem
                    key={idx}
                    onClick={() => router.push(item.href)}
                    _hover={{ bg: "gray.100", color: "blue.600" }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ))}

          {/* Sign In & Sign Up Buttons */}
          {apiToken === null &&
            <>
              <Button
                colorScheme="blue"
                variant="outline"
                size="md"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </Button>
              <Button
                colorScheme="blue"
                size="md"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </Button>
            </>
          }
          {
            apiToken !== null &&
            <Button
              colorScheme="blue"
              variant="outline"
              size="md"
              onClick={() => {
                localStorage.removeItem("apiToken");
                localStorage.removeItem("tokenExpiry");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          }
        </Flex>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "block", md: "none" }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={onToggle}
          variant="ghost"
        />
      </Flex>

      {/* Mobile Navigation */}
      <Collapse in={isOpen} animateOpacity>
        <VStack bg="white" p={4} display={{ base: "flex", md: "none" }} spacing={3}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              fontSize="lg"
              color="gray.700"
              _hover={{ color: "blue.500" }}
            >
              {link.label}
            </Link>
          ))}
          {dropdownLinks.map((dropdown, index) => (
            <Box key={index} w="100%">
              <Text fontSize="lg" color="gray.700" fontWeight="bold">
                {dropdown.label}
              </Text>
              {dropdown.items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  display="block"
                  p={2}
                  color="gray.600"
                  _hover={{ color: "blue.500" }}
                >
                  {item.name}
                </Link>
              ))}
            </Box>
          ))}
          {/* Mobile Sign In & Sign Up */}
          <Button colorScheme="blue" w="full" variant="outline" onClick={() => router.push("/sign-in")}>
            Sign In
          </Button>
          <Button colorScheme="blue" w="full" onClick={() => router.push("/signup")}>
            Sign Up
          </Button>
        </VStack>
      </Collapse>
    </Box>
  );
}
