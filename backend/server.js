const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Basic Route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the CMS API Backend!' });
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/notices', require('./routes/noticeRoutes'));
// app.use('/api/events', require('./routes/eventRoutes'));
// app.use('/api/complaints', require('./routes/complaintRoutes'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
