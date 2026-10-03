import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Fail fast if critical configuration is missing
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    // Connect to database
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   ESCOtech Ltd Backend API                            ║
║   Server running on port ${PORT}                         ║
║   Environment: ${process.env.NODE_ENV || 'development'}                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
