import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDocs, query, where, DocumentData } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Grid, Typography, Stack } from "@mui/material";

import { binDbRef } from "../App";

export default function Bin() {
    const [information, setinformation] = useState<DocumentData>();
    const [imageUrl, setImageUrl] = useState<string>("");

    const params = new URLSearchParams(useLocation().search);
    const bin = params.get("bin")?.replace(/_/g, " ");

    useEffect(() => {
        async function fetchData() {
            const docs = await getDocs(query(binDbRef, where("location", "==", bin)));
            const doc = docs.docs[0];
            setinformation(doc.data());

            const storage = getStorage();
            const imageRef = ref(storage, doc.data().location);
            const downloadUrl = await getDownloadURL(imageRef);
            setImageUrl(downloadUrl);
        }
        fetchData();
    }, [bin])

    return(
        <Grid container justifyItems="center" alignItems="center" height="80vh">
            <Grid item xs={6}>
                <Stack spacing={2}>
                    <>
                        <Typography variant="h4">Location:</Typography>
                        <Typography variant="h6">{information?.location}</Typography>
                    </>
                    <>
                        <Typography variant="h4">Address:</Typography>
                        <Typography variant="h6">{information?.address}</Typography>
                    </>
                    <>
                        <Typography variant="h4">Status:</Typography>
                        <Typography variant="h6" sx={{display: "inline"}}>Full</Typography>
                    </>
                </Stack>
            </Grid>
            <Grid item xs={6}>
                <img src={imageUrl} style={{width: "100%"}}></img>
                <Stack>
                    {information?.comment && <></>}
                </Stack>
            </Grid>
        </Grid>
    )
}