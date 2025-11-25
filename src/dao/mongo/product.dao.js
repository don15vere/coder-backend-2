import productModel from "../../models/products.model.js";

export default class ProductDao {
  async getById(id) {
    return productModel.findById(id).lean();
  }

  async getAll() {
    return productModel.find().lean();
  }

  async create(data) {
    return productModel.create(data);
  }

  async update(id, updateData) {
    return productModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return productModel.findByIdAndDelete(id);
  }

  async updateStock(id, newStock) {
    return productModel.findByIdAndUpdate(
      id,
      { stock: newStock },
      { new: true }
    );
  }
}