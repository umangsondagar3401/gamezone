import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4 md:p-8 bg-gray-50 min-h-screen">
      <main className="max-w-[1440px] w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
