const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const illustrationListRoutes = require('./routes/illustrationListRoutes');
const communityRoutes = require('./routes/communityRoutes');
const userRoutes = require('./routes/userRoutes');
const illustrationCategoryRoutes = require('./routes/illustrationCategoryRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = 8080;

// static assets
// 为seed/images目录设置静态资源访问路径为/images
app.use('/images', express.static(path.join(__dirname,'seed/images')));
// 为public/uploads目录设置静态资源访问路径
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/list', illustrationListRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/category', illustrationCategoryRoutes);
app.use('/api/game', gameRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Encyclopedia API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
