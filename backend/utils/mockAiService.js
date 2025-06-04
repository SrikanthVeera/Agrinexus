/**
 * Mock AI service for development when OpenAI API key is not available
 */

const mockResponses = {
  // Common farming questions
  "crop": "For optimal crop growth, ensure proper soil preparation, adequate water, and regular monitoring for pests and diseases.",
  "pest": "Integrated Pest Management (IPM) combines biological controls, crop rotation, and minimal chemical use to manage pests effectively.",
  "fertilizer": "Choose fertilizers based on soil tests. Organic options include compost, manure, and green manures for sustainable farming.",
  "water": "Efficient irrigation methods like drip irrigation can save water while ensuring crops receive adequate moisture.",
  "soil": "Healthy soil contains a balance of minerals, organic matter, air, and water. Regular testing helps maintain optimal conditions.",
  "organic": "Organic farming avoids synthetic chemicals, focusing on natural processes, biodiversity, and soil health.",
  "season": "Plan your planting calendar according to local seasons and climate conditions for best results.",
  "harvest": "Harvest at the right time to maximize quality and yield. Different crops have different harvest indicators.",
  "market": "Consider direct-to-consumer sales, farmers markets, or cooperatives to maximize your profit margins.",
  "price": "Agricultural commodity prices fluctuate based on supply, demand, weather conditions, and global market trends.",
  
  // Default response
  "default": "As an agricultural expert, I recommend consulting with local extension services for advice specific to your region and conditions."
};

/**
 * Generates a mock response based on keywords in the question
 * @param {string} question - The user's question
 * @returns {string} - A relevant mock response
 */
function generateMockResponse(question) {
  if (!question) return mockResponses.default;
  
  const lowerQuestion = question.toLowerCase();
  
  // Check for keywords in the question
  for (const [keyword, response] of Object.entries(mockResponses)) {
    if (keyword !== "default" && lowerQuestion.includes(keyword)) {
      return response;
    }
  }
  
  // If no keywords match, return the default response
  return mockResponses.default;
}

module.exports = {
  generateMockResponse
};