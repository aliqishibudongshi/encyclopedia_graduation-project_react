require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const connectDB = require('./db');
const illustrationListRoutes = require('./routes/illustrationListRoutes');
const communityRoutes = require('./routes/communityRoutes');
const userRoutes = require('./routes/userRoutes');
const illustrationCategoryRoutes = require('./routes/illustrationCategoryRoutes');
const gameRoutes = require('./routes/gameRoutes');
const progressRoutes = require('./routes/progressRoutes');
const steamRoutes = require('./routes/steamRoutes');
const steamAuth = require('./routes/auth/steam');

const app = express();
const PORT = 8080;

// static assets
// 为seed/images目录设置静态资源访问路径为/images
app.use('/images', express.static(path.join(__dirname, 'seed/images')));
// 为public/uploads目录设置静态资源访问路径
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 3600000, // 1小时
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
    }
}));

// Middleware
app.use(express.json());

const whitelist = ['http://localhost:3000', process.env.API_BASE];
app.use(cors({
    origin: whitelist,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // 允许跨域携带cookie
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/list', illustrationListRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/category', illustrationCategoryRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/steam/', steamRoutes);
app.use('/api/auth/steam/', steamAuth);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Encyclopedia API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
