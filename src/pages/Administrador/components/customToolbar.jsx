import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
    iconButton: {
    },
};

const CustomToolbar = ({ callbackClickCreateUser }) => {

    // For button create user
    const handleClickCreateUser = () => {
        callbackClickCreateUser();
    };

    return (
        <>
            <Tooltip title={"Crear usuario"}>
                <IconButton onClick={handleClickCreateUser}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}

export default withStyles(defaultToolbarStyles, { name: "CustomToolbar" })(CustomToolbar);