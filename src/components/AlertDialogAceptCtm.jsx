import {
    Flex,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogOverlay,
    AlertDialogContent,
    Button,
} from "@chakra-ui/react";

export function AlertDialogAceptCtm({
    cancelRef,
    onCloseAlert,
    isOpenAlert,
    alertText,
    errorMode = false,
}) {
    return (
        <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onCloseAlert}
            isOpen={isOpenAlert}
            isCentered
            size="xs"
            blockScrollOnMount={false}
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogBody align="center" p={8}>
                    {alertText}
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Flex
                        flexDirection="row"
                        w="full"
                        align="center"
                        justifyContent="center"
                    >
                        <Button
                            colorScheme={errorMode ? null : "teal"}
                            color={errorMode ? "rgba(255,255,255, 0.9)" : null}
                            backgroundColor={errorMode ? "rgba(197, 48, 48, 1)" : null}
                            ml={5}
                            onClick={onCloseAlert}
                            pl={10}
                            pr={10}
                        >
                            Aceptar
                        </Button>
                    </Flex>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
