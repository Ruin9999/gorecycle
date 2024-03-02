import { Stack } from "@mui/material";

import BinListing from "../../components/BinListing";

export default function NavigationPage() {
    return (
        <Stack sx={{margin: "auto",maxWidth: "70%", paddingTop: "50px", paddingBottom: "100px"}} spacing={5}>
            <BinListing 
            img="3-in-1.png"
            alt="3-in-1"
            title="3-in-1"
            description="Only ICT equipment, batteries and lamps are accepted. This includes items like
            printers, power banks, computer, laptops, mobile phones, tablets, modems, routers,
            set-boxes, small TVs, and desktop monitors, provided they can fit through the 500mm x 2250mm slot."
            href="/googlemap?dustbin=ict"/>

            <BinListing
            img="batteries-and-bulbs.png"
            alt="batteries and bulbs"
            title="Batteries and Bulbs"
            description="Batteries and lamps only. This includes bulbs and specific battery types (AA,AAA,AAAA,
                D,C,9-volts, and button cell) with flourescent tubes at selected locations."
            href="/googlemap?dustbin=Batteriesandlamps"/>

            <BinListing
            img="shell-bin.png"
            alt="shell e-waste bin"
            title="Shell E-Waste Bin"
            description="Non regulated products only. Including game consoles, keyboards, docking stations, telephones,
             power supplies, headphones, home sound systems, thumb drives, kitchen appliances, fans, and small medical equipment."
            href="/googlemap?dustbin=shells"/>

            <BinListing
            img="virobin.png"
            alt="virobin"
            title="Virobin E-Waste Bin"
            description="Non regulated products only. Including game consoles, keyboards, docking stations, telephones,
             power supplies, headphones, home sound systems, thumb drives, kitchen appliances, fans, and small medical equipment."
            href="/googlemap?dustbin=virogreen"/>

            <BinListing
            img="battery-only.png"
            alt="battery only"
            title="Battery Only"
            description='Batteries only. This includes button cell batteries, AA, AAA, AAAA, C, D and 9-volt only) ICT equipment not accepted,
            Bulbs and lamps not accepted.'
            href="/googlemap?dustbin=Batteriesonly"/>
        </Stack>
    )
}