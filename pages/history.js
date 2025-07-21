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
import { SynjanaCustodialApi } from "@aurora-interactive/synjana-custodial-api";
import { useRouter } from "next/router";

const apiSdk = new SynjanaCustodialApi();

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [datasetMeta, setDatasetMeta] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [apiToken, setApiToken] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const storedToken = localStorage.getItem("apiToken");

    if (storedToken === null) {
      router.push("/");
      return;
    }

    setApiToken(storedToken);
  }, []);

  useEffect(() => {
    async function getDatasets() {
      if (apiToken === null) return;

      const datasets = await apiSdk.datasets.datasetsHistory({
        headers: {
          "Authorization": `Bearer ${apiToken}`
        }
      });

      setRecords(datasets.datasets.map(dataset => (
        {
          name: dataset.name,
          timestamp: dataset.createdAt,
          industry: dataset.industry,
          dataPoints: dataset.numDataPoints,
          datasetId: dataset.datasetId,
          size: dataset.size,
          dataType: dataset.dataType,
          context: dataset.context
        }
      )));
    }
    getDatasets();
  }, [apiToken]);

  const openDatasetModal = useCallback((datasetId) => {
    setLoadingMeta(true);
    onOpen();

    const meta = records?.filter(x => x.datasetId === datasetId)[0];

    setDatasetMeta(meta);
    setLoadingMeta(false);
  }, [onOpen, records]);

  const downloadDataset = async () => {
    // get a presigned S3 URL from our storage provider via Custodial REST API
    if (!datasetMeta.datasetId) {
      alert("No Dataset ID found for download!");
      return;
    }

    const downloadUrlData = await apiSdk.datasets.datasetsDownload({ datasetId: datasetMeta.datasetId }, {
      headers: {
        "Authorization": `Bearer ${apiToken}`
      }
    });

    if (!downloadUrlData.success) {
      alert("Failed to get presigned URL!");
    }

    // use the browser to start the file download
    const link = document.createElement("a");
    link.href = downloadUrlData.downloadUrl;
    link.download = datasetMeta.name;
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
                <Text><strong>User notes:</strong> {datasetMeta.context}</Text>
                {/* <Text><strong>Original file:</strong> {datasetMeta.originalFileName}</Text> */}
                {/* <Text><strong>Generation Task ID:</strong> {datasetMeta.taskId}</Text> */}
                <Text><strong>Generation End:</strong> {new Date(datasetMeta.timestamp).toLocaleString()}</Text>
                <Text><strong>Size:</strong> {(datasetMeta.size / 1_048_576).toFixed(2)} MB</Text>
                <Text><strong>Type:</strong> {datasetMeta.dataType}</Text>
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