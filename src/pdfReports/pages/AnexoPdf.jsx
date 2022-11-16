import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import DateSectionPdf from "../components/DateSectionPdf";
import { Grid, GridItem } from "@chakra-ui/react";
import { RadioButton } from "../../components/inputsForm";
import ControlService from "../../services/ControlService";

const controlService = ControlService.getInstance();

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
  section2: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 3,
    flexGrow: 1,
    border: 1,
    flexDirection: "column",
  },
  section2_1: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 3,
    flexDirection: "row",
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
  section2_1a: {
    width: "34%",
  },
  section2_1b: {
    paddingLeft: "2%",
    width: "31%",
  },
  section2_1c: {
    paddingLeft: "2%",
    width: "31%",
  },
  section2_1a1: {
    flexDirection: "row",
  },
  section2_1a2: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
  },
  section2_1a3: {
    flexDirection: "row",
    paddingTop: 1,
    paddingBottom: 1,
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

const AnexoPdf = ({ anexoData }) => {

  function esPar(numero) {
    return (numero % 2) == 0;
  }

  const ControlsByEtapa = (idEtapa, esListaIzquierda) => {
    // idEtapa: 1 "Entrada - Guardia 1", 
    // 2 "PESAJE INICIAL - Báscula", 
    // 3 "DESCARGA - Descargadero", 
    // 4 "PESAJE FINAL - Báscula", 
    // 5 "SALIDA - Guardia 1".
    let controlsForThisEtapa = [];
    anexoData.controls.map((control) => {
      if (control.control.idEtapa === idEtapa) {
        const name = "control" + control["idControl"];
        const label = control.control["texto"];
        const value = control["valor"];
        const order = control.control["orden"];
        controlsForThisEtapa.push([name, label, value, order]);
      }
    })

    if (controlsForThisEtapa.length === 0) {
      anexoData.cleanControls.map((control) => {
        if (control.idEtapa === idEtapa) {
          const name = "control" + control["idControl"];
          const label = control["texto"];
          const value = null;
          const order = control["orden"];
          controlsForThisEtapa.push([name, label, value, order]);
        }
      })
    }

    controlsForThisEtapa.sort(function (a, b) { return a.order - b.order });

    let definitiveControlsList = [];
    controlsForThisEtapa.map((control, index) => {
      if (esListaIzquierda) {
        if (esPar(index)) {
          definitiveControlsList.push(control);
        }
      } else {
        if (!esPar(index)) {
          definitiveControlsList.push(control);
        }
      }
    })

    return (
      <>
        {definitiveControlsList.map((item, key) => {
          let xEnSi = item[2] === "sí" ? "x" : " ";
          let xEnNo = item[2] === "no" ? "x" : " ";
          return (
            <View key={key} style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: "9", fontFamily: "Roboto", width: "78%" }}>{item[1]}: </Text>
              <Text style={{ fontSize: "9", fontFamily: "Roboto", width: "11%" }}>sí ( {xEnSi} ) </Text>
              <Text style={{ fontSize: "9", fontFamily: "Roboto", width: "11%" }}>no ( {xEnNo} )</Text>
            </View>
          );
        })}
      </>
    );
  };

  const ControlsByEtapaIzquierda = ({ idEtapa }) => {
    return ControlsByEtapa(idEtapa, true);
  };

  const ControlsByEtapaDerecha = ({ idEtapa }) => {
    return ControlsByEtapa(idEtapa, false);
  };

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
                  <Text style={{ fontSize: "11", textAlign: "center", fontFamily: "Roboto", fontWeight: 700 }}>Comprobante Final</Text>
                </View>
                <View style={styles.section1b3}>
                  <Text style={{ fontSize: "14", textAlign: "center", fontFamily: "Roboto", fontWeight: 700 }}>Anexo N° {anexoData.nroAnexo} - Control de Ingreso de combustible</Text>
                </View>
              </View>
            </View>
            <View style={styles.section11}>
              <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>ENTRADA - Guardia 1 </Text>
            </View>
            <View style={styles.section2}>
              <View style={styles.section2_1}>
                <View style={styles.section2_1a}>
                  <View style={styles.section2_1a1}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Combustible: </Text>
                  </View>
                  <View style={styles.section2_1a2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>Tipo Combustible: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.producto}</Text>
                  </View>
                  <View style={styles.section2_1a3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>Proveedor: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.proveedor}</Text>
                  </View>
                  <View style={styles.section2_1a4}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>Transportista: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.transportista}</Text>
                  </View>
                </View>
                <View style={styles.section2_1b}>
                  <View style={styles.section2_1b1}>
                    <Text style={{ color: "white", fontSize: "10", fontFamily: "Roboto" }}>ESPACIO </Text>
                  </View>
                  <View style={styles.section2_1b2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", borderLeft: 1, paddingLeft: 10 }}>Remito N°: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.numeroRemito}</Text>
                  </View>
                  <View style={styles.section2_1b3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", borderLeft: 1, paddingLeft: 10 }}>Destinatario: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.destinatario}</Text>
                  </View>
                </View>
                <View style={styles.section2_1c}>
                  <View style={styles.section2_1c1}>
                    <Text style={{ color: "white", fontSize: "10", fontFamily: "Roboto" }}>ESPACIO </Text>
                  </View>
                  <View style={styles.section2_1c2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", borderLeft: 1, paddingLeft: 10 }}>Fecha Ingreso: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.fechaIngreso}</Text>
                  </View>
                  <View style={styles.section2_1c3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", borderLeft: 1, paddingLeft: 10 }}>Hora: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.horaIngreso}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.section2_2}>
                <View style={styles.section2_2a}>
                  <View style={styles.section2_2a1}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Controles: </Text>
                  </View>
                </View>
              </View>
              <View style={styles.section2_1}>
                <View style={{ width: "50%" }} >
                  <ControlsByEtapaIzquierda idEtapa={1} />
                </View>
                <View style={{ paddingLeft: "1%", width: "48%" }} >
                  <ControlsByEtapaDerecha idEtapa={1} />
                </View>
              </View>
              <View style={styles.section2_3}>
                <View style={styles.section2_3a}>
                  <View style={styles.section2_3a1}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Observaciones: </Text>
                  </View>
                  <View style={styles.section2_3a2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.observaciones}</Text>
                  </View>
                  <View style={styles.section2_3a3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Verificó: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.sectionEntrada.verifico}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section11}>
              <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>PESAJE INICIAL - Báscula </Text>
            </View>
            <View style={styles.section2}>
              <View style={styles.section2_1}>
                <View style={{ width: "50%" }} >
                  <ControlsByEtapaIzquierda idEtapa={2} />
                </View>
                <View style={{ paddingLeft: "1%", width: "48%" }} >
                  <ControlsByEtapaDerecha idEtapa={2} />
                </View>
              </View>
              <View style={styles.section2_2}>
                <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Nombre del Laboratorista: </Text>
                <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa3.nombreLaboratorista}</Text>
              </View>
              <View style={styles.section2_3}>
                <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Controles: </Text>
              </View>
              <View style={styles.section2_1}>
                <View style={{ width: "50%" }} >
                  <ControlsByEtapaIzquierda idEtapa={3} />
                </View>
                <View style={{ paddingLeft: "1%", width: "48%" }} >
                  <ControlsByEtapaDerecha idEtapa={3} />
                </View>
              </View>
              <View style={styles.section2_3}>
                <View style={{ width: "98%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Observaciones: </Text>
                  </View>
                  <View style={styles.section2_3a2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa3.observaciones}</Text>
                  </View>
                  <View style={styles.section2_3a3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Verificó: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa3.verifico}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section11}>
              <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>DESCARGA - Descargadero </Text>
            </View>
            <View style={styles.section2}>
              <View style={styles.section2_3}>
                <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Controles: </Text>
              </View>
              <View style={styles.section2_1}>
                <View style={{ width: "50%" }} >
                  <ControlsByEtapaIzquierda idEtapa={4} />
                </View>
                <View style={{ paddingLeft: "1%", width: "48%" }} >
                  <ControlsByEtapaDerecha idEtapa={4} />
                </View>
              </View>
              <View style={styles.section2_3}>
                <View style={{ width: "98%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Precintos que abre el responsable de la descarga: </Text>
                  </View>
                  <View style={styles.section2_3a2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa5.precintos}</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Observaciones: </Text>
                  </View>
                  <View style={styles.section2_3a2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa5.observaciones}</Text>
                  </View>
                  <View style={styles.section2_3a3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Liberó: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa5.libero}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section11}>
              <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>PESAJE FINAL - Báscula </Text>
            </View>
            <View style={styles.section2}>
              <View style={styles.section2_3}>
                <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Controles: </Text>
              </View>
              <View style={styles.section2_1}>
                <View style={{ width: "50%" }} >
                  <ControlsByEtapaIzquierda idEtapa={5} />
                </View>
                <View style={{ paddingLeft: "1%", width: "48%" }} >
                  <ControlsByEtapaDerecha idEtapa={5} />
                </View>
              </View>
              <View style={styles.section2_3}>
                <View style={{ width: "98%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Observaciones: </Text>
                  </View>
                  <View style={styles.section2_3a2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa6.observaciones}</Text>
                  </View>
                  <View style={styles.section2_3a3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Verificó: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa6.verifico}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section11}>
              <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>SALIDA - Guardia 1 </Text>
            </View>
            <View style={styles.section2}>
              <View style={{ marginRight: 10, paddingTop: 3, flexDirection: "row", }}>
                <View style={{ width: "65%" }}>
                  <View style={styles.section2_1c1}>
                    <Text style={{ color: "white", fontSize: "10", fontFamily: "Roboto" }}>ESPACIO </Text>
                  </View>
                  <View style={styles.section2_3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Controles: </Text>
                  </View>
                </View>
                <View style={{ paddingLeft: "2%", width: "31%", }}>
                  <View style={styles.section2_1c2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", borderLeft: 1, paddingLeft: 10 }}>Fecha Egreso: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa7.fechaEgreso}</Text>
                  </View>
                  <View style={styles.section2_1c3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", borderLeft: 1, paddingLeft: 10 }}>Hora: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa7.horaEgreso}</Text>
                  </View>
                </View>
              </View>
              <View style={{ marginRight: 10, paddingTop: 3, flexDirection: "row", }}>
                <View style={styles.section2_1}>
                  <View style={{ width: "50%" }} >
                    <ControlsByEtapaIzquierda idEtapa={6} />
                  </View>
                  <View style={{ paddingLeft: "1%", width: "48%" }} >
                    <ControlsByEtapaDerecha idEtapa={6} />
                  </View>
                </View>
              </View>
              <View style={styles.section2_3}>
                <View style={{ width: "98%" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Observaciones: </Text>
                  </View>
                  <View style={styles.section2_3a2}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}></Text>
                  </View>
                  <View style={styles.section2_3a3}>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto", fontWeight: 700 }}>Verificó: </Text>
                    <Text style={{ fontSize: "10", fontFamily: "Roboto" }}>{anexoData.etapa7.verifico}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
              <Text style={{ fontSize: "8", textAlign: "right", fontFamily: "Roboto" }}>IdAnexo: {anexoData.idAnexo}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default AnexoPdf;