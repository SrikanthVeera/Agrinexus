import React, { useState, useEffect, useCallback } from "react";
import { MapPin, IndianRupee, Leaf, Search, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { useRef } from "react";

const MarketPrice = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1day');
  const [lastUpdatedId, setLastUpdatedId] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const socketRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  // Setup socket connection for real-time updates
  useEffect(() => {
    socketRef.current = io('http://localhost:5001');
    
    socketRef.current.on('priceUpdate', (updatedPrice) => {
      setMarketData(prev => {
        const idx = prev.findIndex(p => p.id === updatedPrice.id);
        if (idx !== -1) {
          const newData = [...prev];
          newData[idx] = updatedPrice;
          toast.info(`Price updated for ${updatedPrice.product}: ₹${updatedPrice.price}`);
          setLastUpdatedId(updatedPrice.id);
          setTimeout(() => setLastUpdatedId(null), 2000);
          return newData;
        } else {
          toast.info(`New price added for ${updatedPrice.product}: ₹${updatedPrice.price}`);
          return [updatedPrice, ...prev];
        }
      });
    });

    socketRef.current.on('insightsUpdate', ({ product, insights }) => {
      if (selectedProduct === product) {
        toast.info(`New insights available for ${product}`);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedProduct]);

  // Fetch market data with search
  const fetchMarketData = useCallback(async (searchTerm = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/market-prices${searchTerm ? `?search=${searchTerm}` : ''}`);
      setMarketData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast.error('Failed to fetch market data');
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      fetchMarketData(search);
    }, 500);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [search, fetchMarketData]);

  // Fetch real-time price for selected product
  const fetchLivePrice = useCallback(async (product) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/market-prices/live/${product}`);
      setMarketData(prev => {
        const idx = prev.findIndex(p => p.id === response.data.id);
        if (idx !== -1) {
          const newData = [...prev];
          newData[idx] = response.data;
          return newData;
        }
        return [response.data, ...prev];
      });
    } catch (error) {
      console.error('Error fetching live price:', error);
    }
  }, []);

  // Price alert system
  const addPriceAlert = (product, targetPrice) => {
    const newAlert = {
      id: Date.now(),
      product,
      targetPrice,
      createdAt: new Date(),
    };
    setPriceAlerts([...priceAlerts, newAlert]);
    toast.success(`Price alert set for ${product} at ₹${targetPrice}`);
  };

  // Market trend analysis
  const analyzeTrend = (prices) => {
    if (prices.length < 2) return 'stable';
    const recentPrices = prices.slice(-5);
    const trend = recentPrices.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return acc;
      return acc + (curr.price - arr[idx - 1].price);
    }, 0);
    return trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';
  };

  // Filter products based on search
  const filteredPrices = marketData.filter(
    (item) =>
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase())
  );

  const productsToShow = showAll ? filteredPrices : filteredPrices.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <motion.h2
        className="text-4xl font-extrabold text-center text-green-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌾 {t('Real-Time Market Prices')}
      </motion.h2>

      {/* Search and Time Range Selection */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-3 text-green-500" />
          <input
            type="text"
            placeholder={t('Search product or location...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTimeRange('1day')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeRange === '1day'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            1 Day
          </button>
          <button
            onClick={() => setSelectedTimeRange('2days')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeRange === '2days'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            2 Days
          </button>
          <button
            onClick={() => setSelectedTimeRange('3days')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeRange === '3days'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            3 Days
          </button>
        </div>
      </div>

      {/* Price Alerts Section */}
      <div className="mb-8 bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-green-700 mb-4">{t('Price Alerts')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priceAlerts.map((alert) => (
            <div key={alert.id} className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{alert.product}</span>
                <span className="text-green-600">₹{alert.targetPrice}</span>
              </div>
              <div className="text-sm text-gray-500">
                {t('Set on')} {new Date(alert.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Price Table */}
      <motion.div
        className="overflow-x-auto shadow-xl rounded-xl bg-white mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <table className="min-w-full divide-y divide-green-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-5 text-left text-sm font-bold uppercase tracking-wide">
                {t('Product')}
              </th>
              <th className="py-3 px-5 text-left text-sm font-bold uppercase tracking-wide">
                {t('Price')}
              </th>
              <th className="py-3 px-5 text-left text-sm font-bold uppercase tracking-wide">
                {t('Location')}
              </th>
              <th className="py-3 px-5 text-left text-sm font-bold uppercase tracking-wide">
                {t('Trend')}
              </th>
              <th className="py-3 px-5 text-left text-sm font-bold uppercase tracking-wide">
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-200">
            {productsToShow.map((item, index) => {
              const trend = analyzeTrend(item.priceHistory || []);
              return (
                <tr
                  key={index}
                  onClick={() => {
                    setSelectedProduct(item.product);
                    fetchLivePrice(item.product);
                  }}
                  className={`hover:bg-green-50 transition-all duration-200 cursor-pointer ${
                    item.id === lastUpdatedId ? 'animate-pulse bg-green-50' : ''
                  }`}
                >
                  <td className="py-3 px-5 text-green-800 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      <span>{item.product}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap text-gray-800 font-semibold">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                      {item.price}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-gray-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span>{item.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      ) : trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="text-gray-500">→</span>
                      )}
                      <span className={trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500'}>
                        {trend === 'up' ? t('Rising') : trend === 'down' ? t('Falling') : t('Stable')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetPrice = prompt(t('Enter target price for alert:'));
                        if (targetPrice) {
                          addPriceAlert(item.product, parseFloat(targetPrice));
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {t('Set Alert')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {filteredPrices.length > 3 && (
        <div className="text-center my-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      {/* Price Trend Graph */}
      {selectedProduct && (
        <motion.div
          className="mt-12 p-6 bg-green-50 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">
            📈 {selectedProduct} {t('Price Trend')}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={marketData.find(p => p.product === selectedProduct)?.priceHistory || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="₹" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                name={t('Price')}
                stroke="#15803d"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="averagePrice"
                name={t('Average Price')}
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Market Insights */}
      {selectedProduct && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-green-700 mb-4">{t('Market Insights')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span>{t('High demand for')} {selectedProduct} {t('in Chennai')}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>{t('Prices expected to rise in the next week')}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-green-700 mb-4">{t('Weather Impact')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">🌧️</span>
                <span>{t('Recent rainfall may affect supply in southern districts')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500">☀️</span>
                <span>{t('Good harvest expected in northern regions')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPrice;
