import '@fontsource/rampart-one';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme } from "@mui/material";

export default createTheme({
    typography: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        h2: {
            fontFamily: "Rampart One",
        },
    }, 
    palette: {
        text: {
            primary: "#0D5601",
        },
        background: {
            default: "#EFF5E9",
        },
        primary:{
            light: "#79B87C",
            main: "#67B76A",
            contrastText: "#FFFFFF",
        },
    },
})