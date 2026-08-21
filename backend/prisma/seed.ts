import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const services = [
    {
      name: "Haircut",
      duration: 60,
    },
    {
      name: "Hair Coloring",
      duration: 120,
    },
    {
      name: "Hair Wash",
      duration: 30,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name: service.name,
      },
      update: {
        duration: service.duration,
      },
      create: service,
    });
  }

  console.log("Services seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });