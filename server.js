
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: false,
}));

// Routes
app.use('/auth', authRoutes);
app.use('/api', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running', 
        timestamp: new Date().toISOString() 
    });
});


// Test registration endpoint
app.post('/test-register', (req, res) => {
    console.log('Test register called with:', req.body);
    res.json({
        success: true,
        message: 'Test registration successful',
        data: req.body
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('/:any', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port: ${PORT}`);
    console.log(`📝 API Documentation:`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Login: http://localhost:${PORT}/auth/login`);
    console.log(`   Register: http://localhost:${PORT}/auth/register`);
    console.log(`   Users: http://localhost:${PORT}/api/users`);
});
