import { faker } from "@faker-js/faker";
import { register } from "../../data/auth.js";
import { createUniversity } from "../../data/universities.js";
import { createCourse } from "../../data/courses.js";
import { createReview, updateVote } from "../../data/reviews.js";
import {
  courses as coursesC,
  reviews as reviewsC,
  universities as universitiesC,
  users as usersC,
} from "../mongoCollections.js";
import bcrypt from "bcrypt";

const usersCollection = await usersC();
const universitiesCollection = await universitiesC();
const coursesCollection = await coursesC();
const reviewsCollection = await reviewsC();

usersCollection.drop();
universitiesCollection.drop();
coursesCollection.drop();
reviewsCollection.drop();

console.info("🌱 Begin seeding database");

await usersCollection.insertOne({
  email: "admin@stevens.edu",
  hashedPassword: bcrypt.hashSync("Admin123!", 10),
  username: "admin",
  admin: true,
});

console.info("---");
console.info("🔑 Admin account created:");
console.info("Email: admin@stevens.edu");
console.info("Password: Admin123!");
console.info("---");

await usersCollection.insertOne({
  email: "student@stevens.edu",
  hashedPassword: bcrypt.hashSync("student123", 10),
  username: "student",
});

const numberOfUsers = 100;
const numberOfUniversities = 10;
const numberOfCoursesPerUniversity = 10;

// https://stackoverflow.com/a/12646864
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateUsers = async (universityIds) => {
  const users = [];
  for (let i = 0; i < numberOfUsers; i++) {
    const password = faker.internet.password({
      prefix: "Aa1!",
    });
    const user = await register({
      email: faker.internet.email(),
      password,
      username: faker.internet.displayName().slice(0, 16),
      universityId:
        universityIds[getRandomIntInclusive(0, universityIds.length - 1)],
    });
    users.push({ ...user, password });
  }
  return users;
};

const generateUniversities = async () => {
  const universities = [];
  for (let i = 0; i < numberOfUniversities; i++) {
    const university = await createUniversity({
      name: `${faker.company.name()} University`,
      location: `${faker.location.city()}, ${faker.location.state({
        abbreviated: true,
      })}`,
    });
    universities.push(university);
  }
  return universities;
};

const generateCourses = async (universityId) => {
  const courses = [];
  for (let i = 0; i < numberOfCoursesPerUniversity; i++) {
    const course = await createCourse(universityId, {
      courseCode: `${faker.string.alpha({
        casing: "upper",
        length: { min: 2, max: 3 },
      })} ${faker.string.numeric({
        allowLeadingZeros: false,
        length: { min: 3, max: 5 },
      })}`,
      courseName: faker.lorem.words({ min: 3, max: 5 }).slice(0, 40),
      professors: Array.from({ length: getRandomIntInclusive(1, 3) }).map(() =>
        faker.person.fullName(),
      ),
      tags: Array.from({ length: getRandomIntInclusive(0, 5) }).map(() =>
        faker.lorem.word({ length: getRandomIntInclusive(3, 10) }),
      ),
    });
    courses.push(course);
  }
  return courses;
};

const generateReview = (userId, courseId) => {
  return createReview(userId, courseId, {
    rating: getRandomIntInclusive(1, 10) / 2,
    content: faker.lorem.paragraphs(getRandomIntInclusive(1, 3)).slice(0, 500),
  });
};

const generateVote = (userId, reviewId) => {
  return updateVote(userId, {
    reviewId,
    vote: getRandomIntInclusive(0, 1) ? "upvote" : "downvote",
  });
};

// await wipeDatabase();
console.info("🖨️ Begin populating database");
console.info("🏫 Generating universities...");
const universities = await generateUniversities();
console.info("👤 Generating users...");
const users = await generateUsers(universities.map((u) => u._id.toString()));

console.info("📚 Generating courses...");
// each university should have courses
let courses = [];
for (const university of universities) {
  courses.push(...(await generateCourses(university._id.toString())));
}

console.info("📝 Generating reviews...");
// each course should have between 0 and 10 reviews
const reviews = [];
for (const course of courses) {
  const numberOfReviews = getRandomIntInclusive(0, 10);
  const usersToReview = shuffleArray(users).slice(0, numberOfReviews);
  for (const user of usersToReview) {
    reviews.push(
      await generateReview(user._id.toString(), course._id.toString()),
    );
  }
}
console.info("👍 Generating votes...");
// each user should vote on 5 random reviews
for (const user of users) {
  const reviewsToVote = shuffleArray(reviews).slice(0, 5);
  for (const review of reviewsToVote) {
    await generateVote(user._id.toString(), review._id.toString());
  }
}

console.info("🔍 Creating indexes...");

await coursesCollection.createIndex({
  courseCode: "text",
  courseName: "text",
  professors: "text",
  tags: "text",
});

await universitiesCollection.createIndex({
  name: "text",
  location: "text",
});

console.info("✅ Seeding complete");

process.exit(0);
