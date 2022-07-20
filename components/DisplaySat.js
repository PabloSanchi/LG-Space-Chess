import React, { useState, useEffect, useRef, useMemo } from 'react'
import { VStack, Text, Center } from '@chakra-ui/react';
import dynamic from 'next/dynamic'

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { useMap } from 'react-leaflet/hooks'
import { Popup } from 'react-leaflet/Popup'
import L from 'leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css'

import iconUrl2 from '../public/satimage.png';

const satellite = require('satellite.js');

function DisplaySat() {
    // componentDidMount() {
    //     if (!window.GA_INITIALIZED) {
    //         initGA()
    //         window.GA_INITIALIZED = true
    //     }
    //     logPageView()
    // }
    const satIcon = L.icon({
        iconUrl: iconUrl,
        shadowUrl: shadowUrl,
        iconSize: [50, 32],
        iconAnchor: [25, 16],
        popupAnchor: [-3, -76]
    });

    useEffect(() => {
        (async function init() {
            delete L.Icon.Default.prototype._getIconUrl;

            L.Icon.Default.mergeOptions({
                iconRetinaUrl: iconRetinaUrl.src,
                iconUrl: iconUrl.src,
                shadowUrl: shadowUrl.src,
            });
        })();
    }, []);

    const [loaded, setLoaded] = useState(false);
    const [info, setInfo] = useState('loading...');
    const [coord, setCoord] = useState([51.505, -0.09]);

    // const TLE = 
    // `1 25544U 98067A   21122.75616700  .00027980  00000-0  51432-3 0  9994
    // 2 25544  51.6442 207.4449 0002769 310.1189 193.6568 15.48993527281553`;

    const tleLine1 = '1 51080U 22002DA  22200.13694574  .00008725  00000+0  44414-3 0  9996';
    const tleLine2 = '2 25544  51.6400 208.9163 0006317  69.9862  25.2906 15.54225995 67660';
    // `1 51080U 22002DA  22200.13694574  .00008725  00000+0  44414-3 0  9996
    // 2 51080  97.5054 267.8175 0012792 351.4700   8.6314 15.16982496 28253`

    useEffect(() => {

        let coords = getLatLongFromTle();
        setCoord(coords);
        setInfo(`[lat, lng]: ${coords[0]}, ${coords[1]}`);
        setLoaded(true);
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            let coords = getLatLongFromTle();
            setCoord(coords);
            setInfo(`[lat, lng]: ${coords[0]}, ${coords[1]}`);

        }, 5000);
        return () => clearInterval(interval);
    }, []);

    function getLatLongFromTle() {
        // Initialize a satellite record
        var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

        //  Propagate satellite using time since epoch (in minutes).
        let timestamp = new Date().getTime();
        let hours = Math.floor(timestamp / 60 / 60);
        let timeSinceTleEpochMinutes = Math.floor(timestamp / 60);
        var positionAndVelocity = satellite.sgp4(satrec, timeSinceTleEpochMinutes);

        //  Or you can use a JavaScript Date
        var positionAndVelocity = satellite.propagate(satrec, new Date());

        // The position_velocity result is a key-value pair of ECI coordinates.
        // These are the base results from which all other coordinates are derived.
        var positionEci = positionAndVelocity.position,
            velocityEci = positionAndVelocity.velocity;

        // Set the Observer at 122.03 West by 36.96 North, in RADIANS
        var observerGd = {
            longitude: satellite.degreesToRadians(-122.0308),
            latitude: satellite.degreesToRadians(36.9613422),
            height: 0.370
        };

        // You will need GMST for some of the coordinate transforms.
        // http://en.wikipedia.org/wiki/Sidereal_time#Definition
        var gmst = satellite.gstime(new Date());

        // You can get ECF, Geodetic, Look Angles, and Doppler Factor.
        var positionEcf = satellite.eciToEcf(positionEci, gmst),
            observerEcf = satellite.geodeticToEcf(observerGd),
            positionGd = satellite.eciToGeodetic(positionEci, gmst),
            lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

        // The coordinates are all stored in key-value pairs.
        // ECI and ECF are accessed by `x`, `y`, `z` properties.
        var satelliteX = positionEci.x,
            satelliteY = positionEci.y,
            satelliteZ = positionEci.z;

        // Look Angles may be accessed by `azimuth`, `elevation`, `range_sat` properties.
        var azimuth = lookAngles.azimuth,
            elevation = lookAngles.elevation,
            rangeSat = lookAngles.rangeSat;

        // Geodetic coords are accessed via `longitude`, `latitude`, `height`.
        var longitude = positionGd.longitude,
            latitude = positionGd.latitude,
            height = positionGd.height;

        //  Convert the RADIANS to DEGREES.
        var longitudeDeg = satellite.degreesLong(longitude),
            latitudeDeg = satellite.degreesLat(latitude);

        return [latitudeDeg, longitudeDeg];
    }

    return (
        <VStack display="absolute">
            {/* <Center><Text>{info}</Text></Center> */}
            {loaded &&
            <Center>
                <MapContainer center={coord} zoom={4} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={coord}>
                    </Marker>
                </MapContainer>
            </Center>
            }
        </VStack>
        // <MapContainer w={8000} h={800}center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        // </MapContainer>
    )
}

export default DisplaySat
