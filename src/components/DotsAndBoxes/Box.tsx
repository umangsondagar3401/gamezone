import { motion } from "framer-motion";

type BoxProps = {
  row: number;
  col: number;
  owner: 1 | 2 | null;
  getPlayerColor: (player: number) => string;
  spacing: number;
};

const Box: React.FC<BoxProps> = ({
  row,
  col,
  owner,
  getPlayerColor,
  spacing,
}) => {
  if (!owner) return null;

  return (
    <motion.div
      className="absolute rounded-sm"
      style={{
        width: `${spacing}px`,
        height: `${spacing}px`,
        left: `${col * spacing + 20}px`,
        top: `${row * spacing + 20}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        backgroundColor: owner ? `${getPlayerColor(owner)}33` : "transparent",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center text-lg font-bold"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ color: getPlayerColor(owner) }}
      >
        {`P${owner}`}
      </motion.div>
    </motion.div>
  );
};

export default Box;
