import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    // console.log('Seed completed!');
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
