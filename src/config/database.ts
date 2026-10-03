import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/escotech';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  // Cloud Postgres providers (Neon, Render, etc.) require SSL in production.
  dialectOptions:
    process.env.NODE_ENV === 'production'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');

    // Schema sync runs only in development or when explicitly enabled (DB_SYNC=true).
    // In production, schema changes should be applied via a controlled step
    // rather than automatically on every boot.
    if (process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
