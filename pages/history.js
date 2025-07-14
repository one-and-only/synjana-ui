import { useEffect, useState, useCallback } from "react";
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
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  VStack,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { InfoOutlineIcon, DownloadIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";

async function fetchDatasetMeta(datasetId) {
  // TODO: Replace with custodial REST API call
  await new Promise((r) => setTimeout(r, 400)); // simulate latency for placeholder
  return {
    name: `Project Crude Oil Sales - FY2026`,
    userInfo: "Placeholder user notes",
    originalFileName: "oil_sales_fy25.csv",
    taskId: "abcdef123",
    startedAt: Date.now() - 8.64e7,
    sizeBytes: 2_048_576,
    mimeType: "text/csv",
    presignedUrl: "https://example.com/presigned-placeholder.csv",
  };
}

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [datasetMeta, setDatasetMeta] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setRecords([
      {
        name: "Example dataset",
        timestamp: Date.now(),
        industry: "Oil Extraction And Refinement",
        dataPoints: 50000
      }
    ])
  }, []);

  const openDatasetModal = useCallback(async (datasetId) => {
    setLoadingMeta(true);
    onOpen();
    try {
      const meta = await fetchDatasetMeta(datasetId);
      setDatasetMeta(meta);
    } finally {
      setLoadingMeta(false);
    }
  }, [onOpen]);

  const downloadDataset = () => {
    if (!datasetMeta?.presignedUrl) return;

    // use the browser to start the file download
    const link = document.createElement("a");
    link.href = datasetMeta.presignedUrl;
    link.download = datasetMeta.originalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Navbar />

      <Box
        minH="100vh"
        bgGradient="linear(to-br, #0A0F2C, #153E75)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={16}
      >
        <Container
          maxW="1200px"
          p={10}
          bg="white"
          borderRadius="15px"
          boxShadow="2xl"
        >
          <Heading as="h2" size="xl" color="blue.800" mb={6}>
            History of Generated Datasets
          </Heading>

          {records.length === 0 ? (
            <Text fontSize="lg" color="gray.600">
              No history found.
            </Text>
          ) : (
            <TableContainer>
              <Table variant="striped" colorScheme="blue">
                <Thead>
                  <Tr bg="blue.100">
                    <Th color="blue.900">Name</Th>
                    <Th color="blue.900">Generated At</Th>
                    <Th color="blue.900">Industry</Th>
                    <Th color="blue.900">Data Points</Th>
                    <Th color="blue.900">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {records.map((r, idx) => (
                    <Tr
                      key={idx}
                      _hover={{ bg: "blue.50", transition: "0.2s ease-in-out" }}
                    >
                      <Td>{r.name}</Td>
                      <Td>{new Date(r.timestamp).toLocaleString()}</Td>
                      <Td>{r.industry}</Td>
                      <Td>{r.dataPoints}</Td>
                      <Td>
                        <IconButton
                          aria-label="Dataset info"
                          icon={<InfoOutlineIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => openDatasetModal(r.datasetId)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dataset Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loadingMeta ? (
              <HStack justify="center" py={8}>
                <Spinner />
              </HStack>
            ) : datasetMeta ? (
              <VStack align="start" spacing={2}>
                <Text><strong>Name:</strong> {datasetMeta.name}</Text>
                <Text><strong>User notes:</strong> {datasetMeta.userInfo}</Text>
                <Text><strong>Original file:</strong> {datasetMeta.originalFileName}</Text>
                <Text><strong>Generation Task ID:</strong> {datasetMeta.taskId}</Text>
                <Text><strong>Generation Start:</strong> {new Date(datasetMeta.startedAt).toLocaleString()}</Text>
                <Text><strong>Size:</strong> {(datasetMeta.sizeBytes / 1_048_576).toFixed(2)} MB</Text>
                <Text><strong>MIME type:</strong> {datasetMeta.mimeType}</Text>
              </VStack>
            ) : (
              <Text color="red.500">No metadata available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="blue"
              mr={3}
              onClick={downloadDataset}
              isDisabled={!datasetMeta?.presignedUrl}
            >
              Download
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}