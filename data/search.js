import { courses, universities } from "../config/mongoCollections.js";

export const searchUniversity = async (search) => {
  const universityCollection = await universities();
  const $regex = new RegExp(search, "i");
  return universityCollection
    .find({ $or: [{ name: { $regex } }, { location: { $regex } }] })
    .toArray();
};

export const searchCourse = async (search) => {
  const courseCollection = await courses();
  const $regex = new RegExp(search, "i");
  return courseCollection
    .find({
      $or: [
        { courseName: { $regex } },
        { courseCode: { $regex } },
        { professors: { $regex } },
      ],
    })
    .toArray();
};
