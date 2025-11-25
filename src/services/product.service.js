import ProductDao from "../dao/mongo/product.dao.js";

const productDao = new ProductDao();

export default class ProductService {
  getAll() {
    return productDao.getAll();
  }
  getById(id) {
    return productDao.getById(id);
  }
  create(data) {
    return productDao.create(data);
  }
  update(id, data) {
    return productDao.update(id, data);
  }
  delete(id) {
    return productDao.delete(id);
  }
}