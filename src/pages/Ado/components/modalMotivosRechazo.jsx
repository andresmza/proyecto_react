import React from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";

const COLOR_SCHEME = "teal";

export default function ModalMotivosRechazo({
  motivosRechazo,
  isOpen,
  onClose,
  handleChange,
  handleSubmit,
  values,
}, props) {

  return (
    <>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size={"lg"}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Seleccione motivos de rechazo</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={4}>
            <Text fontWeight="bold" mb="1rem">
              Motivos de rechazo:
            </Text>

            <div role="group" aria-labelledby="checkbox-group">
            </div>

            <CheckboxGroup colorScheme={COLOR_SCHEME} defaultValue={null}>
              <Stack ml={4} spacing={[1, 0]} direction={["column"]}>
                {motivosRechazo.map((item, key) => {
                  return (
                    <Checkbox
                      name={`motivosRechazo[${item.idMotivoRechazo}]`}
                      key={item.idMotivoRechazo}
                      onChange={handleChange}
                      isChecked={values.motivosRechazo[item.idMotivoRechazo]}
                    >
                      {item.descripcion}
                    </Checkbox>
                  );
                })}
              </Stack>
            </CheckboxGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button
              type="submit"
              colorScheme={COLOR_SCHEME}
              width="10ch"
              disabled={false}
              onClick={handleSubmit}
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
