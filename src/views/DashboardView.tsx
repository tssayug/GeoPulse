import React, { useState } from 'react';
import ReactGridLayout from 'react-grid-layout';

const { Responsive, WidthProvider } = (ReactGridLayout as any);
const ResponsiveGridLayout = WidthProvider(Responsive);
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import WidgetWrapper from '../components/WidgetWrapper';
import NewsWidget from '../widgets/NewsWidget';
import MarketsWidget from '../widgets/MarketsWidget';
import FlightTrackerWidget from '../widgets/FlightTrackerWidget';
import EmergencyAlertsWidget from '../widgets/EmergencyAlertsWidget';
import YoutubeLiveWidget from '../widgets/YoutubeLiveWidget';
import DisasterEventsWidget from '../widgets/DisasterEventsWidget';
import EarthquakeMonitorWidget from '../widgets/EarthquakeMonitorWidget';
import ConflictMapWidget from '../widgets/ConflictMapWidget';
import AINewsSummaryWidget from '../widgets/AINewsSummaryWidget';

const defaultLayout = [
    { i: 'news', x: 0, y: 0, w: 4, h: 5 },
    { i: 'markets', x: 4, y: 0, w: 4, h: 5 },
    { i: 'alerts', x: 8, y: 0, w: 4, h: 5 },
    { i: 'disaster', x: 0, y: 5, w: 4, h: 5 },
    { i: 'earthquake', x: 4, y: 5, w: 4, h: 5 },
    { i: 'conflict', x: 8, y: 5, w: 4, h: 5 },
    { i: 'flights', x: 0, y: 10, w: 8, h: 7 },
    { i: 'ytlive', x: 8, y: 10, w: 4, h: 7 },
    { i: 'aisummary', x: 0, y: 17, w: 12, h: 4 }
];

const DashboardView: React.FC = () => {
    const [layout, setLayout] = useState<any[]>(() => {
        const saved = localStorage.getItem('dashboard-layout');
        return saved ? JSON.parse(saved) : defaultLayout;
    });

    const onLayoutChange = (newLayout: any) => {
        setLayout(newLayout);
        localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
    };

    const removeWidget = (id: string) => {
        const updated = layout.filter((l: any) => l.i !== id);
        setLayout(updated);
        localStorage.setItem('dashboard-layout', JSON.stringify(updated));
    };

    const renderContent = (id: string) => {
        switch (id) {
            case 'news': return <NewsWidget />;
            case 'markets': return <MarketsWidget />;
            case 'flights': return <FlightTrackerWidget />;
            case 'alerts': return <EmergencyAlertsWidget />;
            case 'ytlive': return <YoutubeLiveWidget />;
            case 'disaster': return <DisasterEventsWidget />;
            case 'earthquake': return <EarthquakeMonitorWidget />;
            case 'conflict': return <ConflictMapWidget />;
            case 'aisummary': return <AINewsSummaryWidget />;
            default: return <div className="text-gray-500 font-mono text-sm p-4">Unknown Widget: {id}</div>;
        }
    };

    const getWidgetTitle = (id: string) => {
        switch (id) {
            case 'news': return 'Geopolitical Intelligence';
            case 'markets': return 'Global Markets';
            case 'flights': return 'Aviation Radar';
            case 'alerts': return 'Emergency Broadcasts';
            case 'ytlive': return 'Live Monitor';
            case 'disaster': return 'Global Disaster Monitor';
            case 'earthquake': return 'Seismic Activity';
            case 'conflict': return 'Tactical Flashpoints';
            case 'aisummary': return 'Neura Tactical Analysis';
            default: return 'Widget';
        }
    };

    return (
        <div className="p-4 h-full overflow-y-auto overflow-x-hidden min-h-screen">
            <div className="flex justify-between items-end mb-4 px-2">
                <h2 className="text-xl font-bold tracking-widest uppercase text-gray-300">Operational Overview</h2>
                {layout.length < 5 && (
                    <button
                        onClick={() => {
                            setLayout(defaultLayout);
                            localStorage.setItem('dashboard-layout', JSON.stringify(defaultLayout));
                        }}
                        className="text-sm uppercase tracking-widest text-dark-accent hover:text-green-400 font-bold px-3 py-1.5 border border-dark-border rounded cursor-pointer transition-colors"
                    >
                        Reset Layout
                    </button>
                )}
            </div>

            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={60}
                onLayoutChange={onLayoutChange}
                draggableHandle=".drag-handle"
                margin={[16, 16]}
                containerPadding={[0, 0]}
            >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {layout.map((l: any) => (
                    <div key={l.i}>
                        <WidgetWrapper id={l.i} title={getWidgetTitle(l.i)} onRemove={removeWidget}>
                            {renderContent(l.i)}
                        </WidgetWrapper>
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
};

export default DashboardView;
