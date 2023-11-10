import {
  getUniversities,
  createUniversity,
  deleteUniversity,
  updateUniversity,
} from "../universities.js";
import { universities } from "../../config/mongoCollections.js";
import { ObjectId } from "bson";

jest.mock("../../config/mongoCollections.js");

describe("data/universities", () => {
  describe("getUniversities", () => {
    it("should get universities", async () => {
      const university = {
        _id: new ObjectId(),
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      };
      const find = jest.fn(() => {
        return { toArray: () => [university] };
      });
      universities.mockReturnValue({
        find,
      });
      const result = await getUniversities();
      expect(result).toEqual([university]);
    });
  });

  describe("createUniversity", () => {
    it("should create a university", async () => {
      const findOne = jest.fn(() => null);
      const insertOne = jest.fn(() => {
        return { acknowledged: true, insertedId: new ObjectId() };
      });
      universities.mockReturnValue({
        findOne,
        insertOne,
      });
      const params = {
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      };
      const university = await createUniversity(params);
      expect(insertOne).toHaveBeenCalledWith({
        name: params.name,
        location: params.location,
      });
      expect(university).toHaveProperty("_id");
      expect(university).toHaveProperty("name", params.name);
      expect(university).toHaveProperty("location", params.location);
    });

    it("should throw an error if db insert fails", async () => {
      const findOne = jest.fn(() => null);
      const insertOne = jest.fn(() => {
        return { acknowledged: false };
      });
      universities.mockReturnValue({
        findOne,
        insertOne,
      });
      const params = {
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      };
      await expect(() => createUniversity(params)).rejects.toHaveProperty(
        "status",
        500,
      );
    });
    it("should throw an error if university already exists", async () => {
      const findOne = jest.fn(() => ({
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      }));
      universities.mockReturnValue({
        findOne,
      });
      const params = {
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      };
      await expect(() => createUniversity(params)).rejects.toHaveProperty(
        "status",
        400,
      );
    });
  });

  describe("deleteUniversity", () => {
    const _id = new ObjectId();
    it("should delete a university", async () => {
      const findOne = jest.fn(() => ({
        _id,
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      }));
      const deleteOne = jest.fn(() => {
        return { deletedCount: 1 };
      });
      universities.mockReturnValue({
      findOne,
        deleteOne,
      });
      const result = await deleteUniversity(_id.toString());
      expect(deleteOne).toHaveBeenCalledWith({ _id });
      expect(result).toBeTruthy();
    });

    it("should throw an error if db delete fails", async () => {
      const _id = new ObjectId();
      const findOne = jest.fn(() => ({
        _id,
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      }));
      const deleteOne = jest.fn(() => {
        return { deletedCount: 0 };
      });
      universities.mockReturnValue({
        findOne,
        deleteOne,
      });
      await expect(() =>
        deleteUniversity(_id.toString()),
      ).rejects.toHaveProperty("status", 500);
    });

    it("should throw an error if university not found", async () => {
      const findOne = jest.fn(() => null);
      universities.mockReturnValue({
        findOne,
      });
      const _id = new ObjectId();
      await expect(() =>
        deleteUniversity(_id.toString()),
      ).rejects.toHaveProperty("status", 404);
    });
  });

  describe("updateUniversity", () => {
    it("should update a university", async () => {
      const _id = new ObjectId();
      const findOne = jest.fn(() => ({
        _id,
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      }));
      const updateOne = jest.fn(() => {
        return { acknowledged: true };
      });
      universities.mockReturnValue({
        findOne,
        updateOne,
      });
      const params = {
        name: "Rutgers University",
        location: "New Brunswick, NJ",
      };
      const result = await updateUniversity(_id.toString(), params);
      expect(updateOne).toHaveBeenCalledWith(
        { _id },
        {
          $set: {
            name: params.name,
            location: params.location,
          },
        },
      );
      expect(result).toBeTruthy();
    });

    it("should throw an error if db update fails", async () => {
      const _id = new ObjectId();
      const findOne = jest.fn(() => ({
        _id,
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      }));
      const updateOne = jest.fn(() => {
        return { modifiedCount: 0 };
      });
      universities.mockReturnValue({
        findOne,
        updateOne,
      });
      const params = {
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      };
      await expect(() =>
        updateUniversity(_id.toString(), params),
      ).rejects.toHaveProperty("status", 500);
    });

    it("should throw an error if university not found", async () => {
      const findOne = jest.fn(() => null);
      universities.mockReturnValue({
        findOne,
      });
      const _id = new ObjectId();
      const params = {
        name: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
      };
      await expect(() =>
        updateUniversity(_id.toString(), params),
      ).rejects.toHaveProperty("status", 404);
    });

    it("should throw an error if university with name already exists", async () => {
      const _id = new ObjectId();
      const findOne = jest.fn(({_id}) => { // TODO: figure out why mocking findOne doesn't work
        if (_id) {
          return {
            _id,
            name: "Stevens Institute of Technology",
            location: "Hoboken, NJ",
          }
        }
        return {
          _id: new ObjectId(),
          name: "Rutgers University",
          location: "New Brunswick, NJ",
        }
      });
      universities.mockImplementation(() => ({
        findOne,
      }));
      const params = {
        name: "Rutgers University",
        location: "New Brunswick, NJ",
      };
      await expect(() =>
        updateUniversity(_id.toString(), params),
      ).rejects.toHaveProperty("status", 400);
    });

  });
});
