import React from "react";
import SEO from "./SEO";
import { motion } from "framer-motion";
import { getPageSeo } from "../lib/seoUtils";
import { HiMiniArrowLeft } from "react-icons/hi2";
import { fadeInDown } from "../animation/CommonVariants";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, description, keywords } = getPageSeo(location.pathname);

  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      <div className="flex flex-col gap-4 items-center justify-between p-4 md:p-8 bg-gray-50 min-h-screen">
        {location.pathname !== "/" && (
          <motion.button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer ml-3 mr-auto"
            onClick={() => navigate("/")}
            initial="hidden"
            animate="show"
            variants={fadeInDown}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiMiniArrowLeft /> Back to home
          </motion.button>
        )}
        <main className="flex items-center justify-center flex-1 max-w-[1440px] w-full mx-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
