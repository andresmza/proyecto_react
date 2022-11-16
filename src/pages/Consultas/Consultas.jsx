import Header from "../Header";
import { Flex, Text } from "@chakra-ui/react";

const Consultas = () => {
  return (
    <>
      <Header rol="Consultas" />
      <Flex
        flexDirection="row"
        minHeight="100vh"
        w="full"
        align="center"
        justifyContent="center"
      >
        <Text
          textTransform="uppercase"
          fontWeight="bold"
          fontSize="6xl"
          pb={200}
          opacity="30%"
        >
          Pantalla Consultas
        </Text>
      </Flex>
    </>
  );
};

export default Consultas;
