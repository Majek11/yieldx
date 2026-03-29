import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

// Fallback static prices in case API is unavailable
const FALLBACK: CoinPrice[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 94210, price_change_percentage_24h: 2.34, image: '' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3512, price_change_percentage_24h: 1.87, image: '' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 201.5, price_change_percentage_24h: 5.21, image: '' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', current_price: 612, price_change_percentage_24h: 0.94, image: '' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', current_price: 2.24, price_change_percentage_24h: -1.12, image: '' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', current_price: 1.08, price_change_percentage_24h: -0.48, image: '' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', current_price: 44.2, price_change_percentage_24h: 3.56, image: '' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', current_price: 19.8, price_change_percentage_24h: 2.11, image: '' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', current_price: 11.4, price_change_percentage_24h: -0.83, image: '' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', current_price: 0.198, price_change_percentage_24h: 4.72, image: '' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', current_price: 14.6, price_change_percentage_24h: 1.33, image: '' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', current_price: 312, price_change_percentage_24h: -2.14, image: '' },
];

const fmt = (n: number) =>
  n >= 1000
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n);

export default function MarketTicker() {
  const [coins, setCoins] = useState<CoinPrice[]>(FALLBACK);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [fetching, setFetching] = useState(false);

  const fetchPrices = useCallback(async () => {
    setFetching(true);
    try {
      const ids = FALLBACK.map(c => c.id).join(',');
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=24h`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) throw new Error('CoinGecko API error');
      const data: CoinPrice[] = await res.json();
      if (data.length > 0) {
        setCoins(data);
        setLastUpdated(new Date());
      }
    } catch {
      // Keep fallback data, silently fail
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    // Refresh every 60 seconds (respects CoinGecko free-tier rate limit)
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Duplicate array for seamless infinite scroll
  const displayCoins = [...coins, ...coins];

  return (
    <div className="bg-card/30 border-y border-border/40 relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Updated time + spinner — top right */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-1.5">
        <button
          onClick={fetchPrices}
          disabled={fetching}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh prices"
        >
          <RefreshCw className={`w-3 h-3 ${fetching ? 'animate-spin' : ''}`} />
        </button>
        <span className="text-muted-foreground text-[10px]">
          {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="ticker-wrapper overflow-hidden py-3">
        <div className="ticker-track flex gap-8 w-max animate-ticker">
          {displayCoins.map((coin, i) => {
            const up = coin.price_change_percentage_24h >= 0;
            return (
              <div key={`${coin.id}-${i}`} className="flex items-center gap-2 flex-shrink-0">
                {coin.image && (
                  <img src={coin.image} alt={coin.symbol} className="w-4 h-4 rounded-full" />
                )}
                <span className="text-foreground text-xs font-semibold font-heading uppercase">
                  {coin.symbol}
                </span>
                <span className="text-foreground text-xs font-mono">
                  {fmt(coin.current_price)}
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {up ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                </span>
                <span className="text-border/60 text-xs">·</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
