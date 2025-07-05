import { Box, Spinner } from "@chakra-ui/react";

export default function LoadingSpinner() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
      <Spinner size="xl" speed="0.65s" />
    </Box>
  );
}
