import React, { useState } from 'react';
import { Radio, Monitor, ChevronRight } from 'lucide-react';

interface NewsChannel {
    id: string;
    name: string;
    channelId: string;
}

const channels: NewsChannel[] = [
    { id: 'dw', name: 'DW NEWS', channelId: 'UCknLrEdhRCp1aegoMqRaCZg' },
    { id: 'skynews', name: 'SKY NEWS', channelId: 'UCoMdktPbSTixAyNGwb-UYkQ' },
    { id: 'bbc', name: 'BBC NEWS', channelId: 'UC16niRr50-MSBwiO3YDb3RA' },
    { id: 'france24', name: 'FRANCE 24 ENGLISH', channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg' },
    { id: 'bloomberg', name: 'BLOOMBERG GLOBAL NEWS', channelId: 'UCIALMKvObZNtJ6AmdCLP7Lg' },
    { id: 'trt', name: 'TRT WORLD', channelId: 'UC7fWeaHhqgM4Ry-RMpM2YYw' },
    { id: 'cna', name: 'CHANNEL NEWS ASIA', channelId: 'UC83jt4dlz1Gjl58fzQrrKZg' },
];

const YoutubeLiveWidget: React.FC = () => {
    const [selectedChannel, setSelectedChannel] = useState<NewsChannel | null>(null);
    const [showSelector, setShowSelector] = useState(true);

    const selectChannel = (channel: NewsChannel) => {
        setSelectedChannel(channel);
        setShowSelector(false);
    };

    return (
        <div className="h-full w-full flex flex-col bg-black rounded-md border border-dark-border/50 relative overflow-hidden group font-mono">
            {/* Ifram Control Overlay */}
            {!showSelector && selectedChannel && (
                <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => setShowSelector(true)}
                        className="bg-dark-bg/80 border border-dark-border text-sm text-dark-accent px-2 py-1 rounded hover:bg-dark-accent hover:text-dark-bg transition-colors flex items-center gap-1"
                    >
                        <Monitor size={12} /> CHANGE FEED
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 relative">
                {selectedChannel ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/live_stream?channel=${selectedChannel.channelId}&autoplay=1&mute=1`}
                        title={selectedChannel.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full grayscale-[20%] contrast-[110%]"
                    ></iframe>
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-dark-bg/80">
                        <Radio className="text-dark-accent mb-2 animate-pulse" size={32} />
                        <span className="text-gray-500 text-sm font-bold tracking-widest">SIGNAL LOST - SELECT FEED</span>
                    </div>
                )}

                {/* Feed Selector Overlay */}
                {showSelector && (
                    <div className="absolute inset-0 bg-dark-bg/95 z-40 p-4 flex flex-col gap-4 overflow-y-auto">
                        <div className="text-sm text-gray-400 border-b border-dark-border pb-1">AVAILABLE SATELLITE FEEDS</div>
                        <div className="flex flex-col gap-2">
                            {channels.map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => selectChannel(channel)}
                                    className={`flex items-center justify-between p-3 border rounded transition-all ${
                                        selectedChannel?.id === channel.id 
                                        ? 'bg-dark-accent/10 border-dark-accent text-dark-accent' 
                                        : 'bg-dark-bg/50 border-dark-border/50 text-gray-400 hover:border-gray-500 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${selectedChannel?.id === channel.id ? 'bg-dark-accent animate-pulse' : 'bg-gray-600'}`}></div>
                                        <span className="text-sm font-bold">{channel.name}</span>
                                    </div>
                                    <ChevronRight size={14} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Visual scanlines effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20 opacity-20 mix-blend-overlay"></div>
            
            {/* Status Bar */}
            <div className="bg-black/80 border-t border-dark-border/50 px-2 py-1 flex justify-between items-center z-30">
                <span className="text-xs text-gray-500 uppercase tracking-tighter">
                    {selectedChannel ? `STREAMING: ${selectedChannel.name}` : 'OPERATIONAL STANDBY'}
                </span>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-dark-accent rounded-full animate-pulse"></span>
                    <span className="text-xs text-dark-accent font-bold">LIVE</span>
                </div>
            </div>
        </div>
    );
};

export default YoutubeLiveWidget;
