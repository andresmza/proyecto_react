import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import DateSectionPdf from "../components/DateSectionPdf";
import ControlService from "../../services/ControlService";

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
    marginTop: 1,
    marginRight: 10,
    marginBottom: 1,
    marginLeft: 10,
  },
  section1: {
    marginTop: 1,
    marginRight: 10,
    marginBottom: 1,
    marginLeft: 10,
    flexGrow: 1,
    borderBottom: 1,
    flexDirection: "row",
  },
  section1a: {
    width: "34%",
    paddingBottom: 5,
  },
  section1b: {
    flexDirection: "column",
    width: "66%",
    paddingTop: -5,
  },
  section1b1: {
    flexGrow: 1,
  },
  section1b2: {
    flexGrow: 2,
  },
  section1b3: {
    flexGrow: 2,
  },
  section11: {
    paddingLeft: "2%",
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    border: 1,
  },
  section2_2: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 3,
    flexDirection: "row",
  },
  section2_3: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 3,
  },
  section2_1b: {
    paddingLeft: "2%",
    width: "31%",
  },
  section2_1c: {
    paddingLeft: "2%",
    width: "31%",
  },
  section2_1a4: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_1b1: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_1b2: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_1b3: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_1c1: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_1c2: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_1c3: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_2a: {
    width: "50%",
  },
  section2_2b: {
    paddingLeft: "2%",
    width: "48%",
  },
  section2_2a1: {
    flexDirection: "row",
  },
  section2_2a2: {
    flexDirection: "column",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_2b1: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_2b2: {
    flexDirection: "column",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_3a: {
    width: "100%",
  },
  section2_3a1: {
    flexDirection: "row",
  },
  section2_3a2: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_3a3: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  image: {
    height: 55
  },
});

const CamionesRechazadosPdf = ({ camionesRechazadosData }) => {

  return (
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
                <View style={styles.section1b1}>
                  <DateSectionPdf />
                </View>
                <View style={styles.section1b2}>
                  <Text style={{ fontSize: "14", textAlign: "center", fontFamily: "Roboto", fontWeight: 700 }}>Camiones Rechazados e Igualmente</Text>
                </View>
                <View style={styles.section1b3}>
                  <Text style={{ fontSize: "14", textAlign: "center", fontFamily: "Roboto", fontWeight: 700 }}> Aprobados por Energía</Text>
                </View>
              </View>
            </View>

            <View style={{ marginLeft: 10, marginRight: 10, paddingTop: 3, paddingBottom: 10, flexGrow: 1, border: 1, flexDirection: "column", }}>
              <View style={{ marginLeft: 10, marginRight: 10, paddingTop: 3, flexDirection: "row", }}>
                <View style={{ width: "34%", }}>
                  <View style={{ flexDirection: "row", }}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Desde: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{camionesRechazadosData.fechaDesde}</Text>
                  </View>
                  <View style={{ flexDirection: "row", }}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Hasta: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{camionesRechazadosData.fechaHasta}</Text>
                  </View>
                </View>
              </View>
            </View>

          </View>
        </Page>
      </Document>
    </>
  );
};

export default CamionesRechazadosPdf;