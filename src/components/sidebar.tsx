"use client";
import { ChevronDown, ChevronsLeft, ChevronsRight, HelpCircle, HomeIcon, Images, LayoutDashboard, Plus, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BrandDropdown } from "./BrandDropdown";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedMenuIndex, setExpandedMenuIndex] = useState<number | null>(null);

  const menuItems = [
    {
      icon: <HomeIcon size={20} className="text-[#7E8986]" />,
      label: "Overview",
      href: "/",
    },
    {
      icon: <LayoutDashboard size={20} className="text-[#7E8986]" />,
      label: "Channels",
      href: "/channels",
      subItems: [
        { label: "Meta Ads", href: "/channels/meta-ads" },
        { label: "Google Ads", href: "/channels/google-ads" },
        {
          label: "Quick Commerce",
          href: "/channels/quick-commerce",
          isActive: true,
        },
      ],
    },
    {
      icon: <Images size={20} className="text-[#7E8986]" />,
      label: "Creatives",
      href: "/creatives",
    },
  ];

  const bottomMenuItems = [
    {
      icon: <HelpCircle size={20} className="text-[#7E8986]" />,
      label: "Help",
      href: "/help",
    },
    {
      icon: <Settings size={20} className="text-[#7E8986]" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="flex">
      <div className={`w-[51px] h-screen bg-white flex flex-col relative transition-all duration-300`}>

        {/* Toggle Button */}
        {!isExpanded && (
          <span onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer z-10 absolute top-7 -right-4 flex items-center justify-center hover:bg-gray-50">
            <ChevronsRight size={16} color="#027056" />
          </span>
        )}

        {/* Header */}
        <div className="flex flex-col py-4 items-center gap-3 justify-center">
          <div className="w-10 h-10 overflow-hidden flex-shrink-0 border rounded-lg border-gray-200 flex items-center justify-center text-white text-xs">
            <Image src="/per.png" alt="logo" width={40} height={40} />
          </div>

          <div className="w-10 h-10 flex-shrink-0 overflow-hidden border rounded-lg border-gray-200 flex items-center justify-center text-white text-xs">
            <Image src="/mama.png" alt="logo" width={40} height={40} />
          </div>

          <div className="w-10 h-10 overflow-hidden flex-shrink-0 border rounded-lg border-gray-200 flex items-center justify-center text-white text-xs">
            <Image src="/boat.png" alt="logo" width={40} height={40} />
          </div>

          <div className="w-10 h-10 border flex-shrink-0 rounded-lg border-gray-200 flex items-center justify-center text-white text-xs">
            <Plus size={16} className="text-[#027056]" />
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="mt-auto p-3">
          <div className="flex flex-col items-center gap-3 justify-center">
            <div className="w-8 h-8  rounded-lg flex items-center justify-center text-white text-xs">
              <Users size={16} className="text-gray-700" />
            </div>

            <div className="w-8 h-8 bg-[#9106FF] rounded-full flex items-center justify-center text-white text-xs">SS</div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className={`flex h-screen w-[237px] bg-white border-r border-gray-200 flex-col relative transition-all duration-300`}>
          <div className="flex items-center">
            <BrandDropdown initials="SS" brandName="Test_brand" />

            {/* Toggle Button */}
            {isExpanded && (
              <span onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer absolute right-3 flex items-center justify-center hover:bg-gray-50">
                <ChevronsLeft size={16} color="#027056" />
              </span>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-3 bg-[#F8F8F8]">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={item.label}>
                  {!item.subItems ? (
                    <Link href={item.href} className={`flex items-center gap-3 px-3 py-2 text-[#031B15] rounded-lg hover:bg-gray-100 ${item.subItems ? "mb-1" : ""}`}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2 text-[#031B15] rounded-lg hover:bg-gray-100">
                      {item.icon}
                      <span>{item.label}</span>
                      <ChevronDown
                        size={16}
                        className="ml-auto"
                        onClick={() => {
                          if (index === expandedMenuIndex) {
                            setExpandedMenuIndex(null);
                          } else {
                            setExpandedMenuIndex(index);
                          }
                        }}
                      />
                    </div>
                  )}
                  {item.subItems && expandedMenuIndex === index && (
                    <ul className="ml-9 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link href={subItem.href} className={`block py-2 rounded-[10px] text-sm ${subItem.isActive ? "text-[#027056] bg-[#DFEAE8] -ml-6 pl-6 pr-4" : "text-[#031B15CC] hover:text-gray-800"}`}>
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Menu */}
          <div className="mt-auto p-3 bg-[#F8F8F8]">
            <ul className="space-y-1">
              {bottomMenuItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
