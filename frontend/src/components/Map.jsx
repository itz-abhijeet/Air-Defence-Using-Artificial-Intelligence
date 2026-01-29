import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Tactical Icons
const friendlyIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div style="background-color: #00e5ff; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px #00e5ff;"></div>',
    iconSize: [10, 10]
});

const threatIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div style="background-color: #ff1744; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px #ff1744;" class="blip-pulse"></div>',
    iconSize: [10, 10]
});

function Map({ flights, onFlightClick }) {
    return (
        <div className="h-full w-full relative z-10">
            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                zoomControl={false}
                attributionControl={false}
                className="h-full w-full bg-black"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    className="filter invert hue-rotate-180 brightness-50 contrast-125 saturate-0"
                />

                {flights.map(flight => (
                    <Marker
                        key={flight.id}
                        position={[flight.lat, flight.lng]}
                        icon={flight.isFriend ? friendlyIcon : threatIcon}
                        eventHandlers={{
                            click: () => onFlightClick(flight),
                        }}
                    />
                ))}
            </MapContainer>

            {/* Radar Overlay */}
            <div className="pointer-events-none absolute inset-0 z-[400] overflow-hidden">
                <div className="radar-sweep absolute inset-0 rounded-full scale-[2] origin-center opacity-30"></div>
                <div className="grid-overlay absolute inset-0 opacity-20"></div>
            </div>
        </div>
    );
}

export default Map;
