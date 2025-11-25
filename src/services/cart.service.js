import CartDao from "../dao/mongo/cart.dao.js";
import ProductDao from "../dao/mongo/product.dao.js";
import TicketService from "../services/ticket.service.js";

const cartDao = new CartDao();
const productDao = new ProductDao();
const ticketService = new TicketService();

class CartService {
  async create(data) {
    const newCart = await cartDao.createCart(data);
    return newCart;
  }

  async purchase(cartId, purchaserEmail) {
    const cart = await cartDao.getById(cartId); 

    const purchasable = [];
    const notPurchasable = [];

    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.stock >= quantity) {
        purchasable.push({ product, quantity });
      } else {
        notPurchasable.push(product._id);
      }
    }

    let amount = 0;
    for (const item of purchasable) {
      amount += item.product.price * item.quantity;
      // actualizar stock
      await productDao.updateStock(
        item.product._id,
        item.product.stock - item.quantity
      );
    }

    let ticket = null;
    if (amount > 0) {
      ticket = await ticketService.createTicket({ amount, purchaser: purchaserEmail });
    }

    // dejar en el carrito sólo los que no se pudieron comprar
    await cartDao.updateProducts(cartId, notPurchasable);

    return { ticket, notPurchasable };
  }
}

const cartService = new CartService();
export default cartService;