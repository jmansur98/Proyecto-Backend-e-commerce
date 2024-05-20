const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const exphbs = require("express-handlebars");
require("./database.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const cors = require("cors");
const path = require('path');
const PUERTO = 8080;



const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

// handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views","./src/views");

// middleware
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);


// rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

//  ruta raíz
app.get("/", (req, res) => {
  res.render("login");
});

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PUERTO}`);
});
///Websockets: 
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
