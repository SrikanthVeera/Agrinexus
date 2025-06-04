import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Filter,
  Download,
  AlertCircle,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

const DemandForecasting = () => {
  const { t } = useTranslation();
  const [forecastData, setForecastData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (selectedProduct) {
      fetchForecastData();
    }
  }, [selectedProduct, selectedTimeframe]);

  const fetchForecastData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5001/api/demand-forecast/${selectedProduct}?timeframe=${selectedTimeframe}`
      );
      setForecastData(response.data.forecast);
      setHistoricalData(response.data.historical);
      setInsights(response.data.insights);
      console.log('API response:', response.data);
      console.log('historicalData:', response.data.historical);
      console.log('forecastData:', response.data.forecast);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      toast.error("Failed to fetch forecast data");
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/demand-forecast/${selectedProduct}/report`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `demand-forecast-${selectedProduct}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">{t('Demand Forecasting')}</h1>
        <p className="text-gray-600 mt-2">
          {t('Predict future demand based on historical data and market trends')}
        </p>
      </motion.div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Select Product')}
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t('Select a product')}</option>
              <option value="tomato">{t('Tomato')}</option>
              <option value="potato">{t('Potato')}</option>
              <option value="onion">{t('Onion')}</option>
              <option value="rice">{t('Rice')}</option>
              <option value="wheat">{t('Wheat')}</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Timeframe')}
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="week">{t('Next Week')}</option>
              <option value="month">{t('Next Month')}</option>
              <option value="quarter">{t('Next Quarter')}</option>
              <option value="year">{t('Next Year')}</option>
            </select>
          </div>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            {t('Download Report')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('Loading forecast data...')}</p>
        </div>
      ) : selectedProduct ? (
        (historicalData.length === 0 && forecastData.length === 0) ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('No forecast data available for this product.')}
            </h3>
            <p className="text-gray-600">
              {t('Try another product or check your backend data.')}
            </p>
          </div>
        ) : (
          <>
            {/* Forecast Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {t('Demand Forecast')}
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...historicalData, ...forecastData]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name={t('Historical Demand')}
                      stroke="#15803d"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      name={t('Forecasted Demand')}
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="upperBound"
                      name={t('Upper Bound')}
                      stroke="#ef4444"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="lowerBound"
                      name={t('Lower Bound')}
                      stroke="#ef4444"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {t('Key Insights')}
                </h2>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Info className="w-5 h-5 text-green-600 mt-1" />
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonal Analysis */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {t('Seasonal Analysis')}
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="seasonalFactor"
                        name={t('Seasonal Factor')}
                        fill="#15803d"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Forecast Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {t('Forecast Details')}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Date')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Forecasted Demand')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Confidence Interval')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Seasonal Factor')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {forecastData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.forecast.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.lowerBound.toFixed(2)} - {item.upperBound.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.seasonalFactor.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('Select a Product')}
          </h3>
          <p className="text-gray-600">
            {t('Choose a product to view its demand forecast')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DemandForecasting; 