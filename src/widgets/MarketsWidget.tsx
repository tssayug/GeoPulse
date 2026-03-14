import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { API_CONFIG } from '../config/apiConfig';

interface MarketItem {
    id: string | number;
    symbol: string;
    label: string;
    value: string;
    change: string;
    percent: string;
    isUp: boolean;
}

const mockMarkets: MarketItem[] = [
    { id: 1, symbol: 'SPY', label: 'S&P 500', value: '5,026.61', change: '+28.70', percent: '+0.57%', isUp: true },
    { id: 2, symbol: 'QQQ', label: 'NASDAQ', value: '15,990.66', change: '+196.93', percent: '+1.25%', isUp: true },
    { id: 3, symbol: 'UUP', label: 'USD INDEX', value: '104.22', change: '+0.12', percent: '+0.11%', isUp: true },
    { id: 4, symbol: 'GLD', label: 'GOLD', value: '2,024.10', change: '-9.20', percent: '-0.45%', isUp: false },
    { id: 5, symbol: 'USO', label: 'CRUDE OIL', value: '76.84', change: '+1.18', percent: '+1.56%', isUp: true },
];

const MarketsWidget: React.FC = () => {
    const [markets, setMarkets] = useState<MarketItem[]>(mockMarkets);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchMarketData = useCallback(async () => {
        if (!API_CONFIG.ALPHA_VANTAGE_KEY) {
            console.log('Alpha Vantage key missing, using mock data');
            setMarkets(mockMarkets);
            return;
        }

        setLoading(true);
        try {
            // Note: Alpha Vantage free tier is limited. We fetch iteratively for each symbol.
            // In a real app we'd batch or use a different endpoint, but following instructions.
            const symbols = ['SPY', 'QQQ', 'UUP', 'GLD', 'USO'];
            const labels: Record<string, string> = {
                'SPY': 'S&P 500',
                'QQQ': 'NASDAQ',
                'UUP': 'USD INDEX',
                'GLD': 'GOLD',
                'USO': 'CRUDE OIL'
            };

            const updatedMarkets: MarketItem[] = [...markets];

            for (const symbol of symbols) {
                try {
                    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE_KEY}`);
                    const data = await response.json();
                    
                    if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
                        const quote = data['Global Quote'];
                        const price = parseFloat(quote['05. price']);
                        const changePercentStr = quote['10. change percent'];
                        const changePercent = parseFloat(changePercentStr.replace('%', ''));
                        const change = parseFloat(quote['09. change']);

                        const idx = updatedMarkets.findIndex(m => m.symbol === symbol);
                        if (idx !== -1) {
                            updatedMarkets[idx] = {
                                ...updatedMarkets[idx],
                                value: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                change: (change >= 0 ? '+' : '') + change.toFixed(2),
                                percent: (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%',
                                isUp: change >= 0
                            };
                        }
                    }
                    // Small delay to respect rate limits if fetching multiple
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (err) {
                    console.error(`Failed to fetch ${symbol}:`, err);
                }
            }

            setMarkets(updatedMarkets);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching market data:', error);
            setMarkets(mockMarkets);
        } finally {
            setLoading(false);
        }
    }, [markets]);

    useEffect(() => {
        fetchMarketData();
        // Refresh every 5 minutes
        const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchMarketData]);

    return (
        <div className="flex flex-col gap-3 h-full">
            <div className="flex justify-between items-center px-1">
                <span className="text-sm text-gray-500 font-mono">
                    {loading ? 'SYNCING...' : `LAST UPDATE: ${lastUpdated.toLocaleTimeString()}`}
                </span>
                <button 
                    onClick={() => fetchMarketData()}
                    className="text-sm text-dark-accent hover:text-green-400 font-bold uppercase transition-colors"
                    disabled={loading}
                >
                    <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {markets.map((market) => (
                    <div key={market.id} className="flex items-center justify-between p-3 bg-dark-bg/30 border border-dark-border/50 rounded hover:bg-dark-bg/50 hover:border-gray-500 transition-all group">
                        <div className="flex flex-col">
                            <div className="font-bold text-gray-300 tracking-wide text-sm">{market.label}</div>
                            <div className="text-sm text-gray-500 font-mono uppercase">{market.symbol}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-base text-gray-200">{market.value}</span>
                            <div className={`flex items-center gap-1 w-20 justify-end font-mono text-sm ${market.isUp ? 'text-dark-accent' : 'text-dark-alert'}`}>
                                {market.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                <span>{market.percent}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketsWidget;
