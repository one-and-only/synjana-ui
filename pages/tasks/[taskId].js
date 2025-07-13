import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Progress,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Layout from "../../components/Layout";
import { SynjanaCustodialApi } from "@aurora-interactive/synjana-custodial-api";

const logLevel2String = {
    0: "Trace",
    1: "Debug",
    2: "Error",
    3: "Warning",
    4: "Info",
};

const apiSdk = new SynjanaCustodialApi({
    auth: "KEY_HERE"
});

/**
 * @typedef {Object} LogEntry
 * @property {string} logLevel
 * @property {string} message
 * @property {string} timestamp
 */

/**
 * Fetch logs for the given task.
 * @param {string} taskId
 * @returns {Promise<LogEntry[]>}
 */
async function fetchLogs(taskId) {
    /* TODO: replace implementation */
    const logs = await apiSdk.logging.loggingRecent({
        afterTimestamp: 0,
        numLogs: 50,
        jobId: "sdfhb56",
    }, {
        headers: {
            "Authorization": "Bearer KEY_HERE"
        }
    });
    if (logs.success) return logs.logs;
}

/**
 * Fetch progress information for the task.
 * @param {string} taskId
 * @returns {Promise<{ current:number, total:number, text:string, isComplete:boolean }>} */
async function fetchProgress(taskId) {
    /* TODO: replace implementation */
    return { current: 0, total: 0, text: "Waiting for backend…", isComplete: false };
}

/**
 * Retrieve a presigned download URL for the completed dataset.
 * @param {string} taskId
 * @returns {Promise<string>} – HTTPS URL
 */
async function getDownloadUrl(taskId) {
    /* TODO: replace implementation */
    return "https://example.com/presigned-url";
}

export default function TaskStatusPage() {
    const router = useRouter();
    console.log(router.query);

    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState({ current: 0, total: 0, text: "Initialising...", isComplete: false });
    const [downloadUrl, setDownloadUrl] = useState("");
    const [taskId, setTaskId] = useState(router.query.taskId || "");

    useEffect(() => {
        setTaskId(router.query);
    }, [router.query.taskId]);

    const toast = useToast();
    const pollingRef = useRef(null);

    const poll = useCallback(async () => {
        console.log("yo!", "task ID:", taskId);
        if (!taskId || taskId === "") return;

        try {
            const newLogs = await fetchLogs(taskId);
            setLogs(newLogs);

            const p = await fetchProgress(taskId);
            setProgress(p);

            if (p.isComplete && !downloadUrl) {
                const url = await getDownloadUrl(taskId);
                setDownloadUrl(url);
                toast({ status: "success", description: "Dataset is ready for download." });
            }
        } catch (err) {
            console.error(err);
            toast({ status: "error", description: "Failed to poll task status." });
        }
    }, [taskId, downloadUrl, toast]);

    useEffect(() => {
        if (!taskId || taskId === "" || pollingRef.current) return;
        poll();
        pollingRef.current = setInterval(poll, 4000);
        return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }, [taskId, poll]);

    const pct = progress.total ? (progress.current / progress.total) * 100 : 0;

    return (
        <Layout>
            <VStack align="stretch" spacing={8} px={{ base: 4, md: 8 }} py={6}>
                <Heading size="lg">Task Status - {router.query.taskId ?? "..."}</Heading>

                <Box p={6} bg="gray.50" rounded="lg" shadow="sm">
                    <VStack align="stretch" spacing={4}>
                        <Text fontWeight="semibold">{progress.text}</Text>
                        <Flex align="center" gap={4}>
                            <Progress flex="1" value={pct} rounded="md" />
                            <Text minW="120px" textAlign="right">
                                {progress.current} / {progress.total}
                            </Text>
                        </Flex>
                        {downloadUrl && (
                            <Button
                                as="a"
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                leftIcon={<ExternalLinkIcon />}
                                colorScheme="teal"
                                alignSelf="flex-start"
                            >
                                Download Dataset
                            </Button>
                        )}
                    </VStack>
                </Box>

                <Box p={6} bg="gray.50" rounded="lg" shadow="sm" overflowX="auto">
                    <Heading size="md" mb={4}>Logs</Heading>
                    <Table size="sm" variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Timestamp</Th>
                                <Th>Level</Th>
                                <Th>Message</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {logs.length === 0 ? (
                                <Tr>
                                    <Td colSpan={3} textAlign="center" py={6}>
                                        No logs yet.
                                    </Td>
                                </Tr>
                            ) : (
                                logs.map((l, idx) => (
                                    <Tr key={idx} _hover={{ bg: "gray.100" }}>
                                        <Td whiteSpace="nowrap">
                                            {new Date(l.timestamp).toISOString()}
                                        </Td>
                                        <Td>{logLevel2String[l.logLevel]}</Td>
                                        <Td maxW="4xl" whiteSpace="normal">
                                            <Text fontFamily="mono" fontSize="sm">
                                                {l.message}
                                            </Text>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </VStack>
        </Layout>
    );
}