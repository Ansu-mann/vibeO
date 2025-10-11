require('dotenv').config()
const express = require('express')
const connectToDb = require('./database/db')
const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-routes')
const adminRoutes = require('./routes/admin-routes')
const uploadRoutes = require('./routes/video-upload-routes')

const app = express();
const PORT = process.env.PORT || 3000;

// DB connection
connectToDb();

// middleware
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/home', homeRoutes)
app.use('/api', adminRoutes)
app.use('/api/video', uploadRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})