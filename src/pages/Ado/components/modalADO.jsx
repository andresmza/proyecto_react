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
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  InputGroup,
  InputRightElement,
  Textarea,
  Spacer,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import { AsyncSelect } from "chakra-react-select";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {
  Formik,
  Form,
  Field,
  useFormikContext,
  useField,
} from "formik";
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
import AnexoADOService from "../../../services/AnexoADOService";
import { useAuth } from "../../../useAuth";
import ModalMotivosRechazo from "./modalMotivosRechazo";
import ReactPDF from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import TicketPesadaPdf from '../../../pdfReports/pages/TicketPesadaPdf';
import AnexoPdf from '../../../pdfReports/pages/AnexoPdf';
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";

const productoService = ProductoService.getInstance();
const controlService = ControlService.getInstance();
const proveedorService = ProveedorService.getInstance();
const transportistaService = TransportistaService.getInstance();
const unidadMedidaService = UnidadMedidaService.getInstance();
const destinatarioService = DestinatarioService.getInstance();
const anexoService = AnexoService.getInstance();
const conductorService = ConductorService.getInstance();
const anexoADOService = AnexoADOService.getInstance();

const COLOR_SCHEME = "teal";

const etapas = [
  "ADO",
  "Ingreso",
  "Análisis Químico",
  "Pesada Inicial",
  "Descarga de Combustible",
  "Pesada Final",
  "Egreso",
  "Salida Concretada",
];

function ListItem(props) {
  return (
    <li width="100%" height="strech">
      <Box
        style={{
          backgroundColor: "rgba(220, 219, 219, 0.8)",
          margin: "5px",
        }}
      >
        <InputGroup>
          <Box w="100%" align="right" pr="35px" mt="-1px">
            {props.value}
          </Box>
          <InputRightElement mt="-10px">
            <Button
              variant={"unstyled"}
              title="Eliminar"
            ></Button>
          </InputRightElement>
        </InputGroup>
      </Box>
    </li>
  );
}

