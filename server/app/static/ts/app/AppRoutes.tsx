import { Privacy } from "app/Privacy";
import React from "react";
import { Route, Routes } from "react-router-dom";

const Home = React.lazy(() => import("app/home"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <React.Suspense fallback={<>...</>}>
            <Home />
          </React.Suspense>
        }
      />
      <Route
        path="/privacy"
        element={
          <React.Suspense fallback={<>...</>}>
            <Privacy />
          </React.Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
