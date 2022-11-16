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
  useDisclosure,
  Box,
  FormLabel,
  FormErrorMessage,
  FormControl,
  Grid,
  StackDivider,
  GridItem,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import { AsyncSelect } from "chakra-react-select";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Form, Field, useFormikContext, useField } from "formik";
import { InputText, RadioButton } from "../../../components/inputsForm";
import React, { useState, useEffect } from "react";
import ProductoService from "../../../services/ProductoService";
import ControlService from "../../../services/ControlService";
import ProveedorService from "../../../services/ProveedorService";
import TransportistaService from "../../../services/TransportistaService";
import UnidadMedidaService from "../../../services/UnidadMedidaService";
import DestinatarioService from "../../../services/DestinatarioService";
import AnexoService from "../../../services/AnexoService";
import ConductorService from "../../../services/ConductorService";
import { useAuth } from "../../../useAuth";
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";

const productoService = ProductoService.getInstance();
const controlService = ControlService.getInstance();
const proveedorService = ProveedorService.getInstance();
const transportistaService = TransportistaService.getInstance();
const unidadMedidaService = UnidadMedidaService.getInstance();
const destinatarioService = DestinatarioService.getInstance();
const anexoService = AnexoService.getInstance();
const conductorService = ConductorService.getInstance();

const COLOR_SCHEME = "teal";
const COLOR_ERROR = "rgba(197, 48, 48, 1)";

