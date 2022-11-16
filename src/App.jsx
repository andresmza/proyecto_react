import {
  ThemeProvider,
  theme,
  CSSReset,
  ChakraProvider,
  Spinner,
} from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Administrador from "./pages/Administrador/Administrador";
import Ado from "./pages/Ado/Ado";
import Bascula from "./pages/Bascula/Bascula";
import Consultas from "./pages/Consultas/Consultas";
import Descargadero from "./pages/Descargadero/Descargadero";
import IngresoEgreso from "./pages/IngresoEgreso/IngresoEgreso";
import Laboratorio from "./pages/Laboratorio/Laboratorio";
import NotFound from "./pages/NotFound";
import { useAuth, AuthProvider } from "./useAuth";
import React, { useState } from "react";


const COLOR_SCHEME = "teal";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, localStorageSession } = useAuth();

  const user = localStorageSession()

  if (!(isAuthenticated || user)) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <div
        hidden={!isLoading}
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          zIndex: "1000000",
        }}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color={COLOR_SCHEME}
          size="xl"
          hidden={!isLoading}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1000000",
          }}
        />
      </div>
      <ChakraProvider>
        <CSSReset />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login setIsLoading={setIsLoading} />} />
            <Route
              path="/administrador"
              element={
                <ProtectedRoute>
                  <Administrador setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ado"
              element={
                <ProtectedRoute>
                  <Ado setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bascula"
              element={
                <ProtectedRoute>
                  <Bascula setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultas"
              element={
                <ProtectedRoute>
                  <Consultas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/descargadero"
              element={
                <ProtectedRoute>
                  <Descargadero puestoDescargadero={"Descargadero"} idPuesto={4} setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/descargadero-cruz-de-piedra"
              element={
                <ProtectedRoute>
                  <Descargadero puestoDescargadero={"Descargadero Cruz de Piedra"} idPuesto={8} setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ingreso-egreso"
              element={
                <ProtectedRoute>
                  <IngresoEgreso setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratorio"
              element={
                <ProtectedRoute>
                  <Laboratorio />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}

export default App;
