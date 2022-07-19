import React, { useState, useEffect, useRef, useMemo } from 'react'
import { VStack, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic'

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { useMap } from 'react-leaflet/hooks'
import { Popup } from 'react-leaflet/Popup'
import L from 'leaflet';

// const {MapContainer} = dynamic(
//     () => import('react-leaflet/MapContainer'),
//     { ssr: false }
// )

// const {TileLayer} = dynamic(
//     () => import('react-leaflet/TileLayer'),
//     { ssr: false }
// );

// const {Marker} = dynamic(
//     () => import('react-leaflet/Marker'),
//     { ssr: false }
// );


import 'leaflet/dist/leaflet.css'

const satellite = require('satellite.js');




function DisplaySat() {
    // componentDidMount() {
    //     if (!window.GA_INITIALIZED) {
    //         initGA()
    //         window.GA_INITIALIZED = true
    //     }
    //     logPageView()
    // }
    // const satIcon = L.icon({
    //     iconUrl: '../public/satimage.png',
    //     shadowUrl: '../public/satimage.png',
    //     iconSize:     [50, 32],
    //     iconAnchor:   [25, 16],
    //     popupAnchor:  [-3, -76]
    // });

    const [loaded, setLoaded] = useState(false);
    const [info, setInfo] = useState('loading...');
    const [coord, setCoord] = useState([51.505, -0.09]);

    const TLE = `1 51080U 22002DA  22200.13694574  .00008725  00000+0  44414-3 0  9996
    2 51080  97.5054 267.8175 0012792 351.4700   8.6314 15.16982496 28253`

    useEffect(() => {

        // import { MapContainer } from 'react-leaflet/MapContainer'
        // import { TileLayer } from 'react-leaflet/TileLayer'
        // import { Marker } from 'react-leaflet/Marker'
        // import { useMap } from 'react-leaflet/hooks'
        // import { Popup } from 'react-leaflet/Popup'

        // Initialize the satellite record with this TLE
        const satrec = satellite.twoline2satrec(
            TLE.split('\n')[0].trim(),
            TLE.split('\n')[1].trim()
        );

        // Get the position of the satellite at the given date
        const date = new Date();
        const positionAndVelocity = satellite.propagate(satrec, date);
        const gmst = satellite.gstime(date);
        const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

        setCoord([position.longitude, position.latitude]);
        console.log(position.longitude);// in radians
        console.log(position.latitude);// in radians
        console.log(position.height);// in km

        setTimeout(() => { setInfo(`coords (long, lat): ${position.longitude}, ${position.latitude}`); setLoaded(true); }, 2000);

    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            // Initialize the satellite record with this TLE
            const satrec = satellite.twoline2satrec(
                TLE.split('\n')[0].trim(),
                TLE.split('\n')[1].trim()
            );

            const date = new Date();
            const positionAndVelocity = satellite.propagate(satrec, date);
            const gmst = satellite.gstime(date);
            const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
            setCoord([position.longitude, position.latitude]);
            setInfo(`coords (long, lat): ${position.longitude}, ${position.latitude}`);

        }, 10000);
        return () => clearInterval(interval);
    }, []);


    return (
        <VStack>
            <Text>{info}</Text>

            {loaded && 
                <MapContainer center={coord} zoom={4} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* icon={satIcon} */}
                    <Marker position={coord}>
                    </Marker>
                </MapContainer>
            }
        </VStack>
        // <MapContainer w={8000} h={800}center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        // </MapContainer>
    )
}

export default DisplaySat
