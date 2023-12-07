import { courses, universities, users } from "../mongoCollections.js";
import getDb from "../mongoConnection.js";
import bcrypt from "bcrypt";

const usersCollection = await users();
const universitiesCollection = await universities();
const coursesCollection = await courses();

usersCollection.drop();
universitiesCollection.drop();
coursesCollection.drop();

console.info("🌱 Begin seeding database");

await usersCollection.insertOne({
  email: "admin@stevens.edu",
  hashedPassword: bcrypt.hashSync("admin123", 10),
  username: "admin",
  admin: true,
});

await usersCollection.insertOne({
  email: "student@stevens.edu",
  hashedPassword: bcrypt.hashSync("student123", 10),
  username: "student",
});

const { insertedId: universityId } = await universitiesCollection.insertOne({
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

await coursesCollection.insertOne({
  courseCode: "CS 546",
  courseName: "Web Programming",
  professors: ["Patrick Hill", "Michael Phelps"],
  universityId,
});

await coursesCollection.insertOne({
  courseCode: "CS 554",
  courseName: "Web Programming II",
  professors: ["Patrick Hill"],
  universityId,
});

await coursesCollection.insertOne({
  courseCode: "CS 382",
  courseName: "Computer Architecture",
  professors: ["Shudong Hao"],
  universityId,
});

console.info("✅ Seeding complete");

process.exit(0);
