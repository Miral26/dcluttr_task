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
  outOfStock: string;
  totalInventory: string;
  averageRank: number;
  estTraffic: number;
  estImpressions: number;
  isExpanded?: boolean;
  [key: string]: string | number | boolean | TableData[] | undefined;
}

interface ApiResponseItem {
  "blinkit_insights_sku.id": string;
  "blinkit_insights_sku.name": string;
  "blinkit_insights_sku.sales_mrp_sum": string;
  "blinkit_insights_sku.qty_sold": string;
  "blinkit_insights_sku.drr_7": string;
  "blinkit_insights_sku.drr_14": string;
  "blinkit_insights_sku.drr_30": string;
  "blinkit_insights_sku.sales_mrp_max": string;
  "blinkit_insights_sku.month_to_date_sales": string;
  "blinkit_insights_sku.be_inv_qty": string;
  "blinkit_insights_sku.fe_inv_qty": string;
  "blinkit_insights_sku.inv_qty": string;
  "blinkit_insights_sku.days_of_inventory_14": string;
  "blinkit_insights_sku.days_of_inventory_max": string;
  "blinkit_scraping_stream.on_shelf_availability": string | null;
  "blinkit_scraping_stream.rank_avg": string | null;
  "blinkit_scraping_stream.selling_price_avg": string | null;
  "blinkit_scraping_stream.discount_avg": string | null;
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
    label: "SKU Name",
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
    group: "availability",
  },
  {
    key: "outOfStock",
    label: "Out of Stock",
    className: "text-center",
    group: "availability",
    sortable: true,
  },
  {
    key: "totalInventory",
    label: "Total Inventory",
    sortable: true,
    className: "text-center",
    group: "availability",
  },
  {
    key: "averageRank",
    label: "Average Rank",
    sortable: true,
    className: "text-center",
    render: (value) => Number(value).toFixed(1),
    group: "visibility",
  },
  {
    key: "estTraffic",
    label: "Est. Traffic",
    sortable: true,
    className: "text-center",
    render: (value) => Number(value).toLocaleString(),
    group: "visibility",
  },
  {
    key: "estImpressions",
    label: "Est. Impressions",
    sortable: true,
    className: "text-center",
    render: (value) => Number(value).toLocaleString(),
    group: "visibility",
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

export default function DataTable() {
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
                measures: [
                  "blinkit_insights_sku.sales_mrp_sum",
                  "blinkit_insights_sku.qty_sold",
                  "blinkit_insights_sku.drr_7",
                  "blinkit_insights_sku.drr_14",
                  "blinkit_insights_sku.drr_30",
                  "blinkit_insights_sku.sales_mrp_max",
                  "blinkit_insights_sku.month_to_date_sales",
                  "blinkit_insights_sku.be_inv_qty",
                  "blinkit_insights_sku.fe_inv_qty",
                  "blinkit_insights_sku.inv_qty",
                  "blinkit_insights_sku.days_of_inventory_14",
                  "blinkit_insights_sku.days_of_inventory_max",
                  "blinkit_scraping_stream.on_shelf_availability",
                  "blinkit_scraping_stream.rank_avg",
                  "blinkit_scraping_stream.selling_price_avg",
                  "blinkit_scraping_stream.discount_avg"
                ],
                dimensions: [
                  "blinkit_insights_sku.id",
                  "blinkit_insights_sku.name"
                ],
                timeDimensions: [
                  {
                    dimension: "blinkit_insights_sku.created_at",
                    dateRange: "Last month",
                    granularity: "day"
                  }
                ],
                limit: 100
              }
            ],
            queryType: "multi"
          }
        );

        const rawData = response.data.results[0].data;
        const formattedData = rawData.map((item: ApiResponseItem) => ({
          id: item["blinkit_insights_sku.id"],
          name: item["blinkit_insights_sku.name"],
          sales: `₹${Number(item["blinkit_insights_sku.sales_mrp_sum"]).toLocaleString()}`,
          outOfStock: item["blinkit_scraping_stream.on_shelf_availability"] 
            ? `${(100 - Number(item["blinkit_scraping_stream.on_shelf_availability"])).toFixed(2)}%`
            : "N/A",
          totalInventory: item["blinkit_insights_sku.inv_qty"],
          averageRank: item["blinkit_scraping_stream.rank_avg"] 
            ? Number(item["blinkit_scraping_stream.rank_avg"])
            : 0,
          estTraffic: Number(item["blinkit_insights_sku.qty_sold"]),
          estImpressions: Number(item["blinkit_insights_sku.month_to_date_sales"]),
        }));

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching SKU data:", error);
        setError("Failed to fetch SKU data");
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
          <h2 className="text-[#031B15] font-medium">SKU level data</h2>
          <p className="text-sm text-[#7D7D7E]">Analytics for all your SKUs</p>
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
                    SKU Name
                  </div>
                </th>
                <th
                  colSpan={3}
                  className="p-4 text-center text-sm font-medium text-[#515153] border-l border-[#EBEBEB]"
                >
                  Availability
                </th>
                <th
                  colSpan={4}
                  className="p-4 text-center text-sm font-medium text-[#515153] border-l border-[#EBEBEB]"
                >
                  Visibility
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
                      } ${
                        column.group === "visibility"
                          ? "border-l border-[#EBEBEB] first:border-l-0"
                          : ""
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
