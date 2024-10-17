import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useMemo } from "react";

import { IBook } from "../../utils/interfaces/book.interface";
import { BookCard } from "./book-card";
import { BooksEmptyState } from "./books-empty-state";

interface IProps {
  books?: IBook[];
  setSelectedBook: Dispatch<SetStateAction<IBook | null>>;
}

export const BooksGrid = ({ books, setSelectedBook }: IProps) => {
  if (!books) {
    return null;
  }

  const booksList = useMemo(
    () => books.map((book) => <BookCard setSelectedBook={setSelectedBook} key={book.book.id} book={book} />),
    [books],
  );

  if (!booksList.length) {
    return <BooksEmptyState />;
  }

  return (
    <Box display="flex" gap="12px" flexWrap="wrap">
      {booksList}
    </Box>
  );
};
 