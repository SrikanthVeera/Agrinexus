module.exports = (req, res, next) => {
  // Dummy authentication middleware: allow all requests
  next();
}; 