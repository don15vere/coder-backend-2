import UserDao from "../dao/mongo/user.dao.js";

const userDao = new UserDao();

export default class UserService {
  async register(userData) {
    // acá podrías hacer validaciones de negocio
    return userDao.create(userData);
  }

  async findByEmail(email) {
    return userDao.getByEmail(email);
  }

  async findById(id) {
    return userDao.getById(id);
  }

  async changePassword(userId, hashedPassword) {
    return userDao.updatePassword(userId, hashedPassword);
  }
}
