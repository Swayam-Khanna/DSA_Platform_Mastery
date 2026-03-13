require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const problemRoutes = require('./routes/problems');
const assessmentRoutes = require('./routes/assessment');
const roadmapRoutes = require('./routes/roadmap');
const codeRunnerRoutes = require('./routes/codeRunner');
const aiRoutes = require('./routes/ai');
const leaderboardRoutes = require('./routes/leaderboard');
const mockInterviewRoutes = require('./routes/mockInterview');
const adminRoutes = require('./routes/admin');
const platformRoutes = require('./routes/platform');
const executeRoutes = require('./routes/execute');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io real-time connection
let activeUsersCount = 0; // Truly real-time starting at 0

io.on('connection', (socket) => {
  // Track actual socket connections
  activeUsersCount += 1;
  io.emit('activeUsers', activeUsersCount);

  socket.on('disconnect', () => {
    activeUsersCount = Math.max(0, activeUsersCount - 1);
    io.emit('activeUsers', activeUsersCount);
  });
});

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/code', codeRunnerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/mock', mockInterviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/execute', executeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Database connection + server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_mastery')
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
