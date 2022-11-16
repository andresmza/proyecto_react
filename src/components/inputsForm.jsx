import React, { useState } from "react";
import {
  Box,
  FormLabel,
  FormErrorMessage,
  FormControl,
  Spacer,
  Flex,
  Text,
  InputRightAddon,
  InputGroup,
} from "@chakra-ui/react";
import { Field, useField, useFormikContext } from "formik";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import "./inputsForm.css";

const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function InputText({
  as,
  inputKey,
  name,
  type,
  error,
  touched,
  handleChange,
  disabled,
  value,
  readOnly,
  inputRightAddon,
  autoComplete,
}) {
  // console.log(as,
  //   inputKey,
  //   name,
  //   type,
  //   error,
  //   touched,
  //   handleChange,
  //   disabled,
  //   value,
  //   readOnly,
  //   inputRightAddon,
  //   autoComplete,)
  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={inputKey}>{name && name + ': '}</FormLabel>
      <InputGroup size='sm'>
        <Field
          width="300px"
          size='sm'
          as={as}
          id={inputKey}
          name={inputKey}
          type={type}
          variant="filled"
          onChange={handleChange}
          disabled={disabled}
          value={value}
          readOnly={readOnly}
          autoComplete={autoComplete ? autoComplete : null}
        />
        {inputRightAddon && (
          <InputRightAddon children={inputRightAddon} />
        )}
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}

export function RadioButton({ label, name, meta, disabled = false, yesChecked = null, yesError = false, noChecked = null, noError = false }) {
  let colorYes = '';
  let colorNo = '';
  yesError ? colorYes = "red" : colorYes = "black";
  noError ? colorNo = "red" : colorNo = "black";

  if(meta.value){
    if(meta.value == 'sí') yesChecked = true;
    if(meta.value == 'no') noChecked = true;
  }

  return (
    <FormControl key={name} isInvalid={!!meta.error && meta.touched}>
      <Flex marginLeft={0} spacing="3%">
        <Box w="75%" h="3" bg="white.500">
          <FormLabel htmlFor={name}><Text fontSize='sm'>{label}:</Text></FormLabel>
        </Box>
        <Box w="10%" h="3" bg="white.500">
          <label style={{color: colorYes}}>
            <Field type="radio" name={name} value="sí" disabled={disabled} checked={yesChecked}/> <span>Si</span>
          </label>
        </Box>
        <Box w="15%" h="3" bg="white.500">
          <Spacer />
          <label style={{color: colorNo}}>
            <Field type="radio" name={name} value="no" disabled={disabled} checked={noChecked}/> <span>No</span>
          </label>
        </Box>
      </Flex>
      <Text color={'red.500'} fontSize='sm' mt={1}>{meta.error && meta.touched}</Text>
    </FormControl>
  );
}


export const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  return (
    <SingleDatepicker
      name="date-input"
      date={field.value}
      onDateChange={val => {
        // console.log(field.name, val)
        setFieldValue(field.name, val);
      }}
      propsConfigs={{
        dateNavBtnProps: {
          colorScheme: 'teal',
        },
        dayOfMonthBtnProps: {
          defaultBtnProps: {
            _hover: {
              background: 'teal.400',
            },
          },
          isInRangeBtnProps: {
          },
          selectedBtnProps: {
            background: 'teal.400',
            borderColor: 'teal.300',
            color: 'gray.200',
          },
          todayBtnProps: {
            color: 'teal.700',
            variant: 'outline',
          },
        },
        inputProps: {
          size: 'md',
          borderRadius: '5px',
        },
        popoverCompProps: {
          popoverContentProps: {
          },
        },
      }}
      configs={{
        dateFormat: 'dd-MM-yyyy',
        dayNames: dayNames,
        monthNames: monthNames,
        firstDayOfWeek: 0,
      }}

    />
  );
};

