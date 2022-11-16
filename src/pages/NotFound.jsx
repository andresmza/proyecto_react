import Header from "./Header";
import { Flex, Text } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <>
      <Header rol="Volver a Inicio" />
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
          Página no encontrada.
        </Text>
      </Flex>
    </>
  );
};

export default NotFound;
