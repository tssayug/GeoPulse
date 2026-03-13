import React, { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../config/apiConfig';

interface NewsItem {
    id: string | number;
    source: string;
    title: string;
    description: string;
    time: string;
    url: string;
}

const mockNews: NewsItem[] = [
    { id: 1, source: 'REUTERS', title: 'Border tensions rise in eastern region', description: 'Diplomatic efforts continue as military presence increases along the disputed border zone.', time: '10m ago', url: '#' },
    { id: 2, source: 'AP', title: 'Naval drills conducted in Pacific', description: 'Major maritime exercise involving multiple carrier groups starts today in international waters.', time: '45m ago', url: '#' },
    { id: 3, source: 'GLOBAL', title: 'Emergency relief deployed after earthquake', description: 'International aid agencies rushing supplies to the affected province following 6.8 magnitude tremor.', time: '2h ago', url: '#' },
    { id: 4, source: 'INTEL', title: 'Cyber attack detected on regional grid', description: 'Security experts investigating coordinated attempt to disrupt power distribution infrastructure.', time: '4h ago', url: '#' },
    { id: 5, source: 'REUTERS', title: 'Diplomatic talks stall in capital', description: 'Negotiations reach deadlock over key territorial and resource allocation agreements.', time: '5h ago', url: '#' },
];

const NewsWidget: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>(mockNews);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchNews = useCallback(async () => {
        if (!API_CONFIG.NEWS_API_KEY) {
            console.log('NewsAPI key missing, using mock data');
            setNews(mockNews);
            return;
        }

        setLoading(true);
        try {
            const query = 'war OR conflict OR military OR earthquake OR disaster OR emergency';
            const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${API_CONFIG.NEWS_API_KEY}`);
            const data = await response.json();

            if (data.status === 'ok') {
                const formattedNews: NewsItem[] = data.articles.map((art: any, index: number) => ({
                    id: art.url || index,
                    source: art.source.name.toUpperCase(),
                    title: art.title,
                    description: art.description || '',
                    time: new Date(art.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    url: art.url
                }));
                setNews(formattedNews);
                setLastUpdated(new Date());
            } else {
                throw new Error(data.message || 'Failed to fetch news');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setNews(mockNews); // Fallback to mock on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
        // Refresh every 10 minutes
        const interval = setInterval(fetchNews, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchNews]);

    return (
        <div className="flex flex-col gap-3 h-full">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-gray-500 font-mono">
                    {loading ? 'SYNCHRONIZING...' : `LAST UPDATE: ${lastUpdated.toLocaleTimeString()}`}
                </span>
                <button 
                    onClick={() => fetchNews()}
                    className="text-[10px] text-dark-accent hover:text-green-400 font-bold uppercase transition-colors"
                >
                    Refresh
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {news.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1 p-3 bg-dark-bg/50 border border-dark-border rounded-md hover:border-gray-500 transition-all cursor-default group">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold tracking-wider">
                            <span className="text-blue-400 group-hover:text-blue-300">{item.source}</span>
                            <span>{item.time}</span>
                        </div>
                        <h4 className="text-sm text-gray-200 font-bold leading-tight group-hover:text-white transition-colors">{item.title}</h4>
                        <p className="text-xs text-gray-400 leading-snug line-clamp-2">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsWidget;
