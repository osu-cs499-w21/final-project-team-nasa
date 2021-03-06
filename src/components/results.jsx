import React, {useState, useEffect} from 'react';
import Nav from "./nav";
import fetch from 'isomorphic-unfetch';

import Spinner from './components/Spinner';
import ErrorContainer from './components/ErrorContainer';

export default function Results() {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const searchQuery = window.location.search.split('=')[1];
    const parts = searchQuery.split(',');
    const newDate = new Date();
    const dateParts = parts[1].split('-');
    newDate.setFullYear(dateParts[0],dateParts[1],dateParts[2]);
    const [photos, setPhotos] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);

    useEffect(()=>{
        let ignore = false;
        const controller = new AbortController();
        async function fetchPhotos(){
            setLoading(true);
            setError(false);
            let responseBody = {};
            try{
                if(parts[2] !== "all"){ //get a specific camera
                    const res = await fetch(
                        `https://api.nasa.gov/mars-photos/api/v1/rovers/${parts[0]}/photos?earth_date=${parts[1]}&camera=${parts[2]}&api_key=${process.env.APP_REACT_ROVER_KEY}`,
                        {signal:controller.signal}
                    )
                    responseBody = await res.json();
                } else { //get all cameras
                    const res = await fetch(
                        `https://api.nasa.gov/mars-photos/api/v1/rovers/${parts[0]}/photos?earth_date=${parts[1]}&api_key=${process.env.REACT_APP_ROVER_KEY}`,
                        {signal:controller.signal}
                    )
                    responseBody = await res.json();
                }
            } catch(e) {
                if(e instanceof DOMException) {
                    setError(true);
                    setLoading(false);
                    console.log("Request Aborted");
                    console.log(e)
                } else {
                    setError(true);
                    setLoading(false);
                    console.log(e);
                }
            }
            if(!ignore){
                setPhotos(responseBody.photos || []);
                setLoading(false);
            }
        }
        if(searchQuery){
            fetchPhotos();
        }
        return() =>{
            controller.abort();
            ignore = true;
        }
    }, [ searchQuery ]);


    return (
        <div>
            <Nav />
            <div style={{marginTop:"150px"}}>
                <h1>Photos for {parts[0].toUpperCase()} on {months[newDate.getMonth()]} {newDate.getDate()}, {newDate.getFullYear()}</h1>
                {isError && <ErrorContainer>Error Message!</ErrorContainer>}
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div style={{display: "inline-flex", width:"100%", flexWrap:"wrap"}}>
                        {photos.map(photo =>(
                            <a href={photo.img_src}><img src={photo.img_src} className="rover-image" alt="" key={photo.id}></img></a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}