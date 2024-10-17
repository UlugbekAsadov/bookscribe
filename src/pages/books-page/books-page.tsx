import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { apiFetcher } from "../../api/api";
import { BookCreateForm } from "../../components/books/book-create-form";
import { BookEditForm } from "../../components/books/book-edit-form";
import { BooksGrid } from "../../components/books/books-grid";
import { BooksLoader } from "../../components/books/books-loader";
import { useDebounce } from "../../hooks/useDebounce";
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import { IBook, ICreateBookForm } from "../../utils/interfaces/book.interface";

const SEARCH_DEBOUNCE_DELAY = 300; // 300ms

export const BooksPage = () => {
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTextFromQuery = queryParams.get("search");
  const [searchText, setSearchText] = useState<string>(searchTextFromQuery ?? "");
  const debouncedSearchText = useDebounce<string>(searchText, SEARCH_DEBOUNCE_DELAY);

  const {
    data: books,
    refetch,
    isFetching,
  } = useQuery({
    // Search ishlamadi 500 error qaytyapti har qanaqa text yozsa
    // queryFn: () => apiFetcher<IBook[]>(`/books/${debouncedSearchText}`, { method: "GET" }),
    queryFn: () => apiFetcher<IBook[]>(`/books`, { method: "GET" }),
    enabled: false,
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

  useEffect(() => {
    refetch();
  }, [debouncedSearchText]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
        sx={{
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          alignItems: {
            xs: "start",
            sm: "center",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
            },
          }}
        >
          All Books
        </Typography>
        <Box
          display="flex"
          gap="12px"
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: {
              xs: "100%",
              sm: "unset",
            },
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            value={searchText}
            size="small"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="contained" onClick={handleOpenModal}>
            Create Book
          </Button>
        </Box>
      </Box>
      {isFetching ? <BooksLoader /> : <BooksGrid books={books} setSelectedBook={setSelectedBook} />}

      <BookCreateForm isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} onSubmit={createBook} />
      {selectedBook && <BookEditForm selectedBook={selectedBook} setSelectedBook={setSelectedBook} refetch={refetch} />}
    </Box>
  );
};
