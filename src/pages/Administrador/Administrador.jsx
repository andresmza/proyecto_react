import Header from "../Header";
import {
  Box,
  Heading,
  HStack,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import TableUsuarios from "./components/tableUsuarios";
import React, { useState, useEffect } from "react";
import UsuariosService from "../../services/UsuariosService";
import ModalFormUserCtm from "./components/modalFormUserCtm";
import { AlertDialogAceptCtm } from "../../components/AlertDialogAceptCtm";

let usersColumns = [];

let usersService = UsuariosService.getInstance();

const Administrador = (props) => {
  const [usersData, setUsersData] = useState([]);

  const [loadingUsersTable, setLoadingUsersTable] = useState(false);

  const [isCreationMode, setIsCreationMode] = useState(true);

  //Usuarios
  //Columnas tabla
  usersColumns = [
    {
      name: "user",
      label: "Usuario",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
      }
    },
    {
      name: "name",
      label: "Nombre",
      options: {
        setCellProps: () => ({ style: { minWidth: "200px", maxWidth: "200px" } }),
      }
    },
    { name: "Roles", label: "Roles", },
    {
      name: "actions",
      label: "Acción",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "100px", maxWidth: "100px" } }),
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <HStack spacing={25}>
                <button
                  variant="link"
                  onClick={() => handleEditarUsuarioButtonClick(tableMeta.rowData)}
                >
                  <Text color="rgba(0,0,255,1)">
                    Editar
                  </Text>
                </button>
              </HStack>
            </>
          );
        },
      },
    },
  ];

  const handleEditarUsuarioButtonClick = async (user) => {
    //TODO: Abrir modal para crear un user
    setIsCreationMode(false);
    const fullName = user[1];
    const formValues = {
      username: user[0],
      name: fullName.substring(fullName.indexOf(",") + 1, fullName.length).trim(),
      lastname: fullName.substring(0, fullName.indexOf(",")).trim(),
      password: "", //TODO: Falta que melo traiga
      roles: user[2].split(' - '),
    };
    setFormValuesForEditUser(formValues);
    onOpenModalFormUser();
  }

  // Llenar grilla Usuarios
  const getUsersForTable = async () => {
    let datos = [];
    setLoadingUsersTable(true);
    //TODO: Descomentar cuando Anibal tenga el endpoint
    // await usuariosService.getUsuarios().then((response) => {
    //   response.data.map((registro) => {
    //     datos.push([
    //       registro.username,
    //       registro.apellido + ", " + registro.nombre,
    //       registro.roles,
    //       registro.id,
    //       registro,
    //     ]);
    //     return datos;
    //   });
    // });
    datos.push([
      "admin", "Sistema, Administrador", "Descargadero", 1,
      {
        id: 1, username: "admin", nombre: "Administrador",
        apellido: "Sistema", roles: "Descargadero"
      }
    ]);
    datos.push([
      "andresmza", "Ortega, Andrés", "Administrador - ADO - Báscula - Consultas - Descargadero - Descargadero Cruz de Piedra - Ingreso/Egreso - Laboratorio", 2,
      {
        id: 2, username: "andresmza", nombre: "Andrés", apellido: "Ortega",
        roles: "Administrador - ADO - Báscula - Consultas - Descargadero - Descargadero Cruz de Piedra - Ingreso/Egreso - Laboratorio"
      }
    ]);
    datos.push([
      "amanzur", "Manzur, Anibal", "Consultas", 3,
      {
        id: 3, username: "amanzur", nombre: "Anibal",
        apellido: "Manzur", roles: "Consultas"
      }
    ]);
    datos.push([
      "mgarcia", "García, Mariano", "Ingreso/Egreso", 4,
      {
        id: 4, username: "mgarcia", nombre: "Mariano",
        apellido: "García", roles: "Ingreso/Egreso"
      }
    ]);

    setUsersData(datos);
    setLoadingUsersTable(false);
  };

  // For modal create user
  const {
    isOpen: isOpenModalFormUser,
    onOpen: onOpenModalFormUser,
    onClose: onCloseModalFormUser,
  } = useDisclosure({ defaultIsOpen: false });

  const [redAlertText, setRedAlertText] = useState("");
  const cancelRefRedAlert = React.useRef();
  const {
    isOpen: isOpenRedAlert,
    onOpen: onOpenRedAlert,
    onClose: onCloseRedAlert,
  } = useDisclosure({ defaultIsOpen: false });

  const [formValuesForEditUser, setFormValuesForEditUser] = useState({});

  const callbackModalFormUser = (mensaje) => {
    setRedAlertText(mensaje);
    onOpenRedAlert();
    getUsersForTable();
  };

  const callbackClickCreateUser = () => {
    setIsCreationMode(true);
    onOpenModalFormUser();
  }

  const callbackUserDeleted = () => {
    getUsersForTable();
  }

  // Constructor
  useEffect(() => {
    getUsersForTable();
  }, []);

  return (
    <>
      <Header rol="Administrador" />
      <Box flexDirection="row" w="full" h="full" align="center">
        <Box flexDirection="column" w="full" align="center" pl={5} pr={5}>
          <Box flexDirection="row" w="full">
            <HStack spacing="2%">
              <Box w="100%" border="2px" borderColor="teal" title="Usuarios">
                <Box align="" pl={1}>
                  <Heading
                    align="center"
                    mt="-15px"
                    backgroundColor="white"
                    w="220px"
                    size="SM"
                  >
                    Usuarios
                  </Heading>

                  {usersData && (
                    <TableUsuarios
                      dataTable={usersData}
                      title="Usuarios"
                      columns={usersColumns}
                      loading={loadingUsersTable}
                      callbackClickCreateUser={callbackClickCreateUser}
                      callbackUserDeleted={callbackUserDeleted}
                    />
                  )}
                  <ModalFormUserCtm
                    isOpen={isOpenModalFormUser}
                    onClose={onCloseModalFormUser}
                    formValuesForEditUser={formValuesForEditUser}
                    callbackModalFormUser={callbackModalFormUser}
                    title={isCreationMode ? "Nuevo Usuario" : "Editar Usuario"}
                    props={props}
                    isCreationMode={isCreationMode}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>
        </Box>
      </Box>

      <AlertDialogAceptCtm
        cancelRef={cancelRefRedAlert}
        onCloseAlert={onCloseRedAlert}
        isOpenAlert={isOpenRedAlert}
        alertText={redAlertText}
      />
    </>
  );
};

export default Administrador;
