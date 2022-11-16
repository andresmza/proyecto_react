import { Formik, Field } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import ConductorService from "../../../services/ConductorService";
import React, { useState } from "react";
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";
import { AsyncSelect } from "chakra-react-select";
import ProductoService from "../../../services/ProductoService";
import { DatePickerField } from "../../../components/inputsForm";
import DataTableService from "../../../services/DataTableService";
import ModalADO from "./modalAdo";
import Tabla from "../../../components/table";

const COLOR_SCHEME = "teal";
const productoService = ProductoService.getInstance();
const dataTableService = DataTableService.getInstance();

let columnsHistorico = [];

const CircleIcon = (props) => (
  <Icon viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

const customOptionsHistorico = {
  tableBodyHeight: "50vh",
  tableBodyWidth: "",
};

export default function SearchFormADO({
  setInputsDisabled,
  handleAbrirIngresandoButtonClick,
}) {

  const [datosHistorico, setDatosHistorico] = useState();
  const [loadingTablaHistorico, setLoadingTablaHistorico] = useState();
  
  const getDataHistorico = async (fechaIngreso, fechaEgreso, idProducto) => {
    // console.log(fechaIngreso, fechaEgreso, idProducto)
    let datos = [];
    await dataTableService.getHistoricoAdo(fechaIngreso, fechaEgreso, idProducto).then((response) => {
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
          registro.conductor.apellido,
          registro,
        ]);
        return datos;
      });
    });
    setDatosHistorico(datos);
    setLoadingTablaHistorico(false);
  };

  columnsHistorico = [
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
          return `${tableMeta.rowData[2]} ${tableMeta.rowData[7]}`;
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
          // console.log(tableMeta)
          return (
            <button
              variant="link"
              onClick={
                () => {
                  setInputsDisabled(true);
                  handleAbrirIngresandoButtonClick(tableMeta.rowData[7]);
                }}
            >
              <Text color="blue">Ver</Text>
            </button>
          );
        },
      },
    },
    {
      name: "Historial",
      label: "Historial",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log(tableMeta)
          return (
            <button
              variant="link"
              onClick={() => {
                setInputsDisabled(false);
                handleAbrirIngresandoButtonClick(tableMeta.rowData[7]);
              }}
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

  return (
    <>
      <Box bg="white" p={6} rounded="md">
        <Formik
          initialValues={{
            idProducto: "",
            desde: new Date(),
            hasta: new Date(),
          }}
          onSubmit={(values) => {
            getDataHistorico(moment(values.desde).format("YYYY-MM-DD"), moment(values.hasta).format("YYYY-MM-DD"), values.idProducto)
          }}
        >
          {({ handleSubmit, errors, touched, handleChange, values, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Stack direction={["column", "row"]} spacing="1vh">
                <Box w="150px" h="40px">
                  <FormLabel htmlFor="dniConductor">Entre fechas:</FormLabel>
                </Box>
                <Box w="180px" h="40px">
                  <FormControl isInvalid={!!errors.desde && touched.desde}>
                    <DatePickerField name={"desde"} />
                    <FormErrorMessage>{errors.desde}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box w="150px" h="40px">
                  <FormControl isInvalid={!!errors.hasta && touched.hasta}>
                    <DatePickerField name={"hasta"} />

                    <FormErrorMessage>{errors.hasta}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w="250px" h="40px">

                <FormControl
                      isInvalid={!!errors.idProducto && touched.idProducto}
                    >
                      <AsyncSelect
                        id="idProducto"
                        name="idProducto"
                        placeholder="Seleccione producto"
                        onChange={({ value }) => {
                          setFieldValue("idProducto", value);
                        }}
                        touched={touched.idProducto ? 1 : 0}
                        defaultOptions={true}
                        loadOptions={(inputValue, callback) => {
                          productoService.getAllProductos().then((response) => {
                            if (response.status == 200) {
                              const data = response.data.map((item) => {
                                return {
                                  value: item.idProducto,
                                  label: item.nombre,
                                };
                              });

                              if (!inputValue) {
                                callback(data);
                              } else {
                                const dataFiltered = data.filter((i) =>
                                  i.label
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                );
                                callback(dataFiltered);
                              }
                            }
                          });
                        }}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      />
                      <FormErrorMessage>{errors.idProducto}</FormErrorMessage>
                    </FormControl>
                </Box>
              </Stack>
              <HStack>
              </HStack>
              <HStack>
                <Button type="submit" colorScheme={COLOR_SCHEME} width="10ch">
                  Buscar
                </Button>
                </HStack>
            </form>
          )}
        </Formik>
     
      {datosHistorico && (
        <Tabla
                      dataTable={datosHistorico}
                      title="Historico a ADO"
                      columns={columnsHistorico}
                      loading={loadingTablaHistorico}
                      customOptions={customOptionsHistorico}
                      setInputsDisabled={setInputsDisabled}
                    />
                  )}
                     </Box>


    </>
    
  );
}
