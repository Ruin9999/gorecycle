import { Typography, Grid, Stack } from "@mui/material";

export default function AboutPage() {
    return (
        <Grid container justifyContent="center" alignItems="center" height="80vh">
            <Stack spacing={2}>
                <Typography variant="h2">About Us</Typography>
                <Typography variant="body1">Welcome to our platform!
                 We're a team of tech enthusiasts with a strong commitment to environmental sustainability.</Typography>
                
                <Typography variant="body1">Our journey began with a shared vision to address the responsible disposal of electronic waste. 
                With a passion for technology, we harnessed the power of software programming to create a convinent solution 
                for locating e-waste bins.</Typography>

                <Typography variant="body1">Our platform is the embodiment of our shared values. 
                We're here to make finding e-waste bins as easy as possible.
                Our goal is to encourage responsible electronic waste disposal for individals and businesses alike.</Typography>

                <Typography variant="body1">Join us on our mission to protect the environment and promote sustainable living.
                Together, we can make it more convenient for everyone to play a part in reducing e-waste and presurving our planet 
                for future generations.</Typography>

                <Typography variant="body1">Let's make the world cleaner, one e-waste bin at a time! 🌍♻️</Typography>
            </Stack>
        </Grid>
    )
}