"use client";
import { CircleHelp } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  data: Array<{ value: number; lastValue: number; date: string }>;
  comparisonText: string;
}

const StatsCard = ({
  title,
  value,
  change,
  data,
  comparisonText,
}: StatsCardProps) => {
  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center p-3 justify-between border-b border-[#F1F1F1]">
        <h3 className="text-[#515153] font-semibold">{title}</h3>
        <CircleHelp size={16} className="text-[#031B15]" />
      </div>

      <div className="p-3 border-b border-[#F1F1F1]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[32px] font-semibold text-gray-900">{value}</h2>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {isPositive ? "↑" : "↓"} {Math.abs(change)}%
            </span>
            <p className="text-sm text-[#031B1599] mt-1">{comparisonText}</p>
          </div>
        </div>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} stroke="#EDEDED"  />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7583" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8C9198" }}
                tickMargin={10}
              />
              <Line
                type="monotone"
                dataKey="lastValue"
                stroke="#E25D33"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#16B364"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-6 p-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#16B364]"></div>
          <span className="text-sm text-[#7D7D7E]">This Month</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E25D33]"></div>
          <span className="text-sm text-[#7D7D7E]">Last Month</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
