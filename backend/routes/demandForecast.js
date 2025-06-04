const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// Update with your MySQL config
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'TIGER', // <-- change to your MySQL password
  database: 'agrotech'
});

// Get forecast for a specific product (no date filter for testing)
router.get('/:product', async (req, res) => {
  const { product } = req.params;
  const { timeframe } = req.query;
  let days = 14; // fetch all rows for testing

  try {
    // Fetch all data for the product (case-insensitive)
    const [allData] = await pool.query(
      `SELECT * FROM demand_forecast WHERE LOWER(product) = LOWER(?) ORDER BY date ASC LIMIT ?`,
      [product, days]
    );
    // Split into historical and forecast based on actual/forecast values
    const historical = allData.filter(row => row.actual > 0);
    const forecast = allData.filter(row => row.forecast > 0);
    res.json({ historical, forecast, insights: [] });
  } catch (err) {
    res.status(500).json({ message: 'DB error', error: err });
  }
});

// Generate and download forecast report
router.get('/:product/report', async (req, res) => {
  try {
    const { product } = req.params;
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=demand-forecast-${product}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Get forecast data
    const forecastData = await DemandForecast.find({ product })
      .sort({ date: 1 })
      .limit(30);

    // Add content to PDF
    doc.fontSize(25).text(`Demand Forecast Report - ${product}`, { align: 'center' });
    doc.moveDown();
    
    // Add summary
    doc.fontSize(16).text('Summary');
    doc.fontSize(12).text(`Total Forecast Periods: ${forecastData.length}`);
    doc.text(`Average Forecast: ${(forecastData.reduce((acc, curr) => acc + curr.forecast, 0) / forecastData.length).toFixed(2)}`);
    doc.text(`Average Confidence: ${(forecastData.reduce((acc, curr) => acc + curr.confidence, 0) / forecastData.length * 100).toFixed(1)}%`);
    doc.moveDown();

    // Add forecast table
    doc.fontSize(16).text('Forecast Details');
    doc.moveDown();
    
    const tableTop = 200;
    const tableLeft = 50;
    let currentTop = tableTop;

    // Table headers
    doc.fontSize(12);
    doc.text('Date', tableLeft, currentTop);
    doc.text('Forecast', tableLeft + 150, currentTop);
    doc.text('Confidence', tableLeft + 250, currentTop);
    currentTop += 20;

    // Table rows
    forecastData.forEach(item => {
      doc.text(new Date(item.date).toLocaleDateString(), tableLeft, currentTop);
      doc.text(item.forecast.toFixed(2), tableLeft + 150, currentTop);
      doc.text(`${(item.confidence * 100).toFixed(1)}%`, tableLeft + 250, currentTop);
      currentTop += 20;
    });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating forecast report' });
  }
});

// Create new forecast (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const forecast = new DemandForecast({
      ...req.body,
      metadata: {
        ...req.body.metadata,
        updatedBy: req.user.id
      }
    });
    await forecast.save();
    res.status(201).json(forecast);
  } catch (error) {
    console.error('Error creating forecast:', error);
    res.status(500).json({ message: 'Error creating forecast' });
  }
});

// Update forecast (protected route)
router.patch('/:id', auth, async (req, res) => {
  try {
    const forecast = await DemandForecast.findById(req.params.id);
    if (!forecast) {
      return res.status(404).json({ message: 'Forecast not found' });
    }

    Object.assign(forecast, {
      ...req.body,
      metadata: {
        ...forecast.metadata,
        lastUpdated: new Date(),
        updatedBy: req.user.id
      }
    });

    await forecast.save();
    res.json(forecast);
  } catch (error) {
    console.error('Error updating forecast:', error);
    res.status(500).json({ message: 'Error updating forecast' });
  }
});

// Delete forecast (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const forecast = await DemandForecast.findById(req.params.id);
    if (!forecast) {
      return res.status(404).json({ message: 'Forecast not found' });
    }

    await forecast.remove();
    res.json({ message: 'Forecast deleted successfully' });
  } catch (error) {
    console.error('Error deleting forecast:', error);
    res.status(500).json({ message: 'Error deleting forecast' });
  }
});

module.exports = router; 