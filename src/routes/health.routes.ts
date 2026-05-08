import { Router } from 'express';
import { version } from '../../package.json';

const router = Router();

router.get('/', (_req, res) => {
  res.json(
    { 
      service: 'rubiks-auth-service', 
      timestamp: new Date().toISOString(),
      version
    }
  );
});

export default router;
