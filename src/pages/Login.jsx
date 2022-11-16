import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image as ImageReact,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Select,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AlertMsg from "../components/alert";
import { useAuth } from "../useAuth";
import UsuariosService from "../services/UsuariosService";

const COLOR_SCHEME = "teal";

const cookies = new Cookies();

let usuariosService = UsuariosService.getInstance();

const Login = (props) => {
  const { login } = useAuth();

  //States
  const [showPassword, setShowPassword] = useState(false);
  const [showRolSelector, setShowRolSelector] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSystemError, setshowSystemError] = useState(false);
  const [showErrorRolSelector, setShowErrorRolSelector] = useState(false);
  const [puestos, setPuestos] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [btnContinuarDeshabilitado, setBtnContinuarDeshabilitado] =
    useState(true);
  const [idPuestoSeleccionado, setIdPuestoSeleccionado] = useState(0);

  const handleCredentialsChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleKeyDownParaIngresar = (event) => {
    if (event.key === "Enter") {
      iniciarSesion();
    }
  };

  const navigate = useNavigate();

  const getPuestosByIdUsuario = async (idUsuario) => {
    props.setIsLoading(true);

    await usuariosService
      .getPuestosByIdUsuario(idUsuario)
      .then((response) => {
        if (response.data.length > 0) {
          const puestosDelUsuario = response.data;
          const puestosDelUsuarioMapeado = puestosDelUsuario.map(
            (puestoDelUsuario) => ({
              value: puestoDelUsuario.idPuesto,
              label: puestoDelUsuario.nombre,
            })
          );
          setPuestos(puestosDelUsuarioMapeado);
        } else {
          setShowError(false);
        }
        props.setIsLoading(false);
      })
      .catch(() => {
        setshowSystemError(true);
        props.setIsLoading(false);
      });
  };

  const iniciarSesion = async () => {
    props.setIsLoading(true);
    setShowRolSelector(false);
    setShowError(false);
    setshowSystemError(false);

    await usuariosService
      .login(form.username, form.password)
      .then((response) => {
        if (response.data.idUsuario != null) {
          const usuarioLogueado = response.data;
          cookies.set("idUsuario", usuarioLogueado.idUsuario, { path: "/" });
          cookies.set("nombre", usuarioLogueado.nombre, { path: "/" });
          cookies.set("apellido", usuarioLogueado.apellido, { path: "/" });
          window.localStorage.setItem("user", JSON.stringify(usuarioLogueado));
          getPuestosByIdUsuario(usuarioLogueado.idUsuario);
          setShowRolSelector(true);
        } else {
          setShowError(true);
        }
        props.setIsLoading(false);
      })
      .catch(() => {
        setshowSystemError(true);
        props.setIsLoading(false);
      });
  };

  const continueLogin = async () => {
    await setShowErrorRolSelector(false);
    login();
    switch (idPuestoSeleccionado) {
      case 6:
        navigate("/administrador");
        break;
      case 5:
        navigate("/ado");
        break;
      case 3:
        navigate("/bascula");
        break;
      case 7:
        navigate("/consultas");
        break;
      case 4:
        navigate("/descargadero");
        break;
      case 8:
        navigate("/descargadero-cruz-de-piedra");
        break;
      case 1:
        navigate("/ingreso-egreso");
        break;
      case 2:
        navigate("/laboratorio");
        break;
      case 0:
        setShowErrorRolSelector(true);
        break;
      default:
        break;
    }
  };

  const cancelLogin = async () => {
    setShowRolSelector(false);
    setShowError(false);
    setShowErrorRolSelector(false);
    setBtnContinuarDeshabilitado(true);
    setIdPuestoSeleccionado(0);
  };

  const RolSelector = () => {
    const handleRolChange = async (e) => {
      if (e.target.value != "") {
        setIdPuestoSeleccionado(parseInt(e.target.value));
        setBtnContinuarDeshabilitado(false);
        setShowErrorRolSelector(false);
      } else {
        setBtnContinuarDeshabilitado(true);
      }
    };

    return (
      <Box>
        <FormLabel mt={4}>Rol</FormLabel>
        <Box textAlign="left">
          <Select
            placeholder="Seleccione un rol"
            value={idPuestoSeleccionado}
            onChange={handleRolChange}
          >
            {puestos.map((puesto) => (
              <option key={puesto.value} value={puesto.value}>
                {puesto.label}
              </option>
            ))}
          </Select>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Flex
        flexDirection="row"
        minHeight="100vh"
        w="full"
        align="center"
        justifyContent="center"
      >
        <Box pr={10}>
          <ImageReact htmlWidth={400} src={"/img/logoCPSA_principal.jpg"} />
        </Box>

        <Box
          borderWidth={1}
          px={4}
          w="full"
          maxW="500px"
          borderRadius={4}
          textAlign="center"
          boxShadow="lg"
        >
          <Box p={3}>
            <LoginHeader />
            <Flex w="full" align="center" justifyContent="center">
              <Box mt={4} w="100%" textAlign="left">
                <form>
                  <FormControl>
                    <FormLabel>Usuario</FormLabel>
                    <Input
                      disabled={showRolSelector ? true : false}
                      type="text"
                      name="username"
                      onChange={handleCredentialsChange}
                      onKeyDown={handleKeyDownParaIngresar}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Contraseña</FormLabel>
                    <InputGroup>
                      <Input
                        disabled={showRolSelector ? true : false}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleCredentialsChange}
                        onKeyDown={handleKeyDownParaIngresar}
                      />
                      <InputRightElement h={"full"}>
                        <Button
                          variant={"ghost"}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  ></Stack>

                  {showError ? (
                    <AlertMsg
                      mt="4"
                      message="Usuario o contraseña incorrectos. Intente nuevamente."
                      status="error"
                    />
                  ) : (
                    ""
                  )}

                  {showSystemError ? (
                    <AlertMsg
                      mt="4"
                      message="Ha ocurrido un error al intentar ingresar al sistema. Por favor, inténtalo de nuevo más tarde."
                      status="error"
                    />
                  ) : (
                    ""
                  )}

                  {showRolSelector ? (
                    <>
                      <RolSelector />

                      {showErrorRolSelector ? (
                        <AlertMsg
                          mt="4"
                          message="Debe seleccionar un rol."
                          status="error"
                        />
                      ) : (
                        ""
                      )}

                      <Stack>
                        <Flex mt={4}>
                          <Button
                            onClick={cancelLogin}
                            colorScheme={COLOR_SCHEME}
                            w="full"
                            mt={4}
                            mr={4}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={continueLogin}
                            colorScheme={COLOR_SCHEME}
                            w="full"
                            mt={4}
                            mb={4}
                            disabled={btnContinuarDeshabilitado}
                          >
                            Continuar
                          </Button>
                        </Flex>
                      </Stack>
                    </>
                  ) : (
                    <Button
                      onClick={iniciarSesion}
                      colorScheme={COLOR_SCHEME}
                      w="full"
                      mt={4}
                      mb={4}
                    >
                      Ingresar
                    </Button>
                  )}
                </form>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

const LoginHeader = () => {
  return (
    <Box textAlign="center">
      <Heading as="h4" size="lg" noOfLines={2}>
        CONDES
      </Heading>
    </Box>
  );
};

export default Login;
