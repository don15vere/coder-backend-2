import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, required: false },
  password: { type: String, required: true }, 
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
    default: null,
  },
  role: { type: String, default: "user" },

});

export default model("User", UserSchema);
