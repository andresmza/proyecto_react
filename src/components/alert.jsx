import {
  Alert,
  AlertIcon,
  Box,
  CloseButton,
  AlertDescription,
} from "@chakra-ui/react";
import React, { useState } from "react";

const AlertMsg = (props) => {
  const [closed, setClosed] = useState(false);

  const handleCloseButtonClick = () => {
    setClosed(true);
  };

  return !closed ? (
    <Box mt={props.mt} mb={props.mb} ml={props.ml} mr={props.mr}>
      <Alert status={props.status}>
        <AlertIcon />
        <Box w={"full"}>
          <AlertDescription>{props.message}</AlertDescription>
        </Box>
        <Box>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-3}
            onClick={handleCloseButtonClick}
          />
        </Box>
      </Alert>
    </Box>
  ) : (
    ""
  );
};

export default AlertMsg;
