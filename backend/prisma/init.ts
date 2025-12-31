import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initDatabase() {
    try {
        await prisma.$executeRawUnsafe(`
      SELECT 1;
    `);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed', error);
    }
}
