import { Router } from "express";
import { verifyToken } from "../utils/index.js";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";

const router = Router();

router.get("/register", (req, res) => {
  res.render("register", { title: "REGISTER" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "LOGIN" });
});

// router.get("/profile", (req, res) => {
//   // console.log(req.session.user);
//   // const user =  req.session.user ;
//   // console.log(user);
//   const token = req.cookies.authCookie;
//   console.log(`Token desde la cookie:${token}`);

//   const{ user } = verifyToken(token);

//   res.render("profile", { title: "PROFILE", user: user });
// });

router.get("/reset-password", (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect("/login");

  res.render("resetPassword", { title: "Restablecer contraseña", token });
});

router.get(
  "/profile",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const userData = req.user.user || req.user;
    const userDTO = new UserDTO(userData);
    res.render("profile", { user: userDTO });
  }
);
router.get("/recupero", (req, res) => {
  res.render("recupero", { title: "Recuperar password" });
});
export default router;
