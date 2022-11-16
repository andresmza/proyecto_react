import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DownloadIcon from '@mui/icons-material/Download';
import { withStyles } from "@material-ui/core/styles";
import ReactPDF from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import CamionesRechazadosPdf from '../../../pdfReports/pages/CamionesRechazadosPdf';

const defaultToolbarStyles = {
    iconButton: {
    },
};

const CustomDownloadOnToolbar = ({ props, fechaDesde, fechaHasta, /*callbackClickDownload */ }) => {

    const exportlReporteCamionesRechazadosToPDF = async () => {
        props.props.props.setIsLoading(true);

        const camionesRechazadosData = {
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
        };

        const blob = await ReactPDF.pdf(
            <CamionesRechazadosPdf camionesRechazadosData={camionesRechazadosData} />
        ).toBlob();
        const fileName = "Camiones Rezazados.pdf";
        saveAs(blob, fileName);
        const fileURL = URL.createObjectURL(blob);
        const pdfWindow2 = window.open();
        const iframe = document.createElement('iframe');
        const title = document.createElement('title');
        title.appendChild(document.createTextNode(fileName));
        iframe.src = fileURL;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        pdfWindow2.document.head.appendChild(title);
        pdfWindow2.document.body.appendChild(iframe);
        pdfWindow2.document.body.style.margin = 0;
        props.props.props.setIsLoading(false);
    };

    const handleClickDownload = () => {
        exportlReporteCamionesRechazadosToPDF();
    };

    return (
        <>
            <Tooltip title={"Descargar PDF"}>
                <IconButton onClick={handleClickDownload}>
                    <DownloadIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}

export default withStyles(defaultToolbarStyles, { name: "CustomDownloadOnToolbar" })(CustomDownloadOnToolbar);