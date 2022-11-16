import Header from "../Header";
import SearchFormIngreso from "./components/searchFormIngreso";
import {
  Box,
  Heading,
  HStack,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogContent,
  Flex,
  Button,
  Icon,
} from "@chakra-ui/react";
import Tabla from "../../components/table";
import DataTableService from "../../services/DataTableService";
import AnexoService from "../../services/AnexoService";
import React, { useState, useEffect } from "react";
import ModalFormSalida from "./components/modalFormSalida";
import ModalFormAutorizacionesIngreso from "./components/modalFormAutorizacionesIngreso";
import { AlertDialogAceptCtm } from "../../components/AlertDialogAceptCtm";

const CircleIcon = (props) => (
  <Icon viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

const dataTableService = DataTableService.getInstance();
const anexoService = AnexoService.getInstance();

let columnsSalida = [];
let columnsAutorizaciones = [];

const customOptionsSalida = {
  tableBodyHeight: "50vh",
  tableBodyWidth: "",
};
const customOptionsAutorizaciones = {
  tableBodyHeight: "50vh",
  tableBodyWidth: "",
};

const IngresoEgreso = (props) => {
  const [datosSalida, setDatosSalida] = useState([]);
  const [datosAutorizaciones, setDatosAutorizaciones] = useState([]);
  const {
    isOpen: isOpenModalFormSalida,
    onOpen: onOpenModalFormSalida,
    onClose: onCloseModalFormSalida,
  } = useDisclosure({ defaultIsOpen: false });

  const [valuesForFormSalida, setvaluesForFormSalida] = useState({});
  const {
    isOpen: isOpenModalFormAutorizacionIngreso,
    onOpen: onOpenModalFormAutorizacionIngreso,
    onClose: onCloseModalFormAutorizacionIngreso,
  } = useDisclosure({ defaultIsOpen: false });
  const [
    valuesForFormAutorizacionIngreso,
    setvaluesForFormAutorizacionIngreso,
  ] = useState({});
  const [loadingTablaAutorizaciones, setLoadingTablaAutorizaciones] =
    useState(false);
  const [loadingTablaSalida, setLoadingTablaSalida] = useState(false);

  const [alertSalidaText, setAlertSalidaText] = useState("");
  const cancelRefSalida = React.useRef();
  const {
    isOpen: isOpenAlertSalida,
    onOpen: onOpenAlertSalida,
    onClose: onCloseAlertSalida,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertAutorizacionIngresoText, setAlertAutorizacionIngresoText] =
    useState("");
  const cancelRefAutorizacionIngreso = React.useRef();
  const {
    isOpen: isOpenAlertAutorizacionIngreso,
    onOpen: onOpenAlertAutorizacionIngreso,
    onClose: onCloseAlertAutorizacionIngreso,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertCerrarText, setAlertCerrarText] = useState("");
  const cancelRefCerrar = React.useRef();
  const {
    isOpen: isOpenAlertCerrar,
    onOpen: onOpenAlertCerrar,
    onClose: onCloseAlertCerrar,
  } = useDisclosure({ defaultIsOpen: false });

  columnsSalida = [
    {
      name: "",
      label: "",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === "Rojo") {
            return <CircleIcon color="#C53030" />;
          }
          if (value === "Verde") {
            return <CircleIcon color="#2F855A" />;
          } else {
            return <CircleIcon color="#B7791F" />;
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
                tableMeta.rowData[12].accion == "Abrir" &&
                  handleAbrirFormSalidaButtonClick(tableMeta.rowData[12]);
                tableMeta.rowData[12].accion == "Cerrar" &&
                  cerrarAnexo(
                    tableMeta.rowData[12].idAnexo,
                    tableMeta.rowData[12].accionCerrarIdEtapa
                  );
              }}
            >
              <Text color="blue">{tableMeta.rowData[12].accion}</Text>
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

  columnsAutorizaciones = [
    {
      name: "",
      label: "",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value === "Rojo") {
            return <CircleIcon color="rgba(197, 48, 48, 1)" />;
          }
          if (value === "Verde") {
            return <CircleIcon color="rgba(47, 133, 90, 1)" />;
          } else {
            return <CircleIcon color="rgba(183, 121, 31, 1)" />;
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
                  tableMeta.rowData[7].accion == 'Abrir' &&  handleAbrirFormAutorizacionesIngresoButtonClick(tableMeta.rowData[7])
                  tableMeta.rowData[7].accion == 'Cerrar' &&  cerrarAnexo(tableMeta.rowData[7].idAnexo, tableMeta.rowData[7].accionCerrarIdEtapa)
                }}
              >
                <Text color="blue">
                  {tableMeta.rowData[7].accion}
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

  const handleAbrirFormSalidaButtonClick = (tableMeta) => {
    setvaluesForFormSalida(tableMeta);
    onOpenModalFormSalida();
  };

  const handleAbrirFormAutorizacionesIngresoButtonClick = (tableMeta) => {
    setvaluesForFormAutorizacionIngreso(tableMeta);
    onOpenModalFormAutorizacionIngreso();
  };

  const getDataSalida = async () => {
    let datos = [];
    setLoadingTablaSalida(true);
    await dataTableService.getDataTable(1, 1).then((response) => {
      response.data.map((registro) => {
        // console.log(registro);
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
          registro.productor.nombre,
          registro.transportista.nombre,
          registro.idAnexo,
          registro.acoplado.patente,
          registro.conductor.dni,
          registro.fechaHoraIngreso,
          registro.estado,
          registro,
        ]);
        return datos;
      });
    });
    setDatosSalida(datos);
    setLoadingTablaSalida(false);
  };

  const getDataAutorizaciones = async () => {
    let datos = [];
    setLoadingTablaAutorizaciones(true);
    await dataTableService.getDataTable(1, 2).then((response) => {
      response.data.map((registro) => {
        // console.log(registro);
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
          registro.productor.nombre,
          registro.transportista.nombre,
          registro,
        ]);
        return datos;
      });
    });
    setDatosAutorizaciones(datos);
    setLoadingTablaAutorizaciones(false);
  };

  const callbackModalFormSalida = (mensaje) => {
    setAlertSalidaText(mensaje);
    onOpenAlertSalida();
    getDataSalida();
  };

  const callbackModalFormAutorizacionIngreso = (mensaje) => {
    setAlertAutorizacionIngresoText(mensaje);
    onOpenAlertAutorizacionIngreso();
    getDataAutorizaciones();
  };

  const cerrarAnexo = async (idAnexo, accionCerrarIdEtapa) => {
    await anexoService
      .cerrarAnexo(idAnexo, accionCerrarIdEtapa)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          setAlertCerrarText(response.data);
          onOpenAlertCerrar();
          getDataAutorizaciones();
          getDataSalida();
        } else {
          setAlertCerrarText(response.error.message);
          onOpenAlertCerrar();
        }
      });
  };

  useEffect(() => {
    getDataAutorizaciones();
    getDataSalida();
  }, []);

  return (
    <>
      <Header rol="Ingreso / Egreso" />
      <Box flexDirection="row" w="full" h="full" align="center">
        <Box flexDirection="column" w="full" align="center" pl={5} pr={5}>
          <Box
            w="full"
            border="1px"
            borderColor="teal"
            title="Nuevo Ingreso - Búsqueda"
            mb={5}
          >
            <Box align="" pl={6}>
              <Heading
                align="center"
                mt="-15px"
                backgroundColor="white"
                w="220px"
                size="SM"
              >
                Nuevo Ingreso - Búsqueda
              </Heading>
            </Box>
            <SearchFormIngreso
              getDataSalida={getDataSalida}
              getDataAutorizaciones={getDataAutorizaciones}
              props={props}
            />

            <Box align="left" pl={10} pb={3} pt={5}></Box>
          </Box>
          <Box flexDirection="row" w="full">
            <HStack spacing="2%">
              <Box w="100%" border="2px" borderColor="teal" title="Salida">
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="65px"
                    size="SM"
                  >
                    Salida
                  </Heading>

                  {datosSalida && (
                    <Tabla
                      dataTable={datosSalida}
                      title="Salida"
                      columns={columnsSalida}
                      loading={loadingTablaSalida}
                      customOptions={customOptionsSalida}
                    />
                  )}
                  <ModalFormSalida
                    isOpen={isOpenModalFormSalida}
                    onClose={onCloseModalFormSalida}
                    formValues={valuesForFormSalida}
                    callbackModalFormSalida={callbackModalFormSalida}
                    idEtapa={6} //idEtapa 6 es Egreso --> Salida
                    props={props}
                  />
                </Box>
              </Box>
              <Box
                w="100%"
                border="2px"
                borderColor="teal"
                title="Autorizaciones de Ingreso"
              >
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="220px"
                    size="SM"
                  >
                    Autorizaciones de Ingreso
                  </Heading>
                  {datosAutorizaciones && (
                    <Tabla
                      dataTable={datosAutorizaciones}
                      title="Autorizaciones de Ingreso"
                      columns={columnsAutorizaciones}
                      loading={loadingTablaAutorizaciones}
                      customOptions={customOptionsAutorizaciones}
                    />
                  )}
                  <ModalFormAutorizacionesIngreso
                    isOpen={isOpenModalFormAutorizacionIngreso}
                    onClose={onCloseModalFormAutorizacionIngreso}
                    formValues={valuesForFormAutorizacionIngreso}
                    callbackModalFormAutorizacionIngreso={
                      callbackModalFormAutorizacionIngreso
                    }
                    props={props}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>
        </Box>
      </Box>

      <AlertDialogAceptCtm
        cancelRef={cancelRefSalida}
        onCloseAlert={onCloseAlertSalida}
        isOpenAlert={isOpenAlertSalida}
        alertText={alertSalidaText}
        errorMode={false}
      />

      <AlertDialogAceptCtm
        cancelRef={cancelRefAutorizacionIngreso}
        onCloseAlert={onCloseAlertAutorizacionIngreso}
        isOpenAlert={isOpenAlertAutorizacionIngreso}
        alertText={alertAutorizacionIngresoText}
        errorMode={false}
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

export default IngresoEgreso;
