
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Watermark: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    
    // Reset the clicked state after animation completes
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };
  
  return (
    <motion.div 
      className="fixed bottom-2 right-2 text-[8px] text-white/10 select-none z-50"
      initial={{ opacity: 0.1 }}
      animate={{ 
        opacity: hovered ? 0.8 : 0.1,
        scale: clicked ? [1, 1.5, 0.8, 1.2, 1] : 1,
        rotate: clicked ? [0, 10, -10, 5, 0] : 0,
        y: clicked ? [0, -10, 5, -5, 0] : 0
      }}
      transition={{ 
        duration: clicked ? 0.6 : 0.2,
        type: clicked ? "spring" : "tween" 
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
    >
      <span className="block text-center">By Daniel-Sahar-Kremen</span>
      
      {hovered && (
        <motion.div 
          className="absolute bottom-full right-0 mb-2 p-1 bg-black/80 rounded text-white/90 whitespace-nowrap text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          Hey there! You found me! 👋
        </motion.div>
      )}
      
      {clicked && (
        <motion.div
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 2 }}
        >
          <div className="text-primary text-4xl font-bold drop-shadow-glow animate-pulse-glow">
            Task-Force by Daniel!
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Watermark;
