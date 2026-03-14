import React from 'react';
import { useNavigate } from 'react-router-dom';


const HomeView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full items-center justify-center p-6 relative overflow-hidden bg-dark-bg">
            {/* Background glow effects */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dark-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center gap-12 text-center max-w-4xl mx-auto">

                {/* Title */}
                <div className="flex flex-col gap-4 items-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] text-gray-200 uppercase drop-shadow-lg">
                        GeoPulse
                        <br />
                        <span className="text-dark-accent tracking-widest text-2xl md:text-3xl">— Real-Time Global Awareness</span>
                    </h1>
                    <div className="h-1 w-32 bg-dark-accent rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                </div>

                {/* Globe Container */}
                <div className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full flex items-center justify-center relative bg-black shadow-[0_0_80px_rgba(34,197,94,0.15)] border-2 border-dark-accent/20 overflow-hidden group">
                    {/* Atmospheric Glow */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(34,197,94,0.3)] z-10 pointer-events-none"></div>
                    
                    {/* Earth Texture */}
                    <div
                        className="w-[100%] h-[100%] rounded-full absolute mix-blend-screen opacity-70 animate-[spin_60s_linear_infinite]"
                        style={{
                            backgroundImage: 'url(//unpkg.com/three-globe/example/img/earth-dark.jpg)',
                            backgroundSize: '200% auto',
                            backgroundPosition: 'center',
                            filter: 'brightness(1.5) contrast(1.2) hue-rotate(-10deg)',
                        }}
                    />

                    {/* Tactical Rings */}
                    <div className="absolute inset-0 rounded-full border border-dark-accent/10 scale-[1.05] animate-pulse"></div>
                    <div className="absolute inset-0 rounded-full border border-dark-accent/5 scale-[1.12]"></div>
                    
                    {/* Rotating Radar Rings */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-dark-accent/30 animate-[spin_10s_linear_infinite] opacity-50"></div>
                    <div className="absolute inset-0 rounded-full border-b-2 border-dark-accent/20 animate-[spin_15s_linear_reverse_infinite] opacity-30"></div>

                    {/* Scanning Line */}
                    <div className="absolute inset-x-0 h-[2px] bg-dark-accent/40 shadow-[0_0_15px_rgba(34,197,94,0.8)] top-0 animate-[scan_4s_ease-in-out_infinite] z-20"></div>
                    
                    {/* Coordinates Overlay */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                        <span className="text-dark-accent font-mono text-[10px] tracking-widest bg-dark-bg/60 px-2 py-0.5 rounded border border-dark-accent/20">COORD: 45.4642 N / 9.1900 E</span>
                        <span className="text-gray-500 font-mono text-[8px] mt-1 tracking-tighter">GLOBAL SURVEILLANCE ACTIVE</span>
                    </div>

                    {/* Interactive points (CSS dots) */}
                    <div className="absolute top-[30%] left-[40%] w-1.5 h-1.5 bg-dark-alert rounded-full animate-ping z-30"></div>
                    <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 bg-dark-alert rounded-full animate-ping delay-700 z-30"></div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group relative px-8 py-4 bg-dark-panel border border-dark-border hover:border-dark-accent rounded font-bold tracking-widest text-lg uppercase transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                >
                    <div className="absolute inset-0 w-0 bg-dark-accent/10 group-hover:w-full transition-all duration-500 ease-out"></div>
                    <span className="relative z-10 flex items-center gap-3 text-gray-300 group-hover:text-dark-accent transition-colors">
                        <span className="w-2 h-2 rounded-full bg-dark-accent animate-pulse group-hover:shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                        Enter Command Center
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HomeView;
