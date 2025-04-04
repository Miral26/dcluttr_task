"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface TableData {
  id: string;
  name: string;
  sales: string;
  percentage: string;
  change: number;
  isExpanded?: boolean;
  [key: string]: string | number | boolean | TableData[] | undefined;
}

interface ApiResponseItem {
  "blinkit_insights_city.name": string;
  "blinkit_insights_city.sales_mrp_sum": string;
}

type TableValue = string | number;

interface Column {
  key: keyof TableData;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (value: TableValue) => ReactNode;
  group: string;
}

const columns: Column[] = [
  {
    key: "name",
    label: "City Name",
    sortable: true,
    className: "text-left min-w-[200px]",
    group: "main",
  },
  {
    key: "sales",
    label: "Sales",
    sortable: true,
    className: "text-center",
    render: (value) => <span className="font-medium">{value}</span>,
    group: "sales",
  },
  {
    key: "percentage",
    label: "Percentage",
    className: "text-center",
    group: "sales",
    sortable: true,
  },
  {
    key: "change",
    label: "Change",
    sortable: true,
    className: "text-center",
    render: (value) => (
      <span className={Number(value) >= 0 ? "text-green-600" : "text-red-600"}>
        {Number(value) >= 0 ? "+" : ""}{Number(value).toFixed(1)}%
      </span>
    ),
    group: "sales",
  },
];

const CustomCheckbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <div
    className={cn(
      "w-4 h-4 border rounded transition-colors cursor-pointer",
      checked
        ? "bg-[#00875A] border-[#00875A]"
        : "border-gray-300 hover:border-[#00875A]"
    )}
    onClick={onChange}
  >
    {checked && <Check size={14} className="text-white" />}
  </div>
);

