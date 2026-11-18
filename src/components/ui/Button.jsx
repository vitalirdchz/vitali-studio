import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className = '',
  icon,
}) {
  const baseClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
  const classes = `${baseClass} ${className}`;

  const content = (
    <>
      {icon && <span className="inline-flex mr-2">{icon}</span>}
      {children}
    </>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      {href ? (
        <a href={href} className={classes}>
          {content}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={classes}>
          {content}
        </button>
      )}
    </motion.div>
  );
}
