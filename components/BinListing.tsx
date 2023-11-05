import { Stack, Typography, Button } from "@mui/material";

interface BinListingProps { 
    img : string,
    alt ?: string,
    title : string,
    description : string,
    href ?: string,
}

export default function BinListing(props : BinListingProps) : JSX.Element {
    return (
        <Stack direction="row" spacing={5}>
        <img src={props.img} alt={props.alt} style={{ maxHeight: '15%', maxWidth: '15%', margin: 'auto' }} />
        <Stack spacing={2}>
            <Typography variant="h5" textAlign="left">{props.title}</Typography>
            <Typography variant="body1" textAlign="center">
              {props.description}
            </Typography>
            <Button variant="contained" href={props.href}>Find Bins</Button>
        </Stack>
    </Stack>
    )
    
}