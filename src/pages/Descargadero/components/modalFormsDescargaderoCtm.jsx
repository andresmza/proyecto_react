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
  FormErrorMessage,
  Grid,
  StackDivider,
  GridItem,
  VStack,
  HStack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  useDisclosure,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {
  Formik,
  Form,
  Field,
  useField,
} from "formik";
import { InputText, RadioButton } from "../../../components/inputsForm";
import React, { useState, useEffect } from "react";
import ControlService from "../../../services/ControlService";
import AnexoService from "../../../services/AnexoService";
import { useAuth } from "../../../useAuth";
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";
import { CloseIcon } from "@chakra-ui/icons";

const controlService = ControlService.getInstance();
const anexoService = AnexoService.getInstance();

const COLOR_SCHEME = "teal";

const orderArray = (data) => {
  const middle = Math.ceil(data.length / 2);
  const first = data.splice(0, middle);
  let [l, s] = data.length > first.length ? [data, first] : [first, data];
  return Array.from({ length: l.length * 2 })
    .map((_, i) => (i % 2 == 0 ? l[i / 2] : s[Math.ceil(i / 2) - 1]))
    .filter((el) => el);
};

export default function modalFormsDescargaderoCtm({ isOpen, onClose, formValues, callbackModalFormDescarga, props, title, idEtapa }) {
  const [inputsForm, setInputsForm] = useState({
    observaciones: "",
    nroPrecinto: "",
  });

  const clearFormAndClose = () => {
    onClose();
    setInputsForm({
      observaciones: "",
      nroPrecinto: "",
    });
    setPrecintosList([]);
  }

  const [radioButtons, setRadioButtons] = useState([]);

  const [precintosList, setPrecintosList] = useState([]);

  const [aceptButtondisabled, setAceptButtondisabled] = useState(true);

  const [alertDescargaderoText, setAlertDescargaderoText] = useState("");
  const cancelRefDescargadero = React.useRef();
  const {
    isOpen: isOpenAlertDescargadero,
    onOpen: onOpenAlertDescargadero,
    onClose: onCloseAlertDescargadero,
  } = useDisclosure({ defaultIsOpen: false });

  const { localStorageSession } = useAuth();
  const nuevaDescargaCamion = async (values) => {
    props.setIsLoading(true);
    const user = localStorageSession();
    let controlsAnexo = {
      idAnexo: anexo.idAnexo,
      valorControles: [],
      precintos: [],
      observaciones: values.observaciones,
      idUsuario: user.idUsuario,
    };

    let claves = Object.keys(values);
    for (const clave of claves) {
      if (clave.includes("control")) {
        const idControSelected = parseInt(clave.replace("control", ""));
        controlsAnexo.valorControles.push({
          idControl: idControSelected,
          valor: values[clave],
        });
      }
    }

    precintosList.map((precinto) => {
      controlsAnexo.precintos.push({
        idPrecinto: 0,
        valor: '' + precinto,
      });
    });

    await anexoService.registerControlsByEtapaDescargadero(idEtapa, controlsAnexo).then((response) => {
      if (response.status == 200 || response.status == 201) {
        callbackModalFormDescarga(response.data.mensaje);
        clearFormAndClose();
      } else {
        setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
        onOpenAlertDescargadero();
        // console.log(response);
      }
    }).catch((error) => {
      setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
      onOpenAlertDescargadero();
      // console.log(error);
    }).finally(() => {
      props.setIsLoading(false);
    });
  };

  const [anexo, setAnexo] = useState({
    nroRemito: "",
  });
  let idTipoProducto = "";
  useEffect(() => {
    if (isOpen) {
      anexoService.getAnexoByIdAnexo(formValues.idAnexo).then((response) => {
        const anexoSelected = response.data;
        setInputsForm({
          ...inputsForm,
          nroRemito: anexoSelected.nroRemito,
        });
        setAnexo(anexoSelected);
      });

      idTipoProducto = formValues.producto.idTipoProducto;
      controlService
        .getControlByIdEtapaIdTipoProducto(idEtapa, idTipoProducto)
        .then((response) => {
          if (response.status == 200) {
            setInputsForm({});
            const data = response.data.map((item) => {
              const name = "control" + item["idControl"];
              const label = item["texto"];
              setInputsForm({
                ...inputsForm,
                name,
              });
              return [name, label];
            });
            setRadioButtons(orderArray(data));
          }
        });
    }
    return () => { };
  }, [formValues]);

  const DynamicRadioBtn = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);
    return <RadioButton label={label} name={field.name} meta={meta} />;
  };

  function deletePrecinto(nroPrecinto) {
    const newPrecintosList = precintosList.filter((precinto) => precinto !== nroPrecinto);
    setPrecintosList(newPrecintosList);
  }

  function ListItem(props) {
    return (
      <li width="100%" height="strech">
        <Box
          style={{
            backgroundColor: "rgba(220, 219, 219, 0.8)",
            margin: "5px",
          }}>
          <InputGroup>
            <Box w="100%" align="right" pr="35px" mt="-1px">
              {props.value}
            </Box>
            <InputRightElement mt="-10px">
              <Button
                variant={"unstyled"}
                onClick={() => deletePrecinto(props.value)}
                title="Eliminar"
              >
                <CloseIcon h={3} w={3} color="rgba(197, 48, 48, 1)"
                />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </li>);
  };

  function PrecintoList(props) {
    const numbers = props.precintosList;
    return (
      <Box height="200px" mb={4}>
        <VStack spacing="0%" h="100%">
          <Box border="1px solid" borderColor={COLOR_SCHEME} w="50%" align="center">
            <b>Precintos Cargados</b>
          </Box>
          <Box borderBottom="1px solid" borderRight="1px solid" borderLeft="1px solid" borderColor={COLOR_SCHEME} width="50%" height="100%" overflowY="scroll">
            <ul align="center">
              {numbers.map((number) =>
                <ListItem
                  key={number.toString()}
                  value={number}
                />
              )}
            </ul>
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={clearFormAndClose} scrollBehavior="inside">
        <ModalOverlay />
        <Formik
          initialValues={{
            ...inputsForm,
          }}
          validate={(valores) => {
            let errores = {};

            // Validaciones radioButtons
            radioButtons.map((item) => {
              if (!valores[item[0]]) {
                errores[item[0]] = "Por favor seleccione una opción.";
              }
            });

            if (JSON.stringify(errores) == '{}' || errores === undefined) {
              setAceptButtondisabled(false);
            } else {
              setAceptButtondisabled(true);
            }

            return errores;
          }}
          onSubmit={(values, { resetForm }) => {
            nuevaDescargaCamion(values);
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
              <ModalContent h="50rem" maxW="60rem" scrollBehavior="inside">
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack
                    divider={<StackDivider borderColor="white" />}
                    spacing={0}
                    align="stretch"
                  >
                    <Accordion allowMultiple>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <h2>
                                <b>
                                  <FormErrorMessage>ERROR</FormErrorMessage>
                                  Datos Camión, Patente N°:{" "}
                                  {formValues.camion.patente}
                                </b>
                              </h2>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Box pl={10}>
                            <Box bg="white.200">
                              <HStack spacing="5%">
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      Patente Camión:{" "}
                                      <b>{formValues.camion.patente}</b>
                                    </Text>
                                  </div>
                                </Box>
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      Patente Acoplado:{" "}
                                      <b>{formValues.acoplado.patente}</b>
                                    </Text>
                                  </div>
                                </Box>
                              </HStack>
                            </Box>
                            <Divider />
                            <Box mt={2} bg="white.200">
                              <HStack spacing="5%">
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      Nombre del Conductor:{" "}
                                      <b>{formValues.conductor.nombre + formValues.conductor.apellido}</b>
                                    </Text>
                                  </div>
                                </Box>
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      DNI Conductor:{" "}
                                      <b>{formValues.conductor.dni}</b>
                                    </Text>
                                  </div>
                                </Box>
                              </HStack>
                            </Box>
                            <Divider />
                            <Box mt={2} bg="white.200">
                              <HStack spacing="5%">
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      Tipo Combustible:{" "}
                                      <b>{formValues.producto.nombre}</b>
                                    </Text>
                                  </div>
                                </Box>
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      Fecha ingreso:{" "}
                                      <b>
                                        {moment(formValues.fechaHoraIngreso).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </b>
                                    </Text>
                                  </div>
                                </Box>
                              </HStack>
                            </Box>
                            <Box bg="white.200">
                              <HStack spacing="5%">
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      Estado: <b>{formValues.estado}</b>
                                    </Text>
                                  </div>
                                </Box>
                                <Box w="40%" h="10" bg="white.100">
                                  <div>
                                    <Text>
                                      Hora Ingreso:{" "}
                                      <b>
                                        {moment(formValues.fechaHoraIngreso).format(
                                          "HH:mm"
                                        )}
                                      </b>
                                    </Text>
                                  </div>
                                </Box>
                              </HStack>
                            </Box>
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>

                    <Box mb={0} mt={5} h="100%" bg="white.200">
                      <h3>
                        <b>Controles:</b>
                      </h3>
                      <HStack mt={4} marginLeft={0} spacing="10%">
                        <VStack w="100%" spacing="1%">
                          <Box w="100%" h="10%" bg="white.100">
                            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                              {radioButtons.map((item, key) => {
                                return (
                                  <GridItem
                                    key={key}
                                    w="100%"
                                    h="3"
                                    bg="white.500"
                                  >
                                    <DynamicRadioBtn
                                      key={key}
                                      name={item[0]}
                                      type="text"
                                      label={item[1]}
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </GridItem>
                                );
                              })}
                            </Grid>
                          </Box>
                        </VStack>
                      </HStack>
                      <Divider mt={6} />
                    </Box>

                    <HStack mt={0} marginLeft={0} spacing="10%">
                      <Box mt={4} w="100%" h="100%" bg="white.200">
                        <HStack>
                          <Box w="50%">
                            <h3>
                              <b>Precintos que abre el responsable de la descarga:</b>
                            </h3>
                            <Box w="100%" mb={10} bg="white.200">
                              <VStack spacing="4%" align="stretch">
                                <HStack spacing="3%">
                                  <Box w="70%" h="10" bg="white.100">
                                    <InputText
                                      as={Input}
                                      inputKey="nroPrecinto"
                                      name="Nuevo precinto N°"
                                      type="number"
                                      error={errors.nroPrecinto}
                                      touched={touched.nroPrecinto ? 1 : 0}
                                      handleChange={handleChange}
                                      value={values.nroPrecinto}
                                    />
                                  </Box>
                                  <Box pt={10}>
                                    <Button variant="outline" colorScheme={COLOR_SCHEME} mr={3}
                                      onClick={() => {
                                        if (values.nroPrecinto) {
                                          const precinto = precintosList.find(
                                            precinto => precinto == values.nroPrecinto
                                          );
                                          if (!precinto) {
                                            setPrecintosList([...precintosList, values.nroPrecinto]);
                                            setFieldValue("nroPrecinto", "");
                                          } else {
                                            const error = "Ya ha cargado el precinto N° " + precinto;
                                            setAlertDescargaderoText(error);
                                            onOpenAlertDescargadero();
                                          }
                                        }
                                      }}>
                                      Agregar
                                    </Button>
                                  </Box>

                                </HStack>
                              </VStack>
                            </Box>
                          </Box>
                          <Box w="50%" h="100%">
                            <PrecintoList h="100%" precintosList={precintosList} />
                          </Box>
                        </HStack>
                        <Divider />
                      </Box>
                    </HStack>
                    <HStack mt={0} marginLeft={0} spacing="10%">
                      <Box mt={4} w="100%" h="100%" bg="white.200">
                        <h3>
                          <b>Observaciones</b>
                        </h3>
                        <Box mb={0} h="100%" bg="white.200">
                          <Field
                            cols="100"
                            rows="3"
                            name="observaciones"
                            as="textarea"
                            placeholder="Escriba una observación. (Opcional)"
                          />
                        </Box>
                      </Box>
                    </HStack>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={clearFormAndClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" colorScheme={COLOR_SCHEME} width="10ch" disabled={aceptButtondisabled}>
                    Aceptar
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
