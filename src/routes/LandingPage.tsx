import { Grid, Typography, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import buttonStyle from "../styles/ButtonStyle";

export default function LandingPage() : JSX.Element {
    const style = buttonStyle();
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate("navigation");
    }

    return (
        
        <Grid container justifyContent="center" alignItems="center" height="80vh">
            <Stack>
                <img
                    alt="The GoRecycle logo."
                    src="gorecycle_logo.svg"
                    style={{ height: '40%', width: '40%', margin: 'auto' }}
                />
                <Stack spacing={2}>
                    <Typography variant="h2">GoRecycle</Typography>
                    <Button color="inherit" onClick={handleOnClick} sx={style}>Find collection points</Button>
                </Stack>    
            </Stack>
        </Grid>
    )
}