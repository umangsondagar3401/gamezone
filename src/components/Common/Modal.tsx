import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface ModalProps {
  open?: boolean;
  children: ReactNode;
}

const Modal = ({ open = true, children }: ModalProps) => {
  if (!open) return null;

  const content = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
};

export default Modal;
