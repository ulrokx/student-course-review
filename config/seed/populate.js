import { faker } from "@faker-js/faker";
import { register } from "../../data/auth.js";
import { createUniversity } from "../../data/universities.js";
import { createCourse } from "../../data/courses.js";
import getDb from "../mongoConnection.js";
import { createReview, updateVote } from "../../data/reviews.js";

const numberOfUsers = 100;
const numberOfUniversities = 10;
const numberOfCoursesPerUniversity = 10;
const db = await getDb();

const wipeDatabase = async () => {
  db.dropDatabase();
};

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

const generateUsers = (universityIds) => {
  return Promise.all(
    [...Array(numberOfUsers)].map(async () => {
      const password = faker.internet.password();
      const user = await register({
        email: faker.internet.email(),
        password,
        username: faker.internet.displayName().slice(0, 16),
        universityId:
          universityIds[getRandomIntInclusive(0, universityIds.length - 1)],
      });
      return { ...user, password };
    }),
  );
};

const generateUniversities = () => {
  return Promise.all(
    [...Array(numberOfUniversities)].map(async () => {
      return createUniversity({
        name: `${faker.company.name()} University`,
        location: `${faker.location.city()}, ${faker.location.state({
          abbreviated: true,
        })}`,
      });
    }),
  );
};

const generateCourses = (universityId) => {
  return Promise.all(
    [...Array(numberOfCoursesPerUniversity)].map(async () => {
      return createCourse(universityId, {
        courseCode: `${faker.string.alpha({
          casing: "upper",
          length: { min: 2, max: 3 },
        })} ${faker.string.numeric({
          allowLeadingZeros: false,
          length: { min: 3, max: 5 },
        })}`,
        courseName: faker.lorem.words({ min: 3, max: 5 }).slice(0, 40),
        professors: Array.from({ length: getRandomIntInclusive(1, 3) }).map(
          () => faker.person.fullName(),
        ),
      });
    }),
  );
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
const courses = (
  await Promise.all(
    universities.map((university) =>
      generateCourses(university._id.toString()),
    ),
  )
).flat();

console.info("📝 Generating reviews...");
// each course should have between 0 and 10 reviews
const reviews = (
  await Promise.all(
    courses.map((course) => {
      const numberOfReviews = getRandomIntInclusive(0, 10);
      const usersToReview = shuffleArray(users).slice(0, numberOfReviews);
      return Promise.all(
        usersToReview.map((user) =>
          generateReview(user._id.toString(), course._id.toString()),
        ),
      );
    }),
  )
).flat();

console.info("👍 Generating votes...");
// each user should vote on 5 random reviews
await Promise.all(
  users.map((user) => {
    const reviewsToVote = shuffleArray(reviews).slice(0, 5);
    return Promise.all(
      reviewsToVote.map((review) =>
        generateVote(user._id.toString(), review._id.toString()),
      ),
    );
  }),
);

console.info("✅ Populating complete");

process.exit(0);
