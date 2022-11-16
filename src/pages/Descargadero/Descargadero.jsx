import Header from "../Header";
import {
  Box,
  Heading,
  HStack,
  useDisclosure,
  Text,
  Icon,
} from "@chakra-ui/react";
import Tabla from "../../components/table";
import React, { useState, useEffect } from "react";
import DataTableService from "../../services/DataTableService";
import AnexoService from "../../services/AnexoService";
import { AlertDialogAceptCtm } from "../../components/AlertDialogAceptCtm";
import ModalFormsDescargaderoCtm from "./components/modalFormsDescargaderoCtm";

const CircleIcon = (props) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

const dataTableService = DataTableService.getInstance();
const anexoService = AnexoService.getInstance();

let columnsIngresoDescargadero = [];
let columnsAutorizacionDescargadero = [];

const customOptionsDescargadero = {
  tableBodyHeight: "75vh",
  tableBodyWidth: ""
};

const customOptionsAutorizaciones = {
  tableBodyHeight: "75vh",
  tableBodyWidth: ""
};

const Descargadero = (props) => {
  // Contexto Ingreso Descargadero
  const [datosIngresoDescargadero, setDatosIngresoDescargadero] = useState([]);
  const {
    isOpen: isOpenModalFormIngresoDescargadero,
    onOpen: onOpenModalFormIngresoDescargadero,
    onClose: onCloseModalFormIngresoDescargadero,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertIngresoDescargaderoText, setAlertIngresoDescargaderoText] = useState("");
  const cancelRefIngresoDescargadero = React.useRef();
  const {
    isOpen: isOpenAlertIngresoDescargadero,
    onOpen: onOpenAlertIngresoDescargadero,
    onClose: onCloseAlertIngresoDescargadero,
  } = useDisclosure({ defaultIsOpen: false });

  const [valuesForFormIngresoDescargadero, setvaluesForFormIngresoDescargadero] = useState({});

  const [loadingTablaIngresoDescargadero, setLoadingTablaIngresoDescargadero] = useState(false);

  // Contexto Autorizacion Descargadero
  const [datosAutorizacionDescargadero, setDatosAutorizacionDescargadero] = useState([]);
  const {
    isOpen: isOpenModalFormAutorizacionDescargadero,
    onOpen: onOpenModalFormAutorizacionDescargadero,
    onClose: onCloseModalFormAutorizacionDescargadero,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertAutorizacionDescargaderoText, setAlertAutorizacionDescargaderoText] = useState("");
  const cancelRefAutorizacionDescargadero = React.useRef();
  const {
    isOpen: isOpenAlertAutorizacionDescargadero,
    onOpen: onOpenAlertAutorizacionDescargadero,
    onClose: onCloseAlertAutorizacionDescargadero,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertCerrarText, setAlertCerrarText] = useState("");
  const cancelRefCerrar = React.useRef();
  const {
    isOpen: isOpenAlertCerrar,
    onOpen: onOpenAlertCerrar,
    onClose: onCloseAlertCerrar,
  } = useDisclosure({ defaultIsOpen: false });

  const [valuesForFormAutorizacionDescargadero, setvaluesForFormAutorizacionDescargadero] = useState({});

  const [loadingTablaAutorizacionDescargadero, setLoadingTablaAutorizacionDescargadero] = useState(false);

  //Ingreso Descargadero
  //Columnas tabla
  columnsIngresoDescargadero = [
    {
      name: "",
      label: "",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === "Rojo") {
            return (
              <CircleIcon color="#C53030" />
            );
          }
          if (value === "Verde") {
            return (
              <CircleIcon color="#2F855A" />
            );
          } else {
            return (
              <CircleIcon color="#B7791F" />
            );
          }
        },
      },
    },
    { name: "Patente", options: { filterOptions: { fullWidth: true } } },
    "Conductor",
    "Producto",
    "Proveedor",
    "Productor",
    "Transportista",
    {
      name: "Acción",
      label: "Acción",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <button
                variant="link"
                onClick={() => {
                  tableMeta.rowData[12].accion == 'Abrir' &&  handleAbrirFormIngresoDescargaderoButtonClick(tableMeta.rowData[12])
                  tableMeta.rowData[12].accion == 'Cerrar' &&  cerrarAnexo(tableMeta.rowData[12].idAnexo, tableMeta.rowData[12].accionCerrarIdEtapa)
                }}
              >
                <Text color="blue">
                  {tableMeta.rowData[12].accion}
                </Text>
              </button>
            );
        },
      },
    },
    { name: "patenteAcoplado", options: { display: false } },
    { name: "dniConductor", options: { display: false } },
    { name: "fechaIngreso", options: { display: false } },
    { name: "estado", options: { display: false } },
    { name: "object", options: { display: false } },
  ];

  // Abrir Form Ingreso Descargadero
  const handleAbrirFormIngresoDescargaderoButtonClick = (tableMeta) => {
    setvaluesForFormIngresoDescargadero(tableMeta);
    onOpenModalFormIngresoDescargadero();
  };

  // Llenar grilla Ingreso Descargadero
  const getDataIngresoDescargadero = async () => {
    let datos = [];
    setLoadingTablaIngresoDescargadero(true);
    await dataTableService.getDataTable(props.idPuesto, 1).then((response) => { // idPuesto 4 es Descargadero, 8 es Descargadero Cruz de Piedra
      response.data.map((registro) => {
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.apellido + " " + registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
          registro.productor.nombre,
          registro.transportista.nombre,
          registro.idAnexo,
          registro.acoplado.patente,
          registro.conductor.dni,
          registro.fechaHoraIngreso,
          registro.etapa,
          registro,
        ]);
        return datos;
      });
    });
    setDatosIngresoDescargadero(datos);
    setLoadingTablaIngresoDescargadero(false);
  };

  // POST Formulario Ingreso Descargadero
  const callbackModalFormIngresoDescargadero = (mensaje) => {
    setAlertIngresoDescargaderoText(mensaje);
    onOpenAlertIngresoDescargadero();
    getDataIngresoDescargadero();
  };

  //Autorizacion Descargadero
  //Columnas tabla
  columnsAutorizacionDescargadero = [
    {
      name: "",
      label: "",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === "Rojo") {
            return (
              <CircleIcon color="#C53030" />
            );
          }
          if (value === "Verde") {
            return (
              <CircleIcon color="#2F855A" />
            );
          } else {
            return (
              <CircleIcon color="#B7791F" />
            );
          }
        },
      },
    },
    { name: "Patente", options: { filterOptions: { fullWidth: true } } },
    "Conductor",
    "Producto",
    "Proveedor",
    "Productor",
    "Transportista",
    {
      name: "Acción",
      label: "Acción",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <button
                variant="link"
                onClick={() => {
                  tableMeta.rowData[12].accion == 'Abrir' &&  handleAbrirFormAutorizacionDescargaderoButtonClick(tableMeta.rowData[12])
                  tableMeta.rowData[12].accion == 'Cerrar' &&  cerrarAnexo(tableMeta.rowData[12].idAnexo, tableMeta.rowData[12].accionCerrarIdEtapa)
                }}
              >
                <Text color="blue">
                  {tableMeta.rowData[12].accion}
                </Text>
              </button>
            );
        },
      },
    },
    { name: "patenteAcoplado", options: { display: false } },
    { name: "dniConductor", options: { display: false } },
    { name: "fechaIngreso", options: { display: false } },
    { name: "estado", options: { display: false } },
    { name: "object", options: { display: false } },
  ];

  // Abrir Form Autorizacion Descargadero
  const handleAbrirFormAutorizacionDescargaderoButtonClick = (tableMeta) => {
    setvaluesForFormAutorizacionDescargadero(tableMeta);
    onOpenModalFormAutorizacionDescargadero();
  };

  // Llenar grilla Autorizacion Descargadero
  const getDataAutorizacionDescargadero = async () => {
    let datos = [];
    setLoadingTablaAutorizacionDescargadero(true);
    await dataTableService.getDataTable(props.idPuesto, 2).then((response) => { // idPuesto 4 es Descargadero, 8 es Descargadero Cruz de Piedra
      response.data.map((registro) => {
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.apellido + " " + registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
          registro.productor.nombre,
          registro.transportista.nombre,
          registro.idAnexo,
          registro.acoplado.patente,
          registro.conductor.dni,
          registro.fechaHoraIngreso,
          registro.etapa,
          registro,
        ]);
        return datos;
      });
    });
    setDatosAutorizacionDescargadero(datos);
    setLoadingTablaAutorizacionDescargadero(false);
  };

  const cerrarAnexo = async (idAnexo, accionCerrarIdEtapa) => {
    await anexoService.cerrarAnexo(idAnexo, accionCerrarIdEtapa).then((response) => {
        if (response.status == 200 || response.status == 201) {
          setAlertCerrarText(response.data);
          onOpenAlertCerrar();
          getDataIngresoDescargadero();
          getDataAutorizacionDescargadero();
        } else {
          setAlertCerrarText(response.error.message);
          onOpenAlertCerrar();
        }
    });
  }

  // POST Formulario Autorizacion Descargadero
  const callbackModalFormAutorizacionDescargadero = (mensaje) => {
    setAlertAutorizacionDescargaderoText(mensaje);
    onOpenAlertAutorizacionDescargadero();
    getDataAutorizacionDescargadero();
  };

  useEffect(() => {
    getDataIngresoDescargadero();
    getDataAutorizacionDescargadero();
  }, []);

  return (
    <>
      <Header rol={props.puestoDescargadero} />
      <Box flexDirection="row" w="full" h="full" align="center">
        <Box flexDirection="column" w="full" align="center" pl={5} pr={5}>
          <Box flexDirection="row" w="full">
            <HStack spacing="2%">
              <Box w="100%" border="2px" borderColor="teal" title="Ingresando a Descargadero">
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="220px"
                    size="SM"
                  >
                    Ingresando a Descargadero
                  </Heading>

                  {datosIngresoDescargadero && (
                    <Tabla
                      dataTable={datosIngresoDescargadero}
                      title="Ingresando a Descargadero"
                      columns={columnsIngresoDescargadero}
                      loading={loadingTablaIngresoDescargadero}
                      customOptions={customOptionsDescargadero}
                    />
                  )}
                  <ModalFormsDescargaderoCtm
                    isOpen={isOpenModalFormIngresoDescargadero}
                    onClose={onCloseModalFormIngresoDescargadero}
                    formValues={valuesForFormIngresoDescargadero}
                    callbackModalFormDescarga={callbackModalFormIngresoDescargadero}
                    props={props}
                    title="Nueva Ingreso a Descargadero"
                    idEtapa={4} //idEtapa 4 es Descarga de Combustible
                  />
                </Box>
              </Box>

              <Box
                w="100%"
                border="2px"
                borderColor="teal"
                title="Autorizaciones de Descarga"
              >
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="220px"
                    size="SM"
                  >
                    Autorizaciones de Descarga
                  </Heading>
                  {datosAutorizacionDescargadero && (
                    <Tabla
                      dataTable={datosAutorizacionDescargadero}
                      title="Autorizaciones de Descarga"
                      columns={columnsAutorizacionDescargadero}
                      loading={loadingTablaAutorizacionDescargadero}
                      customOptions={customOptionsAutorizaciones}
                    />
                  )}
                  <ModalFormsDescargaderoCtm
                    isOpen={isOpenModalFormAutorizacionDescargadero}
                    onClose={onCloseModalFormAutorizacionDescargadero}
                    formValues={valuesForFormAutorizacionDescargadero}
                    callbackModalFormDescarga={callbackModalFormAutorizacionDescargadero}
                    props={props}
                    title="Nueva Autorizacion de Descarga"
                    //TODO: Creo que esto no es con idEtapa 4
                    idEtapa={4} //idEtapa 4 es Descarga de Combustible
                  />
                </Box>
              </Box>
            </HStack>
          </Box>
        </Box>
      </Box>

      <AlertDialogAceptCtm
        cancelRef={cancelRefIngresoDescargadero}
        onCloseAlert={onCloseAlertIngresoDescargadero}
        isOpenAlert={isOpenAlertIngresoDescargadero}
        alertText={alertIngresoDescargaderoText}
      />

      <AlertDialogAceptCtm
        cancelRef={cancelRefAutorizacionDescargadero}
        onCloseAlert={onCloseAlertAutorizacionDescargadero}
        isOpenAlert={isOpenAlertAutorizacionDescargadero}
        alertText={alertAutorizacionDescargaderoText}
      />

<AlertDialogAceptCtm
        cancelRef={cancelRefCerrar}
        onCloseAlert={onCloseAlertCerrar}
        isOpenAlert={isOpenAlertCerrar}
        alertText={alertCerrarText}
        errorMode={false}
      />
    </>
  );
};

export default Descargadero;
