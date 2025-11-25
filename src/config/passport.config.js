import passport from "passport";
import local from "passport-local";
import userModel from "../models/users.model.js";
import { createHash, isValidadPassword } from "../utils/index.js";
import jwt, { ExtractJwt } from "passport-jwt";
import config from "./config.js";

const JWTStrategy = jwt.Strategy,
  ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;
const initializePassport = () => {

  // current strategy
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtSecret,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // aca ocurre magia
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[config.cookieName] || null;
  }
  return token;
};

export default initializePassport;
