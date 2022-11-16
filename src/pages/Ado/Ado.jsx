import Header from "../Header";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Tabla from "../../components/table";
import DataTableService from "../../services/DataTableService";
import React, { useState, useEffect } from "react";
import { AlertDialogAceptCtm } from "../../components/AlertDialogAceptCtm";
import ModalADO from "./components/modalADO";
import SearchFormADO from "./components/searchFormADO";

const CircleIcon = (props) => (
  <Icon viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

const dataTableService = DataTableService.getInstance();

let columnsIngresando = [];
let columnsCamionesPlanta = [];

const customOptionsIngresando = {
  tableBodyHeight: "50vh",
  tableBodyWidth: "",
};
const customOptionsCamionesPlanta = {
  tableBodyHeight: "50vh",
  tableBodyWidth: "",
};

const Ado = (props) => {
  const [datosIngresando, setDatosIngresando] = useState([]);
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [datosCamionesPlanta, setDatosCamionesPlanta] = useState([]);
  const {
    isOpen: isOpenModalIngresando,
    onOpen: onOpenModalIngresando,
    onClose: onCloseModalIngresando,
  } = useDisclosure({ defaultIsOpen: false });

  const [valuesForIngresando, setvaluesForIngresando] = useState({});
  const {
    isOpen: isOpenModalCamionesPlanta,
    onOpen: onOpenModalCamionesPlanta,
    onClose: onCloseModalCamionesPlanta,
  } = useDisclosure({ defaultIsOpen: false });
  const [valuesForFormCamionesPlanta, setvaluesForFormCamionesPlanta] =
    useState({});
  const [loadingTablaCamionesPlanta, setLoadingTablaCamionesPlanta] =
    useState(false);
  const [loadingTablaIngresando, setLoadingTablaIngresando] = useState(false);

  const [alertIngresandoText, setAlertIngresandoText] = useState("");
  const cancelRefIngresando = React.useRef();
  const {
    isOpen: isOpenAlertIngresando,
    onOpen: onOpenAlertIngresando,
    onClose: onCloseAlertIngresando,
  } = useDisclosure({ defaultIsOpen: false });

  columnsIngresando = [
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
    {
      name: "Conductor",
      label: "Conductor",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${tableMeta.rowData[2]} ${tableMeta.rowData[12]}`;
        },
      },
    },
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
                setInputsDisabled(false);
                handleAbrirIngresandoButtonClick(tableMeta.rowData[7]);
              }}
            >
              <Text color="blue">Abrir</Text>
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

  columnsCamionesPlanta = [
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
    {
      name: "Conductor",
      label: "Conductor",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${tableMeta.rowData[2]} ${tableMeta.rowData[12]}`;
        },
      },
    },
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
              onClick={
                () => {
                  setInputsDisabled(true);
                  handleAbrirIngresandoButtonClick(tableMeta.rowData[7]);
                }
              }
            >
              <Text color="blue">Ver</Text>
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

  const handleAbrirIngresandoButtonClick = (tableMeta) => {
    setvaluesForIngresando(tableMeta);
    onOpenModalIngresando();
  };

  const handleAbrirFormCamionesPlantaButtonClick = (tableMeta) => {
    setvaluesForFormCamionesPlanta(tableMeta);
    onOpenModalCamionesPlanta();
  };

  const getDataIngresando = async () => {
    let datos = [];
    setLoadingTablaIngresando(true);
    await dataTableService.getDataTable(5, 1).then((response) => {
      response.data.map((registro) => {
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
          // registro.productor.nombre,
          typeof registro.productor === 'undefined' ? 'Sin productor' : registro.productor.nombre,
          registro.transportista.nombre,
          registro.idAnexo,
          registro.acoplado.patente,
          registro.conductor.dni,
          registro.fechaHoraIngreso,
          registro.estado,
          registro.conductor.apellido,
          registro,
        ]);
        return datos;
      });
    });
    setDatosIngresando(datos);
    setLoadingTablaIngresando(false);
  };

  const getDataCamionesPlanta = async () => {
    let datos = [];
    setLoadingTablaCamionesPlanta(true);
    await dataTableService.getDataTable(5, 2).then((response) => {
      response.data.map((registro) => {
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
          // registro.productor.nombre,
          typeof registro.productor === 'undefined' ? 'Sin productor' : registro.productor.nombre,
          registro.transportista.nombre,
          registro.idAnexo,
          registro.acoplado.patente,
          registro.conductor.dni,
          registro.fechaHoraIngreso,
          registro.estado,
          registro.conductor.apellido,
          registro,
        ]);
        return datos;
      });
    });
    setDatosCamionesPlanta(datos);
    setLoadingTablaCamionesPlanta(false);
  };

  const callbackModalFormIngresando = (mensaje) => {
    setAlertIngresandoText(mensaje);
    onOpenAlertIngresando();
    onCloseModalIngresando()
    getDataIngresando();
  };

  useEffect(() => {
    getDataCamionesPlanta();
    getDataIngresando();
  }, []);

  return (
    <>
      <Header rol="ADO" props={props} />
      <Box flexDirection="row" w="full" h="full" align="center">
        <Box flexDirection="column" w="full" align="center" pl={5} pr={5}>
          <Box flexDirection="row" w="full">
            <HStack spacing="2%">
              <Box
                w="100%"
                border="2px"
                borderColor="teal"
                title="Ingresando a ADO"
              >
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="150px"
                    size="SM"
                  >
                    Ingresando a ADO
                  </Heading>

                  {datosIngresando && (
                    <Tabla
                      dataTable={datosIngresando}
                      title="Ingresando a ADO"
                      columns={columnsIngresando}
                      loading={loadingTablaIngresando}
                      customOptions={customOptionsIngresando}
                      setInputsDisabled={setInputsDisabled}
                      getDataIngresando={getDataIngresando}
                    />
                  )}
                  <ModalADO
                    isOpen={isOpenModalIngresando}
                    onOpen={onOpenModalIngresando}
                    onClose={onCloseModalIngresando}
                    idAnexo={valuesForIngresando}
                    props={props}
                    inputsDisabled={inputsDisabled}
                    callbackModalFormIngresando={callbackModalFormIngresando}
                  />
                </Box>
              </Box>
              <Box
                w="100%"
                border="2px"
                borderColor="teal"
                title="Camiones en Planta"
              >
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="220px"
                    size="SM"
                  >
                    Camiones en Planta
                  </Heading>
                  {datosCamionesPlanta && (
                    <Tabla
                      dataTable={datosCamionesPlanta}
                      title="Camiones en Planta"
                      columns={columnsCamionesPlanta}
                      loading={loadingTablaCamionesPlanta}
                      customOptions={customOptionsCamionesPlanta}
                      setInputsDisabled={setInputsDisabled}
                    />
                  )}
                  <ModalADO
                    isOpen={isOpenModalIngresando}
                    onOpen={onOpenModalIngresando}
                    onClose={onCloseModalIngresando}
                    idAnexo={valuesForIngresando}
                    props={props}
                    inputsDisabled={inputsDisabled}
                    callbackModalFormIngresando={callbackModalFormIngresando}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>

          <Box
            w="full"
            border="2px"
            borderColor="teal"
            title="Buscar en histórico"
            mt={5}
          >
            <Box align="" pl={6}>
              <Heading
                align="center"
                mt="-15px"
                backgroundColor="white"
                w="180px"
                size="SM"
              >
                Buscar en histórico
              </Heading>
              <Box align="left" pl={10} pb={3} pt={5} h="100%">
                <SearchFormADO
                  setInputsDisabled={setInputsDisabled}
                  handleAbrirIngresandoButtonClick={
                    handleAbrirIngresandoButtonClick
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <AlertDialogAceptCtm
        cancelRef={cancelRefIngresando}
        onCloseAlert={onCloseAlertIngresando}
        isOpenAlert={isOpenAlertIngresando}
        alertText={alertIngresandoText}
        errorMode={false}
      />
    </>
  );
};

export default Ado;
