import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Globe, Activity } from 'lucide-react';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-dark-bg border-r border-dark-border h-full flex flex-col items-center py-6">
            <div className="flex items-center gap-2 mb-10 text-dark-accent px-4">
                <Activity size={28} />
                <h1 className="text-xl font-bold tracking-widest text-gray-200 uppercase">Nemesis</h1>
            </div>
            <nav className="w-full flex-1 flex flex-col gap-2 px-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-dark-panel text-dark-accent border border-dark-border' : 'text-gray-400 hover:text-gray-200 hover:bg-dark-panel/50'
                        }`
                    }
                >
                    <Globe size={20} />
                    <span>Home</span>
                </NavLink>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-dark-panel text-dark-accent border border-dark-border' : 'text-gray-400 hover:text-gray-200 hover:bg-dark-panel/50'
                        }`
                    }
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
            </nav>

            <div className="mt-auto px-4 w-full">
                <div className="text-xs text-gray-500 text-center font-mono">
                    v1.0.0-alpha
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
