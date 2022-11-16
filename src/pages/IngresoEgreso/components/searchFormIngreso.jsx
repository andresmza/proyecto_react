import { Formik, Field } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import ModalFormIngreso from "./modalFormIngreso";
import ConductorService from "../../../services/ConductorService";
import React, { useState } from "react";
import { AlertDialogAceptCtm } from "../../../components/AlertDialogAceptCtm";

const conductorService = ConductorService.getInstance();

const COLOR_SCHEME = "teal";

export default function SearchFormIngreso({ getDataSalida, getDataAutorizaciones, props }) {
  const [alertIngresoText, setAlertIngresoText] = useState("");
  const cancelRefIngreso = React.useRef();
  const {
    isOpen: isOpenAlertIngreso,
    onOpen: onOpenAlertIngreso,
    onClose: onCloseAlertIngreso,
  } = useDisclosure({ defaultIsOpen: false });

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  const [inputsSearchFormIngreso, setInputsSearchFormIngreso] = useState({
    idConductor: 0,
    dniConductor: "",
    patenteCamion: "",
    patenteAcoplado: "",
    nombreConductor: "",
    apellidoConductor: "",
  });

  const getConductor = async (values) => {
    await conductorService
      .getCondutorByDni(values.dniConductor)
      .then((response) => {
        if (response.status == 200) {
          setInputsSearchFormIngreso({
            idConductor: response.data.idConductor,
            dniConductor: values.dniConductor,
            patenteCamion: values.patenteCamion,
            patenteAcoplado: values.patenteAcoplado,
            nombreConductor: response.data.nombre,
            apellidoConductor: response.data.apellido,
          });
        } else {
          setInputsSearchFormIngreso({
            idConductor: 0,
            dniConductor: values.dniConductor,
            patenteCamion: values.patenteCamion,
            patenteAcoplado: values.patenteAcoplado,
            nombreConductor: "",
            apellidoConductor: "",
          });
        }
      });
  };

  const callbackModalFormIngreso = (mensaje) => {
    setAlertIngresoText(mensaje);
    onOpenAlertIngreso();
    getDataSalida();
    getDataAutorizaciones();
  };

  return (
    <>
      <Box bg="white" p={6} rounded="md">
        <Formik
          initialValues={{
            idConductor: 0,
            dniConductor: "",
            patenteCamion: "",
            patenteAcoplado: "",
            nombreConductor: "",
            apellidoConductor: "",
          }}
          onSubmit={(values) => {
            if (values.dniConductor) {
              getConductor(values);
            }
            onOpen();
          }}
        >
          {({ handleSubmit, errors, touched, handleChange, values }) => (
            <form onSubmit={handleSubmit}>
              <ModalFormIngreso
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                inputValues={inputsSearchFormIngreso}
                callbackModalFormIngreso={callbackModalFormIngreso}
                props={props}
              />
              <Stack direction={["column", "row"]} spacing="1vh">
                <Box w="150px" h="40px">
                  <FormLabel htmlFor="dniConductor">DNI Conductor:</FormLabel>
                </Box>
                <Box w="150px" h="40px">
                  <FormControl
                    isInvalid={!!errors.dniConductor && touched.dniConductor}
                  >
                    <Field
                      as={Input}
                      id="dniConductor"
                      name="dniConductor"
                      type="number"
                      variant="filled"
                    />
                    <FormErrorMessage>{errors.dniConductor}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box w="150px" h="40px">
                  <FormLabel htmlFor="patenteCamion">Patente Camión:</FormLabel>
                </Box>
                <Box w="150px" h="40px">
                  <FormControl
                    isInvalid={!!errors.patenteCamion && touched.patenteCamion}
                  >
                    <Field
                      as={Input}
                      id="patenteCamion"
                      name="patenteCamion"
                      type="text"
                      variant="filled"
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.patenteCamion}</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box w="150px" h="40px">
                  <FormLabel htmlFor="patenteCamion">
                    Patente Acoplado:
                  </FormLabel>
                </Box>
                <Box w="150px" h="40px">
                  <FormControl
                    isInvalid={
                      !!errors.patenteAcoplado && touched.patenteAcoplado
                    }
                  >
                    <Field
                      as={Input}
                      id="patenteAcoplado"
                      name="patenteAcoplado"
                      type="text"
                      variant="filled"
                    />
                    <FormErrorMessage>
                      {errors.patenteAcoplado}
                    </FormErrorMessage>
                  </FormControl>
                </Box>
              </Stack>
              <Stack direction={["column", "row"]} spacing="1vh">
                <Button type="submit" colorScheme={COLOR_SCHEME} width="10ch">
                  Buscar
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Box>

      <AlertDialogAceptCtm
        cancelRef={cancelRefIngreso}
        onCloseAlert={onCloseAlertIngreso}
        isOpenAlert={isOpenAlertIngreso}
        alertText={alertIngresoText}
        errorMode={false}
      />
    </>
  );
}
