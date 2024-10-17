import { Box } from "@mui/material";
import { useMemo } from "react";

import { IBook } from "../../utils/interfaces/book.interface";
import { BookCard } from "./book-card";
import { BooksEmptyState } from "./books-empty-state";

interface IProps {
  books?: IBook[];
}

export const BooksGrid = ({ books }: IProps) => {
  if (!books) {
    return null;
  }

  const booksList = useMemo(() => books.map((book) => <BookCard key={book.book.id} book={book} />), [books]);

  if (!booksList.length) {
    return <BooksEmptyState />;
  }

  return (
    <Box display="flex" gap="12px">
      {booksList}
    </Box>
  );
};
