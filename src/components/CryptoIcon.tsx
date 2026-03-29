/**
 * CryptoIcon — renders real SVG coin logos from CryptoLogos CDN.
 * Falls back to a styled letter avatar if the image fails to load.
 */
interface CryptoIconProps {
    symbol: 'ETH' | 'BTC' | 'SOL' | 'USDT' | 'BNB' | 'USDC' | string;
    size?: number;
    className?: string;
}

const LOGO_URLS: Record<string, string> = {
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040',
    SOL: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=040',
    USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
    BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040',
    USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040',
};

const FALLBACK_COLORS: Record<string, string> = {
    ETH: '#627EEA',
    BTC: '#F7931A',
    SOL: '#9945FF',
    USDT: '#26A17B',
    BNB: '#F3BA2F',
    USDC: '#2775CA',
};

export default function CryptoIcon({ symbol, size = 32, className = '' }: CryptoIconProps) {
    const url = LOGO_URLS[symbol.toUpperCase()];
    const color = FALLBACK_COLORS[symbol.toUpperCase()] ?? '#7C3AED';

    if (!url) {
        return (
            <div
                className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
                style={{ width: size, height: size, backgroundColor: color + '22', color, fontSize: size * 0.375 }}
            >
                {symbol.charAt(0)}
            </div>
        );
    }

    return (
        <div
            className={`rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${className}`}
            style={{ width: size, height: size }}
        >
            <img
                src={url}
                alt={symbol}
                width={size}
                height={size}
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                    // Fallback to letter avatar
                    const parent = (e.target as HTMLImageElement).parentElement!;
                    parent.innerHTML = `<span style="font-size:${size * 0.375}px;font-weight:700;color:${color}">${symbol.charAt(0)}</span>`;
                    parent.style.backgroundColor = color + '22';
                }}
            />
        </div>
    );
}
