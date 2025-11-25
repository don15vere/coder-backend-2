import userModel from "../../models/users.model.js";

export default class UserDao {
  getById(id) {
    return userModel.findById(id);
  }

  getByEmail(email) {
    return userModel.findOne({ email });
  }

  create(userData) {
    return userModel.create(userData);
  }

  updatePassword(id, hashedPassword) {
    return userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  }


}
