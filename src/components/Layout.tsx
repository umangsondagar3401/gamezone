import React from "react";
import SEO from "./SEO";
import { getPageSeo } from "../lib/seoUtils";
import { Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useLocation();
  const { title, description, keywords } = getPageSeo(location.pathname);

  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      <div className="flex items-center justify-center p-4 md:p-8 bg-gray-50 min-h-screen">
        <main className="max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
