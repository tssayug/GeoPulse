import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-14 bg-dark-panel border-b border-dark-border flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-dark-bg border border-dark-border rounded-md text-sm text-dark-accent">
                    <ShieldCheck size={16} />
                    <span className="font-semibold tracking-wider">SYSTEM OPERATIONAL</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                <div className="bg-dark-bg px-4 py-1.5 rounded-md border border-dark-border shadow-inner">
                    {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} ZULU
                </div>
            </div>
        </header>
    );
};

export default Header;
