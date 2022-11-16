import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { esES } from '@mui/material/locale';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Spinner } from "@chakra-ui/react";
import { PhoneEnabled } from "@mui/icons-material";

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

export default function Tabla({ dataTable, title, columns, loading, customOptions }) {
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("600px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(false);
  const [printBtn, setPrintBtn] = useState(false);
  const [viewColumnBtn, setViewColumnBtn] = useState(false);
  const [filterBtn, setFilterBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const options = {
    search: searchBtn,
    download:  customOptions?.download ?? downloadBtn,
    print:  customOptions?.print ?? printBtn,
    viewColumns: customOptions?.viewColumns ?? viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight: customOptions?.tableBodyHeight ?? "75vh",
    tableBodyMaxHeight: customOptions?.tableBodyMaxHeight ?? "75vh",
    elevation: 0,
    selectableRows: "none",
    border: [[1, 'solid', '#d3d3d3']],
    onTableChange: (action, state) => {
    },
    textLabels: {
      body: {
        noMatch: customOptions?.noMatch ?? 'No hay anexos en este estado',
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
  };

  return (
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
  );
}
