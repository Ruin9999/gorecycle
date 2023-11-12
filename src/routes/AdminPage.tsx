import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid, Typography, Stack } from "@mui/material";
import { addDoc, getDocs, query, where, DocumentData, deleteDoc } from "firebase/firestore";

import AdminBinListing from "../../components/AdminBinListing";
import { binDbRef } from "../App";

export default function AdminPage() {
    const [ binInformation, setBinInformation ] = useState<DocumentData[]>([]);
    const [ ictList, setIctList ] = useState<JSX.Element[]>([]);
    const [ batteriesandlampsList, setBatteriesandlampsList ] = useState<JSX.Element[]>([]);
    const [ shellsList, setShellsList ] = useState<JSX.Element[]>([]);
    const [ virogreenList, setVirogreenList ] = useState<JSX.Element[]>([]);
    const [ batteryList, setBatteryList ] = useState<JSX.Element[]>([]);

    const navigate = useNavigate();

    async function getBinInfo() {
        const docs = await getDocs(query(binDbRef, where("status", "==", 2)));
        setBinInformation(docs.docs);
    }

    async function handleOnComplete(binLocation: string) {
        const snapshot = await getDocs(query(binDbRef, where("location", "==", binLocation)));
        
        deleteDoc(snapshot.docs[0].ref);

        const doc = snapshot.docs[0]; // 

        await addDoc(binDbRef, {
            address: doc.data().address,
            category: doc.data().category,
            comment: doc.data().comment,
            location: doc.data().location,
            status: 0
        });

        alert(`Bin at ${binLocation} has been marked as cleared!`);
    }

    function handleOnView(binLocation: string) {
        navigate(`/bin?bin=${binLocation}`);
    }

    useEffect(() => {
        getBinInfo();
    }, []);

    useEffect(() => { //Handle ict list
        const ictList: JSX.Element[] = [];
        const batteriesandlamps: JSX.Element[] = [];
        const shells: JSX.Element[] = [];
        const virogreen: JSX.Element[] = [];
        const batteryList: JSX.Element[] = [];

        binInformation.forEach((bin) => {
            const data = bin.data();
            const element = <Grid item xs={12}>
            <AdminBinListing
                category={data.category}
                location={data.location}
                address={data.address}
                onComplete={() => handleOnComplete(data.location)}
                onView={() => handleOnView(data.location)}
            />
            </Grid>

            switch(bin.data().category) {
                case "ict":
                    ictList.push(element);
                    break;
                case "batteriesandlamps":
                    batteriesandlamps.push(element);
                    break;
                case "shells":
                    shells.push(element);
                    break;
                case "virogreen":
                    virogreen.push(element);
                    break;
                case "batteriesonly":
                    batteryList.push(element);
                    break;
            }
        });
        
        setIctList(ictList);
        setBatteriesandlampsList(batteriesandlamps);
        setShellsList(shells);
        setVirogreenList(virogreen);
        setBatteryList(batteryList);

    }, [binInformation]);

    return (
        <Grid container justifyContent="center" alignContent="center" sx={{paddingBottom: "50px;"}}>
            <Stack spacing={5}>
                <>
                {ictList.length > 0 && <Typography variant="h4" sx={{fontWeight: "bold"}}>3 in 1 bins</Typography>}
                {ictList}
                </>

                <>
                {batteriesandlampsList.length > 0 && <Typography variant="h4" sx={{fontWeight: "bold"}}>Batteries and Lamps bins</Typography>}
                {batteriesandlampsList}
                </>
                <>
                {shellsList.length > 0 && <Typography variant="h4" sx={{fontWeight: "bold"}}>Shell E-Waste bins</Typography>}
                {shellsList}
                </>
                <>
                {virogreenList.length > 0 && <Typography variant="h4" sx={{fontWeight: "bold"}}>Virobin E-Waste bins</Typography>}
                {virogreenList}
                </>
                <>
                {batteryList.length > 0 && <Typography variant="h4" sx={{fontWeight: "bold"}}>Battery Only</Typography>}
                {batteryList} 
                </>
            </Stack>

        </Grid>
    )
}
