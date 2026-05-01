import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`Attempting to initialize Auth service on port ${env.PORT}`);
  console.log(`Auth service successfully started on port ${env.PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
    console.log(`Auth service failed to initialize on ${env.PORT} due to an error - ${JSON.stringify(error)}`);
    process.exit(1);
});