export default function ModalADO({
  isOpen,
  onOpen,
  onClose,
  idAnexo,
  callbackModalFormIngresando,
  inputsDisabled,
  props,
}) {
  const [dataAnexo, setDataAnexo] = useState({});
  const [inputsModalFormIngresandoADO, setInputsModalFormIngresandoADO] =
    useState({
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
      idEtapaAPasar: -1,
      observaciones: "",
      motivosRechazo: [],
    });

  const [selectedOptionProducto, setSelectedOptionProducto] = useState("");
  const [selectedOptionProveedor, setSelectedOptionProveedor] = useState("");
  const [selectedOptionProductor, setSelectedOptionProductor] = useState("");
  const [selectedOptionTransportista, setSelectedOptionTransportista] =
    useState("");
  const [selectedOptionUnidadMedida, setSelectedOptionUnidadMedida] =
    useState("");
  const [selectedOptionDestinatario, setSelectedOptionDestinatario] =
    useState("");
  const [selectedOptionEtapaAPasar, setSelectedOptionEtapaAPasar] =
    useState("");
  const [ultimaEtapa, setUltimaEtapa] = useState("");
  const [motivosRechazo, setMotivosRechazo] = useState("");

  const [optionsProductor, setOptionsProductor] = useState([]);
  const [commentsByEtapa, setCommentsByEtapa] = useState("");
  const [radioButtonsIngreso, setRadioButtonsIngreso] = useState([]);
  const [radioButtonsLaboratorio, setRadioButtonsLaboratorio] = useState([]);
  const [radioButtonsPesajeEntrada, setRadioButtonsPesajeEntrada] = useState(
    []
  );
  const [radioButtonsDescargadero, setRadioButtonsDescargadero] = useState([]);
  const [radioButtonsPesajeSalida, setRadioButtonsPesajeSalida] = useState([]);
  const [radioButtonsEgreso, setRadioButtonsEgreso] = useState([]);
  const [precintosList, setPrecintosList] = useState([]);

  const [aceptButtondisabled, setAceptButtondisabled] = useState(true);

  const {
    isOpen: isOpenModalMotivosRechazo,
    onOpen: onOpenModalMotivosRechazo,
    onClose: onCloseModalMotivosRechazo,
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
    if (isOpen) {
      clearForm();
      const getDataAnexo = async () => {
        await anexoService.getAnexoADOByIdAnexo(idAnexo).then((response) => {
          const dataAnexo = response.data;
          setDataAnexo(dataAnexo);
          // console.log(dataAnexo);

          let comments = [];

          for (let index = 0; index < 8; index++) {
            dataAnexo.historialEstados.filter((x) => {
              if (x.idEtapa === index) {
                comments[index] = x.observacion;
              }
            });
          }

          setCommentsByEtapa(comments);

          setInputsModalFormIngresandoADO({
            idConductor: dataAnexo.conductor.idConductor,
            dniConductor: dataAnexo.conductor.dni,
            patenteCamion: dataAnexo.camion.patente,
            patenteAcoplado: dataAnexo.acoplado.patente,
            nombreConductor: dataAnexo.conductor.nombre,
            apellidoConductor: dataAnexo.conductor.apellido,
            idProducto: dataAnexo.producto.idProducto,
            idProveedor: dataAnexo.proveedor.idProveedor,
            idProductor: dataAnexo.productor.idProveedor,
            idTransportista: dataAnexo.transportista.idTransportista,
            idRemito: dataAnexo.nroRemito,
            idUnidadMedida: dataAnexo.idUnidadMedida,
            fechaHora: dataAnexo.fechaHoraIngreso,
            cantSegunRemito: dataAnexo.cantSegunRemito,
            idDestinatario: dataAnexo.idDestinatario,
            idEtapaAPasar: -1,
            observaciones: "",
            motivosRechazo: [],
          });

          setSelectedOptionProducto({
            value: dataAnexo.producto.idProducto,
            label: dataAnexo.producto.nombre,
          });

          setSelectedOptionProveedor({
            value: dataAnexo.proveedor.idProveedor,
            label: dataAnexo.proveedor.nombre,
          });

          setSelectedOptionProductor({
            value: dataAnexo.productor.idProveedor,
            label: dataAnexo.productor.nombre,
          });

          setSelectedOptionTransportista({
            value: dataAnexo.transportista.idTransportista,
            label: dataAnexo.transportista.nombre,
          });

          setPrecintosList(dataAnexo.precintos);

          unidadMedidaService.getAllUnidadesDeMedida().then((response) => {
            if (response.status == 200) {
              response.data.map((item) => {
                if (item.idUnidadMedida == dataAnexo.idUnidadMedida) {
                  setSelectedOptionUnidadMedida({
                    value: item.idUnidadMedida,
                    label: item.abreviatura,
                  });
                }
              });
            }
          });

          destinatarioService.getAllDestinatarios().then((response) => {
            if (response.status == 200) {
              response.data.map((item) => {
                if (item.idDestinatario == dataAnexo.idDestinatario) {
                  setSelectedOptionDestinatario({
                    value: item.idDestinatario,
                    label: item.nombre,
                  });
                }
              });
            }
          });
        });

        await controlService
          .getControlByIdEtapaIdTipoProducto(1, 1)
          .then((response) => {
            if (response.status == 200) {
              const data = response.data.map((item) => {
                // setFieldValue(["control" + item["idControl"]], "");
                const name = "control" + item["idControl"];
                const label = item["texto"];
                return [name, label];
              });

              setRadioButtonsIngreso(orderArray(data));
            }
          });

        await controlService
          .getControlByIdEtapaIdTipoProducto(2, 1)
          .then((response) => {
            if (response.status == 200) {
              const data = response.data.map((item) => {
                // setFieldValue(["control" + item["idControl"]], "");
                const name = "control" + item["idControl"];
                const label = item["texto"];
                return [name, label];
              });

              setRadioButtonsLaboratorio(orderArray(data));
            }
          });

        await controlService
          .getControlByIdEtapaIdTipoProducto(3, 1)
          .then((response) => {
            if (response.status == 200) {
              const data = response.data.map((item) => {
                // setFieldValue(["control" + item["idControl"]], "");
                const name = "control" + item["idControl"];
                const label = item["texto"];
                return [name, label];
              });

              setRadioButtonsPesajeEntrada(orderArray(data));
            }
          });

        await controlService
          .getControlByIdEtapaIdTipoProducto(4, 1)
          .then((response) => {
            if (response.status == 200) {
              const data = response.data.map((item) => {
                // setFieldValue(["control" + item["idControl"]], "");
                const name = "control" + item["idControl"];
                const label = item["texto"];
                return [name, label];
              });

              setRadioButtonsDescargadero(orderArray(data));
            }
          });

        await controlService
          .getControlByIdEtapaIdTipoProducto(5, 1)
          .then((response) => {
            if (response.status == 200) {
              const data = response.data.map((item) => {
                // setFieldValue(["control" + item["idControl"]], "");
                const name = "control" + item["idControl"];
                const label = item["texto"];
                return [name, label];
              });

              setRadioButtonsPesajeSalida(orderArray(data));
            }
          });

        await controlService
          .getControlByIdEtapaIdTipoProducto(6, 1)
          .then((response) => {
            if (response.status == 200) {
              const data = response.data.map((item) => {
                // setFieldValue(["control" + item["idControl"]], "");
                const name = "control" + item["idControl"];
                const label = item["texto"];
                return [name, label];
              });

              setRadioButtonsEgreso(orderArray(data));
            }
          });
      };

      getDataAnexo();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const ultimaEtapa =
        dataAnexo.historialEstados &&
        dataAnexo.historialEstados[dataAnexo.historialEstados.length - 1]
          .idEtapa;
      const idTipoProducto = dataAnexo.producto.idTipoProducto;

      anexoADOService
        .getTransicionEtapa(ultimaEtapa, idTipoProducto)
        .then((response) => {
          if (response.status == 200) {
            const data = response.data.map((item) => {
              // console.log(item);
              return {
                name: item.idEtapa,
                label: item.nombre,
              };
            });

            setUltimaEtapa(
              etapas[
              dataAnexo.historialEstados[
                dataAnexo.historialEstados.length - 1
              ].idEtapa
              ]
            );
            setSelectedOptionEtapaAPasar(data);
          }
        });

      anexoADOService.getMotivosRechazo().then((response) => {
        if (response.status == 200) {
          setMotivosRechazo(response.data);
        }
      });
    }
  }, [dataAnexo]);

  const { localStorageSession } = useAuth();
  const ingresarCamion = async (values) => {
    props.setIsLoading(true);
    const user = localStorageSession();

    let motivosRechazo = [];

    values.motivosRechazo.map((item, key) => {
      if (item) {
        motivosRechazo.push({ idMotivoRechazo: key });
      }
    });

    let anexoAdo = {
      idAnexo: dataAnexo.idAnexo,
      nroRemito: values.idRemito,
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
      idEtapaAPasar: parseInt(values.idEtapaAPasar),
      motivosRechazo: motivosRechazo,
    };

    let claves = Object.keys(values);
    for (const clave of claves) {
      if (clave.includes("control")) {
        anexoAdo.controles.push({
          idControl: parseInt(clave.replace("control", "")),
          valor: values[clave],
        });
      }
    }
    props.setIsLoading(false);
    await anexoADOService
      .updateAnexoADO(anexoAdo)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          callbackModalFormIngresando(response.data);
        } else {
          callbackModalFormIngresando("Ha ocurrido un problema al intentar autorizar el ingreso del camión.");
        }
      })
      .catch((error) => { });
    props.setIsLoading(false);
  };

  const clearForm = () => {
    setInputsModalFormIngresandoADO({
      ...inputsModalFormIngresandoADO,
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
      idEtapaAPasar: -1,
      observaciones: "",
    });
    setCommentsByEtapa(["", "", "", "", "", "", "", ""]);
  };

  const FormikContext = () => {
    const { initialValues, values, submitForm, handleChange, handleSubmit } =
      useFormikContext();
    useEffect(() => {
      if (values.dniConductor.length > 6 && values.dniConductor.length < 9) {
        conductorService
          .getCondutorByDni(values.dniConductor)
          .then((response) => {
            if (response.status == 200) {
              values.idConductor = response.data.idConductor;
              values.nombreConductor = response.data.nombre;
              values.apellidoConductor = response.data.apellido;
            }
          });
      }
    }, [values.dniConductor]);
    return null;
  };

  const MotivosRechazo = () => {
    const { values, submitForm, handleChange } = useFormikContext();

    if (values.idEtapaAPasar != -1) {
      return (
        <ModalMotivosRechazo
          isOpen={isOpenModalMotivosRechazo}
          onClose={onCloseModalMotivosRechazo}
          motivosRechazo={motivosRechazo}
          values={values}
          handleSubmit={submitForm}
          handleChange={handleChange}
        />
      );
    }
  };

  const DynamicRadioBtn = ({ label, ...props }) => {
    let valorControl = {};
    let yesChecked = false;
    let yesError = false;
    let noChecked = false;
    let noError = false;

    const idControl = props.name.substr(7);

    if (dataAnexo) {
      valorControl = dataAnexo.valorControls.find(
        (x) => x.idControl === parseInt(idControl)
      );
    }

    if (valorControl) {
      if (valorControl.valor == "sí") {
        yesChecked = true;
        if (valorControl.control.valorRechazoImplicito == "sí") yesError = true;
      }

      if (valorControl.valor == "no") {
        noChecked = true;
        if (valorControl.control.valorRechazoImplicito == "no") noError = true;
      }
    }

    const [field, meta, helpers] = useField(props);
    return (
      <RadioButton
        label={label}
        name={field.name}
        meta={meta}
        disabled={true}
        yesChecked={yesChecked}
        yesError={yesError}
        noChecked={noChecked}
        noError={noError}
      />
    );
  };

  const FormEtapaSiguiente = () => {
    const {
      initialValues,
      values,
      submitForm,
      handleChange,
      handleSubmit,
      errors,
      touched,
    } = useFormikContext();
    return (
      <>
        <HStack mt={0} marginLeft={0} spacing="10px">
          <Box w="20%" h="100%" bg="white.200">
            <h3>
              <b>Última etapa:</b>
            </h3>
          </Box>
          <Box w="20%" h="100%" bg="white.200">
            <InputText
              width="10%"
              as={Input}
              inputKey="etapaAnterior"
              type="text"
              error={errors.patenteCamion}
              touched={touched.patenteCamion ? 1 : 0}
              handleChange={handleChange}
              value={ultimaEtapa}
              readOnly={inputsDisabled}
            />
          </Box>
          <Spacer />
          <Box w="20%" h="100%" bg="white.200">
            <h3>
              <b>Etapa siguiente:</b>
            </h3>
          </Box>
          <Box w="40%" h="100%" bg="white.200">
            <FormControl isInvalid={errors.idEtapaAPasar}>
              <Field
                as="select"
                name="idEtapaAPasar"
                value={values.idEtapaAPasar}
              >
                <option value="-1" disabled>
                  Seleccione una opción
                </option>
                {selectedOptionEtapaAPasar &&
                  selectedOptionEtapaAPasar.map((item, key) => {
                    return (
                      <option key={key} value={item.name}>
                        {item.label}
                      </option>
                    );
                  })}
              </Field>
              <FormErrorMessage>{errors.idEtapaAPasar}</FormErrorMessage>
            </FormControl>
          </Box>
        </HStack>
        <HStack mt={0} marginLeft={0} spacing="10%">
          <Box mt={0} w="100%" h="100%" bg="white.200">
            <h3>
              <b>Observaciones:</b>
            </h3>
            <Box my={2} h="100%">
              <Textarea
                cols="100"
                rows="1"
                name="observaciones"
                as="textarea"
                readOnly={false}
                values={values.observaciones}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </HStack>
      </>
    );
  };

  const Precintos = () => {
    let data = "";
    if (dataAnexo.precintos) {
      data = dataAnexo.precintos.map((item, key) => {
        return item.nroPrecinto;
      });
    }
  };

  const closeForm = () => {
    setAceptButtondisabled(true);
    clearForm();
    onClose();
    setSelectedOptionEtapaAPasar([]);
    setUltimaEtapa("");
  };


  const [noTickets, setNoTickets] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const anexo = dataAnexo;
      if (!!anexo.ticketPesada && anexo.ticketPesada.length > 0) {
        setNoTickets(false);
      } else {
        setNoTickets(true);
      }
    }
  }, [dataAnexo]);

  const [redAlertText, setRedAlertText] = useState("");
  const cancelRefRedAlert = React.useRef();
  const {
    isOpen: isOpenRedAlert,
    onOpen: onOpenRedAlert,
    onClose: onCloseRedAlert,
  } = useDisclosure({ defaultIsOpen: false });

  const exportTicketPesadaToPDF = async () => {
    props.setIsLoading(true);

    const anexo = dataAnexo;

    let ultimoTicketPesada = null;
    if (!!anexo.ticketPesada && anexo.ticketPesada.length > 0) {
      ultimoTicketPesada = anexo.ticketPesada[anexo.ticketPesada.length - 1];

      await destinatarioService
        .getAllDestinatarios()
        .then(async (response) => {
          if (response.status == 200) {
            const destinatario = response.data.find(
              item => item.idDestinatario === anexo.idDestinatario
            );

            const ticketPesadaData = {
              section2: {
                patenteChasis: anexo.camion.patente,
                producto: anexo.producto.nombre,
                proveedor: anexo.proveedor.nombre,
                destinatario: destinatario.nombre,
                transportista: anexo.transportista.nombre,
                nombreConductor: anexo.conductor.apellido + " " + anexo.conductor.nombre,
                operadorEntrada: ultimoTicketPesada.apellidoUsuarioPesajeEntrada + " " + ultimoTicketPesada.nombreUsuarioPesajeEntrada,
                observacionesEntrada: anexo.historialEstados.find((estado) => estado.idEtapa === 4).observacion,
                patenteAcoplado: anexo.acoplado.patente,
                cuitProveedor: "",
                remitoProveedor: anexo.nroRemito,
                cuitDestinatario: "",
                cuitTransportista: "",
                operadorSalida: ultimoTicketPesada.apellidoUsuarioPesajeSalida + " " + ultimoTicketPesada.nombreUsuarioPesajeSalida,
                observacionesSalida: anexo.historialEstados.find((estado) => estado.idEtapa === 6).observacion,
              },
              section3: {
                pesoEntrada: ultimoTicketPesada.pesadaEntrada + " Kg " + (ultimoTicketPesada.pesadaManualEntrada ? "- PESADA MANUAL" : ""),
                pesoSalida: ultimoTicketPesada.pesadaSalida + " Kg " + (ultimoTicketPesada.pesadaManualSalida ? "- PESADA MANUAL" : ""),
                fechaEntrada: moment(ultimoTicketPesada.fechaHoraPesajeEntrada).format("DD-MM-YYYY"),
                fechaSalida: moment(ultimoTicketPesada.fechaHoraPesajeSalida).format("DD-MM-YYYY"),
                horaEntrada: moment(ultimoTicketPesada.fechaHoraPesajeEntrada).format("HH:mm") + " hrs",
                horaSalida: moment(ultimoTicketPesada.fechaHoraPesajeSalida).format("HH:mm") + " hrs",
              },
              section4: {
                pesoNeto: (ultimoTicketPesada.pesadaEntrada - ultimoTicketPesada.pesadaSalida) + " Kg ",
                copia: "ORIGINAL",
              }
            };

            const blob = await ReactPDF.pdf(
              <TicketPesadaPdf ticketPesadaData={ticketPesadaData} />
            ).toBlob();
            const fileName = "Ticket Pesada " + ultimoTicketPesada.nroTicket + ".pdf";
            saveAs(blob, fileName);
            const fileURL = URL.createObjectURL(blob);
            const pdfWindow2 = window.open();
            const iframe = document.createElement('iframe');
            const title = document.createElement('title');
            title.appendChild(document.createTextNode(fileName));
            iframe.src = fileURL;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.border = 'none';
            pdfWindow2.document.head.appendChild(title);
            pdfWindow2.document.body.appendChild(iframe);
            pdfWindow2.document.body.style.margin = 0;
            props.setIsLoading(false);
          }
        }).catch(() => {
          props.setIsLoading(false);
        }).finally(() => {
          props.setIsLoading(false);
        });

    } else {
      setRedAlertText("El camión todavía no tiene tickets de pesada.");
      onOpenRedAlert();
      props.setIsLoading(false);
    }
  };

  const exportAnexoToPDF = async () => {
    props.setIsLoading(true);

    const anexo = dataAnexo;
    let precintos = "";
    anexo.precintos.map((precinto, index) => {
      if (precinto.nroPrecinto) {
        let guion = index === 0 ? "" : " - ";
        precintos = precintos + guion + "N° " + precinto.nroPrecinto;
      }
    })

    await destinatarioService
      .getAllDestinatarios()
      .then(async (response) => {
        if (response.status == 200) {
          const destinatario = response.data.find(
            item => item.idDestinatario === anexo.idDestinatario
          );

          await controlService
            .getControlsForAllEtapasByIdTipoProducto(anexo.producto.idTipoProducto)
            .then(async (response2) => {
              if (response2.status == 200) {
                const cleanControls = response2.data;
                const anexoData = {
                  idAnexo: anexo.idAnexo,
                  nroAnexo: anexo.nroAnexo,
                  controls: anexo.valorControls,
                  cleanControls: cleanControls,
                  idTipoProducto: anexo.producto.idTipoProducto,
                  sectionEntrada: {
                    producto: anexo.producto.nombre,
                    proveedor: anexo.proveedor.nombre,
                    destinatario: destinatario.nombre,
                    transportista: anexo.transportista.nombre,
                    observaciones: anexo.historialEstados.find((estado) => estado.idEtapa === 2) !== undefined ? anexo.historialEstados.find((estado) => estado.idEtapa === 2).observacion : "",
                    numeroRemito: anexo.nroRemito,
                    verifico: anexo.usuarioIngreso,
                    fechaIngreso: moment(anexo.fechaHoraIngreso).format("DD-MM-YYYY"),
                    horaIngreso: moment(anexo.fechaHoraIngreso).format("HH:mm") + " hrs",
                  },
                  etapa3: {
                    observaciones: anexo.historialEstados.find((estado) => estado.idEtapa === 3) !== undefined ? anexo.historialEstados.find((estado) => estado.idEtapa === 3).observacion : "",
                    nombreLaboratorista: anexo.usuarioLaboratorio,
                    verifico: anexo.usuarioPesadaInicial,
                  },
                  etapa5: {
                    observaciones: anexo.historialEstados.find((estado) => estado.idEtapa === 5) !== undefined ? anexo.historialEstados.find((estado) => estado.idEtapa === 5).observacion : "",
                    precintos: precintos,
                    libero: anexo.usuarioDescargadero,
                  },
                  etapa6: {
                    observaciones: anexo.historialEstados.find((estado) => estado.idEtapa === 6) !== undefined ? anexo.historialEstados.find((estado) => estado.idEtapa === 6).observacion : "",
                    verifico: anexo.usuarioPesadaFinal,
                  },
                  etapa7: {
                    fechaEgreso: moment(anexo.fechaHoraEgreso).format("DD-MM-YYYY"),
                    horaEgreso: moment(anexo.fechaHoraEgreso).format("HH:mm") + " hrs",
                    observaciones: anexo.historialEstados.find((estado) => estado.idEtapa === 7) !== undefined ? anexo.historialEstados.find((estado) => estado.idEtapa === 7).observacion : "",
                    verifico: anexo.usuarioEgreso,
                  },
                };
                const blob = await ReactPDF.pdf(
                  <AnexoPdf anexoData={anexoData} />
                ).toBlob();
                const fileName = "Anexo " + anexo.nroAnexo + ".pdf";
                saveAs(blob, fileName);
                const fileURL = URL.createObjectURL(blob);
                const pdfWindow2 = window.open();
                const iframe = document.createElement('iframe');
                const title = document.createElement('title');
                title.appendChild(document.createTextNode(fileName));
                iframe.src = fileURL;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.style.border = 'none';
                pdfWindow2.document.head.appendChild(title);
                pdfWindow2.document.body.appendChild(iframe);
                pdfWindow2.document.body.style.margin = 0;
                props.setIsLoading(false);
              }
            }).catch(() => {
              props.setIsLoading(false);
            }).finally(() => {
              props.setIsLoading(false);
            });
        }
      }).catch(() => {
        props.setIsLoading(false);
      }).finally(() => {
        props.setIsLoading(false);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...inputsModalFormIngresandoADO,
          }}
          validate={(valores) => {
            let errores = {};

            // Validacion estapa a pasar
            if (valores.idEtapaAPasar == -1 && inputsDisabled) {
              errores.idEtapaAPasar = "Por favor seleccione una opción.";
            }

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
              errores.idRemito =
                "Complete el campo con el siguiente formato 1234R12345678.";
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

            // Validaciones radioButtonsIngreso
            // radioButtonsIngreso.map((item) => {
            //   if (!valores[item[0]]) {
            //     errores[item[0]] = "Por favor seleccione una opción.";
            //   }
            // });
            // console.log(JSON.stringify(errores));
            if (JSON.stringify(errores) == "{}" || errores === undefined) {
              setAceptButtondisabled(false);
            } else {
              setAceptButtondisabled(true);
            }

            return errores;
          }}
          onSubmit={(values, { resetForm }) => {
            // console.log("submit");
            // console.log(values);
            // console.log(values.motivosRechazo.length);
            // callbackModalFormIngresando("PROBANDO");
            // debugger
            if (
              values.idEtapaAPasar == 0 &&
              values.motivosRechazo.length == 0
            ) {
              onOpenModalMotivosRechazo();
            } else {
              ingresarCamion(values);
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
            <Form onSubmit={handleSubmit}>
              <FormikContext />
              <MotivosRechazo />
              <ModalContent h="50rem" maxW="60rem" scrollBehavior="outside">
                <ModalHeader>
                  Ingresando a Administración del Operativo
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {!inputsDisabled && <FormEtapaSiguiente />}
                  <Tabs isManual={true} variant="enclosed">
                    <TabList>
                      <Tab _selected={{ color: "white", bg: "blue.400" }}>
                        Ingreso
                      </Tab>
                      <Tab _selected={{ color: "white", bg: "blue.400" }}>
                        Laboratorio
                      </Tab>
                      <Tab _selected={{ color: "white", bg: "blue.400" }}>
                        Pesaje Entrada
                      </Tab>
                      <Tab _selected={{ color: "white", bg: "blue.400" }}>
                        Descargadero
                      </Tab>
                      <Tab _selected={{ color: "white", bg: "blue.400" }}>
                        Pesaje Salida
                      </Tab>
                      <Tab _selected={{ color: "white", bg: "blue.400" }}>
                        Egreso
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
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
                                  readOnly={inputsDisabled}
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
                                  readOnly={inputsDisabled}
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
                                  readOnly={inputsDisabled}
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
                                  readOnly={inputsDisabled}
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
                                  readOnly={inputsDisabled}
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
                                      isDisabled={inputsDisabled}
                                      onChange={({ value, label }) => {
                                        setFieldValue("idProducto", value);
                                        radioButtonsIngreso.map((item) => {
                                          setFieldValue(item[0], undefined);
                                        });

                                        setSelectedOptionProducto({
                                          value: value,
                                          label: label,
                                        });

                                        const idEtapa = 1; // Etapa Ingreso
                                        productoService
                                          .getAllProductos()
                                          .then((response) => {
                                            const producto = response.data.find(
                                              (element) => {
                                                return (
                                                  element.idProducto === value
                                                );
                                              }
                                            );
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
                                                const dataFiltered =
                                                  data.filter((i) =>
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
                                      value={selectedOptionProducto}
                                    />
                                    <FormErrorMessage>
                                      {errors.idProducto}
                                    </FormErrorMessage>
                                  </FormControl>
                                </Box>
                                <Box w="100%" h="10%" bg="white.100">
                                  <FormControl
                                    isInvalid={
                                      !!errors.idProveedor &&
                                      touched.idProveedor
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
                                      isDisabled={inputsDisabled}
                                      onChange={({ value, label }) => {
                                        setFieldValue("idProveedor", value);
                                        setSelectedOptionProveedor({
                                          value: value,
                                          label: label,
                                        });

                                        if (proveedorEsProductor(value)) {
                                          setFieldValue("idProductor", value);
                                          setSelectedOptionProductor({
                                            value: value,
                                            label: label,
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
                                                const dataFiltered =
                                                  data.filter((i) =>
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
                                      value={selectedOptionProveedor}
                                    />
                                    <FormErrorMessage>
                                      {errors.idProveedor}
                                    </FormErrorMessage>
                                  </FormControl>
                                </Box>
                                <Box w="100%" h="10%" bg="white.100">
                                  <FormControl
                                    isInvalid={
                                      !!errors.idProductor &&
                                      touched.idProductor
                                    }
                                  >
                                    <FormLabel htmlFor="idProductor">
                                      Productor:
                                    </FormLabel>
                                    <AsyncSelect
                                      // size='sm'
                                      id="idProductor"
                                      name="idProductor"
                                      placeholder="Seleccione productor"
                                      isDisabled={inputsDisabled}
                                      onChange={({ value, label }) => {
                                        setFieldValue("idProductor", value);
                                        setSelectedOptionProductor({
                                          value: value,
                                          label: label,
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
                                                const dataFiltered =
                                                  data.filter((i) =>
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
                                      value={selectedOptionProductor}
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
                                      isDisabled={inputsDisabled}
                                      onChange={({ value, label }) => {
                                        setFieldValue("idTransportista", value);
                                        setSelectedOptionTransportista({
                                          value: value,
                                          label: label,
                                        });
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
                                                const dataFiltered =
                                                  data.filter((i) =>
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
                                      value={selectedOptionTransportista}
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
                                    value={moment(
                                      dataAnexo.fechaHoraIngreso
                                    ).format("DD-MM-YYYY HH:mm")}
                                    readOnly={true}
                                  />
                                </Box>
                                <Box w="100%" h="10%" bg="white.100">
                                  <FormControl
                                    isInvalid={
                                      !!errors.idRemito && touched.idRemito
                                    }
                                  >
                                    <FormLabel htmlFor="idRemito">
                                      Remito N°:
                                    </FormLabel>
                                    <Input
                                      as={InputMask}
                                      name="idRemito"
                                      type="text"
                                      mask="9999R99999999"
                                      maskChar={null}
                                      onChange={handleChange}
                                      touched={touched.idRemito ? 1 : 0}
                                      value={values.idRemito}
                                      readOnly={inputsDisabled}
                                    />
                                    <FormErrorMessage>
                                      {errors.idRemito}
                                    </FormErrorMessage>
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
                                        readOnly={inputsDisabled}
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
                                        isDisabled={inputsDisabled}
                                        onChange={({ value, label }) => {
                                          setFieldValue(
                                            "idUnidadMedida",
                                            value
                                          );
                                          setSelectedOptionUnidadMedida({
                                            value: value,
                                            label: label,
                                          });
                                        }}
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
                                                      value:
                                                        item.idUnidadMedida,
                                                      label: item.abreviatura,
                                                    };
                                                  }
                                                );
                                                if (!inputValue) {
                                                  callback(data);
                                                } else {
                                                  const dataFiltered =
                                                    data.filter((i) =>
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
                                        value={selectedOptionUnidadMedida}
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
                                      isDisabled={inputsDisabled}
                                      onChange={({ value, label }) => {
                                        setFieldValue("idDestinatario", value);
                                        setSelectedOptionDestinatario({
                                          value: value,
                                          label: label,
                                        });
                                      }}
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
                                                const dataFiltered =
                                                  data.filter((i) =>
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
                                      value={selectedOptionDestinatario}
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
                                  <Grid
                                    templateColumns="repeat(2, 1fr)"
                                    gap={3}
                                  >
                                    {radioButtonsIngreso.map((item, key) => {
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
                                <Textarea
                                  cols="100"
                                  rows="3"
                                  name="observaciones2"
                                  as="textarea"
                                  placeholder=""
                                  readOnly={true}
                                  value={commentsByEtapa[2]}
                                />
                              </Box>
                            </Box>
                          </HStack>
                        </VStack>
                      </TabPanel>
                      <TabPanel>
                        <Box mb={0} h="100%" bg="white.200">
                          <h3>
                            <b>Laboratorio:</b>
                          </h3>
                          <Divider mt={6} />
                          <HStack mt={4} marginLeft={0} spacing="10%">
                            <VStack w="100%" spacing="1%">
                              <Box w="100%" h="10%" bg="white.100">
                                <h3>
                                  <b>Controles:</b>
                                </h3>
                                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                  {radioButtonsLaboratorio.map((item, key) => {
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
                          <HStack mt={0} marginLeft={0} spacing="10%">
                            <Box mt={4} w="100%" h="100%" bg="white.200">
                              <h3>
                                <b>Observaciones:</b>
                              </h3>
                              <Box mb={0} h="100%" bg="white.200">
                                <Textarea
                                  cols="100"
                                  rows="3"
                                  name="observaciones3"
                                  as="textarea"
                                  readOnly={true}
                                  value={commentsByEtapa[3]}
                                />
                              </Box>
                            </Box>
                          </HStack>
                          <Divider mt={6} />
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Box mb={0} h="100%" bg="white.200">
                          <h3>
                            <b>Verificaciones:</b>
                          </h3>
                          <Divider mt={6} />
                          <HStack mt={4} marginLeft={0} spacing="10%">
                            <VStack w="100%" spacing="1%">
                              <Box w="100%" h="10%" bg="white.100">
                                <h3>
                                  <b>Controles:</b>
                                </h3>
                                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                  {radioButtonsPesajeEntrada.map(
                                    (item, key) => {
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
                                    }
                                  )}
                                </Grid>
                              </Box>
                            </VStack>
                          </HStack>
                          <Divider mt={6} />
                          <HStack mt={0} marginLeft={0} spacing="10%">
                            <Box mt={4} w="100%" h="100%" bg="white.200">
                              <h3>
                                <b>Observaciones:</b>
                              </h3>
                              <Box mb={0} h="100%" bg="white.200">
                                <Textarea
                                  cols="100"
                                  rows="3"
                                  name="observaciones4"
                                  as="textarea"
                                  readOnly={true}
                                  value={commentsByEtapa[4]}
                                />
                              </Box>
                            </Box>
                          </HStack>
                          <Divider mt={6} />
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Box mb={0} h="100%" bg="white.200">
                          <h3>
                            <b>Descargadero:</b>
                          </h3>
                          <Divider mt={6} />
                          <HStack mt={4} marginLeft={0} spacing="10%">
                            <VStack w="100%" spacing="1%">
                              <Box w="100%" h="10%" bg="white.100">
                                <h3>
                                  <b>Controles:</b>
                                </h3>
                                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                  {radioButtonsDescargadero.map((item, key) => {
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

                          <HStack alignItems="start" w="100%" mt={4}>
                            {/* <VStack w="50%" spacing="5%"> */}
                            <Box mt={0} h="30px" bg="white.200" align="stretch">
                              <h3>
                                <b>
                                  Precintos que abre el responsable de la
                                  descarga:
                                </b>
                              </h3>
                            </Box>
                            {/* </VStack> */}
                            {/* <VStack w="50%" spacing="5%"> */}

                            <Box w="50%" h="100%">
                              {/* <PrecintoList h="100%" precintosList={dataAnexo.precintos} /> */}

                              <Box height="200px" mb={4}>
                                <VStack spacing="0%" h="100%">
                                  <Box
                                    border="1px solid"
                                    borderColor={COLOR_SCHEME}
                                    w="50%"
                                    align="center"
                                  >
                                    <b>Precintos Cargados</b>
                                  </Box>
                                  <Box
                                    borderBottom="1px solid"
                                    borderRight="1px solid"
                                    borderLeft="1px solid"
                                    borderColor={COLOR_SCHEME}
                                    width="50%"
                                    height="100%"
                                    overflowY="scroll"
                                  >
                                    <ul align="center">
                                      {precintosList.map(
                                        (number, key) =>
                                          number.nroPrecinto && (
                                            <ListItem
                                              key={key}
                                              value={number.nroPrecinto}
                                            />
                                          )
                                      )}
                                    </ul>
                                  </Box>
                                </VStack>
                              </Box>
                            </Box>
                          </HStack>
                          <Divider mt={6} />
                          <HStack mt={0} marginLeft={0} spacing="10%">
                            <Box mt={4} w="100%" h="100%" bg="white.200">
                              <h3>
                                <b>Observaciones:</b>
                              </h3>
                              <Box mb={0} h="100%" bg="white.200">
                                <Textarea
                                  cols="100"
                                  rows="3"
                                  name="observaciones5"
                                  as="textarea"
                                  readOnly={true}
                                  value={commentsByEtapa[5]}
                                />
                              </Box>
                            </Box>
                          </HStack>
                          <Divider mt={6} />
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Box mb={0} h="100%" bg="white.200">
                          <h3>
                            <b>Pesaje de salida:</b>
                          </h3>
                          <Divider mt={6} />
                          <HStack mt={4} marginLeft={0} spacing="10%">
                            <VStack w="100%" spacing="1%">
                              <Box w="100%" h="10%" bg="white.100">
                                <h3>
                                  <b>Controles:</b>
                                </h3>
                                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                  {radioButtonsPesajeSalida.map((item, key) => {
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
                          <HStack mt={0} marginLeft={0} spacing="10%">
                            <Box mt={4} w="100%" h="100%" bg="white.200">
                              <h3>
                                <b>Observaciones:</b>
                              </h3>
                              <Box mb={0} h="100%" bg="white.200">
                                <Textarea
                                  cols="100"
                                  rows="3"
                                  name="observaciones6"
                                  as="textarea"
                                  readOnly={true}
                                  value={commentsByEtapa[6]}
                                />
                              </Box>
                            </Box>
                          </HStack>
                          <Divider mt={6} />
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Box mb={0} h="100%" bg="white.200">
                          <h3>
                            <b>Egreso:</b>
                          </h3>
                          <Divider mt={6} />
                          <HStack mt={4} marginLeft={0} spacing="10%">
                            <VStack w="100%" spacing="1%">
                              <Box w="100%" h="10%" bg="white.100">
                                <h3>
                                  <b>Controles:</b>
                                </h3>
                                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                  {radioButtonsEgreso.map((item, key) => {
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
                          <HStack mt={0} marginLeft={0} spacing="10%">
                            <Box mt={4} w="100%" h="100%" bg="white.200">
                              <h3>
                                <b>Observaciones:</b>
                              </h3>
                              <Box mb={0} h="100%" bg="white.200">
                                <Textarea
                                  cols="100"
                                  rows="3"
                                  name="observaciones7"
                                  as="textarea"
                                  readOnly={true}
                                  value={commentsByEtapa[7]}
                                />
                              </Box>
                            </Box>
                          </HStack>
                          <Divider mt={6} />
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={exportAnexoToPDF}>
                    Imprimir Anexo
                  </Button>
                  <Button colorScheme={noTickets ? "gray" : "blue"} mr={3} onClick={exportTicketPesadaToPDF}>
                    Imprimir Ticket Pesada
                  </Button>
                  <Button colorScheme="blue" mr={3} onClick={closeForm}>
                    Cerrar
                  </Button>

                  {!inputsDisabled && (
                    <Button
                      type="submit"
                      colorScheme={COLOR_SCHEME}
                      width="10ch"
                      disabled={false}
                    >
                      Aceptar
                    </Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>

      <AlertDialogAceptCtm
        cancelRef={cancelRefRedAlert}
        onCloseAlert={onCloseRedAlert}
        isOpenAlert={isOpenRedAlert}
        alertText={redAlertText}
      />
    </>
  );
}
