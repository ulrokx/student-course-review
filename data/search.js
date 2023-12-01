import { universities } from "../config/mongoCollections.js";

export const searchUniversity = async (search) => {
  const universityCollection = await universities();
  const $regex = new RegExp(search, "i");
  return universityCollection
    .find({ $or: [{ name: { $regex } }, { location: { $regex } }] })
    .toArray();
};
