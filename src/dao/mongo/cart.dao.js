import cartModel from "../../models/carts.model.js";

export default class CartDao {
  // Traer carrito por ID, populado con los productos
  async getById(id) {
    return cartModel
      .findById(id)
      .populate("products.product")
      .lean();
  }

  // Crear un carrito vacío
  async createCart() {
    return cartModel.create({ products: [] });
  }

  // Actualizar TODO el array de productos del carrito
  // products: [{ productId, quantity }]
  async updateProducts(cartId, products = []) {
    const formattedProducts = products.map((p) => ({
      product: p.productId || p.product, // aceptamos ambas formas
      quantity: p.quantity,
    }));

    return cartModel
      .findByIdAndUpdate(
        cartId,
        { products: formattedProducts },
        { new: true }
      )
      .populate("products.product")
      .lean();
  }

  // Agregar producto al carrito (o sumar cantidad si ya existe)
  async addProduct(cartId, productId, quantity = 1) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    const index = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString()
    );

    if (index === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      cart.products[index].quantity += quantity;
    }

    await cart.save();
    return cart
      .populate("products.product");
  }

  // Quitar un producto del carrito
  async removeProduct(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId.toString()
    );

    await cart.save();
    return cart
      .populate("products.product");
  }

  // Vaciar carrito
  async clearCart(cartId) {
    return cartModel.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }
}