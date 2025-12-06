import "dotenv/config";
import { Pool } from 'pg'; // You need to import Pool
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// 1. Create a Postgres Pool
const pool = new Pool({ connectionString });

// 2. Pass the pool to the Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with the adapter
const database = new PrismaClient({ adapter });

async function main() {
    try {
        // Clear existing categories to avoid duplicates (Optional)
        // await database.category.deleteMany(); 

        await database.category.createMany({
            data: [
                { name: "Typescript" },
                { name: "Manual Testing" },
                { name: "Computer Science" },
                { name: "Automation Testing" },
                { name: "DevOps" },
                { name: "Javascript" },
            ]
        });
        console.log("Success: Categories seeded");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        // 4. Disconnect correctly
        await database.$disconnect();
    }
}

main();