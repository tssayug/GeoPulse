import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, AlertTriangle } from 'lucide-react';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [20, 32],
    iconAnchor: [10, 32]
});

interface DisasterEvent {
    id: string;
    title: string;
    category: string;
    date: string;
    longitude: number;
    latitude: number;
}

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

const DisasterEventsWidget: React.FC = () => {
    const [events, setEvents] = useState<DisasterEvent[]>([]);
    const [loading, setLoading] = useState(false);
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

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=20');
            const data = await response.json();
            
            if (data && data.events) {
                const formattedEvents: DisasterEvent[] = data.events.map((e: any) => {
                    const latestGeometry = e.geometry[0];
                    return {
                        id: e.id,
                        title: e.title,
                        category: e.categories[0].title,
                        date: new Date(latestGeometry.date).toLocaleDateString(),
                        longitude: latestGeometry.coordinates[0],
                        latitude: latestGeometry.coordinates[1]
                    };
                });
                setEvents(formattedEvents);
            }
        } catch (err) {
            console.error('Error fetching EONET data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchEvents();
        }
    }, [fetchEvents, mounted]);

    if (!mounted) return <div className="h-full w-full bg-dark-bg flex items-center justify-center text-gray-500 font-mono text-sm">LOADING DISASTER DATA...</div>;

    return (
        <div className="flex flex-col h-full gap-2 font-mono">
            <div className="flex justify-between items-center px-1">
                <span className="text-sm text-gray-500 uppercase">
                    {loading ? 'REFRESHING...' : 'GLOBAL DISASTER MONITOR'}
                </span>
                <span className="text-sm text-dark-accent font-bold">
                    {events.length} EVENTS ACTIVE
                </span>
            </div>

            <div className="h-40 w-full rounded border border-dark-border overflow-hidden relative z-0">
                <MapContainer
                    center={[20, 0]}
                    zoom={1}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    scrollWheelZoom={false}
                >
                    <TileLayer url={layers[mapLayer]} />
                    {events.map(event => (
                        <Marker key={event.id} position={[event.latitude, event.longitude]} icon={DefaultIcon}>
                            <Popup className="dark-popup">
                                <div className="text-sm p-1 bg-dark-panel">
                                    <div className="text-dark-alert font-bold">{event.category}</div>
                                    <div className="text-gray-300">{event.title}</div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                <MapLayerSwitcher currentLayer={mapLayer} setLayer={setMapLayer} />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {events.map(event => (
                    <div key={event.id} className="p-2 border border-dark-border/50 bg-dark-bg/30 rounded hover:bg-dark-bg/50 transition-colors flex items-start gap-2">
                        <div className="mt-1">
                            <AlertTriangle size={14} className="text-dark-alert" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-sm text-dark-accent font-bold uppercase tracking-tighter">{event.category}</div>
                            <div className="text-sm text-gray-200 font-bold leading-tight line-clamp-1">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisasterEventsWidget;
