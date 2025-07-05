import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
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
  FaDatabase,
  FaListAlt,
  FaCog,
  FaCommentDots,
  FaInfoCircle,
  FaSlidersH,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function DataRequestPage() {
  const router = useRouter();
  const toast = useToast();

  const [industry, setIndustry] = useState("");
  const [dataPoints, setDataPoints] = useState(1000);
  const [features, setFeatures] = useState("");
  const [distribution, setDistribution] = useState("Normal");
  const [context, setContext] = useState("");
  const [outputFormat, setOutputFormat] = useState("CSV");
  const [featureConstraints, setFeatureConstraints] = useState([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedFeatures = JSON.parse(localStorage.getItem("savedFeatures")) || "";
    setFeatures(storedFeatures);
  }, []);

  const handleAddConstraint = () => {
    setFeatureConstraints([...featureConstraints, ""]);
  };

  const handleConstraintChange = (index, value) => {
    const updatedConstraints = [...featureConstraints];
    updatedConstraints[index] = value;
    setFeatureConstraints(updatedConstraints);
  };

  const handleRemoveConstraint = (index) => {
    const updatedConstraints = [...featureConstraints];
    updatedConstraints.splice(index, 1);
    setFeatureConstraints(updatedConstraints);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!industry.trim() || !features.trim()) {
        toast({
            title: "Missing Required Fields",
            description: "Please enter the industry and key features.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        setLoading(false);
        return;
    }

    if (dataPoints < 1 || dataPoints > 5000 || isNaN(dataPoints)) {
        toast({
            title: "Invalid Data Points",
            description: "Please enter a valid number between 1 and 5000.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        setLoading(false);
        return;
    }

    localStorage.setItem("savedFeatures", JSON.stringify(features));

  
    let formattedConstraints = Array.isArray(featureConstraints)
      ? featureConstraints
        .map((c) => c?.trim()) 
        .filter((c) => c.length > 0) 
      : [];

   
    const constraintsText =
      formattedConstraints.length > 0 ? formattedConstraints.join(", ") : "No constraints applied.";

    const prompt = `
        Generate a structured synthetic dataset in ${outputFormat} format.
        - The dataset should have ${dataPoints} rows with these columns: ${features}.
        - Use a ${distribution} distribution for numerical values.
        - Constraints: ${constraintsText}
        - Additional Context: ${context}.
        - The output must start directly with data without explanations.
    `;

    const requestData = {
      industry,
      dataPoints,
      features,
      distribution,
      outputFormat,
      context,
      timestamp: new Date().toISOString(),
    };

    try {
      
      const storeResponse = await axios.post("/api/storePrompt", requestData);
        
      if (storeResponse.status !== 201) {
          throw new Error("Failed to store request in MongoDB.");
      }

      console.log("✔ Data stored successfully in MongoDB. Proceeding with OpenAI request...");
      
     
      console.log("⏳ Sending request to OpenAI...");
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 4096, // 
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (typeof response.data !== "object") {
        console.error(" Invalid JSON Response:", response.data);
        throw new Error("Received non-JSON response from OpenAI API.");
      }
      

      if (!response.data.choices || response.data.choices.length === 0) {
        throw new Error("No choices returned from OpenAI API.");
      }

      let generatedData =
        response.data.choices?.[0]?.message?.content ||
        "Error generating data.";
      
      console.log("📝 Processed Data:", generatedData);

      router.push(`/results?generatedData=${encodeURIComponent(generatedData)}`);
    } catch (error) {
      console.error("Error generating data:", error.response?.data || error.message);
      toast({
        title: "Failed to generate data",
        description: "There was an error processing your request.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/results?generatedData=Failed to generate synthetic data.`);
    }

    setLoading(false);
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

          <form onSubmit={handleSubmit}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <FormControl>
                  <FormLabel>Industry *</FormLabel>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} required />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Key Features *</FormLabel>
                  <Input value={features} onChange={(e) => setFeatures(e.target.value)} required />
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
              <GridItem>
                <FormControl>
                  <FormLabel>Data Points *</FormLabel>
                  <Input
                    type="number"
                    value={dataPoints}
                    onChange={(e) => setDataPoints(parseInt(e.target.value) || 1)}
                    min="1"
                    max="5000"
                    required
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Distribution</FormLabel>
                  <Select value={distribution} onChange={(e) => setDistribution(e.target.value)}>
                    <option value="Normal">Normal</option>
                    <option value="Uniform">Uniform</option>
                    <option value="Exponential">Exponential</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>

            {/* Feature Constraints Section */}
            <FormControl mt={6}>
              <HStack justifyContent="space-between">
                <FormLabel>Feature Constraints</FormLabel>
                <Tooltip
                  hasArrow
                  label={
                    <Box>
                      <b>Feature Constraints</b> allow you to define limits for each feature.
                      <ul style={{ marginLeft: "10px", marginTop: "5px" }}>
                        <li>Example 1: "Age should be between 18 and 65."</li>
                        <li>Example 2: "Salary should be above 30,000."</li>
                        <li>Click "Add Constraint" to define multiple constraints.</li>
                      </ul>
                    </Box>
                  }
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
                    placeholder='Example: "Age should be between 18 and 65."'
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

            {/*  Context Field */}
            <FormControl mt={6}>
              <FormLabel>Context</FormLabel>
              <Textarea
                placeholder="Provide additional context if needed"
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
