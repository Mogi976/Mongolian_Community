import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
    if (center && zoom) {
        map.setView(center, zoom); // Update the map's center and zoom level
    }
}, [center, zoom, map]);
    return null;
};

const MapComponent = ({ location, theme, zoom }) => {
    const mapToken = process.env.REACT_APP_MAP_TOKEN;
    

    return (
        <div
            style={{
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <MapContainer
                center={location}
                zoom={zoom}
                zoomControl={false}
                attributionControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <ChangeView center={location} zoom={zoom}/>
                <TileLayer
                    url={`https://tile.jawg.io/jawg-${
                        theme === "light" ? "light" : "dark"
                    }/{z}/{x}/{y}{r}.png?access-token=${mapToken}`}
                />
                <Marker
                    position={location}
                    icon={L.divIcon({
                        className: "custom-icon",
                        html: `<div class="bi bi-geo-alt-fill text-primary" style="font-size: 2rem; transform: translate(-50%, -50%);"></div>`,
                        iconSize: [0, 0],
                        iconAnchor: [12, 24],
                    })}
                >
                    <Popup>
                        Current Location: {location[0]}, {location[1]}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapComponent;