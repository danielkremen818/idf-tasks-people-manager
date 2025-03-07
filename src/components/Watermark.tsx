
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Watermark = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <motion.div
      className="fixed bottom-1 right-1 z-50 opacity-20 hover:opacity-60 transition-opacity duration-300"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 0.2 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
      style={{ transform: 'scale(0.7)' }}
    >
      <motion.div
        className="flex items-center justify-center bg-primary/40 text-primary-foreground px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm border border-primary/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isClicked ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="flex items-center text-xs font-medium">
          <span className="opacity-70 text-[0.6rem]">DSK</span>
        </span>
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 right-0 text-center font-bold text-[0.6rem] text-primary/50 uppercase"
        initial={{ opacity: 0, y: -5 }}
        animate={isHovered ? { opacity: 1, y: -10 } : { opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        style={{ textShadow: '0 0 5px rgba(0,0,0,0.5)' }}
      >
        DANIEL SAHAR-KREMEN
      </motion.div>
    </motion.div>
  );
};

export default Watermark;
