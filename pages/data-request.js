import { useEffect, useState } from "react";
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
} from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function DataRequestPage() {

  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState("");
  const [numSamples, setNumSamples] = useState(1000);
  const [featureConstraints, setFeatureConstraints] = useState([""]);
  const [datasetFile, setDatasetFile] = useState(null);
  const [context, setContext] = useState("");
  const [waitingForCompletion, setWaitingForCompletion] = useState(false);
  const [datasetTrained, setDatasetTrained] = useState(false);
  const [datasetId, setDatasetId] = useState(null);
  const [apiToken, setApiToken] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const apiToken = localStorage.getItem("apiToken");
    if (apiToken === null) {
      router.push("/");
      return;
    }

    setApiToken(apiToken);
    setUsername(localStorage.getItem("username"));

    const storedDatasetId = localStorage.getItem("datasetId");
    const storedIsTrained = localStorage.getItem("isDatasetTrained");

    if (storedDatasetId) {
      setDatasetId(parseInt(storedDatasetId));
    }

    if (storedIsTrained) {
      setDatasetTrained(true);
    }
  }, []);

  const generateData = async () => {
    setDatasetTrained(false);
    setWaitingForCompletion(true);

    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_VAE_API_HOST}/generate?dataset_id=${parseInt(datasetId)}`, {
      headers: {
        "Authorization": `Bearer ${apiToken}`
      }
    });
    if (data.success) {
      toast({
        title: "Data Generation",
        description: "Successfully generated your dataset. Please go to the history tab to view information and download.",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      localStorage.removeItem("isDatasetTrained");
      localStorage.removeItem("datasetId");
    } else {
      toast({
        title: "Data Generation",
        description: "Failed to generate data. An error occurred. Please refresh the page and try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    setWaitingForCompletion(false);
  }

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

  const trainModel = async () => {
    if (datasetId === -1) {
      toast({
        title: "Model Training",
        description: "Are you sure you're allowed to train a model? Invalid dataset ID detected.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setWaitingForCompletion(true);
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_VAE_API_HOST}/train_vae?datasetId=${datasetId}`, {
      headers: {
        "Authorization": `Bearer ${apiToken}`
      }
    })
    if (data.success) {
      setDatasetTrained(true);
      localStorage.setItem("isDatasetTrained", "1");

      toast({
        title: "Model Training",
        description: "Model trained successfully! You can now generate your data.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Model Training",
        description: "Failed to train model! An error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    setDatasetId(null);

    setWaitingForCompletion(false);
  }

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

    if (numSamples < 1 || numSamples > 100_000 || isNaN(numSamples)) {
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

    const formData = new FormData();
    formData.append("dataset_file", datasetFile);

    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_VAE_API_HOST}/preprocess_dataset?dataset_format=csv&num_data_points=${numSamples}&constraints=${encodeURIComponent(formattedConstraints.join(";"))}&industry=${encodeURIComponent(industry)}&context=${encodeURIComponent(context)}`, formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${apiToken}` },
      });

      if (data.success) {
        setDatasetId(data.datasetId);
        localStorage.setItem("datasetId", data.datasetId);

        toast({
          title: "Success",
          description: "Successfully preprocessed your dataset, please train your model.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Success",
          description: "Failed to preprocess your dataset. An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      // router.push(
      //   `/tasks/${crypto.randomUUID()}?datasetId=${data.datasetId}`
      // );
      // alert("Functionality will be implemented soon!");
    } catch (err) {
      console.error(err);
      toast({
        title: "Generation failed",
        description: "Something went wrong while preprocessing your dataset",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
                    value={numSamples}
                    onChange={(e) => setNumSamples(parseInt(e.target.value) || 1)}
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

            <Button type="submit" colorScheme="blue" isDisabled={Boolean(datasetId)} size="lg" w="full" mt={6}>
              {loading ? <Spinner size="sm" /> : "Preprocess Dataset"}
            </Button>

            <Button mt={3} size="lg" marginRight="10px" onClick={trainModel} disabled={!Boolean(datasetId)} isLoading={waitingForCompletion}>
              Train VAE
            </Button>

            <Button mt={3} size="lg" onClick={generateData} disabled={!datasetTrained} isLoading={waitingForCompletion}>
              Generate Data
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
}
