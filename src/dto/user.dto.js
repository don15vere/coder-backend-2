export default class UserDTO {
  constructor(user) {
    this.id = user._id || user.id;
    this.name = `${user.first_name} ${user.last_name}`;
    this.email = user.email;
    this.role = user.role;
    this.age = user.age;
    this.cart = user.cart;
  }
}