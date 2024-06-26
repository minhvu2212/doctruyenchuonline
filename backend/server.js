const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');

const config = require('./config');
const routes = require('./routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}))

// Connect to MongoDB
mongoose.connect(config.mongodbURI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(-1);
});
// Cấu hình middleware serve static để phục vụ các tệp từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api', routes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
