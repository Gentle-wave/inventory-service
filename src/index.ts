import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import itemRoutes from './routes/item.routes';
import { connectKafka } from './utils/kafka.publisher';
import { errorMiddleware } from './utils/error.middleware';

dotenv.config();

// Initialize the Express application
const app: Express = express();
app.use(express.json());

// Welcome endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Inventory Service!' });
});

// Kafka (or RabbitMQ) Connection
const connectEventBroker = async (): Promise<void> => {
  try {
    await connectKafka(); 
  } catch (error) {
    console.error('❌ Failed to connect to the event broker.');
    process.exit(1); 
  }
};

// Routes
app.use('/api/items', itemRoutes);

// Error Middleware
app.use(errorMiddleware);

// Start the Server
const startServer = async (): Promise<void> => {
  await connectDB();
  await connectEventBroker();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
};

// Initialize the server
startServer().catch((error) => {
  console.error('❌ Server initialization error:', error.message);
  process.exit(1); 
});


export default app;