
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Watermark = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <motion.div
      className="fixed bottom-2 right-2 z-50 opacity-80 hover:opacity-100 transition-opacity duration-300"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
    >
      <motion.div
        className="flex items-center justify-center bg-primary/70 text-primary-foreground px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-primary/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isClicked ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className="flex items-center text-sm font-medium">
          👋 Hey there! Thanks for using my app
        </span>
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 right-0 text-center font-bold text-lg text-primary/90 uppercase"
        initial={{ opacity: 0, y: -10 }}
        animate={isHovered ? { opacity: 1, y: -25 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ textShadow: '0 0 5px rgba(0,0,0,0.5)' }}
      >
        DANIEL SAHAR-KREMEN
      </motion.div>
    </motion.div>
  );
};

export default Watermark;
