import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    Modal,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
  } from "@chakra-ui/react";

const TabsForms = () => {
  return (
    <Tabs isFitted variant="unstyled">
      <TabList>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Ingreso</Tab>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Laboratorio</Tab>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Pesaje Entrada</Tab>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Descargadero</Tab>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Pesaje Salida</Tab>
        <Tab _selected={{ color: "white", bg: "blue.400" }}>Egreso</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
            <FormIngreso/>
        </TabPanel>
        <TabPanel>
        </TabPanel>
        <TabPanel>
        <FormPesajeEntrada/>
        </TabPanel>
        <TabPanel>
        <FormDescargadero/>
        </TabPanel>
        <TabPanel>
        <FormPesajeSalida/>
        </TabPanel>
        <TabPanel>
        <FormEgreso/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabsForms;
