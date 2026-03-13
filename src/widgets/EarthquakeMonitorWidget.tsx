import React, { useEffect, useState, useCallback } from 'react';
import { Activity, MapPin, Layers } from 'lucide-react';

interface Earthquake {
    id: string;
    magnitude: number;
    location: string;
    depth: number;
    time: string;
    url: string;
}

const EarthquakeMonitorWidget: React.FC = () => {
    const [quakes, setQuakes] = useState<Earthquake[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchQuakes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
            const data = await response.json();
            
            if (data && data.features) {
                const formattedQuakes: Earthquake[] = data.features
                    .slice(0, 15) // Top 15 recent
                    .map((f: any) => ({
                        id: f.id,
                        magnitude: f.properties.mag,
                        location: f.properties.place,
                        depth: f.geometry.coordinates[2],
                        time: new Date(f.properties.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        url: f.properties.url
                    }));
                setQuakes(formattedQuakes);
                setLastUpdated(new Date());
            }
        } catch (err) {
            console.error('Error fetching USGS data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuakes();
        const interval = setInterval(fetchQuakes, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(interval);
    }, [fetchQuakes]);

    return (
        <div className="flex flex-col h-full gap-3">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-gray-500 font-mono uppercase">
                    {loading ? 'SENSING SEISMIC ACTIVITY...' : `LAST SCAN: ${lastUpdated.toLocaleTimeString()}`}
                </span>
                <span className="text-[10px] text-dark-accent font-bold font-mono">
                    USGS LIVE FEED
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {quakes.map(quake => (
                    <div key={quake.id} className={`p-3 border rounded transition-all flex items-center gap-3 group cursor-default ${
                        quake.magnitude >= 5 
                        ? 'bg-dark-alert/10 border-dark-alert/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                        : 'bg-dark-bg/30 border-dark-border/50 hover:bg-dark-bg/50 hover:border-gray-500'
                    }`}>
                        <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border font-bold ${
                            quake.magnitude >= 5 ? 'border-dark-alert text-dark-alert' : 'border-dark-accent text-dark-accent'
                        }`}>
                            <span className="text-xs">MAG</span>
                            <span className="text-sm leading-none">{quake.magnitude.toFixed(1)}</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="text-xs text-gray-200 font-bold truncate group-hover:text-white transition-colors">
                                {quake.location}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                                    <Layers size={10} /> {quake.depth.toFixed(1)}km DEPTH
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {quake.time}
                                </span>
                            </div>
                        </div>

                        {quake.magnitude >= 5 && (
                            <div className="animate-pulse">
                                <Activity size={16} className="text-dark-alert" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EarthquakeMonitorWidget;
