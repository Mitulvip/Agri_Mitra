import React from 'react';
import { PriceTrend } from '../types';

interface PriceTrendChartProps {
  data: PriceTrend[];
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const Chart: React.FC<{ trend: PriceTrend }> = ({ trend }) => {
    const { prices, cropName } = trend;
    if (!prices || prices.length === 0) {
      return <p className="text-sm text-gray-400">No price data available for {cropName}.</p>;
    }
    
    // Sort prices by date to ensure they are in chronological order
    const sortedPrices = [...prices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const maxPrice = Math.max(...sortedPrices.map(p => p.price));
    const minPrice = Math.min(...sortedPrices.map(p => p.price));
    const priceRange = maxPrice - minPrice;

    const chartHeight = 150;
    const chartWidth = 300;
    const barWidth = chartWidth / sortedPrices.length;

    return (
      <div className="mt-4">
        <h4 className="font-semibold text-md mb-2">{cropName} - Price Trend (Last 30 Days)</h4>
        <div className="p-4 bg-gray-800 rounded-lg">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full h-auto" aria-label={`Price trend chart for ${cropName}`}>
            {/* Y-Axis Labels */}
            <text x="0" y="10" className="text-xs fill-current text-gray-400">₹{maxPrice.toLocaleString('en-IN')}</text>
            <text x="0" y={chartHeight} className="text-xs fill-current text-gray-400">₹{minPrice.toLocaleString('en-IN')}</text>
            <g>
              {sortedPrices.map((p, i) => {
                const barHeight = priceRange > 0 ? ((p.price - minPrice) / priceRange) * (chartHeight - 20) : chartHeight - 20;
                const y = chartHeight - barHeight - 10; // 10px padding at bottom
                const x = i * barWidth;
                
                return (
                  <g key={p.date}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth - 2} // Small gap between bars
                      height={barHeight}
                      className="fill-current text-green-500 hover:text-green-400 transition-colors"
                      rx="2"
                      ry="2"
                    >
                      <title>{`Date: ${p.date}, Price: ₹${p.price.toLocaleString('en-IN')}/quintal`}</title>
                    </rect>
                  </g>
                );
              })}
            </g>
            {/* X-Axis Labels */}
            <text x="0" y={chartHeight} textAnchor="start" className="text-xs fill-current text-gray-400" dy="12">{new Date(sortedPrices[0].date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}</text>
            <text x={chartWidth} y={chartHeight} textAnchor="end" className="text-xs fill-current text-gray-400" dy="12">{new Date(sortedPrices[sortedPrices.length - 1].date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}</text>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-600">
      {data.map((trend, index) => (
        <Chart key={index} trend={trend} />
      ))}
    </div>
  );
};

export default PriceTrendChart;