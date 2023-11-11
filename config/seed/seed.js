import { universities, users } from "../mongoCollections.js";
import getDb from "../mongoConnection.js";
import bcrypt from "bcrypt";

const usersCollection = await users();
const universitiesCollection = await universities();

usersCollection.drop();
universitiesCollection.drop();

console.info("🌱 Begin seeding database");

await usersCollection.insertOne({
  email: "admin@stevens.edu",
  hashedPassword: bcrypt.hashSync("admin123", 10),
  username: "admin",
});

await usersCollection.insertOne({
  email: "student@stevens.edu",
  hashedPassword: bcrypt.hashSync("student123", 10),
  username: "student",
});

await universitiesCollection.insertOne({
  name: "Stevens Institute of Technology",
  location: "Hoboken, NJ",
});

await universitiesCollection.insertOne({
  name: "Rutgers University",
  location: "New Brunswick, NJ",
});

await universitiesCollection.insertOne({
  name: "New Jersey Institute of Technology",
  location: "Newark, NJ",
});

console.info("✅ Seeding complete");

process.exit(0);
