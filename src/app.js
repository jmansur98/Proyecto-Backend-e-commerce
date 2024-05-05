const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const PUERTO = 8080;
require("./database.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");

// handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// middleware
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "TestProyectEcommerce",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://juancruzmansur:jcm1998@cluster0.jehqgkx.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);

// Cambios passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

//  ruta raíz
app.get("/", (req, res) => {
  res.render("login");
});



app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en puerto http://localhost:${PUERTO}`);
});
