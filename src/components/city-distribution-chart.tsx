"use client";

import { CircleHelp } from "lucide-react";

interface CityData {
  name: string;
  value: string;
  percentage: string;
  change: number;
  color: string;
}

interface CityDistributionChartProps {
  total: string;
  totalChange: number;
  cities: CityData[];
}

const CityDistributionChart = ({
  total,
  totalChange,
  cities,
}: CityDistributionChartProps) => {
  const radius = 120;
  let startAngle = -180; // Start from the left side

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center p-3 justify-between border-b border-[#F1F1F1]">
        <h3 className="text-[#515153] font-semibold">Top Cities</h3>
        <CircleHelp size={16} className="text-[#031B15]" />
      </div>

      <div className="p-3 pt-0">
        <div className="relative w-[65%] mx-auto mb-3">
          <svg className="w-full h-full" viewBox="0 0 300 150">
            <defs>
              {cities.map((city, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`path-${index}-gradient`}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={city.color} />
                  <stop
                    offset="100%"
                    stopColor={city.color}
                    stopOpacity="0.8"
                  />
                </linearGradient>
              ))}
            </defs>
            {cities.map((city, index) => {
              const percentage = parseFloat(city.percentage) / 100;
              const sweepAngle = 180 * percentage;
              const x1 = 150 + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 150 + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 =
                150 +
                radius * Math.cos(((startAngle + sweepAngle) * Math.PI) / 180);
              const y2 =
                150 +
                radius * Math.sin(((startAngle + sweepAngle) * Math.PI) / 180);
              const largeArcFlag = sweepAngle > 180 ? 1 : 0;

              const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
              startAngle += sweepAngle;

              return (
                <path
                  key={city.name}
                  d={pathData}
                  stroke={`url(#path-${index}-gradient)`}
                  strokeWidth="30"
                  fill="none"
                />
              );
            })}
          </svg>
          <div className="absolute bottom-1  left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
            <span className="text-[13px] text-[#7D7D7E]">Total</span>
            <span className="text-lg font-bold">{total}</span>
            <span
              className={`text-[13px] ${
                totalChange >= 0 ? "text-[#1D874F]" : "text-[#F31D1D]"
              }`}
            >
              {totalChange >= 0 ? "↑" : "↓"} {Math.abs(totalChange)}%
            </span>
          </div>
        </div>
        <div className="space-y-2.5">
          {cities.map((city,index) => (
            <div key={city.name +index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: city.color }}
                />
                <span className="text-[13px] text-[#7D7D7E]">{city.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-bold">{city.value}</span>
                <span className="text-[13px] text-[#7D7D7E] bg-[#F7F7F7] px-1 py-0.5 rounded-xs">
                  {city.percentage}
                </span>
                <span
                  className={`text-[13px] ${
                    city.change >= 0 ? "text-[#1D874F]" : "text-[#F31D1D]"
                  }`}
                >
                  {city.change >= 0 ? "↑" : "↓"}
                  {Math.abs(city.change)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityDistributionChart;
