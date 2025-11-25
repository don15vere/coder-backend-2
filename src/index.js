import 'dotenv/config';
import express from "express";
import { engine } from "express-handlebars";
import { join, __dirname } from "./utils/index.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/session.routes.js";
import viewRoutes from "./routes/views.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
// passport
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import config from "./config/config.js";

//settings
const app = express();
app.set("PORT", 3000);
const url = process.env.MONGO_URL;
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// console.log(join(__dirname, "views"));
// console.log(join(__dirname, "../public"));

const connectDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Conexion exitosa");
  } catch (error) {
    console.log("error de conexion");
  }
};
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "../public")));
app.use(cookieParser());
// passport
initializePassport();
app.use(passport.initialize());
//routes
app.get("/", (req, res) => {
  res.render("home", { title: "HOME" });
});

app.use("/api/sessions", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", viewRoutes);

// db + server
connectDb(url);
app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});
