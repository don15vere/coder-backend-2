import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), "..");

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidadPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

export const generateToken = (user) =>
  jwt.sign({ user }, config.jwtSecret, { expiresIn: "1h" });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

export { join, __dirname };

export const generateResetToken = (user) =>
  jwt.sign(
    { id: user._id || user.id, email: user.email, type: "password_reset" },
    config.jwtSecret,
    { expiresIn: "1h" }
  );
