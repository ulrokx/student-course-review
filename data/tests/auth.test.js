import { getUserById, login, register } from "../auth.js";
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
      const user = await register(params);
      expect(findOne).toHaveBeenCalledWith({ email: params.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(params.password, 10);
      expect(insertOne).toHaveBeenCalledWith({
        email: params.email,
        hashedPassword: "hashedPassword",
        username: params.username,
        admin: false,
      });
      expect(user).not.toHaveProperty("hashedPassword");
      expect(ObjectId.isValid(user._id)).toBeTruthy();
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

  describe("login", () => {
    it("should login successfully", async () => {
      const findOne = jest.fn(() => ({
        email: "bob123@email.com",
        username: "bob123",
        hashedPassword: "hashedPassword",
        _id: new ObjectId(),
      }));
      bcrypt.compare.mockReturnValue(true);
      users.mockReturnValue({ findOne });
      const user = await login({
        email: "bob123@email.com",
        password: "12345678",
      });
      expect(user).not.toHaveProperty("hashedPassword");
      expect(ObjectId.isValid(user._id)).toBeTruthy();
    });

    it("should throw error when email is invalid", async () => {
      const findOne = jest.fn(() => null);
      users.mockReturnValue({ findOne });
      await expect(() =>
        login({ email: "invalid@email.com", password: "123455677" }),
      ).rejects.toHaveProperty("status", 400);
    });

    it("should throw error when password is incorrect", async () => {
      const findOne = jest.fn(() => ({
        email: "bob123@email.com",
        username: "bob123",
        hashedPassword: "hashedPassword",
        _id: new ObjectId(),
      }));
      bcrypt.compare.mockReturnValue(false);
      users.mockReturnValue({ findOne });
      await expect(() =>
        login({
          email: "bob123@email.com",
          password: "badpassword",
        }),
      ).rejects.toHaveProperty("status", 400);
    });
  });

  describe("getUserById", () => {
    it("should throw error if user not found", async () => {
      const findOne = jest.fn(() => null);
      const _id = new ObjectId();
      users.mockReturnValue({ findOne });
      await expect(() => getUserById(_id.toString())).rejects.toHaveProperty(
        "status",
        404,
      );
    });

    it("should throw error if id is invalid", async () => {
      await expect(() => getUserById("abc")).rejects.toHaveProperty(
        "status",
        400,
      );
    });

    it("should return user if exists", async () => {
      const findOne = jest.fn(() => ({
        email: "abc@email.com",
        hashedPassword: "secrethashed",
        admin: false,
        username: "abcman",
      }));
      const _id = new ObjectId();
      users.mockReturnValue({ findOne });
      const result = await getUserById(_id.toString());
      expect(result).not.toHaveProperty("hashedPassword");
    });
  });
});
