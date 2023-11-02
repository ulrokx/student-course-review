import bcrypt from "bcrypt";
import { users } from "../config/mongoCollections.js";
import { idSchema, loginSchema, registerSchema } from "./validation.js";

/**
 * Register new user with email, password, and username
 * @param {Zod.infer<typeof registerSchema} params
 */
export const register = async (params) => {
  const parseResults = registerSchema.safeParse(params);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.message };
  }
  const { email, password, username } = parseResults.data;
  const usersCollection = await users();
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    throw { status: 400, message: "Email already in use" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    email,
    hashedPassword,
    username,
    admin: false,
  };
  const insertedUser = await usersCollection.insertOne(newUser);
  if (!insertedUser.acknowledged) {
    throw { status: 500, message: "Could not add user" };
  }
  return {
    status: 200,
    message: "User added successfully",
    user: {
      id: insertedUser.insertedId.toString(),
      email,
      username,
      admin: false,
    },
  };
};
