const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Path to our data file
const dataFile = path.join(__dirname, 'data', 'visits.json');

// Function to read visit data
async function readVisitData() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading visit data:', error);
    return { totalVisits: 0, lastVisit: null };
  }
}

// Function to write visit data
async function writeVisitData(data) {
  try {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing visit data:', error);
  }
}

// Basic route
app.get('/', async (req, res) => {
  try {
    const data = await readVisitData();
    data.totalVisits += 1;
    data.lastVisit = new Date().toISOString();
    await writeVisitData(data);
    
    res.json({ 
      message: 'Welcome to the Simple Server!',
      visits: data.totalVisits,
      lastVisit: data.lastVisit
    });
  } catch (error) {
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
    const data = await readVisitData();
    res.json({ 
      totalVisits: data.totalVisits,
      lastVisit: data.lastVisit
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read stats' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 