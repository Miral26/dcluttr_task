"use client";
import DataTable from "../data-table";
import Image from "next/image";
import SalesMrp from "../sales-mrp";
import { ChartLine, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import SalesQuantity from "../sales-quantity";
import TopCities from "../top-cities";
import CityDataTable from "../city-data-table";


const QuickCommerce = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 2, 1),
    to: new Date(2025, 3, 30), 
  });

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setIsDatePickerOpen(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between border-b border-[#EBEBEB] px-6">
          <h1 className="font-medium py-6 text-[14px] text-[#031B15]">Quick Commerce</h1>
          {/* switch & datepicker */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-[#D9D9D9] rounded-lg px-4 py-2">
              <div className="flex items-center gap-1">
                <ChartLine size={20} />
                <div className="w-8 h-5 bg-[#027056] rounded-full relative cursor-pointer">
                  <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 right-0.5"></div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-2 border border-[#D9D9D9] rounded-lg cursor-pointer" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                <Calendar size={16} />
                <span className="text-sm text-[#031B15]">{dateRange?.from && dateRange?.to ? `${format(dateRange.from, "MMM dd, yyy")} - ${format(dateRange.to, "MMM dd, yyy")}` : "Select date range"}</span>
                <ChevronDown size={16} />
              </div>

              {isDatePickerOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg z-50 border border-[#EBEBEB]">
                  <DayPicker
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                    className="p-3"
                    styles={{
                      caption: { color: "#031B15" },
                      day: { color: "#031B15" },
                      head_cell: { color: "#666" },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b w-fit border-[#031B151A]">
          <div className="flex gap-4 p-1 border-[0.5px] border-[#031b1510] border-opacity-10 rounded-xl">
            <button className="px-4 py-2 bg-[#DFEAE8] text-[#027056] rounded-lg text-sm flex items-center gap-2 cursor-pointer">
              <Image src="/blinkit.png" alt="Blinkit" width={16} height={16} />
              Blinkit
            </button>
            <button disabled className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 opacity-40 cursor-not-allowed">
              <Image src="/zepto.png" alt="Zepto" width={16} height={16} />
              Zepto
            </button>
            <button disabled className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 opacity-40 cursor-not-allowed">
              <Image src="/instamart.png" alt="Instamart" width={16} height={16} />
              Instamart
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SalesMrp />
          <SalesQuantity />
          <TopCities />
        </div>

        <DataTable />
        <CityDataTable />
      </div>
    </>
  );
};
export default QuickCommerce;
