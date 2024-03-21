const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js")

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router.js");



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/product", (req, res) => {
    res.render("product");
});

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en puerto https://localhost:${PUERTO}`);    
});
