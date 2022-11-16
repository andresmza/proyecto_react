import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { esES } from '@mui/material/locale';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Spinner, useDisclosure, } from "@chakra-ui/react";
import CustomToolbar from "./customToolbar";
import { AlertDialogYesNoCtm } from "../../../components/AlertDialogYesNoCtm";

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  esES,
);

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true
});

const COLOR_SCHEME = "teal";

export default function TableUsuarios({ dataTable, title, columns, loading, callbackClickCreateUser, callbackUserDeleted }) {
  const [responsive, setResponsive] = useState("standard"); // standard,vertical,stacked
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [printBtn, setPrintBtn] = useState(false);
  const [viewColumnBtn, setViewColumnBtn] = useState(false);
  const [filterBtn, setFilterBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [usersSelectedToDelete, setUsersSelectedToDelete] = useState([]);

  const [redAlertText, setRedAlertText] = useState("");
  const cancelRefRedAlert = React.useRef();
  const {
    isOpen: isOpenRedAlert,
    onOpen: onOpenRedAlert,
    onClose: onCloseRedAlert,
  } = useDisclosure({ defaultIsOpen: false });

  const deleteUser = () => {
    // console.log(user) => ['admin', 'Sistema, Administrador', 'Descargadero', 1, {id: 1, username: 'admin', nombre: 'Administrador', apellido: 'Sistema', roles: 'Descargadero'}]
    setIsLoading(true);

    let cantidad = usersSelectedToDelete.length;
    usersSelectedToDelete.map((user) => {
      // await anexoService.registerControlsByEtapaDescargadero(idEtapa, controlsAnexo).then((response) => {
      //   if (response.status == 200 || response.status == 201) {
      // callbackModalFormUser(response.data.mensaje);
      //     clearFormAndClose();
      //   } else {
      //     setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
      //     onOpenAlertDescargadero();
      //     console.log(response);
      //   }
      // }).catch((error) => {
      //   setAlertDescargaderoText("Ha ocurrido un problema al intentar guardar la descarga del camión.");
      //   onOpenAlertDescargadero();
      //   console.log(error);
      // }).finally(() => {
      if (cantidad == 1) {
        callbackUserDeleted();
        setIsLoading(false);
        onCloseRedAlert();
      } else {
        --cantidad;
      }
      // });
    });
  };

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const options = {
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive: responsive,
    tableBodyHeight: "75vh",
    tableBodyMaxHeight: "75vh",
    elevation: 0,
    selectableRows: "multiple",
    onTableChange: (action, state) => {
    },
    textLabels: {
      body: {
        noMatch: 'No hay usuarios cargados',
        toolTip: "Order by",
        columnHeaderTooltip: (column) => `Order by ${column.label}`,
      },
      pagination: {
        next: ">",
        previous: "<",
        rowsPerPage: "Total de items por página",
        displayRows: "de"
      },
      toolbar: {
        search: "Buscar",
        downloadcsv: "Descargar",
      },
      viewColumns: {
        title: "Mostrar columnas",
        titleAria: "Mostrar/ocultar columnas",
      },
    },
    customToolbar: () => {
      return (
        <CustomToolbar callbackClickCreateUser={callbackClickCreateUser} />
      );
    },
    onRowsDelete: (rowsDeleted, dataRows) => {
      const data = dataTable;
      const usersToDelete = rowsDeleted.data.map((d) => data[d.dataIndex]);
      setUsersSelectedToDelete(usersToDelete);

      var msg = rowsDeleted.data.length > 1 ? "¿Querés eliminar estos usuarios?" : "¿Querés eliminar este usuario?";
      setRedAlertText(msg);
      onOpenRedAlert();
    },
  };

  return (
    <>
      <CacheProvider value={muiCache}>
        {
          isLoading
            ?
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={COLOR_SCHEME}
              size="xl"
              hidden={!isLoading}
            />
            :
            <ThemeProvider theme={theme}>
              <MUIDataTable title={title} data={dataTable} columns={columns} options={options} />
            </ThemeProvider>
        }
      </CacheProvider>

      <AlertDialogYesNoCtm
        cancelRef={cancelRefRedAlert}
        onCloseAlert={onCloseRedAlert}
        isOpenAlert={isOpenRedAlert}
        alertText={redAlertText}
        onClickYes={deleteUser}
        onClickNo={onCloseRedAlert}
      />
    </>
  );
}
