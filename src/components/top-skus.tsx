import { useEffect, useState } from "react";
import axios from "axios";

interface SkuData {
  id: string;
  name: string;
  sales_mrp_sum: number;
  qty_sold: number;
  drr_7: number;
  drr_14: number;
  drr_30: number;
  sales_mrp_max: number;
  month_to_date_sales: number;
  be_inv_qty: number;
  fe_inv_qty: number;
  inv_qty: number;
  days_of_inventory_14: number;
  days_of_inventory_max: number;
  on_shelf_availability: number | null;
  rank_avg: number | null;
  selling_price_avg: number | null;
  discount_avg: number | null;
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

export default function TopSkus() {
  const [skuData, setSkuData] = useState<SkuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                limit: 4
              }
            ],
            queryType: "multi"
          }
        );

        const rawData = response.data.results[0].data;
        const formattedData = rawData.map((item: ApiResponseItem) => ({
          id: item["blinkit_insights_sku.id"],
          name: item["blinkit_insights_sku.name"],
          sales_mrp_sum: Number(item["blinkit_insights_sku.sales_mrp_sum"]),
          qty_sold: Number(item["blinkit_insights_sku.qty_sold"]),
          drr_7: Number(item["blinkit_insights_sku.drr_7"]),
          drr_14: Number(item["blinkit_insights_sku.drr_14"]),
          drr_30: Number(item["blinkit_insights_sku.drr_30"]),
          sales_mrp_max: Number(item["blinkit_insights_sku.sales_mrp_max"]),
          month_to_date_sales: Number(item["blinkit_insights_sku.month_to_date_sales"]),
          be_inv_qty: Number(item["blinkit_insights_sku.be_inv_qty"]),
          fe_inv_qty: Number(item["blinkit_insights_sku.fe_inv_qty"]),
          inv_qty: Number(item["blinkit_insights_sku.inv_qty"]),
          days_of_inventory_14: Number(item["blinkit_insights_sku.days_of_inventory_14"]),
          days_of_inventory_max: Number(item["blinkit_insights_sku.days_of_inventory_max"]),
          on_shelf_availability: item["blinkit_scraping_stream.on_shelf_availability"] 
            ? Number(item["blinkit_scraping_stream.on_shelf_availability"]) 
            : null,
          rank_avg: item["blinkit_scraping_stream.rank_avg"] 
            ? Number(item["blinkit_scraping_stream.rank_avg"]) 
            : null,
          selling_price_avg: item["blinkit_scraping_stream.selling_price_avg"] 
            ? Number(item["blinkit_scraping_stream.selling_price_avg"]) 
            : null,
          discount_avg: item["blinkit_scraping_stream.discount_avg"] 
            ? Number(item["blinkit_scraping_stream.discount_avg"]) 
            : null,
        }));

        setSkuData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching SKU data:", error);
        setError("Failed to fetch SKU data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top SKUs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skuData.map((sku) => (
          <div key={sku.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">{sku.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sales (MRP):</span>
                <span>₹{sku.sales_mrp_sum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity Sold:</span>
                <span>{sku.qty_sold}</span>
              </div>
              <div className="flex justify-between">
                <span>DRR (7 days):</span>
                <span>{sku.drr_7.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>MTD Sales:</span>
                <span>₹{sku.month_to_date_sales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Inventory:</span>
                <span>{sku.inv_qty}</span>
              </div>
              {sku.on_shelf_availability !== null && (
                <div className="flex justify-between">
                  <span>OSA:</span>
                  <span>{sku.on_shelf_availability.toFixed(2)}%</span>
                </div>
              )}
              {sku.rank_avg !== null && (
                <div className="flex justify-between">
                  <span>Avg. Rank:</span>
                  <span>{sku.rank_avg.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 