import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import { Input } from "@chakra-ui/react";


export const DatePickerField = ({ ...props } ) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <Input
      type="datetime-local"
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={val => {
        setFieldValue(field.name, val);
      }}
    />
  );
};