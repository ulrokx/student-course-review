import { register } from "../auth.js";
import bcrypt from "bcrypt";
import { users } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";

jest.mock("bcrypt", () => {
  return {
    hash: jest.fn(() => "hashedPassword"),
    compare: jest.fn(() => true),
  };
});

jest.mock("../../config/mongoCollections.js");

describe("data/auth", () => {
  describe("register", () => {
    it("should register a user", async () => {
      const findOne = jest.fn(() => null);
      const insertOne = jest.fn(() => {
        return { acknowledged: true, insertedId: new ObjectId() };
      });
      users.mockReturnValue({
        findOne,
        insertOne,
      });
      const params = {
        email: "bob@email.com",
        password: "bob123bob",
        username: "bob123",
      };
      const result = await register(params);
      expect(findOne).toHaveBeenCalledWith({ email: params.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(params.password, 10);
      expect(insertOne).toHaveBeenCalledWith({
        email: params.email,
        hashedPassword: "hashedPassword",
        username: params.username,
        admin: false,
      });
      expect(result.status).toBe(200);
      expect(result.message).toBe("User added successfully");
      expect(result.user).not.toHaveProperty("hashedPassword");
      expect(typeof result.user.id).toBe("string");
    });

    it("should throw an error if email is already taken", async () => {
      const findOne = jest.fn(() => ({ email: "taken@email.com" }));
      const insertOne = jest.fn();
      users.mockReturnValue({ findOne, insertOne });
      await expect(() =>
        register({
          email: "taken@email.com",
          username: "taken",
          password: "123456789",
        }),
      ).rejects.toHaveProperty("status", 400);
      expect(insertOne).not.toHaveBeenCalled();
    });

    it("should throw an error if db insert fails", async () => {
      const findOne = jest.fn(() => null);
      const insertOne = jest.fn(() => {
        return { acknowledged: false };
      });
      users.mockReturnValue({
        findOne,
        insertOne,
      });
      const params = {
        email: "bob@email.com",
        password: "bob123bob",
        username: "bob123",
      };
      await expect(() => register(params)).rejects.toHaveProperty(
        "status",
        500,
      );
      expect(findOne).toHaveBeenCalledWith({ email: params.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(params.password, 10);
      expect(insertOne).toHaveBeenCalledWith({
        email: params.email,
        hashedPassword: "hashedPassword",
        username: params.username,
        admin: false,
      });
    });
  });
});
