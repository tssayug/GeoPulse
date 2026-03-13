import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';

interface Alert {
    id: string;
    type: 'CRITICAL' | 'WARNING' | 'INFO';
    source: string;
    title: string;
    location: string;
    time: string;
    details?: string;
}

const EmergencyAlertsWidget: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([
        { id: '1', type: 'CRITICAL', source: 'GEOPOL', title: 'AIRSPACE RESTRICTION', location: 'EASTERN EUROPE', time: '0m ago' },
        { id: '2', type: 'WARNING', source: 'SEISMIC', title: 'MAG 5.8 ACTIVITY', location: 'OFFSHORE JAPAN', time: '12m ago' },
    ]);

    useEffect(() => {
        // Simulation of aggregation
        const interval = setInterval(() => {
            const sources = ['SATELLITE', 'INTEL', 'SEISMIC', 'ENV'];
            const types: ('CRITICAL' | 'WARNING' | 'INFO')[] = ['CRITICAL', 'WARNING', 'INFO'];
            const locations = ['PACIFIC RIM', 'ATLANTIC BASIN', 'CENTRAL ASIA', 'NORTHERN ARCTIC'];
            
            const newAlert: Alert = {
                id: Math.random().toString(36).substr(2, 9),
                type: types[Math.floor(Math.random() * types.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                title: 'SIGNAL RECOVERY DETECTED',
                location: locations[Math.floor(Math.random() * locations.length)],
                time: 'JUST NOW'
            };

            setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        }, 30000); // New alert every 30s

        return () => clearInterval(interval);
    }, []);

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'CRITICAL': return 'border-dark-alert text-dark-alert bg-dark-alert/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
            case 'WARNING': return 'border-yellow-500 text-yellow-500 bg-yellow-500/10';
            case 'INFO': return 'border-dark-accent text-dark-accent bg-dark-accent/10';
            default: return 'border-gray-500 text-gray-500';
        }
    };

    return (
        <div className="flex flex-col h-full gap-3 font-mono">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Aggregated Alert Stream</span>
                <span className="flex items-center gap-1 text-[10px] text-dark-accent font-bold">
                    <Zap size={10} className="animate-bounce" /> LIVE
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`p-3 border rounded relative overflow-hidden transition-all ${getTypeStyles(alert.type)}`}>
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                {alert.type === 'CRITICAL' ? <ShieldAlert size={14} /> : 
                                 alert.type === 'WARNING' ? <AlertTriangle size={14} /> : 
                                 <AlertCircle size={14} />}
                                <span className="text-[9px] font-bold tracking-tighter uppercase">{alert.source}</span>
                            </div>
                            <span className="text-[9px] opacity-70">{alert.time}</span>
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase leading-tight">{alert.title}</span>
                            <span className="text-[10px] opacity-80 mt-1">{alert.location}</span>
                        </div>

                        {/* Scanline pulse */}
                        {alert.type === 'CRITICAL' && (
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 animate-[moveUp_2s_linear_infinite]"></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-2 border-t border-dark-border/30 text-center">
                <button className="text-[9px] text-gray-500 hover:text-dark-accent transition-colors uppercase tracking-widest">
                    Clear Terminal
                </button>
            </div>
        </div>
    );
};

export default EmergencyAlertsWidget;
