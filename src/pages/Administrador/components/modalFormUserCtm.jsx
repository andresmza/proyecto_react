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
  StackDivider,
  VStack,
  useDisclosure,
  InputGroup,
  InputRightElement,
  FormLabel,
  FormErrorMessage,
  FormControl,
  Stack,
  HStack,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Formik,
  Form,
  Field,
} from "formik";
import { InputText } from "../../../components/inputsForm";
import React, { useState, useEffect } from "react";
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../../../useAuth";

const COLOR_SCHEME = "teal";

export default function modalFormUserCtm({ isOpen, onClose, callbackModalFormUser, props, title, isCreationMode, formValuesForEditUser }) {
  const [inputsForm, setInputsForm] = useState({
    username: "",
    name: "",
    lastname: "",
    password: "",
    roles: [],
  });
  const [showPassword, setShowPassword] = useState(false);

  const clearFormAndClose = () => {
    onClose();
    setInputsForm({
      username: "",
      name: "",
      lastname: "",
      password: "",
      roles: [],
    });
    setRolesUpdated(false);
  }

  const [aceptButtondisabled, setAceptButtondisabled] = useState(true);

  const [alertDescargaderoText, setAlertDescargaderoText] = useState("");
  const cancelRefDescargadero = React.useRef();
  const {
    isOpen: isOpenAlertDescargadero,
    onOpen: onOpenAlertDescargadero,
    onClose: onCloseAlertDescargadero,
  } = useDisclosure({ defaultIsOpen: false });

  const multipleCheckbioxValues = ["Administrador", "ADO", "Báscula", "Consultas", "Descargadero", "Descargadero Cruz de Piedra", "Ingreso/Egreso", "Laboratorio"];

  const { localStorageSession } = useAuth();
  const createUser = async (values) => {
    props.setIsLoading(true);
    const user = localStorageSession();
    let newUser = {
      idUsuario: user.idUser,
      usuario: values.username,
      nombre: values.name,
      apellido: values.lastname,
      password: values.password,
      roles: values.roles,
    };
    callbackModalFormUser("Usuario MOCK creado!!");

    //TODO:  Descomentar cuando Anibal tenga el endpoint
    // await anexoService.registerControlsByEtapaDescargadero(idEtapa, controlsAnexo).then((response) => {
    //   if (response.status == 200 || response.status == 201) {
    // callbackModalFormUser(response.data.mensaje);
    clearFormAndClose();
    //   } else {
    //     setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
    //     onOpenAlertDescargadero();
    //     console.log(response);
    //   }
    // }).catch((error) => {
    //   setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
    //   onOpenAlertDescargadero();
    //   console.log(error);
    // }).finally(() => {
    props.setIsLoading(false);
    // });
  };

  const editUser = async (values) => {
    props.setIsLoading(true);
    const user = localStorageSession();
    let userUpdated = {
      idUsuarioAdministrador: user.idUser,
      idUsuario: values.idUser,
      usuario: values.username,
      nombre: values.name,
      apellido: values.lastname,
      password: values.password,
      roles: values.roles,
    };
    callbackModalFormUser("Usuario MOCK modificado!!");

    //TODO:  Descomentar cuando Anibal tenga el endpoint
    // await anexoService.registerControlsByEtapaDescargadero(idEtapa, controlsAnexo).then((response) => {
    //   if (response.status == 200 || response.status == 201) {
    // callbackModalFormUser(response.data.mensaje);
    clearFormAndClose();
    //   } else {
    //     setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
    //     onOpenAlertDescargadero();
    //     console.log(response);
    //   }
    // }).catch((error) => {
    //   setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
    //   onOpenAlertDescargadero();
    //   console.log(error);
    // }).finally(() => {
    props.setIsLoading(false);
    // });
  };

  const [rolesUpdated, setRolesUpdated] = useState(false);

  // Constructores
  useEffect(() => {
    if (isCreationMode) {
      setInputsForm({
        username: "",
        name: "",
        lastname: "",
        password: "",
        roles: [],
      });
    } else {
      setInputsForm(formValuesForEditUser);
    }
  }, [isCreationMode, formValuesForEditUser]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={clearFormAndClose} scrollBehavior="inside">
        <ModalOverlay />
        <Formik
          enableReinitialize
          initialValues={inputsForm}
          validate={(valores) => {
            let errores = {};

            // Validacion usuario
            if (!valores.username) {
              errores.username = "Por favor ingrese un usuario.";
            } else if (!/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/.test(valores.username)) {
              errores.username = "El nombre sólo puede contener letras y números";
            }

            // Validacion nombre
            if (!valores.name) {
              errores.name = "Por favor ingrese un nombre.";
            } else if (
              !/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.name)
            ) {
              errores.name = "El nombre sólo puede contener letras y espacios";
            }

            // Validacion apellido
            if (!valores.lastname) {
              errores.lastname = "Por favor ingrese un apellido.";
            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.lastname)) {
              errores.lastname =
                "El apellido sólo puede contener letras y espacios";
            }

            // Validacion password
            if (!valores.password) {
              errores.password = "Por favor ingrese una password.";
            }

            // Validacion roles
            if (!valores.roles.length > 0) {
              errores.roles = "Por favor seleccione al menos un rol.";
            }

            if (JSON.stringify(errores) == '{}' || errores === undefined) {
              setAceptButtondisabled(false);
            } else {
              setAceptButtondisabled(true);
            }

            return errores;
          }}
          onSubmit={(values, { resetForm }) => {
            if (isCreationMode) {
              createUser(values);
            } else {
              editUser(values);
            }
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
            <Form onSubmit={handleSubmit} >
              <ModalContent h="52rem" maxW="40rem" scrollBehavior="inside">
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <VStack
                    divider={<StackDivider borderColor="white" />}
                    w="80%"
                    spacing={6}
                    align="center"
                  >
                    <Box w="80%" h="10" bg="white.100">
                      <InputText
                        as={Input}
                        inputKey="username"
                        name="Usuario"
                        type="text"
                        error={errors.username}
                        touched={touched.username ? 1 : 0}
                        handleChange={handleChange}
                        value={values.username}
                      />
                    </Box>
                    <Box w="80%" h="10" bg="white.100">
                      <InputText
                        as={Input}
                        inputKey="name"
                        name="Nombre"
                        type="text"
                        error={errors.name}
                        touched={touched.name ? 1 : 0}
                        handleChange={handleChange}
                        value={values.name}
                      />
                    </Box>
                    <Box w="80%" h="10" bg="white.100">
                      <InputText
                        as={Input}
                        inputKey="lastname"
                        name="Apellido"
                        type="text"
                        error={errors.lastname}
                        touched={touched.lastname ? 1 : 0}
                        handleChange={handleChange}
                        value={values.lastname}
                      />
                    </Box>
                    <Box w="80%" h="10" bg="white.100">
                      <InputGroup>
                        <InputText
                          as={Input}
                          inputKey="password"
                          name="Password"
                          type={showPassword ? "text" : "password"}
                          error={errors.password}
                          touched={touched.password ? 1 : 0}
                          handleChange={handleChange}
                          autoComplete="new-password"
                          value={values.password}
                        />
                        <InputRightElement w="53%" h={"full"} pt={(touched.password && errors.password) ? "0" : "7"}>
                          <Button
                            variant={"unstyled"}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                    <Box w="80%" h="10" bg="white.100">
                      <FormControl isInvalid={!!errors.roles && rolesUpdated}>
                        <FormLabel htmlFor="roles">Rol:</FormLabel>
                        <div id="checkbox-group"></div>
                        <div role="group" aria-labelledby="checkbox-group">
                          <Stack spacing={1} direction="column" pl={5}>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type='checkbox' name="roles" value="Administrador" onClick={() => setRolesUpdated(true)} /></Box>
                              <Box>Administrador</Box>
                            </HStack>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type="checkbox" name="roles" value="ADO" onClick={() => setRolesUpdated(true)} /> </Box>
                              <Box>ADO</Box>
                            </HStack>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type="checkbox" name="roles" value="Báscula" onClick={() => setRolesUpdated(true)} /> </Box>
                              <Box>Báscula</Box>
                            </HStack>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type="checkbox" name="roles" value="Consultas" onClick={() => setRolesUpdated(true)} /> </Box>
                              <Box>Consultas</Box>
                            </HStack>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type="checkbox" name="roles" value="Descargadero" onClick={() => setRolesUpdated(true)} /> </Box>
                              <Box>Descargadero</Box>
                            </HStack>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type="checkbox" name="roles" value="Descargadero Cruz de Piedra" onClick={() => setRolesUpdated(true)} /> </Box>
                              <Box>Descargadero Cruz de Piedra</Box>
                            </HStack>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type="checkbox" name="roles" value="Ingreso/Egreso" onClick={() => setRolesUpdated(true)} /> </Box>
                              <Box>Ingreso/Egreso</Box>
                            </HStack>
                            <HStack>
                              <Box pt="2px" w={5} ><Field type="checkbox" name="roles" value="Laboratorio" onClick={() => setRolesUpdated(true)} /> </Box>
                              <Box>Laboratorio</Box>
                            </HStack>
                          </Stack>
                        </div>
                        <FormErrorMessage>{errors.roles}</FormErrorMessage>
                      </FormControl>
                    </Box>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={clearFormAndClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" colorScheme={COLOR_SCHEME} disabled={aceptButtondisabled}>
                    {isCreationMode ? "Crear" : "Guardar cambios"}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>

      <AlertDialogAceptCtm
        cancelRef={cancelRefDescargadero}
        onCloseAlert={onCloseAlertDescargadero}
        isOpenAlert={isOpenAlertDescargadero}
        alertText={alertDescargaderoText}
        errorMode={true}
      />
    </>
  );
};
