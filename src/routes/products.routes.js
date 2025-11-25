import { Router } from "express";
import passport from "passport";
import { handlePolicies } from "../utils/authorization.js";
import ProductService from "../services/product.service.js";

const router = Router();
const productService = new ProductService();

const createProductController = async (req, res) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({ status: "success", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al crear producto" });
  }
};

const updateProductController = async (req, res) => {
  try {
    const product = await productService.update(req.params.pid, req.body);
    res.json({ status: "success", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al actualizar producto" });
  }
};

const deleteProductController = async (req, res) => {
  try {
    await productService.delete(req.params.pid);
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al eliminar producto" });
  }
};

router.post(
  "/",
  passport.authenticate("current", { session: false }),
  handlePolicies(["ADMIN"]),
  createProductController
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  handlePolicies(["ADMIN"]),
  updateProductController
);

router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  handlePolicies(["ADMIN"]),
  deleteProductController
);

export default router;