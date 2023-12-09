import { ObjectId } from "mongodb";
import { courses, universities } from "../config/mongoCollections.js";

export const searchUniversity = async (search) => {
  const universityCollection = await universities();
  const $regex = new RegExp(search, "i");
  return universityCollection
    .find({ $or: [{ name: { $regex } }, { location: { $regex } }] })
    .toArray();
};

export const searchCourse = async (search, universityId) => {
  const courseCollection = await courses();
  const $regex = new RegExp(search, "i");
  if (universityId) {
    return courseCollection
      .find({
        $and: [
          {
            $or: [
              { courseName: { $regex } },
              { courseCode: { $regex } },
              { professors: { $regex } },
            ],
          },
          { universityId: new ObjectId(universityId) },
        ],
      })
      .toArray();
  }
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
