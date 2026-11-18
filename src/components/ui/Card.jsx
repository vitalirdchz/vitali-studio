import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true }) {
  const cardContent = (
    <div className={`card ${className}`}>
      {children}
    </div>
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
