import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import { apiFetcher } from "../../api/api";
import { BookCreateForm } from "../../components/books/book-create-form";
import { BooksGrid } from "../../components/books/books-grid";
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import { IBook, ICreateBookForm } from "../../utils/interfaces/book.interface";

export const BooksPage = () => {
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);

  const { data: books, refetch } = useQuery({
    queryFn: () => apiFetcher<IBook[]>("/books", { method: "GET" }),
  });

  const createBookMutation = useMutation<IBook, ICreateBookForm, string>({
    mutationFn: (values) => apiFetcher<IBook, ICreateBookForm>("/books", { method: "POST", body: values }),
    onSuccess: () => {
      setIsBookModalOpen(false);
      refetch();
      toast.success("Book successfully added to you library");
    },
    onError: (err) => {
      toast.error(err && "Book not found or already in your library");
    },
  });

  const handleOpenModal = () => {
    setIsBookModalOpen(true);
  };

  const createBook = async (values: ICreateBookForm) => {
    await createBookMutation.mutateAsync(values);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          All Books
        </Typography>
        <Button variant="contained" onClick={handleOpenModal}>
          Create Book
        </Button>
      </Box>
      <BooksGrid books={books} />

      <BookCreateForm isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} onSubmit={createBook} />
    </Box>
  );
};
