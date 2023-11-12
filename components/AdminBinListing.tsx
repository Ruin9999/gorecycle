import { Grid, Typography, Button } from "@mui/material";

interface AdminBinListingProps {
    category: string,
    location: string,
    address: string,
    onComplete: () => void,
    onView: () => void,
}

export default function AdminBinListing(props: AdminBinListingProps) {

    return(
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Typography variant="h6">Location:</Typography>
                <Typography variant="body1">{props.location}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6">Category: 
                    <Typography variant="body1" sx={{display: "inline"}}> &nbsp; {props.category}</Typography>
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6">Address:</Typography>
                <Typography variant="body1">{props.address}</Typography>
            </Grid>
            <Grid item xs={3} sx={{paddingRight: "10px"}}>
                    <Button variant="contained" sx={{height: "100%"}} onClick={props.onComplete} fullWidth>Complete Task</Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" sx={{height: "100%"}} onClick={props.onView} fullWidth>View</Button>
            </Grid>
        </Grid>
    )
}