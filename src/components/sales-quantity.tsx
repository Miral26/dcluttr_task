"use client";

import StatsCard from "./stats-card";
import { useEffect, useState } from "react";
import axios from "axios";

interface SalesData {
  "blinkit_insights_sku.created_at.day": string;
  "blinkit_insights_sku.created_at": string;
  "blinkit_insights_sku.qty_sold": string;
  "time.day": string;
}
interface ChartData {
  value: number;
  lastValue: number;
  date: string;
}

interface ResultData {
  query: {
    measures: ["blinkit_insights_sku.qty_sold"];
    timeDimensions: [
      {
        dimension: "blinkit_insights_sku.created_at";
        granularity: "day";
        dateRange: string[];
      }
    ];
  };
  data: SalesData[];
  lastRefreshTime: string;
  annotation: {
    measures: {
      "blinkit_insights_sku.qty_sold": {
        title: string;
        shortTitle: string;
        type: string;
        meta: {
          format: string;
          metricCategory: string;
        };
        drillMembers: string[];
        drillMembersGrouped: {
          measures: string[];
          dimensions: string[];
        };
      };
    };
    dimensions: object;
    segments: object;
    timeDimensions: {
      "blinkit_insights_sku.created_at.day": {
        title: string;
        shortTitle: string;
        type: string;
        granularity: {
          name: string;
          title: string;
          interval: string;
        };
      };
      "blinkit_insights_sku.created_at": {
        title: string;
        shortTitle: string;
        type: string;
      };
    };
    dataSource: string;
    dbType: string;
    extDbType: string;
    external: boolean;
    slowQuery: boolean;
    total: number | null;
  };
}
const processSalesData = (data: ResultData[]): ChartData[] => {
  return data[1].data.map((item: SalesData, index: number) => ({
    value: Number(item["blinkit_insights_sku.qty_sold"]),
    lastValue:
      Number(
        data[0]?.data[index]?.["blinkit_insights_sku.qty_sold"] ?? 0
      ),
    date: new Date(item["blinkit_insights_sku.created_at"]).toLocaleDateString(
      "en-US",
      { day: "numeric" }
    ),
  }));
};

export default function SalesQuantity() {
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [lastMonthTotalSales, setLastMonthTotalSales] = useState(0);
  const [change, setChange] = useState(0);
  const [mockChartData1, setMockChartData1] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://amaranth-muskox.aws-us-east-1.cubecloudapp.dev/dev-mode/feat/frontend-hiring-task/cubejs-api/v1/load",
          {
            query: [
              {
                measures: ["blinkit_insights_sku.qty_sold"],
                timeDimensions: [
                  {
                    dimension: "blinkit_insights_sku.created_at",
                    dateRange:
                      "2025-02-01T00:00:00.000, 2025-02-28T23:59:59.999",
                    granularity: "day",
                  },
                ],
                order: {
                  "blinkit_insights_sku.created_at": "asc",
                },
              },
              {
                measures: ["blinkit_insights_sku.qty_sold"],
                timeDimensions: [
                  {
                    dimension: "blinkit_insights_sku.created_at",
                    dateRange: "Last month",
                    granularity: "day",
                  },
                ],
                order: {
                  "blinkit_insights_sku.created_at": "asc",
                },
              },
            ],
            queryType: "multi",
          }
        );
        console.log("response", response);
        const processedData = processSalesData(response.data.results);
        console.log("processedData", processedData);
        setMockChartData1(processedData);
        // Calculate totals
        const total = processedData.reduce((sum, item) => sum + item.value, 0);
        const lastTotal = processedData.reduce(
          (sum, item) => sum + item.lastValue,
          0
        );

        setTotalSales(total);
        setLastMonthTotalSales(lastTotal);
        setChange(((total - lastTotal) / lastTotal) * 100);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StatsCard
      title="Sales (Quantity)"
      value={totalSales.toFixed(2)}
      change={Number(change.toFixed(1))}
      data={mockChartData1}
      comparisonText={`vs ${lastMonthTotalSales.toFixed(2)} last month`}
    />
  );
}
