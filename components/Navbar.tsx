import { AppBar, Toolbar, Typography, Stack, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Navbar(): JSX.Element {
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{boxShadow: 'none',
         backgroundColor: theme.palette.background.default,
         color: theme.palette.text.primary}}>
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="logo" href="/">
                    <img src="gorecycle_logo.svg" alt="logo" width="50px" height="50px" />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>GoRecycle</Typography>
                <Stack direction="row" spacing={2}>
                    <Button color="inherit" href="about">About Us</Button>
                    <Button color="inherit" href="login">Login</Button>
                    <Button color="inherit" href="signup">Sign Up</Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}