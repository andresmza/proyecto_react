import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
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
  Button,
  ModalHeader,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik, Form, Field, useField } from "formik";
import { InputText, RadioButton } from "../../../components/inputsForm";
import moment from "moment";
import ControlService from "../../../services/ControlService";
import { useAuth } from "../../../useAuth";
import AnexoService from "../../../services/AnexoService";
import React, { useState, useEffect } from "react";
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";

const controlService = ControlService.getInstance();
const anexoService = AnexoService.getInstance();

const COLOR_SCHEME = "teal";
const idEtapa = 6;

const orderArray = (data) => {
  const middle = Math.ceil(data.length / 2);
  const first = data.splice(0, middle);
  let [l, s] = data.length > first.length ? [data, first] : [first, data];
  return Array.from({ length: l.length * 2 })
    .map((_, i) => (i % 2 == 0 ? l[i / 2] : s[Math.ceil(i / 2) - 1]))
    .filter((el) => el);
};


export default function modalFormSalida({ isOpen, onClose, formValues, callbackModalFormSalida, idEtapa, props }) {
  const [inputsForm, setInputsForm] = useState({});
  const [radioButtons, setRadioButtons] = useState([]);
  
  const [aceptButtondisabled, setAceptButtondisabled] = useState(true);
  
  const [alertEgresoText, setAlertEgresoText] = useState("");
  const cancelRefEgreso = React.useRef();
  const {
    isOpen: isOpenAlertEgreso,
    onOpen: onOpenAlertEgreso,
    onClose: onCloseAlertEgreso,
  } = useDisclosure({ defaultIsOpen: false });
  
  const { localStorageSession } = useAuth();
  const nuevaSalidaCamion = async (values) => {
    props.setIsLoading(true);
    const user = localStorageSession();
    let controlsAnexo = {
      idAnexo: anexo.idAnexo,
      observaciones: values.observaciones,
      idUsuario: user.idUsuario,
      valorControles: [],
    };
    
    let claves = Object.keys(values);
    for (const clave of claves) {
      if (clave.includes("control")) {
        const idControSelected = parseInt(clave.replace("control", ""));
        const controlSelected = anexo.valorControls.find((element) => {
          return element.idControl === idControSelected;
        });
        controlsAnexo.valorControles.push({
          idControl: idControSelected,
          valor: values[clave],
        });
      }
    }
    
    await anexoService.registerControlsByEtapa(idEtapa, controlsAnexo).then((response) => {
      if (response.status == 200 || response.status == 201) {
        callbackModalFormSalida(response.data.mensaje);
        clearFormAndClose();
      } else {
        setAlertEgresoText("Ha ocurrido un problema al intentar sacar el camión.");
        onOpenAlertEgreso();
      }
    }).catch((error) => {
      setAlertEgresoText("Ha ocurrido un problema al intentar sacar el camión.");
      onOpenAlertEgreso();
    });
    props.setIsLoading(false);
  };
  
  const clearFormAndClose = () => {
    onClose();
    setInputsForm({});
  }
  
  const [anexo, setAnexo] = useState({});
  const fechaHora = new Date();
  let idTipoProducto = "";
  useEffect(() => {
    props.setIsLoading(true);
    if (isOpen) {
      anexoService.getAnexoByIdAnexo(formValues.idAnexo).then((response) => {
        const anexoSelected = response.data;
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
    props.setIsLoading(false);
    return () => { };
  }, [formValues]);
  
  const DynamicRadioBtn = ({ label, ...props }) => {
    const [field, meta, helpers] = useField(props);
    return <RadioButton label={label} name={field.name} meta={meta} />;
  };
  
  const closeForm = () => {
    setAceptButtondisabled(true);
    onClose();
  }
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
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

            if (JSON.stringify(errores) == '{}' || errores === undefined) {
              setAceptButtondisabled(false);
            } else {
              setAceptButtondisabled(true);
            }

            return errores;
          }}
          onSubmit={(values, { resetForm }) => {
            nuevaSalidaCamion(values);
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
                <ModalHeader>Nueva Salida</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack
                    divider={<StackDivider borderColor="white" />}
                    spacing={0}
                    align="stretch"
                  >
                    <Accordion allowMultiple defaultIndex={[0]}>
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
                        <VStack w="50%" spacing="1%">
                          <Box w="100%" h="10%" bg="white.100">
                            <HStack mt={4} marginLeft={0} spacing="10%">
                              <VStack w="100%" spacing="1%">
                                <Box w="100%" h="10%" bg="white.100">
                                  <Grid
                                    templateColumns="repeat(1, 1fr)"
                                    gap={3}
                                  >
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
                          </Box>
                        </VStack>
                        <VStack w="50%" spacing="1%">
                          <Box w="100%" h="10%" bg="white.100">
                            <InputText
                              as={Input}
                              inputKey="fechaHora"
                              name="Fecha y hora"
                              type="text"
                              readOnly={true}
                              value={moment(fechaHora).format(
                                "DD-MM-YYYY HH:mm"
                              )}
                            />
                          </Box>
                        </VStack>
                      </HStack>
                      <Divider mt={6} />
                    </Box>
                    <HStack mt={0} marginLeft={0} spacing="10%">
                      <Box mt={4} w="100%" h="100%" bg="white.200">
                        <h3>
                          <b>Observaciones:</b>
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
                  <Button colorScheme="blue" mr={3} onClick={closeForm}>
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
        cancelRef={cancelRefEgreso}
        onCloseAlert={onCloseAlertEgreso}
        isOpenAlert={isOpenAlertEgreso}
        alertText={alertEgresoText}
        errorMode={true}
      />
    </>
  );
}
