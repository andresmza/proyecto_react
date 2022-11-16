import Header from "../Header";
// import SearchFormIngreso from "./components/searchFormIngreso";
import {
  Box,
  Heading,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Stack,
  VStack,
  useDisclosure,
  Text,
  Icon,
} from "@chakra-ui/react";
import Tabla from "../../components/table";
import DataTableService from "../../services/DataTableService";
import AnexoService from "../../services/AnexoService";
import React, { useState, useEffect } from "react";
import ModalFormLaboratorio from "./components/modalFormLaboratorio";
import { AlertDialogAceptCtm } from "../../components/AlertDialogAceptCtm";

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

let columnsLaboratorio = [];

const customOptionsLaboratorio = {
  tableBodyHeight: "75vh",
  tableBodyWidth: "100vh"
};

//Sólo están duplicadas por si después llegan a llevar columnas diferentes, en caso contrario unificarlas en una constante columnsNames.

const Laboratorio = () => {
  const [datosLaboratorio, setDatosLaboratorio] = useState([]);
  const [datosForFormLaboratorio, setDatosForFormLaboratorio] = useState([]);
  const [ loadingTablaLaboratorio, setLoadingTablaLaboratorio ] = useState(false);


  const {
    isOpen: isOpenModalFormLaboratorio,
    onOpen: onOpenModalFormLaboratorio,
    onClose: onCloseModalFormLaboratorio,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertLaboratorioText, setAlertLaboratorioText] = useState("");
  const cancelRefLaboratorio = React.useRef();
  const {
    isOpen: isOpenAlertLaboratorio,
    onOpen: onOpenAlertLaboratorio,
    onClose: onCloseAlertLaboratorio,
  } = useDisclosure({ defaultIsOpen: false });

  const [alertCerrarText, setAlertCerrarText] = useState("");
  const cancelRefCerrar = React.useRef();
  const {
    isOpen: isOpenAlertCerrar,
    onOpen: onOpenAlertCerrar,
    onClose: onCloseAlertCerrar,
  } = useDisclosure({ defaultIsOpen: false });
  
  columnsLaboratorio = [
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
                    tableMeta.rowData[11].accion == 'Abrir' &&  handleAbrirFormLaboratorioButtonClick(tableMeta.rowData[11])
                    tableMeta.rowData[11].accion == 'Cerrar' &&  cerrarAnexo(tableMeta.rowData[11].idAnexo, tableMeta.rowData[11].accionCerrarIdEtapa)
                  }}
                >
                  <Text color="blue">
                    {tableMeta.rowData[11].accion}
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

  const getDataLaboratorio = async () => {
    let datos = [];
    setLoadingTablaLaboratorio(true);
    await dataTableService.getDataTable(2, 1).then((response) => {
      response.data.map((registro) => {
        datos.push([
          registro.color,
          registro.camion.patente,
          registro.conductor.nombre,
          registro.producto.nombre,
          registro.proveedor.nombre,
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
    setDatosLaboratorio(datos);
    setLoadingTablaLaboratorio(false);
  };

  const handleAbrirFormLaboratorioButtonClick = (tableMeta) => {
    setDatosForFormLaboratorio(tableMeta);
    onOpenModalFormLaboratorio();
  };

  const cerrarAnexo = async (idAnexo, accionCerrarIdEtapa) => {
    await anexoService.cerrarAnexo(idAnexo, accionCerrarIdEtapa).then((response) => {
        if (response.status == 200 || response.status == 201) {
          setAlertCerrarText(response.data);
          onOpenAlertCerrar();
          getDataLaboratorio();
        } else {
          setAlertCerrarText(response.error.message);
          onOpenAlertCerrar();
        }
    });
  }

  const callbackModalFormLaboratorio = (mensaje) => {
    setAlertLaboratorioText(mensaje);
    onOpenAlertLaboratorio();
    getDataLaboratorio();
  };


  useEffect(() => {
    getDataLaboratorio();
  }, []);

  return (
    <>
      <Header rol="Laboratorio" />
      <Box flexDirection="row" w="full" h="full" align="center">
        <Box flexDirection="column" w="full" align="center" pl={5} pr={5}>
        
        {/* <Button onClick={onOpenModalFormIngresandoLaboratorio}>Open Modal</Button> */}
          <Box flexDirection="row" w="full">
            <HStack spacing="2%">
              <Box w="100%" h="100%" border="2px" borderColor="teal" title="Salida">
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="220px"
                    size="SM"
                  >
                    Ingresando a Laboratorio
                  </Heading>

                  {datosLaboratorio && (
                    <Tabla
                      dataTable={datosLaboratorio}
                      title="Ingresando a Laboratorio"
                      columns={columnsLaboratorio}
                      loading={loadingTablaLaboratorio}
                      customOptions={customOptionsLaboratorio}
                    />
                  )}
                  <ModalFormLaboratorio
                    isOpen={isOpenModalFormLaboratorio}
                    onClose={onCloseModalFormLaboratorio}
                    formValues={datosForFormLaboratorio}
                    callbackModalFormLaboratorio={callbackModalFormLaboratorio}
                    // props={props}
                  />
                </Box>
              </Box>
             
            </HStack>
          </Box>
        </Box>
      </Box>

      <AlertDialogAceptCtm
        cancelRef={cancelRefLaboratorio}
        onCloseAlert={onCloseAlertLaboratorio}
        isOpenAlert={isOpenAlertLaboratorio}
        alertText={alertLaboratorioText}
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

export default Laboratorio;

