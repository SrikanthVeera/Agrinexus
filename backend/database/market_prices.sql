CREATE TABLE IF NOT EXISTS market_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  unit VARCHAR(50) DEFAULT 'kg',
  supplyStatus ENUM('high', 'medium', 'low') DEFAULT 'medium',
  demandStatus ENUM('high', 'medium', 'low') DEFAULT 'medium',
  marketTrend ENUM('rising', 'falling', 'stable') DEFAULT 'stable',
  weatherImpact ENUM('positive', 'neutral', 'negative') DEFAULT 'neutral',
  priceHistory JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product (product),
  INDEX idx_location (location),
  INDEX idx_updated_at (updated_at)
);

-- Insert some sample data
INSERT INTO market_prices (product, price, location, unit, supplyStatus, demandStatus, marketTrend, weatherImpact, priceHistory) VALUES
('Rice', 45.50, 'Chennai', 'kg', 'high', 'high', 'rising', 'neutral', '[]'),
('Wheat', 35.75, 'Chennai', 'kg', 'medium', 'high', 'stable', 'positive', '[]'),
('Tomato', 40.00, 'Chennai', 'kg', 'low', 'high', 'rising', 'negative', '[]'),
('Potato', 25.50, 'Chennai', 'kg', 'high', 'medium', 'falling', 'neutral', '[]'),
('Onion', 30.25, 'Chennai', 'kg', 'medium', 'high', 'rising', 'neutral', '[]');

-- Find the id of Rice
SELECT id, product, price FROM market_prices WHERE product = 'Rice';

-- Update Rice price (use the id from the above query)
UPDATE market_prices 
SET price = 50.00, 
    updated_at = NOW() 
WHERE id = 1;  -- Replace 1 with the actual id from the SELECT query 