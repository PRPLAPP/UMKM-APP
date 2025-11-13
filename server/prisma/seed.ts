import { MsmeStatus, PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await seedProducts();
  const users = await seedUsers();
  await seedMsmeProfiles(users);
  await seedNews();
  await seedTourismSpots();
  await seedNotifications(users);
}

async function seedProducts() {
  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) return;

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
      },
      {
        name: "Bamboo Basket",
        description: "Sustainable bamboo basket from local artisans",
        price: 22,
        stock: 30,
        category: "Handicrafts"
      }
    ]
  });
}

async function seedUsers() {
  const passwordHash = await hash("Password123!", 12);

  const msme = await prisma.user.upsert({
    where: { email: "msme@example.com" },
    update: { passwordHash },
    create: {
      name: "Demo MSME",
      email: "msme@example.com",
      role: UserRole.msme,
      passwordHash
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { passwordHash },
    create: {
      name: "Village Admin",
      email: "admin@example.com",
      role: UserRole.admin,
      passwordHash
    }
  });

  const villager = await prisma.user.upsert({
    where: { email: "villager@example.com" },
    update: { passwordHash },
    create: {
      name: "Community Member",
      email: "villager@example.com",
      role: UserRole.villager,
      passwordHash
    }
  });

  return { msme, admin, villager, passwordHash };
}

async function seedMsmeProfiles(users: Awaited<ReturnType<typeof seedUsers>>) {
  if (!users) return;

  await prisma.msmeProfile.upsert({
    where: { userId: users.msme.id },
    update: {},
    create: {
      userId: users.msme.id,
      storeName: "Warung Sari",
      category: "Food & Beverage",
      description: "Traditional delicacies and daily staples from local farmers.",
      location: "Central Market",
      distanceKm: 0.5,
      rating: 4.8,
      status: MsmeStatus.approved
    }
  });

  const pendingUser = await prisma.user.upsert({
    where: { email: "pending.msme@example.com" },
    update: { passwordHash: users.passwordHash },
    create: {
      name: "Pending MSME",
      email: "pending.msme@example.com",
      role: UserRole.msme,
      passwordHash: users.passwordHash
    }
  });

  await prisma.msmeProfile.upsert({
    where: { userId: pendingUser.id },
    update: {},
    create: {
      userId: pendingUser.id,
      storeName: "Kerajinan Tangan",
      category: "Handicrafts",
      description: "Handmade crafts awaiting verification.",
      location: "Artisan Lane",
      distanceKm: 1.2,
      rating: 4.5,
      status: MsmeStatus.pending
    }
  });
}

async function seedNews() {
  const count = await prisma.newsItem.count();
  if (count > 0) return;

  await prisma.newsItem.createMany({
    data: [
      {
        title: "Village Festival Next Week",
        summary: "Join us for a cultural celebration featuring local MSMEs and performances.",
        type: "event"
      },
      {
        title: "New MSME Added: Fresh Produce",
        summary: "Introducing a new farm-to-table experience with organic vegetables.",
        type: "business"
      },
      {
        title: "Community Meeting on Saturday",
        summary: "Discussing infrastructure plans and digital initiatives for the village.",
        type: "announcement"
      }
    ]
  });
}

async function seedTourismSpots() {
  const count = await prisma.tourismSpot.count();
  if (count > 0) return;

  await prisma.tourismSpot.createMany({
    data: [
      {
        name: "Air Terjun Indah",
        description: "A hidden waterfall surrounded by lush greenery.",
        imageUrl: "https://images.unsplash.com/photo-1760292424045-6c3669699efd?auto=format&fit=crop&w=800&q=80",
        location: "North Valley"
      },
      {
        name: "Sawah Terrace",
        description: "Panoramic rice fields perfect for sunrise walks.",
        imageUrl: "https://images.unsplash.com/photo-1737913785137-c2a957ae7565?auto=format&fit=crop&w=800&q=80",
        location: "East Ridge"
      },
      {
        name: "Kampung Tradisi",
        description: "Experience traditional crafts and culinary delights.",
        imageUrl: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&w=800&q=80",
        location: "Heritage Quarter"
      }
    ]
  });
}

async function seedNotifications(users: Awaited<ReturnType<typeof seedUsers>>) {
  const count = await prisma.notification.count();
  if (count > 0 || !users) return;

  await prisma.notification.createMany({
    data: [
      {
        title: "Welcome to Karya Desa",
        message: "Stay tuned for updates from your community.",
        type: "system",
        authorId: users.admin.id,
        targetRole: null,
        targetUserId: users.villager.id
      },
      {
        title: "Profile Approved",
        message: "Your MSME profile is under review.",
        type: "announcement",
        authorId: users.admin.id,
        targetUserId: users.msme.id
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
