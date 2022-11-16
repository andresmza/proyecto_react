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
import ModalFormsBasculaCtm from "./components/modalFormsBasculaCtm";

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

let columnsPesadaInicial = [];
let columnsPesadaFinal = [];
let columnsAdo = [];

const customOptionsPesadaInicial = {
  tableBodyHeight: "30vh",
  tableBodyWidth: ""
};
const customOptionsPesadaFinal = {
  tableBodyHeight: "30vh",
  tableBodyWidth: ""
};
const customOptionsDatosAdo = {
  tableBodyHeight: "30vh",
  tableBodyWidth: ""
};

const Bascula = (props) => {
  // Contexto Pesada Inicial
  const [datosPesadaInicial, setDatosPesadaInicial] = useState([]);
  const {
    isOpen: isOpenModalFormPesadaInicial,
    onOpen: onOpenModalFormPesadaInicial,
    onClose: onCloseModalFormPesadaInicial,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertPesadaInicialText, setAlertPesadaInicialText] = useState("");
  const cancelRefPesadaInicial = React.useRef();
  const {
    isOpen: isOpenAlertPesadaInicial,
    onOpen: onOpenAlertPesadaInicial,
    onClose: onCloseAlertPesadaInicial,
  } = useDisclosure({ defaultIsOpen: false });

  const [valuesForFormPesadaInicial, setvaluesForFormPesadaInicial] = useState({});

  const [loadingTablaPesadaInicial, setLoadingTablaPesadaInicial] = useState(false);

  // Contexto Pesada Final
  const [datosPesadaFinal, setDatosPesadaFinal] = useState([]);
  const {
    isOpen: isOpenModalFormPesadaFinal,
    onOpen: onOpenModalFormPesadaFinal,
    onClose: onCloseModalFormPesadaFinal,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertPesadaFinalText, setAlertPesadaFinalText] = useState("");
  const cancelRefPesadaFinal = React.useRef();
  const {
    isOpen: isOpenAlertPesadaFinal,
    onOpen: onOpenAlertPesadaFinal,
    onClose: onCloseAlertPesadaFinal,
  } = useDisclosure({ defaultIsOpen: false });

  const [valuesForFormPesadaFinal, setvaluesForFormPesadaFinal] = useState({});

  const [loadingTablaPesadaFinal, setLoadingTablaPesadaFinal] = useState(false);

  // Contexto Ado
  const [datosAdo, setDatosAdo] = useState([]);
  const {
    isOpen: isOpenModalFormAdo,
    onOpen: onOpenModalFormAdo,
    onClose: onCloseModalFormAdo,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertAdoText, setAlertAdoText] = useState("");
  const cancelRefAdo = React.useRef();
  const {
    isOpen: isOpenAlertAdo,
    onOpen: onOpenAlertAdo,
    onClose: onCloseAlertAdo,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertCerrarText, setAlertCerrarText] = useState("");
  const cancelRefCerrar = React.useRef();
  const {
    isOpen: isOpenAlertCerrar,
    onOpen: onOpenAlertCerrar,
    onClose: onCloseAlertCerrar,
  } = useDisclosure({ defaultIsOpen: false });

  const [valuesForFormAdo, setvaluesForFormAdo] = useState({});

  const [loadingTablaAdo, setLoadingTablaAdo] = useState(false);

  columnsPesadaInicial = [
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
                  tableMeta.rowData[12].accion == 'Abrir' &&  handleAbrirFormPesadaInicialButtonClick(tableMeta.rowData[12])
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

  // Abrir Form Pesada Inicial
  const handleAbrirFormPesadaInicialButtonClick = (tableMeta) => {
    setvaluesForFormPesadaInicial(tableMeta);
    onOpenModalFormPesadaInicial();
  };

  // Llenar grilla Pesada Inicial
  const getDataPesadaInicial = async () => {
    let datos = [];
    setLoadingTablaPesadaInicial(true);
    await dataTableService.getDataTable(3, 1).then((response) => {
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
    setDatosPesadaInicial(datos);
    setLoadingTablaPesadaInicial(false);
  };
  
  const cerrarAnexo = async (idAnexo, accionCerrarIdEtapa) => {
    await anexoService.cerrarAnexo(idAnexo, accionCerrarIdEtapa).then((response) => {
        if (response.status == 200 || response.status == 201) {
          setAlertCerrarText(response.data);
          onOpenAlertCerrar();
          getDataPesadaInicial();
          getDataPesadaFinal();
          getDataAdo();
        } else {
          setAlertCerrarText(response.error.message);
          onOpenAlertCerrar();
        }
    });
  }

  // POST Formulario Pesada Inicial
  const callbackModalFormPesadaInicial = (mensaje) => {
    setAlertPesadaInicialText(mensaje);
    onOpenAlertPesadaInicial();
    getDataPesadaInicial();
  };

  //Pesada Final
  //Columnas tabla
  columnsPesadaFinal = [
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
                  tableMeta.rowData[12].accion == 'Abrir' &&  handleAbrirFormPesadaFinalButtonClick(tableMeta.rowData[12])
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

  // Abrir Form Pesada Final
  const handleAbrirFormPesadaFinalButtonClick = (tableMeta) => {
    setvaluesForFormPesadaFinal(tableMeta);
    onOpenModalFormPesadaFinal();
  };

  // Llenar grilla Pesada Final
  const getDataPesadaFinal = async () => {
    let datos = [];
    setLoadingTablaPesadaFinal(true);
    await dataTableService.getDataTable(3, 2).then((response) => {
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
    setDatosPesadaFinal(datos);
    setLoadingTablaPesadaFinal(false);
  };

  // POST Formulario Pesada Final
  const callbackModalFormPesadaFinal = (mensaje) => {
    setAlertPesadaFinalText(mensaje);
    onOpenAlertPesadaFinal();
    getDataPesadaFinal();
  };

  //Ado
  //Columnas tabla
  const [idEtapaAdo, setIdEtapaAdo] = useState(null);
  columnsAdo = [
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
    "Pesaje",
    {
      name: "Acción",
      label: "Acción",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <button
                variant="link"
                onClick={() => {
                  tableMeta.rowData[12].accion == 'Abrir' &&  handleAbrirFormAdoButtonClick(tableMeta.rowData[12])
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

  // Abrir Form Ado
  const handleAbrirFormAdoButtonClick = (tableMeta) => {
    const idEtapaAdoCamionSeleccionado = (tableMeta.etapa === "Pesada Inicial" ? 3 : 5);
    setIdEtapaAdo(idEtapaAdoCamionSeleccionado);
    setvaluesForFormAdo(tableMeta);
    onOpenModalFormAdo();
  };

  // Llenar grilla Ado
  const getDataAdo = async () => {
    let datos = [];
    setLoadingTablaAdo(true);
    await dataTableService.getDataTable(3, 3).then((response) => {
      response.data.map((registro) => {
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.apellido + " " + registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
          registro.productor.nombre,
          registro.transportista.nombre,
          registro.etapa,
          registro.idAnexo,
          registro.acoplado.patente,
          registro.conductor.dni,
          registro.fechaHoraIngreso,
          registro,
        ]);
        return datos;
      });
    });
    setDatosAdo(datos);
    setLoadingTablaAdo(false);
  };

  // POST Formulario Ado
  const callbackModalFormAdo = (mensaje) => {
    setAlertAdoText(mensaje);
    onOpenAlertAdo();
    getDataAdo();
  };

  useEffect(() => {
    getDataPesadaInicial();
    getDataPesadaFinal();
    getDataAdo();
  }, []);

  return (
    <>
      <Header rol="Báscula" />
      <Box flexDirection="row" w="full" h="full" align="center">
        <Box flexDirection="column" w="full" align="center" pl={5} pr={5}>
          <Box flexDirection="row" w="full">
            <HStack spacing="2%" >
              <Box w="100%" border="2px" borderColor="teal" title=" En espera de pesada inicial">
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="220px"
                    size="SM"
                  >
                    En espera de pesada inicial
                  </Heading>

                  {datosPesadaInicial && (
                    <Tabla
                      dataTable={datosPesadaInicial}
                      title="En espera de pesada inicial"
                      columns={columnsPesadaInicial}
                      loading={loadingTablaPesadaInicial}
                      customOptions={customOptionsPesadaInicial}
                    />
                  )}
                  <ModalFormsBasculaCtm
                    isOpen={isOpenModalFormPesadaInicial}
                    onClose={onCloseModalFormPesadaInicial}
                    formValues={valuesForFormPesadaInicial}
                    callbackModalFormPesada={callbackModalFormPesadaInicial}
                    props={props}
                    title="Nueva Pesada Inicial"
                    idEtapa={3} //idEtapa 3 es Pesada inicial
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
                    En espera de pesada final
                  </Heading>

                  {datosPesadaFinal && (
                    <Tabla
                      dataTable={datosPesadaFinal}
                      title="En espera de pesada final"
                      columns={columnsPesadaFinal}
                      loading={loadingTablaPesadaFinal}
                      customOptions={customOptionsPesadaFinal}
                    />
                  )}
                  <ModalFormsBasculaCtm
                    isOpen={isOpenModalFormPesadaFinal}
                    onClose={onCloseModalFormPesadaFinal}
                    formValues={valuesForFormPesadaFinal}
                    callbackModalFormPesada={callbackModalFormPesadaFinal}
                    props={props}
                    title="Nueva Pesada Final"
                    idEtapa={5} //idEtapa 5 es Pesada final
                  />
                </Box>
              </Box>
            </HStack>
            <HStack mt={6} spacing="2%">
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
                    Autorizaciones de ADO
                  </Heading>

                  {datosAdo && (
                    <Tabla
                      dataTable={datosAdo}
                      title="Autorizaciones de ADO"
                      columns={columnsAdo}
                      loading={loadingTablaAdo}
                      customOptions={customOptionsDatosAdo}
                    />
                  )}
                  <ModalFormsBasculaCtm
                    isOpen={isOpenModalFormAdo}
                    onClose={onCloseModalFormAdo}
                    formValues={valuesForFormAdo}
                    callbackModalFormPesada={callbackModalFormAdo}
                    props={props}
                    title="Nueva Autorización ADO"
                    idEtapa={idEtapaAdo} //idEtapa 3 si etapa es Pesada Inicial y 5 si etapa es Pesada Final
                  />
                </Box>
              </Box>
            </HStack>
          </Box>
        </Box>
      </Box>

      <AlertDialogAceptCtm
        cancelRef={cancelRefPesadaInicial}
        onCloseAlert={onCloseAlertPesadaInicial}
        isOpenAlert={isOpenAlertPesadaInicial}
        alertText={alertPesadaInicialText}
      />

      <AlertDialogAceptCtm
        cancelRef={cancelRefPesadaFinal}
        onCloseAlert={onCloseAlertPesadaFinal}
        isOpenAlert={isOpenAlertPesadaFinal}
        alertText={alertPesadaFinalText}
      />

      <AlertDialogAceptCtm
        cancelRef={cancelRefAdo}
        onCloseAlert={onCloseAlertAdo}
        isOpenAlert={isOpenAlertAdo}
        alertText={alertAdoText}
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

export default Bascula;
