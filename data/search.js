import { universities } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const exportedMethods = {
  async searchUniversity(search) {
    const universityCollection = await universities();
    const part = new RegExp(search, "i");
    const universitiesList = await universityCollection
      .find({ name: { $regex: part } })
      .toArray();
    let temp = [];
    for (let i = 0; i < universitiesList.length; i++) {
      const uniList = {
        _id: universitiesList[i]._id,
        name: universitiesList[i].name,
      };
      temp.push(uniList);
    }
    return temp;
  },

  /*async getId(id) {
    if (!id) {
      throw "Error: id does not exist";
    }
    if (typeof id !== "string") {
      throw "Error: Id must be a string";
    }
    if (id.trim().length === 0) {
      throw "Error: id is empty";
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
      throw "Error: invalid ID";
    }
    const universityCollection = await universities();
    const university = await universityCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!university) {
      throw "Error: No event with that id";
    }

    return university;
  },*/
};
export default exportedMethods;
