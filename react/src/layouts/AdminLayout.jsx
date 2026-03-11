import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#eef1f5] font-poppins dark:bg-gray-800 m-0 p-0">
      <div className="flex h-full w-full">
        <Sidebar />

        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
