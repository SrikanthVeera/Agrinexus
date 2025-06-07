const paymentRoutes = require('./routes/payment');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const entrepreneurRoutes = require('./routes/entrepreneur');
const leftoversRoutes = require('./routes/leftovers');

// Routes my rout
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/entrepreneur-products', entrepreneurRoutes);
app.use('/api/leftovers', leftoversRoutes); 