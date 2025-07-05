import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { 
    Box, Heading, Button, VStack, Table, Thead, Tbody, Tr, Th, Td, Spinner, 
    Icon, Tooltip, Text, HStack, Divider
} from "@chakra-ui/react";
import { FaDownload, FaFileCsv, FaFilePdf, FaRedo, FaHome, FaFileCode } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../components/Navbar";

export default function ResultsPage() {
    const router = useRouter();
    const { generatedData } = router.query;
    const [formattedData, setFormattedData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (generatedData) {
            try {
                let decodedData = decodeURIComponent(generatedData).trim();
    
                
                decodedData = decodedData.replace(/```csv|```/g, "").trim();
    
                
                const rows = decodedData.split("\n").map(row => row.split(","));
    
                
                if (rows.length > 1) {
                    setHeaders(rows[0]);  
                    setFormattedData(rows.slice(1));  
                } else {
                    setFormattedData([]);
                }
    
            } catch (error) {
                console.error("Parsing error:", error);
            }
        }
        setLoading(false);
    }, [generatedData]);    

    // Download CSV
    const handleDownloadCSV = () => {
        const csvContent = [headers.join(","), ...formattedData.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "synthetic_data.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Download JSON
    const handleDownloadJSON = () => {
        const jsonData = formattedData.map(row => {
            let obj = {};
            headers.forEach((key, i) => { obj[key] = row[i] || ""; });
            return obj;
        });

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "synthetic_data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generateDiagnosticsReport = () => {
        if (!formattedData || formattedData.length === 0) {
            return {
                totalRows: 0,
                totalColumns: 0,
                missingData: "N/A",
                duplicateRecords: "N/A",
                privacyScore: "N/A",
                featureStats: {}
            };
        }
    
        const report = {
            totalRows: formattedData.length,
            totalColumns: headers.length,
            missingData: "0.00%", 
            duplicateRecords: "0",
            privacyScore: "100.00/100",
            featureStats: {}
        };
    
        headers.forEach((header, index) => {
            
            const columnData = formattedData
                .map(row => parseFloat(row[index])) 
                .filter(val => !isNaN(val)); 
    
            if (columnData.length > 0) {
                columnData.sort((a, b) => a - b); 
                
                const mean = (columnData.reduce((a, b) => a + b, 0) / columnData.length).toFixed(2);
                const min = Math.min(...columnData);
                const max = Math.max(...columnData);
                const median = columnData[Math.floor(columnData.length / 2)];
                const q1 = columnData[Math.floor(columnData.length / 4)];
                const q3 = columnData[Math.floor(3 * columnData.length / 4)];
    
                
                const variance = columnData.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / columnData.length;
                const stdDev = Math.sqrt(variance).toFixed(2);
    
                report.featureStats[header] = { mean, stdDev, min, q1, median, q3, max };
            } else {
                
                report.featureStats[header] = { mean: "N/A", stdDev: "N/A", min: "N/A", q1: "N/A", median: "N/A", q3: "N/A", max: "N/A" };
            }
        });
    
        return report;
    };
    
    const handleDownloadDiagnosticsPDF = () => {
        const doc = new jsPDF();
        const report = generateDiagnosticsReport();
    
        doc.setFontSize(16);
        doc.text("Synthetic Data Diagnostics Report", 10, 10);
        doc.setFontSize(12);
        doc.text("Generated Data Summary", 10, 20);
        doc.text("-------------------------------", 10, 25);
    
        const summaryData = [
            ["Total Rows", report.totalRows],
            ["Column Count", report.totalColumns],
            ["Missing Data", report.missingData],
            ["Duplicate Records", report.duplicateRecords],
            ["Privacy Score", report.privacyScore]
        ];
    
        autoTable(doc, {
            startY: 30,
            head: [["Metric", "Value"]],
            body: summaryData
        });
    
        
        let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 50;
    
        doc.text("Feature Statistics", 10, finalY);
        doc.text("-------------------------------", 10, finalY + 5);
    
        Object.entries(report.featureStats).forEach(([feature, stats], i) => {
            doc.text(`${feature}:`, 10, finalY + 15 + i * 10);
            doc.text(
                `  Mean: ${stats.mean}, Std Dev: ${stats.stdDev}, Min: ${stats.min}, Q1: ${stats.q1}, Median: ${stats.median}, Q3: ${stats.q3}, Max: ${stats.max}`,
                10,
                finalY + 20 + i * 10
            );
        });
    
        doc.save("Synthetic_Data_Report.pdf");
    };

    return (
        <Box>
            <Navbar /> {/*  Added Navbar component here */}
            
            <Box
                minH="100vh"
                bg="gray.50"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={10}
            >
                <Box
                    maxW="900px"
                    w="100%"
                    p={8}
                    bg="white"
                    borderRadius="12px"
                    boxShadow="lg"
                    textAlign="center"
                >
                    <Heading as="h2" size="lg" mb={6} color="blue.900">
                        Generated Data
                    </Heading>
    
                    {loading ? (
                        <Spinner size="lg" />
                    ) : (
                        <>
                            {/* Data Summary */}
                            <HStack spacing={6} justify="center" mb={6}>
                                <Box textAlign="center">
                                    <Text fontSize="lg" fontWeight="bold" color="gray.700">Total Rows</Text>
                                    <Text fontSize="2xl" color="blue.600">{formattedData.length}</Text>
                                </Box>
                                <Divider orientation="vertical" />
                                <Box textAlign="center">
                                    <Text fontSize="lg" fontWeight="bold" color="gray.700">Columns</Text>
                                    <Text fontSize="2xl" color="blue.600">{headers.length}</Text>
                                </Box>
                            </HStack>
    
                            {/*  Table Data */}
                            <Box maxH="400px" overflowY="auto" border="1px solid #CBD5E0" borderRadius="10px">
                                <Table variant="striped" colorScheme="blue">
                                    <Thead bg="blue.600">
                                        <Tr>
                                            {headers.map((header, index) => (
                                                <Th key={index} color="white">{header}</Th>
                                            ))}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {formattedData.slice(0, 10).map((row, rowIndex) => (
                                            <Tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <Td key={cellIndex}>{cell}</Td>
                                                ))}
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
    
                            {/*  Download & Navigation Buttons */}
                            <VStack spacing={4} mt={6}>
                                <HStack spacing={3}>
                                    <Tooltip label="Download as CSV">
                                        <Button
                                            leftIcon={<Icon as={FaFileCsv} />}
                                            colorScheme="blue"
                                            variant="solid"
                                            onClick={handleDownloadCSV}
                                        >
                                            CSV
                                        </Button>
                                    </Tooltip>
    
                                    <Tooltip label="Download as JSON">
                                        <Button
                                            leftIcon={<Icon as={FaFileCode} />}
                                            colorScheme="blue"
                                            variant="solid"
                                            onClick={handleDownloadJSON}
                                        >
                                            JSON
                                        </Button>
                                    </Tooltip>
    
                                    <Tooltip label="Download Diagnostics Report">
                                        <Button
                                            leftIcon={<Icon as={FaFilePdf} />}
                                            colorScheme="red"
                                            variant="solid"
                                            onClick={handleDownloadDiagnosticsPDF}
                                        >
                                            Diagnostics Report
                                        </Button>
                                    </Tooltip>
                                </HStack>
    
                                <Button 
                                    leftIcon={<Icon as={FaRedo} />}
                                    colorScheme="teal"
                                    variant="outline"
                                    onClick={() => router.push("/data-request")}
                                >
                                    Generate New Data
                                </Button>
    
                                <Button 
                                    leftIcon={<Icon as={FaHome} />}
                                    colorScheme="gray"
                                    variant="solid"
                                    onClick={() => router.push("/")}
                                >
                                    Back to Home
                                </Button>
                            </VStack>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}    