export default function modalFormIngreso({ isOpen, onClose, inputValues, callbackModalFormIngreso, props }) {
  const [inputsModalFormIngreso, setInputsModalFormIngreso] = useState({
    idConductor: 0,
    dniConductor: "",
    patenteCamion: "",
    patenteAcoplado: "",
    nombreConductor: "",
    apellidoConductor: "",
    idProducto: 0,
    idProveedor: 0,
    idProductor: 0,
    idTransportista: 0,
    idRemito: "",
    idUnidadMedida: 0,
    fechaHora: "",
    cantSegunRemito: "",
    idDestinatario: 0,
    observaciones: "",
  });

  const fechaHora = new Date();

  const [selectedoptionProductor, setSelectedoptionProductor] = useState("");
  const [optionsProductor, setOptionsProductor] = useState([]);
  const [radioButtons, setRadioButtons] = useState([]);

  const [aceptButtondisabled, setAceptButtondisabled] = useState(true);

  const [alertIngresoText, setAlertIngresoText] = useState("");
  const cancelRefIngreso = React.useRef();
  const {
    isOpen: isOpenAlertIngreso,
    onOpen: onOpenAlertIngreso,
    onClose: onCloseAlertIngreso,
  } = useDisclosure({ defaultIsOpen: false });

  const proveedorEsProductor = (idProveedor) => {
    return optionsProductor.some((element) => {
      return element.value === idProveedor;
    });
  };

  const orderArray = (data) => {
    const middle = Math.ceil(data.length / 2);
    const first = data.splice(0, middle);
    let [l, s] = data.length > first.length ? [data, first] : [first, data];
    return Array.from({ length: l.length * 2 })
      .map((_, i) => (i % 2 == 0 ? l[i / 2] : s[Math.ceil(i / 2) - 1]))
      .filter((el) => el);
  };

  useEffect(() => {
    setInputsModalFormIngreso((inputsModalFormIngreso) => ({
      ...inputsModalFormIngreso,
      idConductor: inputValues.idConductor,
      dniConductor: inputValues.dniConductor,
      patenteCamion: inputValues.patenteCamion,
      patenteAcoplado: inputValues.patenteAcoplado,
      nombreConductor: inputValues.nombreConductor,
      apellidoConductor: inputValues.apellidoConductor,
    }));
  }, [inputValues]);

  const { localStorageSession } = useAuth();
  const ingresarCamion = async (values) => {
    props.setIsLoading(true);
    const user = localStorageSession();
    let newAnexo = {
      nroRemito: values.idRemito,
      fechaHoraIngreso: fechaHora.toISOString(),
      camion: {
        idVehiculo: 0,
        patente: values.patenteCamion,
      },
      acoplado: {
        idVehiculo: 0,
        patente: values.patenteAcoplado,
      },
      conductor: {
        idConductor: values.idConductor,
        dni: values.dniConductor,
        nombre: values.nombreConductor,
        apellido: values.apellidoConductor,
      },
      idProducto: values.idProducto,
      idProveedor: values.idProveedor,
      idProductor: values.idProductor,
      idTransportista: parseInt(values.idTransportista),
      idDestinatario: values.idDestinatario,
      idUnidadMedida: values.idUnidadMedida,
      cantSegunRemito: values.cantSegunRemito,
      observaciones: values.observaciones,
      idUsuario: user.idUsuario,
      controles: [],
    };

    let claves = Object.keys(values);
    for (const clave of claves) {
      if (clave.includes("control")) {
        newAnexo.controles.push({
          idControl: parseInt(clave.replace("control", "")),
          valor: values[clave],
        });
      }
    }

    await anexoService.createAnexo(newAnexo).then((response) => {
      if (response.status == 200 || response.status == 201) {
        callbackModalFormIngreso(response.data.mensaje);
        clearFormAndClose();
      }
      else {
        setAlertIngresoText("Ha ocurrido un problema al intentar ingresar el camión.");
        onOpenAlertIngreso();
      }
    }).catch((error) => {
      if (error.response && error.response.status && error.response.status == 400) {
        setAlertIngresoText(error.response.data.error.message);
        onOpenAlertIngreso();
      } else {
        setAlertIngresoText("Ha ocurrido un problema al intentar ingresar el camión.");
        onOpenAlertIngreso();
      }
    }).finally(() => {
      props.setIsLoading(false);
    });

  };

  const clearFormAndClose = () => {
    onClose();
    setInputsModalFormIngreso({
      ...inputsModalFormIngreso,
      idConductor: 0,
      dniConductor: "",
      patenteCamion: "",
      patenteAcoplado: "",
      nombreConductor: "",
      apellidoConductor: "",
      idProducto: 0,
      idProveedor: 0,
      idProductor: 0,
      idTransportista: 0,
      idRemito: "",
      idUnidadMedida: 0,
      fechaHora: "",
      cantSegunRemito: "",
      idDestinatario: 0,
      observaciones: "",
    });
  }

  const FormikContext = () => {
    const { values, submitForm } = useFormikContext();

    useEffect(() => {

      if (values.dniConductor.length > 6 && values.dniConductor.length < 9) {
        conductorService
          .getCondutorByDni(values.dniConductor)
          .then((response) => {
            if (response.status == 200) {
              values.nombreConductor = response.data.nombre;
              values.apellidoConductor = response.data.apellido;
            }
          });
      }
    }, [values.dniConductor]);

    useEffect(() => { }, [values, submitForm]);
    return null;
  };

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
          enableReinitialize={true}
          initialValues={{
            ...inputsModalFormIngreso,
          }}
          validate={(valores) => {
            let errores = {};

            // Validacion patenteCamion
            if (!valores.patenteCamion) {
              errores.patenteCamion = "Por favor ingrese una patente.";
            } else if (
              !/^(([A-Za-z]{3}[0-9]{3})|([A-Za-z]{2}[0-9]{3}[A-Za-z]{2}))+$/.test(
                valores.patenteCamion
              )
            ) {
              errores.patenteCamion = "Por favor ingrese una patente válida.";
            }

            // Validacion patenteAcoplado
            if (!valores.patenteAcoplado) {
              errores.patenteAcoplado = "Por favor ingrese una patente.";
            } else if (
              !/^(([A-Za-z]{3}[0-9]{3})|([A-Za-z]{2}[0-9]{3}[A-Za-z]{2}))+$/.test(
                valores.patenteAcoplado
              )
            ) {
              errores.patenteAcoplado = "Por favor ingrese una patente válida.";
            }

            // Validacion dniConductor
            if (!valores.dniConductor) {
              errores.dniConductor = "Por favor ingrese un DNI.";
            } else if (!/^[0-9]{7,8}$/.test(valores.dniConductor)) {
              errores.dniConductor =
                "El DNI sólo puede contener números de 7 u 8 dígitos.";
            }

            // Validacion nombreConductor
            if (!valores.nombreConductor) {
              errores.nombreConductor = "Por favor ingrese un nombre.";
            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.nombreConductor)) {
              errores.nombreConductor =
                "El nombre sólo puede contener letras y espacios";
            }

            // Validacion apellidoConductor
            if (!valores.apellidoConductor) {
              errores.apellidoConductor = "Por favor ingrese un apellido.";
            } else if (
              !/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.apellidoConductor)
            ) {
              errores.apellidoConductor =
                "El apellido sólo puede contener letras y espacios";
            }

            // Validacion producto
            if (!valores.idProducto) {
              errores.idProducto = "Por favor seleccione una opción.";
            }

            // Validacion proveedor
            if (!valores.idProveedor) {
              errores.idProveedor = "Por favor seleccione una opción.";
            }

            // Validacion productor
            if (!valores.idProductor) {
              errores.idProductor = "Por favor seleccione una opción.";
            }

            // Validacion idTransportista
            if (!valores.idTransportista) {
              errores.idTransportista = "Por favor ingrese un transportista.";
            }

            // Validacion idRemito
            if (!valores.idRemito) {
              errores.idRemito = "Por favor ingrese un número de remito.";
            } else if (!/^[0-9]{4}R[0-9]{8}$/.test(valores.idRemito)) {
              errores.idRemito = "Complete el campo con el siguiente formato 1234R12345678.";
            }

            // Validacion cantSegunRemito
            if (!valores.cantSegunRemito) {
              errores.cantSegunRemito =
                "Por favor ingrese cantidad según remito.";
            } else if (!/^[0-9]{0,20}$/.test(valores.cantSegunRemito)) {
              errores.cantSegunRemito = "Ingrese sólo números.";
            }

            // Validacion idUnidadMedida
            if (!valores.idUnidadMedida) {
              errores.idUnidadMedida =
                "Por favor ingrese una unidad de medida.";
            }

            // Validacion destinatario
            if (!valores.idDestinatario) {
              errores.idDestinatario = "Por favor ingrese un destinatario.";
            }

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
            ingresarCamion(values);
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
                <ModalHeader>Nuevo Ingreso</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack
                    divider={<StackDivider borderColor="white" />}
                    spacing={0}
                    align="stretch"
                  >
                    <h2>
                      <b>Datos del vehículo:</b>
                    </h2>
                    <Box mb={10} h="60px" bg="white.200">
                      <HStack spacing="5%">
                        <Box w="30%" h="10" bg="white.100">
                          <InputText
                            as={Input}
                            inputKey="patenteCamion"
                            name="Patente camión"
                            type="text"
                            error={errors.patenteCamion}
                            touched={touched.patenteCamion ? 1 : 0}
                            handleChange={handleChange}
                            value={values.patenteCamion}
                          />
                        </Box>
                        <Box w="30%" h="10" bg="white.100">
                          <InputText
                            as={Input}
                            inputKey="patenteAcoplado"
                            name="Patente acoplado"
                            type="text"
                            error={errors.patenteAcoplado}
                            touched={touched.patenteAcoplado ? 1 : 0}
                            handleChange={handleChange}
                            value={values.patenteAcoplado}
                          />
                        </Box>
                      </HStack>
                    </Box>

                    <Divider />
                    <Box mb={8} h="90px" bg="white.200">
                      <h3>
                        <b>Datos del conductor:</b>
                      </h3>
                      <HStack spacing="5%">
                        <Box w="30%" h="10" bg="white.100">
                          <InputText
                            as={Input}
                            inputKey="dniConductor"
                            name="DNI Conductor"
                            type="text"
                            error={errors.dniConductor}
                            touched={touched.dniConductor ? 1 : 0}
                            handleChange={handleChange}
                            value={values.dniConductor}
                          />
                        </Box>
                        <Box w="30%" h="10" bg="white.100">
                          <InputText
                            as={Input}
                            inputKey="nombreConductor"
                            name="Nombre Conductor"
                            type="text"
                            error={errors.nombreConductor}
                            touched={touched.nombreConductor ? 1 : 0}
                            handleChange={handleChange}
                            value={values.nombreConductor}
                          />
                        </Box>
                        <Box w="30%" h="10" bg="white.100">
                          <InputText
                            as={Input}
                            inputKey="apellidoConductor"
                            name="Apellido Conductor"
                            type="text"
                            error={errors.apellidoConductor}
                            touched={touched.apellidoConductor ? 1 : 0}
                            handleChange={handleChange}
                            value={values.apellidoConductor}
                          />
                        </Box>
                      </HStack>
                    </Box>

                    <Divider />
                    <Box mb={8} h="100%" bg="white.200">
                      <h3>
                        <b>Combustible:</b>
                      </h3>
                      <HStack marginLeft={0} spacing="5%">
                        <VStack w="50%" spacing="5%">
                          <Box w="100%" h="10%" bg="white.100">
                            <FormControl
                              isInvalid={
                                !!errors.idProducto && touched.idProducto
                              }
                            >
                              <FormLabel htmlFor="idProducto">
                                Producto:
                              </FormLabel>
                              <AsyncSelect
                                id="idProducto"
                                name="idProducto"
                                placeholder="Seleccione producto"
                                onChange={({ value }) => {
                                  setFieldValue("idProducto", value);
                                  radioButtons.map((item) => {
                                    setFieldValue(item[0], undefined);
                                  });

                                  const idEtapa = 1; // Etapa Ingreso
                                  productoService
                                    .getAllProductos()
                                    .then((response) => {
                                      const producto = response.data.find(
                                        (element) => {
                                          return element.idProducto === value;
                                        }
                                      );
                                      if (value) {
                                        controlService
                                          .getControlByIdEtapaIdTipoProducto(
                                            idEtapa,
                                            producto.idTipoProducto
                                          )
                                          .then((response) => {
                                            if (response.status == 200) {
                                              const data = response.data.map(
                                                (item) => {
                                                  setFieldValue(
                                                    [
                                                      "control" +
                                                      item["idControl"],
                                                    ],
                                                    ""
                                                  );
                                                  const name =
                                                    "control" +
                                                    item["idControl"];
                                                  const label = item["texto"];
                                                  return [name, label];
                                                }
                                              );

                                              setRadioButtons(orderArray(data));
                                            }
                                          });
                                      }
                                    });
                                }}
                                touched={touched.idProducto ? 1 : 0}
                                defaultOptions={true}
                                loadOptions={(inputValue, callback) => {
                                  productoService
                                    .getAllProductos()
                                    .then((response) => {
                                      if (response.status == 200) {
                                        const data = response.data.map(
                                          (item) => {
                                            return {
                                              value: item.idProducto,
                                              label: item.nombre,
                                            };
                                          }
                                        );

                                        if (!inputValue) {
                                          callback(data);
                                        } else {
                                          const dataFiltered = data.filter(
                                            (i) =>
                                              i.label
                                                .toLowerCase()
                                                .includes(
                                                  inputValue.toLowerCase()
                                                )
                                          );
                                          callback(dataFiltered);
                                        }
                                      }
                                    });
                                }}
                              />
                              <FormErrorMessage>
                                {errors.idProducto}
                              </FormErrorMessage>
                            </FormControl>
                          </Box>
                          <Box w="100%" h="10%" bg="white.100">
                            <FormControl
                              isInvalid={
                                !!errors.idProveedor && touched.idProveedor
                              }
                            >
                              <FormLabel htmlFor="idProveedor">
                                Proveedor:
                              </FormLabel>
                              <AsyncSelect
                                // isMulti
                                id="idProveedor"
                                name="idProveedor"
                                placeholder="Seleccione proveedor"
                                onChange={(values) => {
                                  setFieldValue("idProveedor", values.value);
                                  if (proveedorEsProductor(values.value)) {
                                    setFieldValue("idProductor", values.value);
                                    setSelectedoptionProductor({
                                      value: values.value,
                                      label: values.label,
                                    });
                                  }
                                }}
                                touched={touched.idProveedor ? 1 : 0}
                                defaultOptions={true}
                                loadOptions={(inputValue, callback) => {
                                  proveedorService
                                    .getAllProveedores()
                                    .then((response) => {
                                      if (response.status == 200) {
                                        const data = response.data.map(
                                          (item) => {
                                            return {
                                              value: item.idProveedor,
                                              label: item.nombre,
                                            };
                                          }
                                        );
                                        if (!inputValue) {
                                          callback(data);
                                        } else {
                                          const dataFiltered = data.filter(
                                            (i) =>
                                              i.label
                                                .toLowerCase()
                                                .includes(
                                                  inputValue.toLowerCase()
                                                )
                                          );
                                          callback(dataFiltered);
                                        }
                                      }
                                    });
                                }}
                              />
                              <FormErrorMessage>
                                {errors.idProveedor}
                              </FormErrorMessage>
                            </FormControl>
                            {/* <Select size="sm" /> */}
                          </Box>
                          <Box w="100%" h="10%" bg="white.100">
                            <FormControl
                              isInvalid={
                                !!errors.idProductor && touched.idProductor
                              }
                            >
                              <FormLabel htmlFor="idProductor">
                                Productor:
                              </FormLabel>
                              <AsyncSelect
                                id="idProductor"
                                name="idProductor"
                                placeholder="Seleccione productor"
                                onChange={(values) => {
                                  setFieldValue("idProductor", values.value);
                                  setSelectedoptionProductor({
                                    value: values.value,
                                    label: values.label,
                                  });
                                }}
                                touched={touched.idProductor ? 1 : 0}
                                defaultOptions={true}
                                loadOptions={(inputValue, callback) => {
                                  proveedorService
                                    .getProveedoresQueSonProductores(true)
                                    .then((response) => {
                                      if (response.status == 200) {
                                        const data = response.data.map(
                                          (item) => {
                                            return {
                                              value: item.idProveedor,
                                              label: item.nombre,
                                            };
                                          }
                                        );
                                        setOptionsProductor(data);
                                        if (!inputValue) {
                                          callback(data);
                                        } else {
                                          const dataFiltered = data.filter(
                                            (i) =>
                                              i.label
                                                .toLowerCase()
                                                .includes(
                                                  inputValue.toLowerCase()
                                                )
                                          );
                                          callback(dataFiltered);
                                        }
                                      }
                                    });
                                }}
                                value={selectedoptionProductor}
                              />
                              <FormErrorMessage>
                                {errors.idProductor}
                              </FormErrorMessage>
                            </FormControl>
                          </Box>
                          <Box w="100%" h="10%" bg="white.100">
                            <FormControl
                              isInvalid={
                                !!errors.idTransportista &&
                                touched.idTransportista
                              }
                            >
                              <FormLabel htmlFor="idTransportista">
                                Transportista:
                              </FormLabel>
                              <AsyncSelect
                                id="idTransportista"
                                name="idTransportista"
                                placeholder="Seleccione transportista"
                                onChange={(values) => {
                                  setFieldValue(
                                    "idTransportista",
                                    values.value
                                  );
                                }}
                                touched={touched.idTransportista ? 1 : 0}
                                defaultOptions={true}
                                loadOptions={(inputValue, callback) => {
                                  transportistaService
                                    .getAllTransportistas()
                                    .then((response) => {
                                      if (response.status == 200) {
                                        const data = response.data.map(
                                          (item) => {
                                            return {
                                              value: item.idTransportista,
                                              label: item.nombre,
                                            };
                                          }
                                        );
                                        if (!inputValue) {
                                          callback(data);
                                        } else {
                                          const dataFiltered = data.filter(
                                            (i) =>
                                              i.label
                                                .toLowerCase()
                                                .includes(
                                                  inputValue.toLowerCase()
                                                )
                                          );
                                          callback(dataFiltered);
                                        }
                                      }
                                    });
                                }}
                              />
                              <FormErrorMessage>
                                {errors.idTransportista}
                              </FormErrorMessage>
                            </FormControl>
                          </Box>
                        </VStack>
                        <VStack w="50%" spacing="5%">
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
                          <Box w="100%" h="10%" bg="white.100">
                            <FormControl isInvalid={!!errors.idRemito && touched.idRemito}>
                              <FormLabel htmlFor="idRemito">Remito N°:</FormLabel>
                              <Input
                                as={InputMask}
                                name="idRemito"
                                type="text"
                                mask="9999R99999999"
                                maskChar={null}
                                onChange={handleChange}
                                touched={touched.idRemito ? 1 : 0}
                              />
                              <FormErrorMessage>{errors.idRemito}</FormErrorMessage>
                            </FormControl>
                          </Box>
                          <HStack w="100%">
                            <Box w="50%" h="10%" bg="white.100">
                              <FormControl
                                isInvalid={
                                  !!errors.cantSegunRemito &&
                                  touched.cantSegunRemito
                                }
                              >
                                <FormLabel htmlFor="cantSegunRemito">
                                  Cantidad según Remito:
                                </FormLabel>
                                <Field
                                  as={Input}
                                  id="cantSegunRemito"
                                  name="cantSegunRemito"
                                  type="text"
                                  variant="filled"
                                  onChange={handleChange}
                                />
                                <FormErrorMessage>
                                  {errors.cantSegunRemito}
                                </FormErrorMessage>
                              </FormControl>
                            </Box>
                            <Box w="50%" h="10%" bg="white.100">
                              <FormControl
                                isInvalid={
                                  !!errors.idUnidadMedida &&
                                  touched.idUnidadMedida
                                }
                              >
                                <FormLabel htmlFor="idUnidadMedida">
                                  Unidad:
                                </FormLabel>
                                <AsyncSelect
                                  id="idUnidadMedida"
                                  name="idUnidadMedida"
                                  placeholder="Seleccione unidad"
                                  onChange={(values) =>
                                    setFieldValue(
                                      "idUnidadMedida",
                                      values.value
                                    )
                                  }
                                  touched={touched.idUnidadMedida ? 1 : 0}
                                  defaultOptions={true}
                                  loadOptions={(inputValue, callback) => {
                                    unidadMedidaService
                                      .getAllUnidadesDeMedida()
                                      .then((response) => {
                                        if (response.status == 200) {
                                          const data = response.data.map(
                                            (item) => {
                                              return {
                                                value: item.idUnidadMedida,
                                                label: item.abreviatura,
                                              };
                                            }
                                          );
                                          if (!inputValue) {
                                            callback(data);
                                          } else {
                                            const dataFiltered = data.filter(
                                              (i) =>
                                                i.label
                                                  .toLowerCase()
                                                  .includes(
                                                    inputValue.toLowerCase()
                                                  )
                                            );
                                            callback(dataFiltered);
                                          }
                                        }
                                      });
                                  }}
                                />
                                <FormErrorMessage>
                                  {errors.idUnidadMedida}
                                </FormErrorMessage>
                              </FormControl>
                            </Box>
                          </HStack>
                          <Box w="100%" h="10%" bg="white.100">
                            <FormControl
                              isInvalid={
                                !!errors.idDestinatario &&
                                touched.idDestinatario
                              }
                            >
                              <FormLabel htmlFor="idDestinatario">
                                Destinatario:
                              </FormLabel>
                              <AsyncSelect
                                // isMulti
                                name="idDestinatario"
                                placeholder="Seleccione destinatario"
                                onChange={(values) =>
                                  setFieldValue("idDestinatario", values.value)
                                }
                                touched={touched.idDestinatario ? 1 : 0}
                                defaultOptions={true}
                                loadOptions={(inputValue, callback) => {
                                  destinatarioService
                                    .getAllDestinatarios()
                                    .then((response) => {
                                      if (response.status == 200) {
                                        const data = response.data.map(
                                          (item) => {
                                            return {
                                              value: item.idDestinatario,
                                              label: item.nombre,
                                            };
                                          }
                                        );
                                        if (!inputValue) {
                                          callback(data);
                                        } else {
                                          const dataFiltered = data.filter(
                                            (i) =>
                                              i.label
                                                .toLowerCase()
                                                .includes(
                                                  inputValue.toLowerCase()
                                                )
                                          );
                                          callback(dataFiltered);
                                        }
                                      }
                                    });
                                }}
                              />
                              <FormErrorMessage>
                                {errors.idDestinatario}
                              </FormErrorMessage>
                            </FormControl>
                          </Box>
                        </VStack>
                      </HStack>

                      <Divider mt={6} />
                    </Box>
                    <Box mb={0} h="100%" bg="white.200">
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
                                      touched={touched.key ? 1 : 0}
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
                    Ingresar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>

      <AlertDialogAceptCtm
        cancelRef={cancelRefIngreso}
        onCloseAlert={onCloseAlertIngreso}
        isOpenAlert={isOpenAlertIngreso}
        alertText={alertIngresoText}
        errorMode={true}
      />
    </>
  );
}
