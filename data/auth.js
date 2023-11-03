import bcrypt from "bcrypt";
import { users } from "../config/mongoCollections.js";
import { loginSchema, registerSchema } from "./validation.js";

/**
 * Register new user with email, password, and username
 * @param {Zod.infer<typeof registerSchema>} params
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
      _id: insertedUser.insertedId,
      email,
      username,
      admin: false,
    },
  };
};

/**
 * Login user with email and password
 * @param {Zod.infer<typeof loginSchema>} params
 */
export const login = async (params) => {
  const parseResults = loginSchema.safeParse(params);
  if (!parseResults.success) {
    throw { status: 400, message: parseResults.error.message };
  }
  const { email, password } = parseResults.data;
  const usersCollection = await users();
  const user = await usersCollection.findOne({ email });
  if (!user) {
    throw { status: 400, message: "Invalid email or password" };
  }
  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!passwordMatch) {
    throw { status: 400, message: "Invalid email or password" };
  }
  delete user.hashedPassword;
  return {
    status: 200,
    message: "Login successful",
    user,
  };
};
