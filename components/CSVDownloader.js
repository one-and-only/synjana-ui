import { jsonToCSV } from "../utils/generateCsv";
import { Button } from "@chakra-ui/react";

export default function CSVDownloader({ syntheticData }) {
  function handleDownload() {
    if (!syntheticData || syntheticData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const csvString = jsonToCSV(syntheticData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "synthetic_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Button colorScheme="blue" onClick={handleDownload}>
      Download CSV
    </Button>
  );
}
