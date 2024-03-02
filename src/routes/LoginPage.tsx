import { useState } from "react";
import { getDocs, query, where } from "@firebase/firestore";
import { TextField, Stack, Grid , Button, Checkbox, FormControlLabel, Alert } from "@mui/material";

import { userDbRef } from "../App";

const INPUTWIDTH = 300;

const isEmail = (email : string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
}

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [isInvalidForm, setInvalidForm] = useState(false);

    function handleEmail() {
        if (!isEmail(email)) {
            setEmailError(true);
            return;
        }
        setEmailError(false);
    }

    function handlePassword() {
        if(password.length < 8) setPasswordError(true);
        else setPasswordError(false);
    }

    /* IMPLEMENT checking if fields are empty */
    async function handleSubmit() {
        setInvalidForm(false);

        if(!email || !password || emailError || passwordError) {
            setInvalidForm(true);
            return;
        }

        console.log("Submitting form");

        const snapshot = await getDocs(query(userDbRef, where("email", "==", email), where("password", "==", password)));
        
        if (snapshot.empty) {
            setInvalidForm(true);
            return;
        }

        //Scuffed redirecting because useNavigation doesn't refresh the navbar when I use it
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", snapshot.docs[0].data().isAdmin);

        if(!snapshot.docs[0].data().isAdmin) {
            window.location.href = "/navigation";
        } else {
            window.location.href = "/admin";
        }

    }

    //Handle unauthorized access
    if(localStorage.getItem("isLoggedIn") === "true") {
        if(localStorage.getItem("isAdmin")) window.location.href = "/admin";
        else  window.location.href = "/navigation";
    }

    return (
        <Grid container justifyContent="center" alignItems="center" height="80vh">
            <Stack spacing={2}>
                <TextField 
                    label="Email" 
                    error={emailError}
                    variant="standard" 
                    sx={{width: INPUTWIDTH}} 
                    onChange={(e) => {setEmail(e.target.value)}}
                    onBlur={handleEmail}/>

                <TextField 
                    label="Password" 
                    error={passwordError}
                    variant="standard" 
                    type="password" 
                    sx={{width: INPUTWIDTH}} 
                    onChange={(e) => {setPassword(e.target.value)}}
                    onBlur={handlePassword}/>

                <FormControlLabel 
                sx={{color: "#8B8E88"}} 
                control={
                    <Checkbox size="small" />
                } 
                label="Remember me"/>

                <Button variant="contained" onClick={handleSubmit}>Login</Button>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Button href="" size="small" variant="text">Forgot password?</Button>
                    </Grid>
                    <Grid item>
                        <Button href="signup" size="small" variant="text">Create an account</Button>
                    </Grid>
                </Grid>
                {
                    isInvalidForm ? <Alert severity="error">Invalid email or password</Alert> : null
                }
            </Stack>
        </Grid>
    )
}   