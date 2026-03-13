import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-gray-200 font-mono">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-auto relative custom-scrollbar">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
