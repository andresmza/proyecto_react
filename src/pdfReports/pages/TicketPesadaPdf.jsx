import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import DateSectionPdf from "../components/DateSectionPdf";

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
let hh = today.getHours();
let min = today.getMinutes();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
const formattedToday = dd + "/" + mm + "/" + yyyy + ", " + hh + ":" + min;

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: `./fonts/roboto.regular.ttf`
    },
    {
      src: `./fonts/roboto.medium.ttf`,
      fontWeight: '700'
    },
    {
      src: `./fonts/roboto.bold.ttf`,
      fontWeight: '800',
    },
    {
      src: `./fonts/roboto.black.ttf`,
      fontWeight: '900',
    }
  ]
})

const styles = StyleSheet.create({
  page: {
  },
  principalView: {
    flexDirection: "column",
    border: 1,
    margin: 10,
  },
  section1: {
    margin: 10,
    flexGrow: 1,
    borderBottom: 1,
    flexDirection: "row",
  },
  section1a: {
    width: "34%",
    paddingBottom: 5,
  },
  section1b: {
    width: "33%",
    paddingTop: 5,
    paddingLeft: 15,
  },
  section1c: {
    flexDirection: "column",
    width: "33%",
    marginTop: -5,
  },
  section1c1: {
    flexGrow: 1,
  },
  section1c2: {
    flexGrow: 2,
  },
  section1c3: {
    flexGrow: 2,
  },
  section2: {
    marginLeft: 10,
    marginTop: 5,
    marginRight: 10,
    marginBottom: 10,
    paddingBottom: 5,
    flexGrow: 1,
    borderBottom: 1,
    flexDirection: "row",
  },
  section2a: {
    paddingLeft: "2%",
    width: "48%",
  },
  section2b: {
    paddingLeft: "2%",
    width: "48%",
  },
  section2a1: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2a2: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2a3: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2a4: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2a5: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2a6: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2a7: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2a8: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b1: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b2: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b3: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b4: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b5: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b6: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b7: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section2b8: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section3: {
    marginLeft: 10,
    marginTop: 5,
    marginRight: 10,
    marginBottom: 10,
    paddingBottom: 5,
    flexGrow: 1,
    borderBottom: 1,
    flexDirection: "row",
  },
  section3a: {
    paddingLeft: "2%",
    width: "54%",
  },
  section3b: {
    paddingLeft: "2%",
    width: "20%",
  },
  section3c: {
    paddingLeft: "2%",
    width: "20%",
  },
  section3a1: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section3a2: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section3b1: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section3b2: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section3c1: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section3c2: {
    flexDirection: "row",
    lineHeight: 2,
  },
  section4: {
    marginLeft: 10,
    marginTop: 5,
    marginRight: 10,
    marginBottom: 10,
    paddingBottom: 5,
    flexGrow: 1,
    flexDirection: "row",
  },
  section4a: {
    paddingLeft: "2%",
    width: "48%",
  },
  section4b: {
    paddingLeft: "2%",
    width: "48%",
  },
  section4a1: {
    paddingTop: 5,
    paddingBottom: 5,
    border: 1,
  },
  section4b1: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  image: {
    height: 55
  },
});

const TicketPesadaPdf = ({ ticketPesadaData }) => (
  <>
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.principalView}>
          <View style={styles.section1}>
            <View style={styles.section1a}>
              <Image
                style={styles.image}
                src="/img/logoCPSA_principal.jpg"
              />
            </View>
            <View style={styles.section1b}>
              <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>Parque Industrial Provincial</Text>
              <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>Luján de Cuyo - Mendoza</Text>
              <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>CUIT : 30-67821347-7</Text>
            </View>
            <View style={styles.section1c}>
              <View style={styles.section1c1}>
                <DateSectionPdf />
              </View>
              <View style={styles.section1c2}>
                <Text style={{ fontSize: "11", textAlign: "center", fontFamily: "Roboto", fontWeight: 700 }}>Ticket de Pesada</Text>
              </View>
              <View style={styles.section1c3}>
                <Text style={{ fontSize: "14", textAlign: "center", fontFamily: "Roboto", fontWeight: 700 }}>Ticket Nº: 32781</Text>
              </View>
            </View>
          </View>
          <View style={styles.section2}>
            <View style={styles.section2a}>
              <View style={styles.section2a1}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Patente Chasis: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.patenteChasis}</Text>
              </View>
              <View style={styles.section2a2}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Producto: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>{ticketPesadaData.section2.producto}</Text>
              </View>
              <View style={styles.section2a3}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Proveedor: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.proveedor}</Text>
              </View>
              <View style={styles.section2a4}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Destinatario: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.destinatario}</Text>
              </View>
              <View style={styles.section2a5}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Transportista: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.transportista}</Text>
              </View>
              <View style={styles.section2a6}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Nombre del Conductor: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.nombreConductor}</Text>
              </View>
              <View style={styles.section2a7}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Operador Entrada: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.operadorEntrada}</Text>
              </View>
              <View style={styles.section2a8}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Observaciones Entrada: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.observacionesEntrada}</Text>
              </View>
            </View>
            <View style={styles.section2b}>
              <View style={styles.section2b1}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Patente Acoplado: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.patenteAcoplado}</Text>
              </View>
              <View style={styles.section2b2}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>CUIT Proveedor: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.cuitProveedor}</Text>
              </View>
              <View style={styles.section2b3}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Remito del Proveedor: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }} > {ticketPesadaData.section2.remitoProveedor}</Text>
              </View>
              <View style={styles.section2b4}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>CUIT Destinatario: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.cuitDestinatario}</Text>
              </View>
              <View style={styles.section2b5}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>CUIT Transportista: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.cuitTransportista}</Text>
              </View>
              <View style={styles.section2b6}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}> </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}></Text>
              </View>
              <View style={styles.section2b7}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Operador Salida: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.operadorSalida}</Text>
              </View>
              <View style={styles.section2b8}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Observaciones Salida: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto" }}>{ticketPesadaData.section2.observacionesSalida}</Text>
              </View>
            </View>
          </View>
          <View style={styles.section3}>
            <View style={styles.section3a}>
              <View style={styles.section3a1}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Peso de Entrada: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>{ticketPesadaData.section3.pesoEntrada}</Text>
              </View>
              <View style={styles.section3a2}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Peso de Salida: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>{ticketPesadaData.section3.pesoSalida}</Text>
              </View>
            </View>
            <View style={styles.section3b}>
              <View style={styles.section3b1}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Fecha: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>{ticketPesadaData.section3.fechaEntrada}</Text>
              </View>
              <View style={styles.section3b2}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Fecha: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>{ticketPesadaData.section3.fechaSalida}</Text>
              </View>
            </View>
            <View style={styles.section3c}>
              <View style={styles.section3c1}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Hora: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>{ticketPesadaData.section3.horaEntrada}</Text>
              </View>
              <View style={styles.section3c2}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>Hora: </Text>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700 }}>{ticketPesadaData.section3.horaSalida}</Text>
              </View>
            </View>
          </View>
          <View style={styles.section4}>
            <View style={styles.section4a}>
              <View style={styles.section4a1}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700, paddingLeft: 5 }}>Peso Neto: {ticketPesadaData.section4.pesoNeto}</Text>
              </View>
            </View>
            <View style={styles.section4b}>
              <View style={styles.section4b1}>
                <Text style={{ fontSize: "11", fontFamily: "Roboto", fontWeight: 700, textAlign: "right" }}>{ticketPesadaData.section4.copia}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  </>
);

export default TicketPesadaPdf;