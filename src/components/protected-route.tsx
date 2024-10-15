import { Navigate, Outlet } from "react-router-dom";

import { MainLayout } from "../layout/main-layout";
import { getCookie } from "../utils/utils";

export const ProtectedRoute = () => {
  const isAuthenticated = getCookie("bookScribe_at") && getCookie("bookScribe_secret");

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
