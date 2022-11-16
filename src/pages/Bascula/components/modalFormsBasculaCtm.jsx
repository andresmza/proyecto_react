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
} from "@chakra-ui/react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {
  Formik,
  Form,
  Field,
  useField,
  useFormikContext,
} from "formik";
import { InputText, RadioButton } from "../../../components/inputsForm";
import React, { useState, useEffect } from "react";
import ControlService from "../../../services/ControlService";
import AnexoService from "../../../services/AnexoService";
import { useAuth } from "../../../useAuth";
import ModalModificarValorPesada from "./modalModificarValorPesada";
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";
import BasculaService from "../../../services/BasculaService";


const controlService = ControlService.getInstance();
const anexoService = AnexoService.getInstance();
const basculaService = BasculaService.getInstance();

const COLOR_SCHEME = "teal";

const orderArray = (data) => {
  const middle = Math.ceil(data.length / 2);
  const first = data.splice(0, middle);
  let [l, s] = data.length > first.length ? [data, first] : [first, data];
  return Array.from({ length: l.length * 2 })
    .map((_, i) => (i % 2 == 0 ? l[i / 2] : s[Math.ceil(i / 2) - 1]))
    .filter((el) => el);
};

export default function ModalFormsBasculaCtm({ isOpen, onClose, formValues, callbackModalFormPesada, props, title, idEtapa }) {
  const [inputsForm, setInputsForm] = useState({
    peso: "",
    idUsuarioPesadaManual: 0,
    nroRemito: "",
  });

  const clearFormAndClose = () => {
    onClose();
    setInputsForm({
      ...inputsForm,
      peso: "",
      idUsuarioPesadaManual: 0,
      nroRemito: "",
    });
    setAceptButtondisabled(true);
  }

  const [radioButtons, setRadioButtons] = useState([]);

  const [aceptButtondisabled, setAceptButtondisabled] = useState(true);

  const [alertBasculaText, setAlertBasculaText] = useState("");
  const cancelRefBascula = React.useRef();
  const {
    isOpen: isOpenAlertBascula,
    onOpen: onOpenAlertBascula,
    onClose: onCloseAlertBascula,
  } = useDisclosure({ defaultIsOpen: false });

  const { localStorageSession } = useAuth();
  const nuevaPesadaCamion = async (values) => {
    props.setIsLoading(true);
    const user = localStorageSession();
    let controlsAnexo = {
      idAnexo: anexo.idAnexo,
      observaciones: values.observaciones,
      idUsuario: user.idUsuario,
      valorControles: [],
      peso: inputsForm.peso,
      idUsuarioPesadaManual: inputsForm.idUsuarioPesadaManual,
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

    await anexoService.registerControlsByEtapaBascula(idEtapa, controlsAnexo).then((response) => {
      if (response.status == 200 || response.status == 201) {
        callbackModalFormPesada(response.data.mensaje);
        clearFormAndClose();
      } else {
        setAlertBasculaText("Ha ocurrido un problema al intentar guardar la pesada del camión.");
        onOpenAlertBascula();
      }
    }).catch((error) => {
      setAlertBasculaText("Ha ocurrido un problema al intentar guardar la pesada del camión.");
      onOpenAlertBascula();
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

  const obtenerValor = () => {
    props.setIsLoading(true);
    basculaService.getPesada().then((response) => {
      if (response.status == 200) {
        setInputsForm({
          ...inputsForm,
          peso: response.valor,
        });
      }
    }).catch((error) => {
      setAlertBasculaText("Ha ocurrido un problema al intentar obtener la pesada del camión desde la báscula.");
      onOpenAlertBascula();
      // console.log(error);
    }).finally(() => {
      props.setIsLoading(false);
    });
  };

  const modificarValor = () => {
    onOpenModalModificarValorPesada();
  };

  // Contexto Modal Modificar Valor Pesada
  const {
    isOpen: isOpenModalModificarValorPesada,
    onOpen: onOpenModalModificarValorPesada,
    onClose: onCloseModalModificarValorPesada,
  } = useDisclosure({ defaultIsOpen: false });

  const callbackModalModificarValorPesada = (pesoModificado, idUsuarioPesadaManual) => {
    setInputsForm({
      ...inputsForm,
      peso: parseInt(pesoModificado),
      idUsuarioPesadaManual: idUsuarioPesadaManual,
    });
  };

  const FormikContext = () => {
    const { values, submitForm, setFieldValue } = useFormikContext();

    useEffect(() => {
      if (inputsForm.peso && !isNaN(+inputsForm.peso)) {
        setFieldValue("peso", inputsForm.peso);
      }
    }, [values.peso]);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={clearFormAndClose} scrollBehavior="inside">
        <ModalOverlay />
        <Formik
          initialValues={{
            ...inputsForm,
            observaciones: "",
          }}
          validate={(valores) => {
            let errores = {};

            // Validaciones radioButtons
            radioButtons.map((item) => {
              if (!valores[item[0]]) {
                errores[item[0]] = "Por favor seleccione una opción.";
              }
            });

            // Validacion peso
            if (inputsForm.peso) {
              valores.peso = inputsForm.peso;
            }
            if (!valores.peso) {
              errores.peso =
                "Por favor ingrese el peso de entrada.";
            } else if (!/^[0-9]{0,20}$/.test(valores.peso)) {
              errores.peso = "Ingrese sólo números.";
            }

            if (JSON.stringify(errores) == '{}' || errores === undefined) {
              setAceptButtondisabled(false);
            } else {
              setAceptButtondisabled(true);
            }

            return errores;
          }}
          onSubmit={(values, { resetForm }) => {
            nuevaPesadaCamion(values);
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
              <FormikContext />
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
                                      <b>{formValues.conductor.nombre}</b>
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
                        <b>Verificaciones:</b>
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
                        <h3>
                          <b>Pesaje:</b>
                        </h3>
                        <Box mb={10} bg="white.200">
                          <VStack spacing="4%" align="stretch">
                            <HStack spacing="3%">
                              <Box w="30%" h="10" bg="white.100">
                                <InputText
                                  as={Input}
                                  inputKey="peso"
                                  name="Pesaje"
                                  type="text"
                                  error={errors.peso}
                                  touched={touched.peso}
                                  onChange={handleChange}
                                  handleChange={handleChange}
                                  value={inputsForm.peso}
                                  inputRightAddon={"kg"}
                                  readOnly
                                />
                              </Box>
                              <Box pt={10}>
                                <Button variant="outline" colorScheme={COLOR_SCHEME} mr={3} onClick={obtenerValor}>
                                  Obtener Valor
                                </Button>
                                <Button variant="outline" colorScheme={COLOR_SCHEME} onClick={modificarValor}>
                                  Modificar Valor
                                </Button>
                              </Box>
                            </HStack>
                            <Box w="30%" h="10" bg="white.100">
                              <InputText
                                as={Input}
                                inputKey="nroRemito"
                                name="Remito N°"
                                type="text"
                                readOnly={true}
                                value={anexo.nroRemito}
                              />
                            </Box>
                          </VStack>
                        </Box>
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

      <ModalModificarValorPesada
        isOpen={isOpenModalModificarValorPesada}
        onClose={onCloseModalModificarValorPesada}
        callbackModalModificarValorPesada={callbackModalModificarValorPesada}
        props={props}
      />

      <AlertDialogAceptCtm
        cancelRef={cancelRefBascula}
        onCloseAlert={onCloseAlertBascula}
        isOpenAlert={isOpenAlertBascula}
        alertText={alertBasculaText}
        errorMode={true}
      />
    </>
  );
}
