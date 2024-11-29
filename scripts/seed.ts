const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
    try {
        await db.Category.createMany({
            data : [
                {name : "Compiler design"},
                {name : "Web development"},
                {name : "Machine learning"},
                {name : "Artificial intelligence"},
                {name : "Operating systems"},
                {name : "Database management"},
            ]
        });
        console.log("Successs");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    }finally {
        await db.$disconnect();
    }
}

main();