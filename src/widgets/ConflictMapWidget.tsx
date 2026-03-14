import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ConflictZone {
    id: string;
    name: string;
    location: [number, number];
    status: 'ACTIVE' | 'HIGH ALERT' | 'MONITORING';
    activity: string;
    intensity: number; // 1-10
}

const conflictDataset: ConflictZone[] = [
    { id: 'ukraine', name: 'UKRAINE FRONT', location: [48.3794, 38.3323], status: 'ACTIVE', activity: 'Artillery exchanges and tactical movement reported along eastern axis.', intensity: 9 },
    { id: 'gaza', name: 'GAZA ENCLAVE', location: [31.3547, 34.3088], status: 'ACTIVE', activity: 'High-intensity urban operations and aerial activity ongoing.', intensity: 10 },
    { id: 'sudan', name: 'SUDAN - KHARTOUM', location: [15.5007, 32.5599], status: 'ACTIVE', activity: 'Civilian infrastructure damage reported amid ongoing factional fighting.', intensity: 8 },
    { id: 'myanmar', name: 'MYANMAR REGION', location: [21.9162, 95.9560], status: 'HIGH ALERT', activity: 'Increased clashes in northern states; border security upgraded.', intensity: 7 },
    { id: 'scsea', name: 'SOUTH CHINA SEA', location: [12.0000, 114.0000], status: 'MONITORING', activity: 'Naval presence increased; satellite monitoring of artificial installations.', intensity: 5 },
    { id: 'taiwan', name: 'TAIWAN STRAIT', location: [24.0000, 119.5000], status: 'HIGH ALERT', activity: 'Frequent ADIZ incursions; maritime patrols at elevated readiness.', intensity: 6 },
];

const MapLayerSwitcher: React.FC<{ currentLayer: string, setLayer: (l: string) => void }> = ({ currentLayer, setLayer }) => {
    return (
        <div className="absolute top-2 left-2 z-[400] flex flex-col gap-1 bg-dark-bg/80 border border-dark-border p-1 rounded shadow backdrop-blur-sm">
            <button 
                onClick={() => setLayer('dark')}
                className={`px-2 py-0.5 text-[7px] font-mono uppercase rounded transition-colors ${currentLayer === 'dark' ? 'bg-dark-accent text-dark-bg font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Tactical
            </button>
            <button 
                onClick={() => setLayer('satellite')}
                className={`px-2 py-0.5 text-[7px] font-mono uppercase rounded transition-colors ${currentLayer === 'satellite' ? 'bg-dark-accent text-dark-bg font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Satellite
            </button>
            <button 
                onClick={() => setLayer('osm')}
                className={`px-2 py-0.5 text-[7px] font-mono uppercase rounded transition-colors ${currentLayer === 'osm' ? 'bg-dark-accent text-dark-bg font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Street
            </button>
        </div>
    );
};

const ConflictMapWidget: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const [mapLayer, setMapLayer] = useState('dark');

    const layers: Record<string, string> = {
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'text-dark-alert';
            case 'HIGH ALERT': return 'text-orange-500';
            case 'MONITORING': return 'text-blue-400';
            default: return 'text-gray-500';
        }
    };

    const getCircleColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return '#ef4444';
            case 'HIGH ALERT': return '#f97316';
            case 'MONITORING': return '#60a5fa';
            default: return '#9ca3af';
        }
    };

    if (!mounted) return <div className="h-full w-full bg-dark-bg flex items-center justify-center text-gray-500 font-mono text-sm">LOADING TACTICAL GRID...</div>;

    return (
        <div className="flex flex-col h-full gap-2 font-mono">
            <div className="flex justify-between items-center px-1">
                <span className="text-sm text-gray-500 uppercase">Geopolitical Flashpoints</span>
                <span className="text-sm text-dark-alert font-bold animate-pulse">LIVE INTEL FEED</span>
            </div>

            <div className="h-48 w-full rounded border border-dark-border overflow-hidden relative z-0">
                <MapContainer
                    center={[20, 40]}
                    zoom={1}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    scrollWheelZoom={false}
                >
                    <TileLayer url={layers[mapLayer]} />
                    {conflictDataset.map(zone => (
                        <React.Fragment key={zone.id}>
                            <Circle 
                                center={zone.location} 
                                radius={400000} 
                                pathOptions={{ 
                                    color: getCircleColor(zone.status), 
                                    fillColor: getCircleColor(zone.status), 
                                    fillOpacity: 0.1,
                                    weight: 1,
                                    dashArray: '5, 5'
                                }} 
                            />
                            <Marker 
                                position={zone.location}
                                icon={L.divIcon({
                                    className: 'custom-div-icon',
                                    html: `<div class="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>`,
                                    iconSize: [8, 8],
                                    iconAnchor: [4, 4]
                                })}
                            >
                                <Popup className="dark-popup">
                                    <div className="text-sm font-mono p-1 bg-dark-panel">
                                        <div className="font-bold border-b border-dark-border mb-1">{zone.name}</div>
                                        <div>STATUS: {zone.status}</div>
                                        <div className="text-gray-400 mt-1">{zone.activity}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapContainer>
                <MapLayerSwitcher currentLayer={mapLayer} setLayer={setMapLayer} />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {conflictDataset.map(zone => (
                    <div key={zone.id} className="p-2 border border-dark-border/30 bg-dark-bg/20 rounded hover:border-gray-500 transition-colors flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-200 font-bold">{zone.name}</span>
                            <span className={`text-xs font-bold ${getStatusColor(zone.status)}`}>{zone.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-tight italic">"{zone.activity}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConflictMapWidget;
