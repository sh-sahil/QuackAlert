import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

const RoutingControl = ({ userLatLon, destinationLatLon }) => {
    const map = useMap();
    const routingControlRef = useRef(null);
    const userMarkerRef = useRef(null);
    const destinationMarkerRef = useRef(null);

    useEffect(() => {
        if (userLatLon && destinationLatLon) {
            // Remove previous routing control if it exists
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }

            // Remove previous markers if they exist
            if (userMarkerRef.current) {
                map.removeLayer(userMarkerRef.current);
            }
            if (destinationMarkerRef.current) {
                map.removeLayer(destinationMarkerRef.current);
            }

            // Create new routing control
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(userLatLon.lat, userLatLon.lon),
                    L.latLng(destinationLatLon.lat, destinationLatLon.lon)
                ],
                routeWhileDragging: true,
                createMarker: () => null // Disable default markers
            }).addTo(map);

            // Add marker for current location
            userMarkerRef.current = L.marker([userLatLon.lat, userLatLon.lon])
                .addTo(map)
                .bindPopup('Your Location')
                .openPopup();

            // Add marker for destination location
            destinationMarkerRef.current = L.marker([destinationLatLon.lat, destinationLatLon.lon])
                .addTo(map)
                .bindPopup('Destination')
                .openPopup();
        }

        // Clean up the routing control and markers on component unmount
        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
            if (userMarkerRef.current) {
                map.removeLayer(userMarkerRef.current);
            }
            if (destinationMarkerRef.current) {
                map.removeLayer(destinationMarkerRef.current);
            }
        };
    }, [userLatLon, destinationLatLon, map]);

    return null;
};

const MapWithDirection = ({ userLatLon, destinationLatLon }) => {
    const [mapInstance, setMapInstance] = useState(null);

    const handleMapLoad = (map) => {
        setMapInstance(map);
    };

    useEffect(() => {
        if (mapInstance && userLatLon) {
            mapInstance.setView([userLatLon.lat, userLatLon.lon], 13, {
                animate: true,
                duration: 1 // Duration in seconds
            });
        }
    }, [mapInstance, userLatLon]);

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer
                center={[userLatLon.lat, userLatLon.lon]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                whenCreated={handleMapLoad}
            >
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <RoutingControl userLatLon={userLatLon} destinationLatLon={destinationLatLon} />
            </MapContainer>
        </div>
    );
};

export default MapWithDirection;
