import { ObjectId } from "mongodb";
import { courses, universities } from "../../config/mongoCollections.js";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../courses.js";

jest.mock("../../config/mongoCollections.js");

describe("data/courses", () => {
  describe("createCourse", () => {
    it("should create a course", async () => {
      const universityId = new ObjectId();
      const universitiesFindOne = jest.fn().mockResolvedValue({
        _id: universityId,
      });
      universities.mockResolvedValue({
        findOne: universitiesFindOne,
      });
      const coursesFindOne = jest.fn().mockResolvedValue(null);
      const coursesInsertOne = jest.fn(() => {
        return { acknowledged: true, insertedId: new ObjectId() };
      });

      courses.mockResolvedValue({
        findOne: coursesFindOne,
        insertOne: coursesInsertOne,
      });
      const result = await createCourse(universityId.toString(), {
        courseCode: "CS546",
        courseName: "Web Programming",
        professors: ["Patrick Hill"],
      });
      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("professors", ["Patrick Hill"]);
    });

    it("should throw an error if university does not exist", async () => {
      const universitiesFindOne = jest.fn().mockResolvedValue(null);
      universities.mockResolvedValue({
        findOne: universitiesFindOne,
      });
      expect(() =>
        createCourse(new ObjectId().toString(), {
          courseCode: "CS546",
          courseName: "Web Programming",
          professors: ["Patrick Hill"],
        }),
      ).rejects.toHaveProperty("status", 404);
    });

    it("should throw an error if course already exists", async () => {
      const universityId = new ObjectId();
      const universitiesFindOne = jest.fn().mockResolvedValue({
        _id: universityId,
      });
      universities.mockResolvedValue({
        findOne: universitiesFindOne,
      });
      const coursesFindOne = jest.fn().mockResolvedValue({
        _id: new ObjectId(),
      });
      courses.mockResolvedValue({
        findOne: coursesFindOne,
      });
      expect(() =>
        createCourse(universityId.toString(), {
          courseCode: "CS546",
          courseName: "Web Programming",
          professors: ["Patrick Hill"],
        }),
      ).rejects.toHaveProperty("status", 400);
    });

    it("should throw an error if course insertion fails", async () => {
      const universityId = new ObjectId();
      const universitiesFindOne = jest.fn().mockResolvedValue({
        _id: universityId,
      });
      universities.mockResolvedValue({
        findOne: universitiesFindOne,
      });
      const coursesFindOne = jest.fn().mockResolvedValue(null);
      const coursesInsertOne = jest
        .fn()
        .mockResolvedValue({ acknowledged: false });

      courses.mockResolvedValue({
        findOne: coursesFindOne,
        insertOne: coursesInsertOne,
      });
      expect(() =>
        createCourse(universityId.toString(), {
          courseCode: "CS546",
          courseName: "Web Programming",
          professors: ["Patrick Hill"],
        }),
      ).rejects.toHaveProperty("status", 500);
    });
  });

  describe("getCourses", () => {
    it("should return courses", async () => {
      const universityId = new ObjectId();
      const coursesFind = jest.fn().mockReturnValue({
        toArray: () => [
          {
            _id: new ObjectId(),
            courseCode: "CS546",
            courseName: "Web Programming",
            professors: ["Patrick Hill"],
          },
        ],
      });
      courses.mockResolvedValue({
        find: coursesFind,
      });
      const result = await getCourses(universityId.toString());
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("_id");
      expect(result[0]).toHaveProperty("professors", ["Patrick Hill"]);
    });
  });

  describe("updateCourse", () => {
    it("should update a course", async () => {
      const universityId = new ObjectId();
      const coursesFindOne = jest
        .fn()
        .mockResolvedValueOnce({
          _id: new ObjectId(),
          courseCode: "CS546",
          courseName: "Web Programming",
          professors: ["Patrick Hill"],
        })
        .mockResolvedValueOnce(null);
      const coursesFindOneAndUpdate = jest.fn().mockResolvedValue({
        _id: new ObjectId(),
        courseCode: "CS554",
        courseName: "Web Programming II",
        professors: ["Patrick Hill"],
      });
      courses.mockResolvedValue({
        findOne: coursesFindOne,
        findOneAndUpdate: coursesFindOneAndUpdate,
      });
      const coursesUpdateOne = jest.fn().mockResolvedValue({
        _id: new ObjectId(),
      });
      universities.mockResolvedValue({
        updateOne: coursesUpdateOne,
      });
      const result = await updateCourse(new ObjectId().toString(), {
        courseCode: "CS554",
        courseName: "Web Programming II",
        professors: ["Patrick Hill"],
      });
      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("professors", ["Patrick Hill"]);
    });

    it("should throw error if course does not exist", () => {
      const findOne = jest.fn().mockResolvedValue(null);
      courses.mockResolvedValue({
        findOne,
      });
      expect(() =>
        updateCourse(new ObjectId().toString(), {
          courseCode: "CS554",
          courseName: "Web Programming II",
          professors: ["Patrick Hill"],
        }),
      ).rejects.toHaveProperty("status", 404);
    });

    it("should throw error if course update fails", () => {
      const findOne = jest
        .fn()
        .mockResolvedValueOnce({
          _id: new ObjectId(),
          courseCode: "CS546",
          courseName: "Web Programming",
          professors: ["Patrick Hill"],
        })
        .mockResolvedValueOnce(null);
      const findOneAndUpdate = jest.fn().mockResolvedValue(null);
      courses.mockResolvedValue({
        findOne,
        findOneAndUpdate,
      });
      expect(() =>
        updateCourse(new ObjectId().toString(), {
          courseCode: "CS554",
          courseName: "Web Programming II",
          professors: ["Patrick Hill"],
        }),
      ).rejects.toHaveProperty("status", 500);
    });

    it("should throw error if course with course code already exists", () => {
      const findOne = jest
        .fn()
        .mockResolvedValueOnce({
          _id: new ObjectId(),
          courseCode: "CS546",
          courseName: "Web Programming",
          professors: ["Patrick Hill"],
        })
        .mockResolvedValueOnce({
          _id: new ObjectId(),
          courseCode: "CS554",
          courseName: "Web Programming II",
          professors: ["Patrick Hill"],
        });
      courses.mockResolvedValue({
        findOne,
      });
      expect(() =>
        updateCourse(new ObjectId().toString(), {
          courseCode: "CS554",
          courseName: "Web Programming II",
          professors: ["Patrick Hill"],
        }),
      ).rejects.toHaveProperty("status", 400);
    });
  });

  describe("deleteCourse", () => {
    it("should delete a course", async () => {
      const courseFindOne = jest.fn().mockResolvedValue({
        _id: new ObjectId(),
      });
      const coursesDeleteOne = jest.fn().mockResolvedValue({
        deletedCount: 1,
      });
      courses.mockResolvedValue({
        findOne: courseFindOne,
        deleteOne: coursesDeleteOne,
      });
      const result = await deleteCourse(new ObjectId().toString());
      expect(result).toBe(true);
    });

    it("should throw error if course does not exist", async () => {
      const courseFindOne = jest.fn().mockResolvedValue(null);
      courses.mockResolvedValue({
        findOne: courseFindOne,
      });
      expect(() =>
        deleteCourse(new ObjectId().toString()),
      ).rejects.toHaveProperty("status", 404);
    });
  });
});
