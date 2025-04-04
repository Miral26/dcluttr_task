import { useEffect, useState } from "react";
import CityDistributionChart from "./city-distribution-chart";
import axios from "axios";

interface CityData {
  name: string;
  value: string;
  percentage: string;
  change: number;
  color: string;
}

interface ApiResponseItem {
  "blinkit_insights_city.name": string;
  "blinkit_insights_city.sales_mrp_sum": string;
}


const COLORS = ["#6C4FED", "#EA6153", "#F7C245", "#D9D9D9"];

export default function TopCities() {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [total, setTotal] = useState<string>("0");
  const [totalChange, setTotalChange] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://amaranth-muskox.aws-us-east-1.cubecloudapp.dev/dev-mode/feat/frontend-hiring-task/cubejs-api/v1/load",
          {
            query: [
              {
                measures: ["blinkit_insights_city.sales_mrp_sum"],
                dimensions: ["blinkit_insights_city.name"],
                timeDimensions: [
                  {
                    dimension: "blinkit_insights_city.created_at",
                    dateRange: "last month",
                    granularity: "day",
                  },
                ],
                order: {
                  "blinkit_insights_city.sales_mrp_sum": "desc",
                },
                limit: 4,
              },
              {
                measures: ["blinkit_insights_city.sales_mrp_sum"],
                dimensions: ["blinkit_insights_city.name"],
                timeDimensions: [
                  {
                    dimension: "blinkit_insights_city.created_at",
                    dateRange:
                      "2025-02-01T00:00:00.000, 2025-02-28T23:59:59.999",
                    granularity: "day",
                  },
                ],
                order: {
                  "blinkit_insights_city.sales_mrp_sum": "desc",
                },
                limit: 4,
              },
            ],
            queryType: "multi",
          }
        );
        console.log("response1", response?.data?.results);
        const thisMonthData = response?.data?.results?.[0]?.data;
        const lastMonthData = response?.data?.results?.[1]?.data;
        console.log("thisMonthData", thisMonthData);
        console.log("lastMonthData", lastMonthData);

        // Calculate total sales for this month
        const totalSales = thisMonthData.reduce(
          (sum: number, item: ApiResponseItem) =>
            sum + Number(item["blinkit_insights_city.sales_mrp_sum"]),
          0
        );

        // Calculate total sales for last month
        const lastMonthTotalSales = lastMonthData.reduce(
          (sum: number, item: ApiResponseItem) =>
            sum + Number(item["blinkit_insights_city.sales_mrp_sum"]),
          0
        );

        // Calculate percentage change
        const change =
          ((totalSales - lastMonthTotalSales) / lastMonthTotalSales) * 100;

        // Format the data for the chart
        const formattedData = thisMonthData.map(
          (item: ApiResponseItem, index: number) => {
            const sales = Number(item["blinkit_insights_city.sales_mrp_sum"]);
            const percentage = ((sales / totalSales) * 100).toFixed(1);

            // Find corresponding last month data for this city
            const lastMonthItem = lastMonthData.find(
              (lastItem: ApiResponseItem) =>
                lastItem["blinkit_insights_city.name"] ===
                item["blinkit_insights_city.name"]
            );

            const lastMonthSales = lastMonthItem
              ? Number(lastMonthItem["blinkit_insights_city.sales_mrp_sum"])
              : 0;
            const cityChange =
              ((sales - lastMonthSales) / lastMonthSales) * 100;

            return {
              name: item["blinkit_insights_city.name"],
              value: (sales / 100000).toFixed(1) + "L", // Convert to lakhs
              percentage: percentage + "%",
              change: parseFloat(cityChange.toFixed(1)),
              color: COLORS[index % COLORS.length],
            };
          }
        );

        setTotal((totalSales / 100000).toFixed(1) + "L");
        setTotalChange(parseFloat(change.toFixed(1)));
        setCityData(formattedData);
        console.log(formattedData);
        console.log(totalSales, lastMonthTotalSales);
        console.log(change);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <CityDistributionChart
      total={total}
      totalChange={totalChange}
      cities={cityData}
    />
  );
}
