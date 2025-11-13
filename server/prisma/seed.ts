import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "Batik Tote",
          description: "Handmade batik tote bag",
          price: 34.5,
          stock: 12,
          category: "Accessories"
        },
        {
          name: "Kopi Luwak",
          description: "Premium Indonesian coffee beans",
          price: 18,
          stock: 40,
          category: "Beverages"
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
