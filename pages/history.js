import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Container,
  Text
} from "@chakra-ui/react";
import Navbar from "../components/Navbar"; 

export default function HistoryPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("syntheticDataHistory")) || [];
    setRecords(storedHistory);
  }, []);

  return (
    <Box>
      {/*  Navbar (Keep it) */}
      <Navbar />

      {/*  Main Content - Now Fully Extends Without Footer */}
      <Box
        minH="100vh"  
        bgGradient="linear(to-br, #0A0F2C, #153E75)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        py={16}
      >
        <Container maxW="900px" p={10} bg="white" borderRadius="15px" boxShadow="2xl">
          <Heading as="h2" size="xl" color="blue.800" mb={6}>
            History of Generated Datasets
          </Heading>

          {/*  No History Case - Proper Message */}
          {records.length === 0 ? (
            <Text fontSize="lg" color="gray.600">No history found.</Text>
          ) : (
            <TableContainer>
              <Table variant="striped" colorScheme="blue">
                <Thead>
                  <Tr bg="blue.100">
                    <Th color="blue.900">Generated At</Th>
                    <Th color="blue.900">Industry</Th>
                    <Th color="blue.900">Data Points</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {records.map((r, index) => (
                    <Tr key={index} _hover={{ bg: "blue.50", transition: "0.2s ease-in-out" }}>
                      <Td>{new Date(r.timestamp).toLocaleString()}</Td>
                      <Td>{r.industry}</Td>
                      <Td>{r.dataPoints}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>

      {/*  Removed Footer */}
    </Box>
  );
}
