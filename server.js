const express = require('express');
const mongoose = require('mongoose');
const Visit = require('./models/Visit');
const axios = require('axios');  // Add axios for making HTTP requests
const app = express();
const port = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1); // Exit if we can't connect to the database
});

// Middleware to parse JSON bodies
app.use(express.json());

// Wake-up endpoint that calls external API
app.get('/wake-up', async (req, res) => {
    try {
        // Call external API (example using JSONPlaceholder)
        const apiResponse = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        
        // Log the API response
        console.log('External API response:', apiResponse.data);
        
        // Create a visit record
        const visit = new Visit();
        await visit.save();
        
        res.json({
            status: 'success',
            message: 'Server woke up and called external API',
            apiResponse: apiResponse.data,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error during wake-up:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to complete wake-up routine',
            error: error.message
        });
    }
});

// Basic route
app.get('/', async (req, res) => {
  try {
    // Create a new visit record
    const visit = new Visit();
    await visit.save();

    // Get total visits
    const totalVisits = await Visit.countDocuments();
    
    // Get the last visit
    const lastVisit = await Visit.findOne().sort({ timestamp: -1 });

    res.json({ 
      message: 'Welcome to the Simple Server!',
      visits: totalVisits,
      lastVisit: lastVisit ? lastVisit.timestamp : null
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update visit count' });
  }
});

// Example route with a parameter
app.get('/hello/:name', (req, res) => {
  res.json({ message: `Hello, ${req.params.name}!` });
});

// Health check route (useful for deployment)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Stats route to check visit count
app.get('/stats', async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    const lastVisit = await Visit.findOne().sort({ timestamp: -1 });
    
    res.json({ 
      totalVisits,
      lastVisit: lastVisit ? lastVisit.timestamp : null
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to read stats' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 