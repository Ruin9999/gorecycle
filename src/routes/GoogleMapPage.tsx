import { Typography, Grid, Box, Card} from "@mui/material";
import { useEffect, useState } from 'react';
import { useLoadScript, GoogleMap, MarkerF, InfoWindowF, DirectionsRenderer } from '@react-google-maps/api';
import { useLocation } from "react-router-dom";
import data from '../../EwasteRecyclingLocations.json';

export default function GoogleMaps() {

	const params = new URLSearchParams(useLocation().search);
	const dustbin = params.get('dustbin');

    // Store the current location details
    const [userLocation, setUserLocation] = useState({
        lat: 0,
        lng: 0
    })
    const [selectedMarker, setSelectedMarker] = useState<Number|null>(null)
    const [selectedOnMap, setSelectedOnMap] = useState({
        lat:0,
        lng:0
    })
   
    // For Travel Mode
    const[directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult>();
    const[walkingDistance, setWalkingDistance] = useState<String>();
    const[walkingDuration,setWalkingDuration] = useState<String>();

    const[drivingDistance,setDrivingDistance] = useState<String>();
    const[drivingDuration,setDrivingDuration] = useState<String>();

    const[transitDistance,setTransitDistance] = useState<String>();
    const[transitDuration,setTransitDuration] = useState<String>();
    const[disableLocation,setDisableLocation] = useState<boolean>(false);

    var total = 0;
    var parameter = "";
    var imageFilename = "";
    
    if (dustbin == "ict") {
        parameter = "Bin collection; E-waste accepted: ICT equipment, Batteries and Lamps only";
        imageFilename = "icticon.png";
    } else if (dustbin == "Batteriesandlamps") {
        parameter = "Bin collection; E-waste accepted: Batteries and Lamps only";
        imageFilename = "batteryandbulbicon.png"
    } else if (dustbin == "Batteriesonly") {
        parameter = "Bin collection; E-waste accepted: Batteries only";
        imageFilename = "batteryicon.png"
    } else if (dustbin == "shells") {
        parameter = "Shell-Metalo E-waste Recycling Programme for Non-regulated E-waste";
        imageFilename = "shellicon.png";
    } else if (dustbin == "virogreen") {
        parameter = "Virogreen NECDC E-waste Recycling Programme for Non-regulated E-waste";
        imageFilename = "virogreenicon.png"
    }
    const tdRegex = /<td>(.*?)<\/td>/g;
    //data.features.filter((datass) => datass.properties.Description.includes(parameter)).map((filtereddata) => filtereddata.properties.Description.split("<th>").map((arraydata) => arraydata.match(tdRegex))).map((finaldata,index) => console.log(index));
    //data.features.map((filtereddata)=> console.log(total++));

    async function calculateRoute(theUserLocation:{lat:number,lng:number},selectedLocation:{lat:number, lng:number}){
        if(theUserLocation.lat==0 && theUserLocation.lng==0 || selectedLocation.lat==0 && selectedLocation.lng==0){
            return
        }
        const directionService = new google.maps.DirectionsService()
        const resultsWalking = await directionService.route({
            origin: theUserLocation,
            destination: selectedLocation,
            waypoints:[],
            travelMode: google.maps.TravelMode.WALKING,         
        })
        setDirectionsResponse(resultsWalking)                  
        const resultsDriving= await directionService.route({
            origin: theUserLocation,
            destination: selectedLocation,
            travelMode: google.maps.TravelMode.DRIVING,            
        })
        const resultsTransit= await directionService.route({
            origin: theUserLocation,
            destination: selectedLocation,
            travelMode: google.maps.TravelMode.TRANSIT,           
        })

        setWalkingDistance(resultsWalking.routes[0].legs[0].distance?.text);
        setWalkingDuration(resultsWalking.routes[0].legs[0].duration?.text);

        setDrivingDistance(resultsDriving.routes[0].legs[0].distance?.text);
        setDrivingDuration(resultsDriving.routes[0].legs[0].duration?.text);

        setTransitDistance(resultsTransit.routes[0].legs[0].distance?.text);
        setTransitDuration(resultsTransit.routes[0].legs[0].duration?.text);
       
    }

    const calculateDistance =  (lat1:number, lng1:number, lat2:number, lng2:number) =>{
        var R = 6371.0710;
        var rlat1= lat1*(Math.PI/180);
        var rlat2 = lat2*(Math.PI/180);
        var difflat = rlat2-rlat1;
        var difflon = (lng2-lng1) * (Math.PI/180); // Radian difference (longitudes)
        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));      
        return d.toFixed(1);
    }

    // Once loaded will ask for location
    useEffect(() => {
        getUserLocation()
    }, [])

    // Sort by Distance
    let sortByDistanceList: { id: number, thenewResult: number, theDescription:string }[] = [];
    if(userLocation.lat!=0 && userLocation.lng!=0){
        for(let id=0;id<data.features.length;id++){
            var thenewResult = parseFloat(calculateDistance(userLocation.lat,userLocation.lng,data.features[id].geometry.coordinates[1],data.features[id].geometry.coordinates[0]))
            var theDescription = data.features[id].properties.description + " "+ data.features[id].properties.Description
            sortByDistanceList.push({id,thenewResult,theDescription})
        }
        sortByDistanceList.sort(compareByDistance);     
    }
    
	
    function compareByDistance(a:{ id: number, thenewResult: number },b:{ id: number, thenewResult: number }){    
        return a.thenewResult-b.thenewResult;
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBSyQHKtgILu4te4TMSAQ3X8oPyfHkm-Oc"
    });

    const getUserLocation = async () => {
        await navigator.geolocation.getCurrentPosition(function (pos: any) {
            setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            })
		},	function (error: any){
				setDisableLocation(true)
				console.log("error")
			}     
        )      
    }
    const containerStyle = {
        width: '100%',
        height: '100%'
    }

    if (!isLoaded) return <div>Loading</div>
    return (
        
        <div>
            
            {userLocation.lat!=0 && userLocation.lng!=0 ? (
                <Grid container sx={{ flexDirection: { xs: "column", md: "row"} }}>
                    <Grid item xs={5} sx={{my: 2, ml:-4}}>
                            <Box sx={{ width: {xs: "300px", md: "500px"}, height:{xs:"300px", md:"500px"} }}>
                                <GoogleMap zoom={15} center={userLocation} mapContainerStyle={containerStyle} onClick={()=> setSelectedMarker(null)}>
                                    {sortByDistanceList.filter((datass) => datass.theDescription.includes(parameter)).map((filtereddata, index) => (
                                        <MarkerF key={index} position={{ lat: data.features[filtereddata.id].geometry.coordinates[1], lng: data.features[filtereddata.id].geometry.coordinates[0] }}
                                            icon={{
                                                url: '/public/' + imageFilename,
                                                scaledSize: new google.maps.Size(35, 35),
                                            }}
                                            onClick={()=>{setSelectedMarker(index) 
                                                calculateRoute({lat:userLocation.lat,lng:userLocation.lng},{lat: data.features[filtereddata.id].geometry.coordinates[1],lng: data.features[filtereddata.id].geometry.coordinates[0]})
                                                setSelectedOnMap({lat: data.features[filtereddata.id].geometry.coordinates[1],lng: data.features[filtereddata.id].geometry.coordinates[0]})
                                                
                                            }}
                                        >
                                            {selectedMarker == index? (
                                                
                                                <InfoWindowF onCloseClick={()=>setSelectedMarker(null)}>
                                                   <div>
                                                   <p>Location Name: {data.features[filtereddata.id].properties.address}</p>
                                                   <p>Address Name: {data.features[filtereddata.id].properties.streetName}</p>
                                                   <a href={"https://www.google.com/maps/dir/"+ userLocation.lat + "," + userLocation.lng + "/" + data.features[filtereddata.id].geometry.coordinates[1] + "," + data.features[filtereddata.id].geometry.coordinates[0]} target="_blank">Link to Google Map Direction</a>
                                                   </div>
                                                </InfoWindowF>
                                            ):null}
                                            
                                            
            
                                        </MarkerF>
            
            
                                    ))}
                                     <DirectionsRenderer directions={directionsResponse} options={{suppressInfoWindows:true}}/>
                                    
            
                                    
                                    <MarkerF position={userLocation}
                                        icon={{
                                            url: '/public/currentLocation.png',
                                            scaledSize: new google.maps.Size(50, 50),
                                        }}>
            
            
                                    </MarkerF>
                                </GoogleMap>
                            </Box>
                            <Box sx={{bgcolor: "white", width: {xs: "350px", md: "500px"}, height:{xs:"350px", md:"350px"}, borderRadius:4, pl:2, pt:1, mt:1}}>
                                
                                <Typography variant="h2" sx={{fontSize:'32px', fontWeight:'bold', color:'black' }}>Travel Mode: Walking</Typography>
                                <Typography variant="h2"sx={{fontSize:'24px'}}>Est Distance: {walkingDistance}</Typography>
                                <Typography variant="h2" sx={{fontSize:'24px'}}>Est Duration: {walkingDuration}</Typography>
                                <Typography variant="h2" sx={{fontSize:'32px', fontWeight:'bold', color:'black' }}>Travel Mode: Driving </Typography>
                                <Typography variant="h2"sx={{fontSize:'24px'}}>Est Distance: {drivingDistance}</Typography>
                                <Typography variant="h2"sx={{fontSize:'24px'}}>Est Duration: {drivingDuration}</Typography>
                                <Typography variant="h2" sx={{fontSize:'32px', fontWeight:'bold', color:'black' }}>Travel Mode: Transit</Typography>
                                <Typography variant="h2"sx={{fontSize:'24px'}}>Est Distance: {transitDistance}</Typography>
                                <Typography variant="h2"sx={{fontSize:'24px'}}>Est Duration: {transitDuration}</Typography>

                            </Box>
                            </Grid>
                            <Grid item xs={7} sx={{ml:-4}}  >

                                
                                <Typography variant="h2">Top Nearby Places:</Typography>
                                <Box sx={{maxHeight: '100vh', overflow: 'auto', mt:1,  width: {xs: "350px" , md:"800px"}, height:{xs:"350px", md:"800px"} }}>
                                {sortByDistanceList.filter((datass) => datass.theDescription.includes(parameter)).map((filteredData,index) => (
                                    <Box sx={{bgcolor:'white', mb:2, borderRadius:4, pl:2 }} key={index}>
                                    <div key={index} >                 
                                            <div>
                                                <Typography variant="h2" sx={{fontSize:'24px'}} >Location Name: <span style={{fontSize:'20px', color:'black'}}>{data.features[filteredData.id].properties.address}</span></Typography>
                                                <Typography variant="h2" sx={{fontSize:'24px'}}>Postal Code: <span style={{fontSize:'20px', color:'black'}}>{data.features[filteredData.id].properties.postalCode}</span></Typography>
                                                <Typography variant="h2" sx={{fontSize:'24px'}}>Address: <span style={{fontSize:'20px', color:'black'}}>{data.features[filteredData.id].properties.streetName}</span></Typography>
                                                <Typography variant="h2" sx={{fontSize:'24px'}}> Distance: <span style={{fontSize:'20px', color:'black'}}>{ userLocation.lat!=0?calculateDistance(userLocation.lat,userLocation.lng,data.features[filteredData.id].geometry.coordinates[1],data.features[filteredData.id].geometry.coordinates[0]):0} km</span></Typography>
                                               
                                                <button  onClick={()=> {
                                                setSelectedMarker(index)
                                                calculateRoute({lat:userLocation.lat,lng:userLocation.lng},{lat: data.features[filteredData.id].geometry.coordinates[1],lng: data.features[filteredData.id].geometry.coordinates[0]})
                                                
                                                } } style={{backgroundColor:'green', borderColor:'green', color:'white', fontSize:'20px', borderRadius:8, padding:'7px', marginTop:"4px", marginRight:"4px", borderStyle:'solid'}}>Navigate</button>     
                                                
                                                {localStorage.getItem("isLoggedIn") === "true"? (
                                                    <a style={{backgroundColor:'green', borderColor:'green', textDecoration:'none', color:'white', borderRadius:6, fontSize:'20px', padding:"9px", fontFamily:'Arial'}} href={"/upload?category="+dustbin+"&location="+data.features[filteredData.id].properties.address+"&address="+data.features[filteredData.id].properties.streetName.replace(/,/g,' ')} >Update</a>
                                                ):null}

                                            </div>                                
                                    </div>
                                    </Box>
                                ))}
                                </Box>
                        </Grid>
                        
                    </Grid>
                            
            ): disableLocation?(
                <div className=''>
                <Grid container sx={{ flexDirection: { xs: "column", md: "row"} }}>
                <Grid item xs={5} sx={{my: 2, ml:-4}}>

                <Box sx={{ width: {xs: "300px", md: "500px"}, height:{xs:"300px", md:"500px"} }}>
                <GoogleMap zoom={12}  mapContainerStyle={containerStyle} center={{lat:1.30151446718831 , lng:  103.902131834447999}}>

                {data.features.filter((datass) => datass.properties.description.includes(parameter) || datass.properties.Description.includes(parameter)).map((filtereddata, index) => (
                            <MarkerF key={index} position={{ lat: filtereddata.geometry.coordinates[1], lng: filtereddata.geometry.coordinates[0] }}
                                icon={{
                                    url: '/public/' +imageFilename,
                                    scaledSize: new google.maps.Size(35, 35),
                                }}
                                onClick={()=>{setSelectedMarker(index) 
                                    setSelectedOnMap({lat: filtereddata.geometry.coordinates[1],lng: filtereddata.geometry.coordinates[0]})    
                                }}
                            >
                                {selectedMarker == index? (
                                    
                                    <InfoWindowF onCloseClick={()=>setSelectedMarker(null)}>
                                       <div>
                                       <p>Location Name: {filtereddata.properties.address}</p>
                                       <p>Address Name: {filtereddata.properties.streetName}</p>
                                       <a href={"https://www.google.com/maps/dir/?api=1&destination="+  filtereddata.geometry.coordinates[1] + "," + filtereddata.geometry.coordinates[0]} target="_blank">Link to Google Map Direction</a>
                                       </div>
                                    </InfoWindowF>
                                ):null}
                                
                                

                            </MarkerF>
                        ))}
                </GoogleMap>
                </Box>
                </Grid>
                <Grid item xs={7} sx={{ml:-4}}  >

                <Typography variant="h2">Top Nearby Places:</Typography>
                <Box sx={{maxHeight: '100vh', overflow: 'auto', mt:1,  width: {xs: "350px" , md:"800px"}, height:{xs:"350px", md:"800px"} }}>

                                    
                    {data.features.filter((datass) => datass.properties.description.includes(parameter) || datass.properties.Description.includes(parameter)).map((filteredData,index) => (
                        <Box sx={{bgcolor:'white', mb:2, borderRadius:4, pl:2 }}>
                        <div key={index} >                            
                                <div>
                                    <Typography variant="h2" sx={{fontSize:'24px'}}>Location Name: <span style={{fontSize:'20px', color:'black'}}> {filteredData.properties.address}</span></Typography>
                                    <Typography variant="h2" sx={{fontSize:'24px'}}>Postal Code: <span style={{fontSize:'20px', color:'black'}}>{filteredData.properties.postalCode}</span></Typography>
                                    <Typography variant="h2" sx={{fontSize:'24px'}}>Address:<span style={{fontSize:'20px', color:'black'}}>{filteredData.properties.streetName}</span></Typography>
                                    <button onClick={()=> {
                                    setSelectedMarker(index)
                                    } } style={{backgroundColor:'green', borderColor:'green', color:'white', fontSize:'20px', borderRadius:8, padding:'7px', marginTop:"4px", marginRight:"4px", borderStyle:'solid'}}>Navigate</button>
                                </div>
                        </div>
                        </Box>
                    ))}
					
                </Box>
                </Grid>
                
                </Grid>
            </div>
            ):(
                <p>Loading</p>
            )}
        </div>
    )
}