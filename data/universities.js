import { ObjectId } from "bson";
import { universities } from "../config/mongoCollections.js";
import {
  createUniversitySchema,
  getUniversitiesOptionsSchema,
  idSchema,
  updateUniversitySchema,
} from "./validation.js";

export const getUniversities = async (options = {}) => {
  const parseResults = getUniversitiesOptionsSchema.safeParse(options);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.issues[0].message };
  }
  const { search } = parseResults.data;
  const universitiesCollection = await universities();
  const query = {};
  if (search) {
    query.$text = { $search: search };
  }
  return universitiesCollection.find(query).toArray();
};

export const getUniversity = async (id) => {
  const parseResults = idSchema.safeParse(id);
  if (!parseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  const universitiesCollection = await universities();
  const _id = new ObjectId(id);
  const university = await universitiesCollection.findOne({ _id });
  if (!university) {
    throw { status: 404, message: "University not found" };
  }
  return university;
};

export const createUniversity = async (params) => {
  const parseResults = createUniversitySchema.safeParse(params);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.issues[0].message };
  }
  const universitiesCollection = await universities();
  const existingUniversity = await universitiesCollection.findOne({
    name: parseResults.data.name,
  });
  if (existingUniversity) {
    throw { status: 400, message: "University already exists" };
  }
  const insertedUniversity = await universitiesCollection.insertOne(
    parseResults.data,
  );
  if (!insertedUniversity.acknowledged) {
    throw { status: 500, message: "Could not add university" };
  }
  return {
    _id: insertedUniversity.insertedId,
    ...parseResults.data,
  };
};

export const deleteUniversity = async (id) => {
  const parseResults = idSchema.safeParse(id);
  if (!parseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  const universitiesCollection = await universities();
  const _id = new ObjectId(id);
  const university = await universitiesCollection.findOne({ _id });
  if (!university) {
    throw { status: 404, message: "University not found" };
  }
  const deleteResult = await universitiesCollection.deleteOne({ _id });
  if (deleteResult.deletedCount === 0) {
    throw { status: 500, message: "Could not delete university" };
  }
  return true;
};

export const updateUniversity = async (id, params) => {
  const parseResults = updateUniversitySchema.safeParse(params);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.issues[0].message };
  }
  const universitiesCollection = await universities();
  const _id = new ObjectId(id);
  const university = await universitiesCollection.findOne({ _id });
  if (!university) {
    throw { status: 404, message: "University not found" };
  }
  const existingUniversity = await universitiesCollection.findOne({
    name: parseResults.data.name,
  });
  if (existingUniversity && !existingUniversity._id.equals(_id.toString())) {
    throw { status: 400, message: "University already exists" };
  }
  delete parseResults.data.id;
  const updatedUniversity = await universitiesCollection.updateOne(
    {
      _id,
    },
    { $set: parseResults.data },
  );
  if (updatedUniversity.modifiedCount === 0) {
    throw { status: 500, message: "Could not update university" };
  }
  return universitiesCollection.findOne({ _id });
};
