# Simple Server

A basic Express.js server for learning deployment.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. For production:
```bash
npm start
```

## Available Routes

- `GET /`: Welcome message
- `GET /hello/:name`: Personalized greeting
- `GET /health`: Health check endpoint

## Testing the Server

Once running, you can test the endpoints using curl or a web browser:

```bash
# Test the root endpoint
curl http://localhost:3000

# Test the hello endpoint
curl http://localhost:3000/hello/YourName

# Test the health endpoint
curl http://localhost:3000/health
```

## Deployment

This server is ready to be deployed to various cloud platforms like:
- Render
- Railway
- Fly.io
- Heroku

The server will automatically use the PORT environment variable provided by the hosting platform. 