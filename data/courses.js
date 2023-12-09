import { ObjectId } from "mongodb";
import { courses, universities } from "../config/mongoCollections.js";
import {
  createCourseSchema,
  getCoursesOptionsSchema,
  idSchema,
  updateCourseSchema,
} from "./validation.js";
import { log } from "console";

export const createCourse = async (universityId, params) => {
  const parseResults = createCourseSchema.safeParse(params);
  const idParseResults = idSchema.safeParse(universityId);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.issues[0].message };
  }
  if (!idParseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  const university_id = new ObjectId(universityId);
  const coursesCollection = await courses();
  const universitiesCollection = await universities();
  const university = await universitiesCollection.findOne({
    _id: university_id,
  });
  if (!university) {
    throw { status: 404, message: "University not found" };
  }
  const existingCourse = await coursesCollection.findOne({
    courseCode: parseResults.data.name,
    universityId: university_id,
  });
  if (existingCourse) {
    throw { status: 400, message: "Course already exists" };
  }
  const insertedCourse = await coursesCollection.insertOne({
    ...parseResults.data,
    universityId: university_id,
  });

  if (!insertedCourse.acknowledged) {
    throw { status: 500, message: "Could not add course" };
  }

  return {
    _id: insertedCourse.insertedId,
    ...parseResults.data,
    universityName: university.name,
  };
};

export const getAllCourses = async () => {
  const coursesCollection = await courses();
  return coursesCollection.find({}).toArray();
};

export const getCourses = async (options) => {
  const parseResults = getCoursesOptionsSchema.safeParse(options);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.issues[0].message };
  }
  const { search, universityId, sortBy } = parseResults.data;
  const coursesCollection = await courses();
  const query = {};
  if (universityId) {
    query.universityId = new ObjectId(universityId);
  }
  if (search) {
    query.$text = { $search: search };
  }
  const cursor = coursesCollection.find(query);
  if (sortBy) {
    const sort =
      sortBy === "rating-asc" ? { averageRating: 1 } : { averageRating: -1 };
    cursor.sort(sort);
  }
  return cursor.toArray();
};

export const getCourse = async (id) => {
  const parseResults = idSchema.safeParse(id);
  if (!parseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  const coursesCollection = await courses();
  const _id = new ObjectId(id);
  const course = await coursesCollection.findOne({ _id });
  if (!course) {
    throw { status: 404, message: "Course not found" };
  }
  return course;
};

export const updateCourse = async (id, params) => {
  const parseResults = updateCourseSchema.safeParse(params);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.issues[0].message };
  }
  const coursesCollection = await courses();
  const _id = new ObjectId(id);
  const course = await coursesCollection.findOne({ _id });
  if (!course) {
    throw { status: 404, message: "Course not found" };
  }
  const existingCourse = await coursesCollection.findOne({
    courseCode: parseResults.data.courseCode,
    universityId: course.universityId,
  });
  if (existingCourse && existingCourse._id.toString() !== id) {
    throw { status: 400, message: "Course already exists" };
  }
  const updatedCourse = await coursesCollection.findOneAndUpdate(
    { _id },
    { $set: parseResults.data },
    { returnDocument: "after" },
  );
  if (!updatedCourse) {
    throw { status: 500, message: "Could not update course" };
  }
  return updatedCourse;
};

export const deleteCourse = async (id) => {
  const parseResults = idSchema.safeParse(id);
  if (!parseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  const coursesCollection = await courses();
  const _id = new ObjectId(id);
  const course = await coursesCollection.findOne({ _id });
  if (!course) {
    throw { status: 404, message: "Course not found" };
  }
  const deleteResult = await coursesCollection.deleteOne({ _id });
  if (deleteResult.deletedCount === 0) {
    throw { status: 500, message: "Could not delete course" };
  }
  return true;
};
