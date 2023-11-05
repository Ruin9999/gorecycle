import { useState } from 'react';
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { TextField, Stack, Grid, Button, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ref } from '../App';

const INPUTWIDTH = 300;

const isEmail = (email : string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
}

export default function SignUpPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [isInvalidForm, setInvalidForm] = useState(false);

    const navigate = useNavigate();

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

    function handleConfirm() {
        if(password !== confirmPassword) setConfirmError(true);
        else setConfirmError(false);
    }

    async function checkExists() {
        const snapshot = await getDocs(query(ref, where("email", "==", email)));
        if(!snapshot.empty) return true;
        else return false;
    }

    /* IMPLEMENT checking if fields empty */
    async function handleSubmit() {
        setInvalidForm(false);
        
        if(await checkExists()) {
                setInvalidForm(true);
                return;
        }
        
        console.log("Submitting form");

        try {
            const snapshot = await addDoc(ref, {
            email: email,
            password: password,
            });
            
            navigate("/navigation");
            console.log("Document written with ID: ", snapshot.id); 
        } catch (e) {
            console.log("Error adding document: ", e);
        }
    }

    return (
        <Grid container justifyContent="center" alignItems="center" height="80vh">
            <Stack spacing={2}>
                <TextField
                    required
                    label="Email"
                    error={emailError}
                    variant="standard"
                    sx={{ width: INPUTWIDTH }}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmail}/>
                <TextField
                    required
                    label="Password"
                    error={passwordError}
                    variant="standard"
                    type="password"
                    sx={{ width: INPUTWIDTH }}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePassword}/>
                <TextField
                    required
                    label="Confirm Password"
                    error={confirmError}
                    variant="standard"
                    type="password"
                    sx={{ width: INPUTWIDTH }}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={handleConfirm}/>
                <FormControlLabel
                    sx={{color: "#8B8E88"}}
                    control={<Checkbox size="small" />}
                    label="I agree to the Terms and Conditions"/>
                <Button variant="contained"  onClick={handleSubmit}>Create account</Button>
                <Button variant="text" href="login" >Already have an account?</Button>
                {
                    isInvalidForm ? <Alert severity="error">Email already exists</Alert> : null
                }
            </Stack>
        </Grid>
    )
}