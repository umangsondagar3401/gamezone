import type { Game } from "../types/gamecard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cardVariants } from "../animation/GameCardVariants";

const GameCard = ({ game }: { game: Game }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileHover="hover"
      whileInView="show"
      viewport={{ once: false }}
      whileTap="tap"
      className="relative group h-full flex flex-col cursor-default"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${game.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}
      />
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100 group-hover:shadow-xl transition-all duration-300 hover:mt-[-4px] hover:mb-[4px]">
        <div
          className={`h-2 bg-gradient-to-r ${game.color} transition-all duration-300`}
        />
        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-4 flex-col sm:flex-row justify-center sm:justify-start">
            <img
              src={game.icon}
              alt={game.name}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {game.name}
              </h3>
              <div
                className={`h-1 w-full sm:w-8 rounded-full bg-gradient-to-r ${game.color} mb-3 group-hover:w-full transition-all duration-300`}
              ></div>
            </div>
          </div>

          <p className="text-gray-600 text-sm sm:text-base mt-3 mb-6 flex-1 text-center">
            {game.description}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate(game.link)}
              className={`w-full group/btn relative overflow-hidden px-6 py-2.5 rounded-lg bg-gradient-to-r ${game.color} text-white font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer`}
            >
              <span className="relative z-10 flex items-center justify-center">
                Play Now
                <svg
                  className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <span
                className={`absolute inset-0 bg-gradient-to-r ${game.btnColor} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`}
              ></span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
