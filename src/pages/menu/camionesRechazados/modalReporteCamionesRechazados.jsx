import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  FormLabel,
  FormErrorMessage,
  FormControl,
  HStack,
  Stack,
} from "@chakra-ui/react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { DatePickerField } from "../../../components/inputsForm";
import TableCamionesRechazados from "./tableCamionesRechazados";
import ReporteService from "../../../services/ReporteService";

const COLOR_SCHEME = "teal";
const reporteService = ReporteService.getInstance();

let columnsCamionesRechazados = [];

const customOptionsCamionesRechazados = {
  tableBodyHeight: "50vh",
  tableBodyWidth: "",
  noMatch: "No hay camiones rechazados entre estas fechas",
  download: false,
  print: false,
  viewColumns: false,
  rowsPerPage: 10,
  rowsPerPageOptions: [10],
};

export default function modalReporteCamionesRechazados({ isOpen, onOpen, onClose, props, }) {
  const [datosCamionesRechazados, setDatosCamionesRechazados] = useState();
  const [loadingTablaCamionesRechazados, setLoadingTablaCamionesRechazados] = useState();
  const [fechaDesde, setFechaDesde] = useState(new Date());
  const [fechaHasta, setFechaHasta] = useState(new Date());

  const getDataCamionesRechazados = async (fechaDesde, fechaHasta) => {
    // console.log(fechaDesde, fechaHasta)
    setFechaDesde(moment(fechaDesde).format("DD-MM-YYYY"));
    setFechaHasta(moment(fechaHasta).format("DD-MM-YYYY"));
    let datos = [];
    //TODO: Descomentar cuando este endpoint de Anibal
    // await reporteService.getCamionesRechazados(fechaDesde, fechaHasta).then((response) => {
    //   response.data.map((registro) => {
    //     // console.log(registro);
    //     datos.push([
    //       registro.nroAnexo,
    //       registro.nroTicket,
    //       registro.fechaIngreso,
    //       registro.conductor,
    //       registro.patente,
    //       registro.producto,
    //       registro.nroRemito,
    //       registro.etapa,
    //       registro.obsEtapaRechazo,
    //       registro.idAnexo,
    //       registro,
    //     ]);
    //     return datos;
    //   });
    // });
    datos.push([24750, 1, "03-09-2021", "FUEL OIL", "ABC 123", "FUEL OIL", "0002R00012274", "Descargadero", "Observaciones etapa rechazo ejemplo 1", 25337]);
    datos.push([24751, 2, "04-10-2021", "FUEL OIL", "ABC 124", "FUEL OIL", "0002R00012275", "Laboratorio", "Observaciones etapa rechazo ejemplo 2", 25338]);
    datos.push([24752, 3, "05-11-2021", "FUEL OIL", "ABC 125", "GAS OIL", "0002R00012276", "Pesada Inicial", "Obs corta ej 3", 25339]);
    datos.push([24753, 4, "06-12-2021", "FUEL OIL", "ABC 126", "FUEL OIL", "0002R00012277", "Pesada Final", "Observaciones etapa rechazo ejemplo 4", 25340]);
    datos.push([24754, 5, "07-01-2022", "FUEL OIL", "ABC 127", "GAS OIL", "0002R00012278", "Descargadero", "Observaciones etapa rechazo ejemplo 5", 25341]);
    datos.push([24755, 6, "03-09-2021", "FUEL OIL", "ABC 123", "FUEL OIL", "0002R00012274", "Descargadero", "Observaciones etapa rechazo ejemplo 6", 25342]);
    datos.push([24756, 7, "04-10-2021", "FUEL OIL", "ABC 124", "FUEL OIL", "0002R00012275", "Laboratorio", "Observaciones etapa rechazo ejemplo 7", 25343]);
    datos.push([24757, 8, "05-11-2021", "FUEL OIL", "ABC 125", "GAS OIL", "0002R00012276", "Pesada Inicial", "Obs corta ej 8", 25344]);
    datos.push([24758, 9, "06-12-2021", "FUEL OIL", "ABC 126", "FUEL OIL", "0002R00012277", "Pesada Final", "Observaciones etapa rechazo ejemplo 9", 25345]);
    datos.push([24759, 10, "07-01-2022", "FUEL OIL", "ABC 127", "GAS OIL", "0002R00012278", "Descargadero", "Observaciones etapa rechazo ejemplo 10", 25346]);

    setDatosCamionesRechazados(datos);
    setLoadingTablaCamionesRechazados(false);
  };

  columnsCamionesRechazados = [
    { name: "nroAnexo", label: "Nro. Anexo", },
    { name: "nroTicket", label: "Nro. Ticket", },
    { name: "fechaIngreso", label: "Fecha Ingreso", },
    { name: "conductor", label: "Conductor", },
    { name: "patente", label: "Patente", },
    { name: "producto", label: "Producto", },
    { name: "nroRemito", label: "Nro. Remito", },
    { name: "etapa", label: "Etapa", },
    { name: "obsEtapaRechazo", label: "Observaciones en Etapa de Rechazo", },
    { name: "idAnexo", options: { display: false } },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent h="86%" maxW="96%" scrollBehavior="inside">
          <ModalHeader>Reporte Camiones Rechazados</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box bg="white" rounded="md">
              <Formik
                initialValues={{
                  fechaDesde: new Date(),
                  fechaHasta: new Date(),
                }}
                onSubmit={(values) => {
                  getDataCamionesRechazados(moment(values.fechaDesde).format("YYYY-MM-DD"), moment(values.fechaHasta).format("YYYY-MM-DD"))
                }}
              >
                {({ handleSubmit, errors, touched, handleChange, values, setFieldValue }) => (
                  <form onSubmit={handleSubmit}>
                    <Stack direction={["column", "row"]} spacing="1vh" paddingLeft="10%" p={3}>
                      <Box w="110px" h="40px" pt={2}>
                        <FormLabel>Entre fechas:</FormLabel>
                      </Box>
                      <Box w="150px" h="40px">
                        <FormControl isInvalid={!!errors.fechaDesde && touched.fechaDesde} >
                          <DatePickerField name={"fechaDesde"} />
                          <FormErrorMessage>{errors.fechaDesde}</FormErrorMessage>
                        </FormControl>
                      </Box>
                      <Box w="150px" h="40px">
                        <FormControl isInvalid={!!errors.fechaHasta && touched.fechaHasta}>
                          <DatePickerField name={"fechaHasta"} />
                          <FormErrorMessage>{errors.fechaHasta}</FormErrorMessage>
                        </FormControl>
                      </Box>
                      <Box w="150px" h="40px" pt={2}>
                        <FormLabel>(fechas de ingreso)</FormLabel>
                      </Box>
                      <Button type="submit" colorScheme={COLOR_SCHEME} width="10ch">
                        Buscar
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
              <Box pt={5}>
                {datosCamionesRechazados && (
                  <TableCamionesRechazados
                    dataTable={datosCamionesRechazados}
                    title="Camiones Rechazados e Igualmente Aprobados por Energía"
                    columns={columnsCamionesRechazados}
                    loading={loadingTablaCamionesRechazados}
                    customOptions={customOptionsCamionesRechazados}
                    props={props}
                    fechaDesde={fechaDesde}
                    fechaHasta={fechaHasta}
                  />
                )}
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
