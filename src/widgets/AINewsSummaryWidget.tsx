import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Sparkles, RefreshCcw, ShieldCheck } from 'lucide-react';

const AINewsSummaryWidget: React.FC = () => {
    const [summary, setSummary] = useState<string>('ANALYZING GLOBAL FEEDS...');
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const generateSummary = useCallback(async () => {
        setLoading(true);
        setSummary('INITIALIZING NEURAL ENGINE...');
        
        // Mocking an AI summary based on current "hot" topics or just providing a generic strategic overview
        // In a real app, this might call an LLM with the latest news headlines.
        setTimeout(() => {
            const summaries = [
                "STRATEGIC OVERVIEW: Elevated tensions in Eastern Europe and South China Sea suggest a shift in maritime posturing. Tactical alerts remain high near urban hubs.",
                "SITUATION REPORT: Natural disaster events (wildfires/seismic) are clustering in the Pacific Basin. Infrastructure resilience remains stable but expects localized disruptions.",
                "MARKET IMPACT: Global markets are reacting to energy volatility following regional supply chain adjustments. Aviation corridors remain mostly open with minor bypasses.",
                "INTELLIGENCE SUMMARY: Multi-vector monitoring shows increased digital and physical reconnaissance across sovereign borders. No immediate kinetic escalations detected."
            ];
            const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
            setSummary(randomSummary);
            setLoading(false);
            setLastUpdated(new Date());
        }, 2000);
    }, []);

    useEffect(() => {
        generateSummary();
    }, [generateSummary]);

    return (
        <div className="flex flex-col h-full gap-3 font-mono">
            <div className="flex justify-between items-center px-1">
                <span className="text-sm text-gray-500 uppercase">Neural Intelligence Hub</span>
                <span className="text-sm text-dark-accent font-bold animate-pulse flex items-center gap-1">
                    <Brain size={12} /> AI ACTIVE
                </span>
            </div>

            <div className="flex-1 bg-dark-bg/20 border border-dark-accent/20 rounded p-4 relative overflow-hidden group">
                {/* Background glow effect */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-dark-accent/5 rounded-full blur-3xl group-hover:bg-dark-accent/10 transition-colors"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-dark-accent" />
                        <span className="text-[11px] font-bold text-gray-200">TACTICAL SUMMARY</span>
                    </div>
                    
                    <div className={`text-sm leading-relaxed transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'} ${loading ? 'animate-pulse' : ''} text-gray-300`}>
                        {summary}
                    </div>

                    <div className="mt-auto pt-4 flex justify-between items-end border-t border-dark-border/30">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase">Verification Level</span>
                            <span className="text-sm text-green-500 flex items-center gap-1"><ShieldCheck size={10} /> HIGH CONFIDENCE</span>
                        </div>
                        <button 
                            onClick={generateSummary}
                            disabled={loading}
                            className="bg-dark-accent/10 hover:bg-dark-accent/20 border border-dark-accent/30 text-dark-accent px-2 py-1 rounded text-sm flex items-center gap-1 transition-all"
                        >
                            <RefreshCcw size={10} className={loading ? 'animate-spin' : ''} /> RE-ANALYZE
                        </button>
                    </div>
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <div className="px-1 text-xs text-gray-600 uppercase flex justify-between">
                <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
                <span>System Res: 98.4%</span>
            </div>
        </div>
    );
};

export default AINewsSummaryWidget;
