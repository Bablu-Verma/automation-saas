"use client";

import React from "react";
import { motion } from "framer-motion";

const LoadingSpiner = () => {
  

 
  return (
   <div className="h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-secondary border-white rounded-full"
        />
      </div>
  );
};

export default LoadingSpiner;
