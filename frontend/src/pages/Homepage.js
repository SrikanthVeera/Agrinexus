// src/pages/HomePage.js
import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Box, Button, Container, Typography, Grid, Card, CardContent, CardActions } from "@mui/material";
import { Agriculture, ShoppingCart, LocalShipping, ShowChart, Support, AdminPanelSettings } from "@mui/icons-material";
import { Leaf, DollarSign, Truck, Users, ShieldCheck, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Drawer from '@mui/material/Drawer';
import FarmerGroup from "../components/FarmerGroup";
import PlantIcon from "../components/PlantIcon";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [specialOpen, setSpecialOpen] = useState(false);

  const features = [
    {
      title: t("For Buyers"),
      description: t("Access fresh produce directly from farmers at competitive prices."),
      icon: <ShoppingCart sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />,
      action: "/register?role=buyer",
      buttonText: t("Join as Buyer"),
    },
    {
      title: t("For Farmers"),
      description: t("List your agricultural produce and connect with buyers directly."),
      icon: <Agriculture sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />,
      action: "/register?role=seller",
      buttonText: t("Join as Seller"),
    },
    {
      title: t("Delivery Partner"),
      description: t("Easy and efficient transport booking for your agricultural produce."),
      icon: <LocalShipping sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />,
      action: "/Delivery-Patner",
      buttonText: t("Book Transport"),
    },
    {
      title: t("Market Prices"),
      description: t("Stay updated with real-time market prices for better decisions."),
      icon: <ShowChart sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />,
      action: "/market-price",
      buttonText: t("View Prices"),
    },
    {
      title: t("24/7 Support"),
      description: t("Get instant help from our AI-powered chatbot assistant."),
      icon: <Support sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />,
      action: "/support",
      buttonText: t("Get Help"),
    },
    {
      title: t("Admin Dashboard"),
      description: t("Comprehensive platform management and analytics."),
      icon: <AdminPanelSettings sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />,
      action: "/admin/login",
      buttonText: t("Admin Access"),
    },
  ];

  const whyChooseFeatures = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: t("Fresh Produce"),
      description: t("Direct from farms ensuring quality and freshness"),
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: t("Fair Pricing"),
      description: t("Transparent pricing model benefiting both farmers and consumers"),
    },
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: t("Reliable Delivery"),
      description: t("Efficient logistics network for timely deliveries"),
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: t("Connect Directly"),
      description: t("Direct connection between farmers and buyers"),
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
      title: t("Quality Assurance"),
      description: t("Strict quality checks for all products"),
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: t("Real-time Tracking"),
      description: t("Monitor your orders from farm to doorstep"),
    },
  ];

  const roleButtons = [
    {
      label: t('Seller'),
      icon: <Agriculture sx={{ mr: 1 }} />,
      color: '#1976d2',
      hover: '#1565c0',
      path: '/login',
    },
    {
      label: t('Buyer'),
      icon: <ShoppingCart sx={{ mr: 1 }} />,
      color: '#388e3c',
      hover: '#2e7d32',
      path: '/login',
    },
        {
      label: t('Delivery Partner'),
      icon: <LocalShipping sx={{ mr: 1 }} />,
      color: '#fb8c00',
      hover: '#ef6c00',
      path: '/login',
    },
    {
      label: t('Entrepreneur'),
      icon: <LocalShipping sx={{ mr: 1 }} />,
      color: '#e53935',
      hover: '#b71c1c',
      path: '/login',
    },
    {
      label: t('Admin'),
      icon: <AdminPanelSettings sx={{ mr: 1 }} />,
      color: '#9c27b0',
      hover: '#7b1fa2',
      path: '/admin/login',
    },
  ];

  // Feature navigation handlers
  const handleFeatureClick = (path) => {
    setSpecialOpen(false);
    setTimeout(() => navigate(path), 300); // Wait for drawer to close
  };

  // Shared button style for special features
  const specialBtnStyle = {
    background: 'linear-gradient(90deg, #e0ffe9 0%, #f9fbe7 100%)',
    color: '#1976d2',
    fontWeight: 700,
    fontSize: 18,
    border: 'none',
    borderRadius: 16,
    boxShadow: '2px 4px 16px 0 rgba(25,118,210,0.10)',
    padding: '18px 28px 18px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    width: '100%',
    marginBottom: 18,
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'left',
    outline: 'none',
    animation: 'slideInLeft 0.7s cubic-bezier(.4,2,.6,1)',
  };

  // Floating forum button style
  const forumBtnStyle = {
    ...specialBtnStyle,
    position: 'fixed',
    top: '40%',
    left: 0,
    zIndex: 1200,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderRadius: '0 20px 20px 0',
    marginBottom: 0,
    width: 'auto',
    maxWidth: 320,
    minWidth: 220,
    padding: '16px 28px 16px 16px',
    boxShadow: '0 4px 16px 0 rgba(25,118,210,0.13)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.18s, box-shadow 0.18s',
  };

  // Add keyframes for slideInLeft animation
  const styleSheet = document.styleSheets[0];
  if (styleSheet && !Array.from(styleSheet.cssRules).find(r => r.name === 'slideInLeft')) {
    styleSheet.insertRule(`@keyframes slideInLeft { from { transform: translateX(-120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`, styleSheet.cssRules.length);
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-green-50 via-green-100 to-blue-50">
      {/* Green Menu Bar */}
      <Box sx={{ width: '100%', bgcolor: '#166534', py: 0.5, px: 0, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        {/* FARMER GROUP Button (left) */}
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
            color: '#222',
            borderRadius: 3,
            boxShadow: 4,
            px: 2,
            py: 1.2,
            minWidth: 0,
            width: 56,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => navigate('/farmer-group')}
        >
          <PlantIcon size={32} />
        </Button>
        {/* Centered Nav Links */}
        <Box sx={{ display: 'flex', gap: 3, flex: 1, justifyContent: 'center' }}>
          <Button component={RouterLink} to="/" sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: 15, minWidth: 0, px: 2 }}>
            {t('Home')}
          </Button>
          <Button component={RouterLink} to="/about" sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: 15, minWidth: 0, px: 2 }}>
            {t('About')}
          </Button>
          <Button component={RouterLink} to="/customer-details" sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: 15, minWidth: 0, px: 2 }}>
            {t('Customer')}
          </Button>
          <Button component={RouterLink} to="farmer-details" sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: 15, minWidth: 0, px: 2 }}>
            {t('Farmer')}
          </Button>
          <Button component={RouterLink} to="/service" sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: 15, minWidth: 0, px: 2 }}>
            {t('Services')}
          </Button>
        </Box>
      </Box>

      {/* Hero Section with animated gradient */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-green-200 via-blue-100 to-white"
        style={{ minHeight: '60vh', position: 'relative' }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 mb-4 drop-shadow-lg text-center animate-pulse">
          {t('Welcome to AgroTech Nexus')}
        </h1>
        {user && (
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-2 animate-fade-in text-center">
            {t('Welcome')}, {user.name}!
          </h2>
        )}
        <p className="text-lg md:text-2xl text-gray-700 mb-8 text-center max-w-2xl animate-fade-in">
          {t('Connecting Farmers and Buyers in the Digital Age')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
          {roleButtons.map((btn, idx) => (
            <motion.button
              key={btn.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (btn.label === t('Buyer')) {
                  if (user && (user.role === 'Buyer' || user.role === 'buyer')) {
                    navigate('/buyer/dashboard');
                  } else {
                    navigate('/login');
                  }
                } else if (btn.label === t('Seller')) {
                  if (user && (user.role === 'Seller' || user.role === 'seller')) {
                    navigate('/farmer/dashboard');
                  } else {
                    navigate('/login');
                  }
                } else if (btn.label === t('Entrepreneur')) {
                  if (user && (user.role === 'Entrepreneur' || user.role === 'entrepreneur')) {
                    navigate('/entrepreneur-details');
                  } else {
                    navigate('/login');
                  }
                } else if (btn.label === t('Delivery Partner')) {
                  if (user && (user.role === 'DeliveryPartner' || user.role === 'deliverypartner')) {
                    navigate('/delivery-partner');
                  } else {
                    navigate('/login');
                  }
                } else {
                  navigate(btn.path);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200"
              style={{ background: btn.color, fontSize: '1.1rem', minWidth: 180 }}
            >
              {btn.icon}
              {btn.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="w-full h-2 bg-gradient-to-r from-green-400 via-blue-300 to-green-200 my-8 rounded-full shadow-md animate-pulse" />

      {/* Features Section with animation */}
      <Container maxWidth="lg" sx={{ mb: 10, mt: 6 }}>
        <Grid container spacing={5} justifyContent="center" alignItems="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: 260,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    boxShadow: 3,
                    transition: "transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)",
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: 8,
                      background: "linear-gradient(90deg, #e0ffe9 0%, #f9fbe7 100%)",
                    },
                    background: "rgba(255,255,255,0.98)",
                    p: 2,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={700} align="center" sx={{ mb: 1, color: '#222' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
                    {feature.description}
                  </Typography>
                  <CardActions sx={{ justifyContent: "center", mt: "auto" }}>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-2 rounded-lg border-2 border-green-400 text-green-700 font-bold bg-white hover:bg-green-50 transition-all duration-200 shadow"
                      onClick={() => navigate(feature.action)}
                    >
                      {feature.buttonText}
                    </motion.button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us Section with animation */}
      <Box sx={{ background: 'linear-gradient(to bottom, #e8f5e9 0%, #fff 100%)', py: 8, px: { xs: 2, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} align="center" color="green" mb={2} className="animate-fade-in">
            {t('Why Choose AgriConnect')}
          </Typography>
          <Typography align="center" color="textSecondary" mb={6} className="animate-fade-in">
            {t("We're revolutionizing agricultural supply chains with technology and fair trade practices")}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {whyChooseFeatures.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 180 }}>
                    <Box mb={2}>{item.icon}</Box>
                    <Typography variant="h6" fontWeight={700} align="center" color="green" mb={1}>
                      {item.title}
                    </Typography>
                    <Typography align="center" color="textSecondary" fontSize={15}>
                      {item.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
}

export default HomePage;
