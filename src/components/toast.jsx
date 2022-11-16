import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export function useToastHook() {
  const [stateT, setStateT] = useState();
  const toast = useToast();

  useEffect(() => {
    if (state) {
      const { message, status } = state;

      toast({
        title: status,
        description: message,
        status: status,
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }
  }, [state, toast]);

  return [stateT, setStateT];
}