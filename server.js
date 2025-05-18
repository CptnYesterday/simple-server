const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Counter for visits
let visitCount = 0;

// Basic route
app.get('/', (req, res) => {
  visitCount++;
  res.json({ 
    message: 'Welcome to the Simple Server!',
    visits: visitCount
  });
});

// Example route with a parameter
app.get('/hello/:name', (req, res) => {
  res.json({ message: `Hello, ${req.params.name}!` });
});

// Health check route (useful for deployment)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// New route to check visit count
app.get('/stats', (req, res) => {
  res.json({ totalVisits: visitCount });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 