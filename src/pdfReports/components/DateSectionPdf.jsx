import React from 'react';
import { Text, Font } from '@react-pdf/renderer';

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
let hh = today.getHours();
let min = today.getMinutes();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
if (min < 10) mm = '0' + mm;
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

const DateSectionPdf = () => (
  <>
    <Text style={{ fontSize: "8", textAlign: "right", fontFamily: "Roboto" }}>{formattedToday}</Text>
  </>
);

export default DateSectionPdf;