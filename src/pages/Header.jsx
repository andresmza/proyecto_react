import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Image,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AlertDialogYesNoCtm } from "../components/AlertDialogYesNoCtm";
import Menu from "./menu/menu";

const Header = (props) => {
  const cookies = new Cookies();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  const [rolAdo, setRolAdo] = useState(false);

  const logout = async () => {

    window.localStorage.setItem('user', null)
    navigate("/");

  };

  useEffect(() => {
    if (props.rol === "ADO") {
      setRolAdo(true);
    } else {
      setRolAdo(false);
    }
  }, [props]);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} mb={5}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Image boxSize="50%" src={"/img/logoCPSA_principal.jpg"} />
            </Box>
            <HStack spacing={4} display={{ base: "none", md: "flex" }}>
              <Text
                textTransform="uppercase"
                fontWeight="bold"
                fontSize="2xl"
                color={"teal"}
              >
                {props.rol}
              </Text>
              {rolAdo && (
                <Box pb={0} mb={0} textAlign="center" pt="50px" pr="50px">
                  <Menu props={props}/>
                </Box>
              )}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Box pr={5}>
              <Text as={"a"} fontSize={"sm"} fontWeight={500} variant={"link"}>
                Bienvenido {cookies.get("nombre")} {cookies.get("apellido")}
              </Text>
            </Box>
            <Button
              variant="outline"
              colorScheme={"teal"}
              size={"sm"}
              onClick={onOpen}
            >
              Cerrar Sesión
            </Button>

            <AlertDialogYesNoCtm
              cancelRef={cancelRef}
              onCloseAlert={onClose}
              isOpenAlert={isOpen}
              alertText="¿Estás seguro de que querés salir?"
              onClickYes={logout}
              onClickNo={onClose}
            />

          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Header;