export default function CityDataTable() {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableData;
    direction: "asc" | "desc";
  } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
                limit: 100,
              },{
                measures: ["blinkit_insights_city.sales_mrp_sum"],
                dimensions: ["blinkit_insights_city.name"],
                timeDimensions: [
                  {
                    dimension: "blinkit_insights_city.created_at",
                    dateRange: "2025-02-01T00:00:00.000, 2025-02-28T23:59:59.999",
                    granularity: "day",
                  },
                ],
                order: {
                  "blinkit_insights_city.sales_mrp_sum": "desc",
                },
                limit: 100,
              },
            ],
            queryType: "multi",
          }
        );

        const thisMonthData = response.data.results[0].data;
        const lastMonthData = response.data.results[1].data;

        // Calculate total sales for this month
        const totalSales = thisMonthData.reduce(
          (sum: number, item: ApiResponseItem) =>
            sum + Number(item["blinkit_insights_city.sales_mrp_sum"]),
          0
        );

        // Format the data for the table
        const formattedData = thisMonthData.map((item: ApiResponseItem, index: number) => {
          const sales = Number(item["blinkit_insights_city.sales_mrp_sum"]);
          const percentage = ((sales / totalSales) * 100).toFixed(1);
          
          // Find corresponding last month data for this city
          const lastMonthItem = lastMonthData.find(
            (lastItem: ApiResponseItem) =>
              lastItem["blinkit_insights_city.name"] === item["blinkit_insights_city.name"]
          );
          
          const lastMonthSales = lastMonthItem 
            ? Number(lastMonthItem["blinkit_insights_city.sales_mrp_sum"]) 
            : 0;
          const change = ((sales - lastMonthSales) / lastMonthSales) * 100;

          return {
            id: index.toString(),
            name: item["blinkit_insights_city.name"],
            sales: `₹${(sales / 100000).toFixed(1)}L`,
            percentage: `${percentage}%`,
            change: parseFloat(change.toFixed(1)),
          };
        });

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching city data:", error);
        setError("Failed to fetch city data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key: keyof TableData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (typeof aValue === "undefined" || typeof bValue === "undefined")
        return 0;
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const renderCellContent = (row: TableData, column: Column): ReactNode => {
    const value = row[column.key];

    if (column.key === "name") {
      return (
        <div className="flex items-center gap-2">
          <CustomCheckbox
            checked={expandedRows.has(row.id)}
            onChange={() => toggleRowExpansion(row.id)}
          />
          {String(value)}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return null;
    }

    if (
      column.render &&
      (typeof value === "string" || typeof value === "number")
    ) {
      return column.render(value);
    }

    if (value !== undefined) {
      return String(value);
    }

    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB]">
        <div>
          <h2 className="text-[#031B15] font-medium">City level data</h2>
          <p className="text-sm text-[#7D7D7E]">Analytics for all cities</p>
        </div>
        <button className="px-4 py-2 bg-[#00875A] text-white rounded-lg text-sm flex items-center gap-2">
          Filters(1)
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="bg-white rounded-lg border border-[#EBEBEB]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EBEBEB] bg-white">
                <th
                  className="p-4 text-left text-sm font-medium text-[#515153] min-w-[200px]"
                  rowSpan={2}
                >
                  <div className="flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.6667 2H1.33333C0.596954 2 0 2.59695 0 3.33333V12.6667C0 13.403 0.596954 14 1.33333 14H14.6667C15.403 14 16 13.403 16 12.6667V3.33333C16 2.59695 15.403 2 14.6667 2ZM1.33333 12.6667V3.33333H14.6667L14.6683 12.6667H1.33333Z"
                        fill="#515153"
                      />
                      <path
                        d="M3.33203 5.33334H12.6654V6.66668H3.33203V5.33334ZM3.33203 8.00001H9.33203V9.33334H3.33203V8.00001Z"
                        fill="#515153"
                      />
                    </svg>
                    City Name
                  </div>
                </th>
                <th
                  colSpan={3}
                  className="p-4 text-center text-sm font-medium text-[#515153] border-l border-[#EBEBEB]"
                >
                  Sales Metrics
                </th>
              </tr>
              <tr className="border-b border-[#EBEBEB]">
                {columns
                  .filter((col) => col.group !== "main")
                  .map((column) => (
                    <th
                      key={column.key}
                      className={`p-4 text-sm font-medium text-[#515153] ${
                        column.className
                      }`}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          column.className?.includes("text-center")
                            ? "justify-center"
                            : "justify-start"
                        )}
                      >
                        {column.label}
                        {column.sortable && (
                          <button
                            onClick={() => handleSort(column.key)}
                            className="hover:bg-gray-200 p-1 rounded"
                          >
                            <div className="flex flex-col">
                              {sortConfig?.key === column.key &&
                              sortConfig?.direction === "asc" ? (
                                <ChevronUp
                                  size={12}
                                  className={cn(
                                    "text-gray-400",
                                    sortConfig?.key === column.key &&
                                      sortConfig.direction === "asc" &&
                                      "text-[#00875A]"
                                  )}
                                />
                              ) : (
                                <ChevronDown
                                  size={12}
                                  className={cn(
                                    "text-gray-400 -mt-1",
                                    sortConfig?.key === column.key &&
                                      sortConfig.direction === "desc" &&
                                      "text-[#00875A]"
                                  )}
                                />
                              )}
                            </div>
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    className={cn(
                      "border-b border-[#EBEBEB] hover:bg-[#F9FAFB] transition-colors",
                      expandedRows.has(row.id) && "bg-[#F9FAFB]"
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${row.id}-${column.key}`}
                        className={`p-4 text-sm ${column.className}`}
                      >
                        {renderCellContent(row, column)}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EBEBEB]">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
              {data.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "px-3 py-1 rounded border",
                  currentPage === 1
                    ? "border-gray-200 text-gray-400"
                    : "border-[#00875A] text-[#00875A] hover:bg-[#00875A] hover:text-white"
                )}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={cn(
                  "px-3 py-1 rounded border",
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400"
                    : "border-[#00875A] text-[#00875A] hover:bg-[#00875A] hover:text-white"
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 