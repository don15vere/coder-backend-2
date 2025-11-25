import { Router } from "express";
import passport from "passport";
import { handlePolicies } from "../utils/authorization.js";
import cartService from "../services/cart.service.js";
import CartDao from "../dao/mongo/cart.dao.js";

const cartDao = new CartDao();
const router = Router();

const addProductToCartController = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartDao.addProduct(cid, pid, 1);
    res.json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al agregar producto al carrito" });
  }
};

router.post(
  "/:cid/products/:pid",
  passport.authenticate("current", { session: false }),
  handlePolicies(["USER"]),
  addProductToCartController
);

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  handlePolicies(["USER"]),
  async (req, res) => {
    const { cid } = req.params;
    const userData = req.user.user || req.user;

    try {
      const { ticket, notPurchasable } = await cartService.purchase(
        cid,
        userData.email
      );

      res.json({
        status: "success",
        ticket,
        productsNotPurchased: notPurchasable,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Error en compra" });
    }
  }
);

export default router;