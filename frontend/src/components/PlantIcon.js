import React from "react";
import { motion } from "framer-motion";
import farmerGroupImg from "../assets/farmer-group.png";

const PlantIcon = ({ className = "", size = 32 }) => (
  <motion.img
    src={farmerGroupImg}
    alt="Farmer Group Icon"
    width={size}
    height={size}
    className={className}
    initial={{ scale: 0.8 }}
    animate={{ scale: [0.8, 1.1, 1] }}
    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    style={{ borderRadius: "50%", border: "3px solid #22c55e", background: "#fff" }}
  />
);

export default PlantIcon; 