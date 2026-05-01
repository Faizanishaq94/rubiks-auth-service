import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { env } from './config/env';

const app = express();

// TODO: add any global middleware here (e.g. cors(), helmet(), express.json())
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS }));


// Routes
app.use('/auth', authRoutes);

// Global error handler — must be registered last
app.use(errorMiddleware);

export default app;
