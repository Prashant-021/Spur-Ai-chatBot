import app from "./app";
import { env } from "./config/env";
import { execSync } from 'child_process';

try {
  console.log('Running Prisma DB Push...');
  execSync('npx prisma db push', { stdio: 'inherit' });
} catch (err) {
  console.error('Prisma db push failed', err);
}

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});