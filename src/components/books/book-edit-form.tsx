import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

import { apiFetcher } from "../../api/api";
import { useMutation } from "../../hooks/useMutation";
import { IBook } from "../../utils/interfaces/book.interface";
import { bookStatuses } from "../../utils/mocks/book-status.mock";

interface IProps {
  selectedBook: IBook;
  setSelectedBook: Dispatch<SetStateAction<IBook | null>>;
  refetch: () => void;
}

export const BookEditForm = ({ selectedBook, setSelectedBook, refetch }: IProps) => {
  const [bookStatus, setBookStatus] = useState<IBook["status"]>(selectedBook.status);

  const deleteBookMutation = useMutation({
    mutationFn: (bookId) => apiFetcher(`/books/${bookId}`, { method: "DELETE" }),
    onSuccess: () => {
      refetch();
      handleCloseModal();
    },
  });

  const editBookMutation = useMutation({
    mutationFn: (bookId) => apiFetcher(`/books/${bookId}`, { method: "PATCH", body: { status: bookStatus } }),
    onSuccess: () => {
      refetch();
      handleCloseModal();
    },
  });

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleDeleteBook = () => {
    deleteBookMutation.mutateAsync(selectedBook.book.id);
  };

  const handleChangeStatus = (event: FormEvent) => {
    event.preventDefault();

    editBookMutation.mutateAsync(selectedBook.book.id);
  };

  return (
    <Dialog
      open={!!selectedBook}
      onClose={handleCloseModal}
      PaperProps={{
        component: "form",
        onSubmit: handleChangeStatus,
      }}
    >
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To change the status of the book, select a new status from the dropdown below. This will update the current status of the book and
          help keep track of its progress or availability.
        </DialogContentText>
        <FormControl fullWidth sx={{ marginTop: "12px" }}>
          <InputLabel id="demo-simple-select-label">Book status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={bookStatus}
            label="Book status"
            sx={{ textTransform: "capitalize" }}
            onChange={(e) => setBookStatus(parseInt(e.target.value as string))}
          >
            {Object.entries(bookStatuses).map(([key, value]) => (
              <MenuItem value={key} sx={{ textTransform: "capitalize" }}>
                {value.toLowerCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} variant="outlined">
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteBook}>
          Delete
        </Button>
        <Button type="submit" variant="contained">
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
