import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuthContext } from "../../../context/auth.context";
import { IRegisterForm } from "../../../utils/interfaces/auth.interface";

const initialRegisterForm: IRegisterForm = {
  email: "",
  key: "",
  name: "",
  secret: "",
};

export const RegisterForm = () => {
  const { registerUser } = useAuthContext();
  const [isSecretHidden, setIsSecretHidden] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>({
    defaultValues: initialRegisterForm,
  });

  return (
    <Box sx={{ width: "100%", p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Register to BookScribe family
      </Typography>

      <Box component="form" mt={3} onSubmit={handleSubmit(registerUser)}>
        <TextField
          label="Name"
          {...register("name", { required: { message: "This field is required", value: true } })}
          variant="outlined"
          fullWidth
          margin="normal"
          helperText={errors.name?.message}
          error={!!errors.name}
        />
        <TextField
          label="Email"
          {...register("email", {
            required: { message: "This field is required", value: true },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email format",
            },
          })}
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          helperText={errors.email?.message}
          error={!!errors.email}
        />
        <TextField
          label="Key"
          {...register("key", {
            required: { message: "This field is required", value: true },
            minLength: { message: "This field requires a minimum of 6 characters", value: 6 },
          })}
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          helperText={errors.key?.message}
          error={!!errors.key}
        />
        <TextField
          label="Secret"
          type={isSecretHidden ? "password" : "text"}
          {...register("secret", {
            required: { message: "This field is required", value: true },
            minLength: { message: "This field requires a minimum of 6 characters", value: 6 },
          })}
          variant="outlined"
          fullWidth
          margin="normal"
          helperText={errors.secret?.message}
          error={!!errors.secret}
          InputProps={{
            endAdornment: isSecretHidden ? (
              <Visibility onClick={() => setIsSecretHidden(!isSecretHidden)} sx={{ cursor: "pointer" }} />
            ) : (
              <VisibilityOff onClick={() => setIsSecretHidden(!isSecretHidden)} sx={{ cursor: "pointer" }} />
            ),
          }}
        />
        <FormControlLabel control={<Checkbox name="rememberMe" />} label="Remember me" />

        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 2, py: 1.5, backgroundColor: "black" }}>
          Sign up
        </Button>
      </Box>
    </Box>
  );
};
