import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_CONFIG } from '../config/apiConfig';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface Flight {
    icao24: string;
    callsign: string;
    origin: string;
    longitude: number;
    latitude: number;
    altitude: number;
    velocity: number;
    heading: number;
}

const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
}

const MapLayerSwitcher: React.FC<{ currentLayer: string, setLayer: (l: string) => void }> = ({ currentLayer, setLayer }) => {
    return (
        <div className="absolute top-2 left-2 z-[400] flex flex-col gap-1 bg-dark-bg/80 border border-dark-border p-1 rounded shadow backdrop-blur-sm">
            <button 
                onClick={() => setLayer('dark')}
                className={`px-2 py-1 text-xs font-mono uppercase rounded transition-colors ${currentLayer === 'dark' ? 'bg-dark-accent text-dark-bg font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Tactical
            </button>
            <button 
                onClick={() => setLayer('satellite')}
                className={`px-2 py-1 text-xs font-mono uppercase rounded transition-colors ${currentLayer === 'satellite' ? 'bg-dark-accent text-dark-bg font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Satellite
            </button>
            <button 
                onClick={() => setLayer('osm')}
                className={`px-2 py-1 text-xs font-mono uppercase rounded transition-colors ${currentLayer === 'osm' ? 'bg-dark-accent text-dark-bg font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Street
            </button>
        </div>
    );
};

const FlightTrackerWidget: React.FC = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [mapLayer, setMapLayer] = useState('dark');

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchFlights = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('https://opensky-network.org/api/states/all?lamin=30&lomin=-20&lamax=70&lomax=40');
            const data = await response.json();
            
            if (data && data.states) {
                const activeFlights: Flight[] = data.states
                    .slice(0, 50) 
                    .map((s: any) => ({
                        icao24: s[0],
                        callsign: s[1]?.trim() || 'N/A',
                        origin: s[2],
                        longitude: s[5],
                        latitude: s[6],
                        altitude: s[7] || 0,
                        velocity: s[9] || 0,
                        heading: s[10] || 0
                    }))
                    .filter((f: Flight) => f.latitude && f.longitude);
                
                setFlights(activeFlights);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching OpenSky data:', err);
            setError('API unavailable - showing restricted radar');
            setFlights([
                { icao24: 'mock1', callsign: 'AF1', origin: 'USA', longitude: -77, latitude: 38, altitude: 35000, velocity: 500, heading: 90 },
                { icao24: 'mock2', callsign: 'BA249', origin: 'UK', longitude: 0, latitude: 51, altitude: 32000, velocity: 480, heading: 180 }
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchFlights();
            const interval = setInterval(fetchFlights, 15000); 
            return () => clearInterval(interval);
        }
    }, [fetchFlights, mounted]);

    if (!mounted) return <div className="h-full w-full bg-dark-bg flex items-center justify-center text-gray-500 font-mono text-base">INITIALIZING RADAR...</div>;

    const layers: Record<string, string> = {
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };

    return (
        <div className="h-full w-full relative z-0 bg-dark-bg">
            <MapContainer
                center={[45, 10]}
                zoom={3}
                style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}
                zoomControl={false}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url={layers[mapLayer]}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                
                {flights.map((flight) => (
                    <Marker 
                        key={flight.icao24} 
                        position={[flight.latitude, flight.longitude]}
                        icon={DefaultIcon}
                    >
                        <Popup className="dark-popup">
                            <div className="p-1 font-mono text-sm">
                                <div className="text-dark-accent font-bold border-b border-dark-border mb-1">{flight.callsign}</div>
                                <div>ORIGIN: {flight.origin}</div>
                                <div>ALT: {Math.round(flight.altitude)}m</div>
                                <div>VEL: {Math.round(flight.velocity * 3.6)}km/h</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                
                <MapResizer />
            </MapContainer>

            <MapLayerSwitcher currentLayer={mapLayer} setLayer={setMapLayer} />

            {/* Radar Overlay Info */}
            <div className="absolute top-2 right-2 z-[400] flex flex-col gap-1 items-end">
                <div className="bg-dark-bg/80 border border-dark-border px-2 py-1 rounded text-sm text-gray-400 font-mono shadow backdrop-blur-sm">
                    {loading ? 'RESCANNING...' : `OPERATIONAL: ${flights.length} CONTACTS`}
                </div>
                {error && (
                    <div className="bg-dark-alert/20 border border-dark-alert/50 text-dark-alert px-2 py-0.5 rounded text-xs font-mono">
                        {error}
                    </div>
                )}
            </div>
            
            {/* Visual sweep effect overlay */}
            <div className="absolute inset-0 z-[10] pointer-events-none border border-dark-accent/10 rounded-lg overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,197,94,0.05)_40deg,transparent_45deg)] animate-[spin_4s_linear_infinite]"></div>
            </div>
        </div>
    );
};

export default FlightTrackerWidget;
