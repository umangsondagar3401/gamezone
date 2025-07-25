import React from "react";
import { games } from "../lib/utils";
import GameCard from "../components/GameCard";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { fade } from "../animation/CommonVariants";

const Dashboard = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const navigate = useNavigate();

  return (
    <div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-16"
      >
        <div
          className="flex flex-col items-center justify-center gap-2 w-max mb-4 mx-auto group"
          onClick={() => navigate("/")}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer">
            Game Zone
          </h1>
          <div
            className={`h-1 w-36 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300`}
          />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enjoy a handpicked selection of fun and engaging games. Simple,
          entertaining, and ready to play!
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-start gap-8"
        variants={fade}
        initial="hidden"
        animate="show"
      >
        {games.map((game) => (
          <div
            key={game.id}
            className="w-full sm:max-w-[calc(50%-1rem)] lg:max-w-[calc(33.333%-1.5rem)]"
          >
            <GameCard game={game} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
