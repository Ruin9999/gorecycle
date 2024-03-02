import { useLocation, useNavigate } from "react-router-dom";
import { addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { Grid, Stack, Typography, Button, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import UploadSharpIcon from '@mui/icons-material/UploadSharp';

import { binDbRef } from "../App";

const UploadImageButtonStyle = {
    minHeight: "300px",
    height: "50%",
    width: "100%",
    color: "#60625e",
    borderColor: "#b8bcb4",
    "&:hover": {
        backgroundColor: "transparent",
        borderColor: "#1a550e",
    }
}

export default function UploadPage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [comment, setComment] = useState("");
    const [binStatus, setBinStatus] = useState<0 | 1 | 2>(0); //0 = empty, 1 = half, 2 = full

    const params = new URLSearchParams(useLocation().search);
    const category = params.get("category")?.replace(/_/g, " "); //Not changing to uppercase because xin ying doesn't
    const location = params.get("location")?.replace(/_/g, " ").toUpperCase();
    const address = params.get("address")?.replace(/_/g, " ").toUpperCase();
    const navigate = useNavigate();

    function handleCommentChange(e: React.ChangeEvent<HTMLInputElement>) {
        setComment(e.target.value);
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.value != "0" && e.target.value != "1" && e.target.value != "2") return;
        setBinStatus(parseInt(e.target.value) as 0 | 1 | 2);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files == null) return;

        if(!isImage(e.target.files[0])) {
            alert("Please upload an image file!");
            return;
        }
        setImageFile(e.target.files[0]);
    }

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        if(imageFile != null) await uploadFile(imageFile);
        await uploadDetails();
        alert("Successfully uploaded details!");
        navigate("/navigation");
    }

    function getFileExtension(filename: string) {
        return filename.split('.').pop();
    }

    function isImage(file : File) {
        const extension = getFileExtension(file.name);
        if(extension == null) return false;
        return extension.toLowerCase() == "jpg" || extension.toLowerCase() == "jpeg" || extension.toLowerCase() == "png";
    }

    async function uploadDetails() { 
        const docs = await getDocs(query(binDbRef, where("location", "==", location)));
        if(!docs.empty) {
            docs.forEach(async (doc) => {
                console.log(`Deleting duplication document ${doc.id}`);
                await deleteDoc(doc.ref);
            })
        }

        await addDoc(binDbRef, {
            category: category,
            location: location,
            address: address,
            comment: comment,
            status: binStatus,
        });
        
        console.log(`Uploaded details for ${location} with comments: ${comment} and status: ${binStatus}`);
    }

    async function uploadFile(file: File) {
        const storage = getStorage();
        const storageRef = ref(storage, location || "default");
        await uploadBytes(storageRef, file);
    }

    return(
        <Grid container justifyContent="center" justifyItems="center" sx={{flexDirection: { xs: "column", md: "row"}}}>
            <Grid item xs={12} md={5}>
                <Typography variant="h6">Location:</Typography>
                <Typography variant="body1">{location}</Typography>
                <Typography variant="h6">Address:</Typography>
                <Typography variant="body1">{address}</Typography>
            </Grid>
            <Grid item xs={12} md={7}>
                <Stack spacing={2}>
                    <Button variant="outlined" component="label" sx={UploadImageButtonStyle}>
                        { 
                            imageFile == null ? <>
                            Upload Image
                            <UploadSharpIcon color="inherit"/>
                            <input color="inherit" onChange={handleFileChange} type="file" accept="image/jpeg, image/jpg, image/png" hidden/> </>: 
                            <img src={URL.createObjectURL(imageFile)} alt="Uploaded Image" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                        }
                    </Button>
                    <TextField label="Comment" placeholder="..." onChange={handleCommentChange} multiline minRows={5} maxRows={10}/>
                    <FormControl>
                        <FormLabel id="bin-status-label">Bin Status</FormLabel>
                        <RadioGroup row onChange={handleStatusChange}>
                            <FormControlLabel value="0" control={<Radio />} label="Empty" />
                            <FormControlLabel value="1" control={<Radio />} label="Half" />
                            <FormControlLabel value="2" control={<Radio />} label="Full" />
                        </RadioGroup>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
                </Stack>
            </Grid>
        </Grid>
    )
}