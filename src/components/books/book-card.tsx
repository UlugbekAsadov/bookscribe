import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { IBook } from "../../utils/interfaces/book.interface";
import { ImageWithFallback } from "../image-with-fallback";

interface IProps {
  book: IBook;
  setSelectedBook: Dispatch<SetStateAction<IBook | null>>;
}

export const BookCard = ({ book, setSelectedBook }: IProps) => {
  return (
    <Box maxWidth={200} width="100%" sx={{ cursor: "pointer" }} onClick={() => setSelectedBook(book)}>
      <ImageWithFallback
        fallbackSrc={"/images/book-thumbnail.png"}
        src={book.book.cover}
        alt={book.book.title}
        width="100%"
        sx={{ objectFit: "cover", borderRadius: "16px" }}
      />
      <Typography
        sx={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {book.book.title}
      </Typography>
      <Typography color="info">{book.book.author}</Typography>
    </Box>
  );
};
