import { Router } from "express";
import passport from "passport";

import UserService from "../services/user.service.js";
import CartService from "../services/cart.service.js";
import UserDTO from "../dto/user.dto.js";
import config from "../config/config.js";

import {
  createHash,
  isValidadPassword,
  generateToken,
  generateResetToken,
  verifyToken
} from "../utils/index.js";

import { sendPasswordResetEmail } from "../services/mail.service.js";

const router = Router();
const userService = new UserService();

/* ============================================================
   REGISTER
   ============================================================ */

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, age, role } = req.body;

    const userExists = await userService.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const passwordHash = createHash(password);
    const newCart = await CartService.create({ products: [] });

    await userService.register({
      first_name,
      last_name,
      email,
      age,
      password: passwordHash,
      role: role || "user",
      cart: newCart._id,
    });

    return res.redirect("/login");

  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

/* ============================================================
   LOGIN
   ============================================================ */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const validPassword = isValidadPassword(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = generateToken({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      age: user.age,
      cart: user.cart
    });

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    res.redirect("/profile");

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno" });
  }
});

/* ============================================================
   LOGOUT
   ============================================================ */

router.get("/logout", (req, res) => {
  res.clearCookie("authCookie");
  res.redirect("/login");
});

/* ============================================================
   CURRENT (JWT strategy + DTO)
   ============================================================ */

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    try {
      const userData = req.user.user || req.user;
      const userDTO = new UserDTO(userData);

      res.send({
        status: "success",
        user: userDTO
      });
    } catch (error) {
      console.error("Error en /current:", error);
      res.status(500).send({ status: "error", message: "Error interno" });
    }
  }
);

/* ============================================================
   REQUEST PASSWORD RESET (via email)
   ============================================================ */

router.post("/recupero", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.redirect("/login");
    }

    const token = generateResetToken(user);

    try {
      await sendPasswordResetEmail(email, token);
    } catch (mailError) {
      console.error("Error enviando mail de recupero:", mailError);
    }
    console.log(`LINK DE RECUPERO: http://localhost:3000/reset-password?token=${token}`);

    return res.redirect("/login");
  } catch (error) {
    console.error("Error en recupero:", error);
    return res.status(500).json({ message: "Error interno" });
  }
});


/* ============================================================
   RESET PASSWORD form submit
   ============================================================ */

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const payload = verifyToken(token);
    if (!payload || payload.type !== "password_reset") {
      return res.status(400).send("Enlace inválido o expirado");
    }

    const user = await userService.findById(payload.id);
    if (!user) {
      return res.status(400).send("Usuario no encontrado");
    }

    const samePassword = isValidadPassword(password, user.password);
    if (samePassword) {
      return res
        .status(400)
        .send("El nuevo password no puede ser igual al anterior");
    }

    const newHash = createHash(password);
    await userService.changePassword(user._id, newHash);

    return res.redirect("/login");

  } catch (error) {
    console.error("Error en reset-password:", error);
    return res.status(500).send("Error interno");
  }
});

export default router;
