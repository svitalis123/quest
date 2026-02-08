"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

interface FadeInListProps {
  children: ReactNode;
  className?: string;
}

/** Wrapper that staggers its children's entrance animation. */
export function FadeInList({ children, className }: FadeInListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Wrap each list item in this for the stagger effect. */
export function FadeInItem({ children, className }: FadeInListProps) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
