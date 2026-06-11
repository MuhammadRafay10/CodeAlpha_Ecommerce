const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Config and Middleware Imports
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Is file ka name check karlein ke routes/ folder mein yahi ho

const app = express();

// 1. Database Connection
connectDB();

// 2. Middlewares
app.use(cors());
app.use(express.json()); // Incoming JSON request data ko parse karne ke liye

// 3. API Routes Link
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 4. Base/Test Route
app.get('/', (req, res) => {
    res.send('CodeAlpha E-commerce API is Running successfully...');
});

// 5. Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in development mode on port ${PORT}`);
});