import {
  Box,
  useColorModeValue,
  Menu as MenuChakra,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ChevronDownIcon, } from '@chakra-ui/icons';
import ModalReporteCamionesRechazados from "./camionesRechazados/modalReporteCamionesRechazados";
import ModalReporteConductores from "./conductores/modalReporteConductores";
import ModalReporteCamionesCombustibles from "./camionesYCombustibles/modalReporteCamionesCombustibles";

const menu = (props) => {

  const {
    isOpen: isOpenModalReporteCamionesRechazados,
    onOpen: onOpenModalReporteCamionesRechazados,
    onClose: onCloseModalReporteCamionesRechazados,
  } = useDisclosure({ defaultIsOpen: false });

  const abrirModalReporteCamionesRechazados = () => {
    onOpenModalReporteCamionesRechazados();
  };

  const {
    isOpen: isOpenModalReporteConductores,
    onOpen: onOpenModalReporteConductores,
    onClose: onCloseModalReporteConductores,
  } = useDisclosure({ defaultIsOpen: false });

  const abrirModalReporteConductores = () => {
    onOpenModalReporteConductores();
  };

  const {
    isOpen: isOpenModalReporteCamionesCombustibles,
    onOpen: onOpenModalReporteCamionesCombustibles,
    onClose: onCloseModalReporteCamionesCombustibles,
  } = useDisclosure({ defaultIsOpen: false });

  const abrirModalReporteCamionesCombustibles = () => {
    onOpenModalReporteCamionesCombustibles();
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} mb={5}>
        <MenuChakra>
          {({ isOpen }) => (
            <>
              <MenuButton isActive={isOpen} as={Button} variant="outline" colorScheme={"teal"} size={"sm"} rightIcon={<ChevronDownIcon />} borderRadius={0}>
                Imprimir Reportes
              </MenuButton>
              <MenuList zIndex={101}>
                <MenuItem onClick={() => abrirModalReporteCamionesRechazados()}>Camiones Rechazados</MenuItem>
                <MenuItem onClick={() => abrirModalReporteConductores()}>Conductores</MenuItem>
                <MenuItem onClick={() => abrirModalReporteCamionesCombustibles()}>Camiones y Combustibles</MenuItem>
              </MenuList>
            </>
          )}
        </MenuChakra>
        <MenuChakra>
          {({ isOpen }) => (
            <>
              <MenuButton isActive={isOpen} as={Button} variant="outline" colorScheme={"teal"} size={"sm"} rightIcon={<ChevronDownIcon />} borderRadius={0} borderLeft={0}>
                ABM
              </MenuButton>
              <MenuList zIndex={101}>
                <MenuItem onClick={() => alert('Motivos de Rechazo')}>Motivos de Rechazo</MenuItem>
                <MenuItem onClick={() => alert('Proveedores')}>Proveedores</MenuItem>
                <MenuItem onClick={() => alert('Transportista')}>Transportista</MenuItem>
                <MenuItem onClick={() => alert('Destinatario')}>Destinatario</MenuItem>
                <MenuItem onClick={() => alert('Producto')}>Producto</MenuItem>
              </MenuList>
            </>
          )}
        </MenuChakra>
      </Box>

      <ModalReporteCamionesRechazados
        isOpen={isOpenModalReporteCamionesRechazados}
        onOpen={onOpenModalReporteCamionesRechazados}
        onClose={onCloseModalReporteCamionesRechazados}
        props={props}
      />

      <ModalReporteConductores
        isOpen={isOpenModalReporteConductores}
        onOpen={onOpenModalReporteConductores}
        onClose={onCloseModalReporteConductores}
        props={props}
      />

      <ModalReporteCamionesCombustibles
        isOpen={isOpenModalReporteCamionesCombustibles}
        onOpen={onOpenModalReporteCamionesCombustibles}
        onClose={onCloseModalReporteCamionesCombustibles}
        props={props}
      />
    </>
  );
};

export default menu;
