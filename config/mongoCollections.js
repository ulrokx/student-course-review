import { Collection } from "mongodb";
import dbConnection from "./mongoConnection.js";

/**
 * @param {string} collection
 * @returns {() => Promise<Collection>}
 */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
export const users = getCollectionFn("users");
export const universities = getCollectionFn("universities");
export const courses = getCollectionFn("courses");
export const reviews = getCollectionFn("reviews");
