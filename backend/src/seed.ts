#!/usr/bin/env ts-node
import "dotenv/config";
import { connectToDatabase, collections } from "./core/services/database.service";
import User from "./core/models/user";
import * as bcrypt from 'bcrypt';

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force") || args.includes("-f");
  const drop = args.includes("--drop");

  // Prevent destructive flags from running in production
  const nodeEnv = process.env.NODE_ENV || "development";
  if (nodeEnv === "production" && (force || drop)) {
    console.error("Refusing to run seeder with --force or --drop when NODE_ENV=production.");
    console.error("If you truly intend to run destructive seeding in production, change NODE_ENV or remove these flags.");
    process.exit(1);
  }

  console.log("Connecting to database...");
  await connectToDatabase();

  if (!collections.users) {
    console.error("Users collection is not initialized");
    process.exit(1);
  }

  if (drop) {
    console.log("Dropping existing users collection (if it exists)...");
    try {
      await collections.users.drop();
    } catch (e) {
      // ignore if collection doesn't exist
    }
  }

  const usersCount = await collections.users.countDocuments();
  if (usersCount > 0 && !force) {
    console.log(`Users collection already has ${usersCount} documents. Use --force to seed anyway.`);
    process.exit(0);
  }

  console.log("Seeding sample admin users...");

  // Create sample admin users with properly hashed passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const testPassword = await bcrypt.hash("test123", 10);

  const adminUsers = [
    new User("admin@example.com", adminPassword, true),
    new User("test@example.com", testPassword, false),
  ].map((u) => ({
    email: u.email,
    passwordHash: u.passwordHash,
    isSuperAdmin: !!u.isSuperAdmin,
  }));

  const usersResult = await collections.users.insertMany(adminUsers);
  const userIds = Object.values(usersResult.insertedIds);
  console.log("Inserted users:", userIds);

  console.log("Seeding complete.");
  console.log("Default admin user: admin@example.com / admin123");
  console.log("Default test user: test@example.com / test123");
  process.exit(0);
}

main().catch(err => {
  console.error("Seeder failed:", err);
  process.exit(1);
});
