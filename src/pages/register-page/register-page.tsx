import "./register-page.css";

import { Box, Container, Grid } from "@mui/material";

import { RegisterForm } from "../../components/auth/register/register-form";

export const RegisterPage = () => {
  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Grid xs={12} container height="100%">
        <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
          <RegisterForm />
        </Grid>

        <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
          <Box>
            <img src="/images/auth-image.png" alt="Illustration" className="auth__image-left" />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
