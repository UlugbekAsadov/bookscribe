import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

import { ICreateBookForm } from "../../utils/interfaces/book.interface";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ICreateBookForm) => Promise<void>;
}

export const BookCreateForm = ({ isOpen, onClose, onSubmit }: IProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ICreateBookForm>({ defaultValues: { isbn: "" } });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>Create Book</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates occasionally.
        </DialogContentText>
        <TextField
          {...register("isbn", { required: { message: "This field is required", value: true } })}
          autoFocus
          margin="dense"
          label="ISBN"
          type="text"
          fullWidth
          variant="standard"
          error={!!errors.isbn}
          helperText={errors.isbn?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
