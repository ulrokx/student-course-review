import { universities } from "../../config/mongoCollections.js";
import { searchUniversity } from "../search.js";

jest.mock("../../config/mongoCollections.js");

describe("data/search", () => {
  describe("searchUniversity", () => {
    it("should return a list of universities", async () => {
      const find = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          {
            _id: "5f8fde0c0f3d9d4f0c8b6d1a",
            name: "Stevens Institute of Technology",
            location: "Hoboken, NJ",
          },
        ]),
      });
      universities.mockResolvedValue({
        find,
      });
      const result = await searchUniversity("Stevens");
      expect(result).toHaveProperty("length", 1);
      expect(result[0]).toHaveProperty(
        "name",
        "Stevens Institute of Technology",
      );
      expect(find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: /Stevens/i } },
          { location: { $regex: /Stevens/i } },
        ],
      });
    });
  });
});
