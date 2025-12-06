const { PrismaClient } = require("@prisma/client");
const Database = new PrismaClient();

async function main() {
    try {
        await Database.category.createMany({
            data: [
                { name: "Typescript" },
                { name: "Manual Testing" },
                { name: "Computer Science" },
                { name: "Automation Testing" },
                { name: "DevOps" },
                { name: "Javascript" },
            ]
        })
        console.log("Success");
    } catch (error) {
        console.log("Error seeding the database categories", error)
    } finally {
        await Database.$disconnect();
    }
}

main()