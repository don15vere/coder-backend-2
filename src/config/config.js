import "dotenv/config";

export default {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  cookieName: process.env.JWT_COOKIE_NAME || "authCookie",
};