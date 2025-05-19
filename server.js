const express = require('express');
const mongoose = require('mongoose');
const Visit = require('./models/Visit');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://philipptietjen:g4liMZajW5U9LcoM@cluster0.d21qq0l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Middleware to parse JSON bodies
app.use(express.json());

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