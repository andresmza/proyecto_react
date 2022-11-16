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
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect } from "react";

const COLOR_SCHEME = "teal";

export default function modalReporteCamionesCombustibles({
  isOpen,
  onOpen,
  onClose,
  props,
}) {

  useEffect(() => {
    if (isOpen) {
    };
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent h="50rem" maxW="60rem" scrollBehavior="inside">
          <ModalHeader>Reporte Camiones y Combustibles</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={clearFormAndClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" colorScheme={COLOR_SCHEME} width="10ch" disabled={aceptButtondisabled}>
                    Aceptar
                  </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
