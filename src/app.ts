import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { env } from './config/env';

const app = express();


app.use(express.json());
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS }));


// Routes
app.use('/auth', authRoutes);

// Global error handler — must be registered last
app.use(errorMiddleware);

export default app;
