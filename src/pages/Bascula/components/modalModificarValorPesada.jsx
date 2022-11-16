import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Input,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Formik,
  Form,
} from "formik";
import { InputText } from "../../../components/inputsForm";
import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import UsuariosService from "../../../services/UsuariosService";
import AlertMsg from "../../../components/alert";

const COLOR_SCHEME = "teal";

let usuariosService = UsuariosService.getInstance();

export default function modalModificarValorPesada({ isOpen, onClose, callbackModalModificarValorPesada, props }) {
  const [inputsForm, setInputsForm] = useState({
    username: "",
    password: "",
    peso: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [aceptButtonOnModificarValorDisabled, setAceptButtonOnModificarValorDisabled] = useState(true);
  const [showError, setShowError] = useState(false);

  const modificarValorPeso = async (values) => {
    props.setIsLoading(true);

    await usuariosService
      .login(values.username, values.password)
      .then(async (response) => {
        if (response.data.idUsuario != null) {
          const usuarioLogueado = response.data;

          await usuariosService
            .getPuestosByIdUsuario(usuarioLogueado.idUsuario)
            .then((response) => {
              if (response.data.length > 0) {
                const puestosDelUsuario = response.data;
                const puestoAdo = puestosDelUsuario.find(
                  //idPuesto 5 es ADO
                  puesto => puesto.idPuesto === 5
                );
                if (puestoAdo) {
                  const pesoModificado = values.peso;
                  const idUsuarioPesadaManual = usuarioLogueado.idUsuario;
                  callbackModalModificarValorPesada(pesoModificado, idUsuarioPesadaManual);
                  clearFormAndClose();
                } else {
                  setShowError("El usuario no tiene permisos para modificar el peso.");
                }
              } else {
                setShowError("El usuario no tiene permisos para modificar el peso.");
              }
            })
            .catch(() => {
              setShowError("Ha ocurrido un error al intentar ingresar al sistema. Por favor, inténtalo de nuevo más tarde.");
            });
        } else {
          setShowError("Usuario o contraseña incorrectos. Intente nuevamente.");
        }
      })
      .catch(() => {
        setShowError("Ha ocurrido un error al intentar ingresar al sistema. Por favor, inténtalo de nuevo más tarde.");
      })
      .finally(() => {
        props.setIsLoading(false);
      });
  };

  const clearFormAndClose = () => {
    onClose();
    setInputsForm({
      ...inputsForm,
      username: "",
      password: "",
      peso: "",
    });
    setShowError("");
  }

  const handleCredentialsChange = (e) => {
    const { name, value } = e.target;
    setInputsForm({
      ...inputsForm,
      [name]: value,
    });
  };

  const handleKeyDownParaIngresar = (event) => {
    if (event.key === "Enter") {
      modificarValorPeso();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={clearFormAndClose}
        scrollBehavior="inside"
        blockScrollOnMount={false}>
        <ModalOverlay />
        <Formik
          initialValues={{
            ...inputsForm
          }}
          validate={(valores) => {
            let errores = {};

            // Validacion username
            if (!valores.username) {
              errores.username =
                "Por favor ingrese el usuario.";
            }

            // Validacion password
            if (!valores.password) {
              errores.password =
                "Por favor ingrese la contraseña.";
            }

            // Validacion peso
            if (!valores.peso) {
              errores.peso =
                "Por favor ingrese el peso de entrada.";
            } else if (!/^[0-9]{0,20}$/.test(valores.peso)) {
              errores.peso = "Ingrese sólo números.";
            }

            if (JSON.stringify(errores) == '{}') {
              setAceptButtonOnModificarValorDisabled(false);
            } else {
              setAceptButtonOnModificarValorDisabled(true);
            }

            return errores;
          }}
          onSubmit={(values, { resetForm }) => {
            modificarValorPeso(values);
          }}
        >
          {({
            handleSubmit,
            errors,
            touched,
            handleChange,
            values,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <ModalContent mt={178} h="32rem" maxW="30rem" scrollBehavior="inside">
                <ModalHeader>Modificar Valor</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box h="50px" bg="white.200">
                    <VStack spacing="12%">
                      <Box w="100%" h="10" bg="white.100">
                        <InputText
                          as={Input}
                          inputKey="username"
                          name="Usuario"
                          type="text"
                          error={errors.username}
                          touched={touched.username}
                          handleChange={handleChange}
                          value={values.username}
                          onKeyDown={handleKeyDownParaIngresar}
                        />
                      </Box>
                      <Box w="100%" h="10" bg="white.100">
                        <InputGroup>
                          <InputText
                            as={Input}
                            inputKey="password"
                            name="Contraseña"
                            type={showPassword ? "text" : "password"}
                            error={errors.password}
                            touched={touched.password}
                            handleChange={handleChange}
                            value={values.password}
                            onChange={handleCredentialsChange}
                            onKeyDown={handleKeyDownParaIngresar}
                          />
                          <InputRightElement pt={47}>
                            <Button
                              variant={"link"}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </Box>
                      <Box w="100%" h="10" bg="white.100">
                        <InputText
                          as={Input}
                          inputKey="peso"
                          name="Peso"
                          type="text"
                          error={errors.peso}
                          touched={touched.peso}
                          handleChange={handleChange}
                          value={values.peso}
                          inputRightAddon={"kg"}
                          onKeyDown={handleKeyDownParaIngresar}
                        />
                      </Box>
                      {showError ? (
                        <AlertMsg
                          mt="4"
                          message={showError}
                          status="error"
                        />
                      ) : (
                        ""
                      )}
                    </VStack>
                  </Box>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={clearFormAndClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" colorScheme={COLOR_SCHEME} width="10ch" disabled={aceptButtonOnModificarValorDisabled}>
                    Aceptar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
