import { Box } from "@mui/material";

export const BooksEmptyState = () => {
  return (
    <Box display="grid" paddingY={10} sx={{ placeItems: "center" }}>
      <Box component="img" src="/images/books-not-found.png" alt="books-not-found" maxWidth={200} width="100%" />
    </Box>
  );
};
