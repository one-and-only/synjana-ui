import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  Icon,
  Tooltip,
  useToast,
  Spinner,
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FaInfoCircle,
  FaSlidersH,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function DataRequestPage() {
  const router = useRouter();
  const toast = useToast();

  const [industry, setIndustry] = useState("");
  const [dataPoints, setDataPoints] = useState(1000);
  const [featureConstraints, setFeatureConstraints] = useState([""]);
  const [datasetFile, setDatasetFile] = useState(null);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddConstraint = () => {
    setFeatureConstraints([...featureConstraints, ""]);
  };

  const handleConstraintChange = (index, value) => {
    const updated = [...featureConstraints];
    updated[index] = value;
    setFeatureConstraints(updated);
  };

  const handleRemoveConstraint = (index) => {
    const updated = [...featureConstraints];
    updated.splice(index, 1);
    setFeatureConstraints(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setDatasetFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!industry.trim()) {
      toast({
        title: "Industry required",
        description: "Please enter the industry for the dataset.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (dataPoints < 1 || dataPoints > 5000 || isNaN(dataPoints)) {
      toast({
        title: "Invalid Number of Data Points",
        description: "Please enter a valid number between 1 and 100,000.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (!datasetFile) {
      toast({
        title: "Dataset file missing",
        description: "Please upload a CSV, JSON, JSONL, or Apache Parquet file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    const formattedConstraints = featureConstraints
      .map((c) => c.trim())
      .filter((c) => c);

    const prompt = `You will receive a dataset describing ${industry}. Fill temporal gaps and return a synthetic dataset with exactly ${dataPoints} rows in CSV format. Constraints: ${formattedConstraints.length ? formattedConstraints.join(", ") : "None"}. Additional context (for reference only): ${context}. The output must begin directly with data (no prose).`;

    const formData = new FormData();
    formData.append("industry", industry);
    formData.append("dataPoints", dataPoints);
    formData.append("constraints", JSON.stringify(formattedConstraints));
    formData.append("context", context);
    formData.append("prompt", prompt);
    formData.append("datasetFile", datasetFile);

    try {
      // const { data } = await axios.post("/api/generateSynthetic", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // router.push(
      //   `/results?generatedData=${encodeURIComponent(data?.generatedData || "")}`
      // );
      alert("Functionality will be implemented soon!");
    } catch (err) {
      console.error(err);
      toast({
        title: "Generation failed",
        description: "Something went wrong while generating data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      router.push(
        `/results?generatedData=${encodeURIComponent(
          "Failed to generate synthetic data."
        )}`
      );
    } finally {
      setLoading(false);
    }
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
          maxW="900px"
          p={10}
          bg="white"
          borderRadius="20px"
          boxShadow="0px 10px 30px rgba(0, 0, 0, 0.15)"
        >
          <Heading as="h2" size="xl" color="blue.900" mb={4} textAlign="center">
            Synthetic Data Generator
          </Heading>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Industry</FormLabel>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Data Points</FormLabel>
                  <Input
                    type="number"
                    min="1"
                    max="100000"
                    value={dataPoints}
                    onChange={(e) => setDataPoints(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <FormControl mt={6}>
              <HStack justifyContent="space-between">
                <FormLabel>Feature Constraints</FormLabel>
                <Tooltip
                  hasArrow
                  label={<Box><b>Feature Constraints</b> let you constrain columns. Examples: Age between 18 and 65; Salary above 30,000.</Box>}
                  fontSize="sm"
                  bg="gray.700"
                  color="white"
                  p={3}
                >
                  <Icon as={FaInfoCircle} color="blue.600" />
                </Tooltip>
              </HStack>

              {featureConstraints.map((constraint, index) => (
                <HStack key={index} mt={2}>
                  <Input
                    placeholder='e.g. "Age 18-65"'
                    value={constraint}
                    onChange={(e) => handleConstraintChange(index, e.target.value)}
                    width="85%"
                  />
                  <Button size="sm" colorScheme="red" onClick={() => handleRemoveConstraint(index)}>
                    <Icon as={FaTrash} />
                  </Button>
                </HStack>
              ))}
              <Button mt={3} size="sm" leftIcon={<FaSlidersH />} onClick={handleAddConstraint}>
                Add Constraint
              </Button>
            </FormControl>

            <FormControl mt={6} isRequired>
              <FormLabel>Dataset File</FormLabel>
              <Input
                type="file"
                accept=".csv, application/json, application/jsonlines, application/vnd.apache.parquet"
                onChange={handleFileChange}
              />
            </FormControl>

            <FormControl mt={6}>
              <FormLabel>Context (optional)</FormLabel>
              <Textarea
                placeholder="Notes for your own reference..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                height="100px"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" w="full" mt={6}>
              {loading ? <Spinner size="sm" /> : "Generate Data"}
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
}
