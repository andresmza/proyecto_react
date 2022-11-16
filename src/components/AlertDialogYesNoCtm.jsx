import {
    Flex,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogOverlay,
    AlertDialogContent,
    Button,
} from "@chakra-ui/react";

export function AlertDialogYesNoCtm({
    cancelRef,
    onCloseAlert,
    isOpenAlert,
    alertText,
    onClickYes,
    onClickNo,
}) {
    return (
        <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onCloseAlert}
            isOpen={isOpenAlert}
            isCentered
            size="xs"
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
                        <Button ref={cancelRef} onClick={onClickNo} pl={10} pr={10}>
                            No
                        </Button>
                        <Button
                            colorScheme="teal"
                            ml={5}
                            onClick={onClickYes}
                            pl={10}
                            pr={10}
                        >
                            Si
                        </Button>
                    </Flex>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
