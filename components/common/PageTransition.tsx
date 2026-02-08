"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

interface PageTransitionProps extends HTMLMotionProps<"div"> {
  className?: string;
}

export function PageTransition({ className, children, ...props }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
