// src/components/layout/AppLayout.jsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-16">
        {" "}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden pt-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div
          className={`
            fixed top-16 bottom-0 left-0 transform w-64 bg-gray-50 border-r
            transition-transform duration-300 ease-in-out z-30
            lg:static lg:translate-x-0 lg:top-auto lg:h-[calc(100vh-4rem)]
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar onItemClick={() => setSidebarOpen(false)} />
        </div>
        <button
          className="fixed bottom-4 right-4 lg:hidden p-3 bg-blue-600 text-white rounded-full shadow-lg z-20"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <main className="flex-1 p-4 sm:p-6 overflow-auto min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
