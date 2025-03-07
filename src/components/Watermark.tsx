
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
      className="fixed bottom-4 right-4 text-primary font-bold text-xs select-none z-[9999] cursor-pointer"
      initial={{ opacity: 0.2 }}
      animate={{ 
        opacity: hovered ? 1 : 0.6,
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
      whileHover={{ 
        textShadow: "0 0 8px rgba(246, 211, 101, 0.7)",
        scale: 1.05
      }}
    >
      <span className="block text-center drop-shadow-glow animate-pulse-glow">DANIEL-SAHAR-KREMEN</span>
      
      {hovered && (
        <motion.div 
          className="absolute bottom-full right-0 mb-2 p-2 bg-background/90 border border-primary rounded text-primary whitespace-nowrap text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          Hey there! Thanks for using my app! 👋
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
          <div className="text-primary text-5xl font-bold drop-shadow-glow animate-pulse-glow">
            DANIEL SAHAR KREMEN
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Watermark;
