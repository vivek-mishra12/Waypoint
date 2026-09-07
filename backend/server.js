require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

connectDB();

const app = express();

// Allowed explicit origins
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'https://frontend-topaz-sigma-43.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean); // removes undefined if CLIENT_ORIGIN is not set

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Check against exact domains or any preview ending in .vercel.app
    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Enable CORS and explicitly handle HTTP preflight requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'nova-backend' })
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`NOVA backend running on port ${PORT}`));