const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const PUERTO = process.env.PORT || 8080;
const dbURL = process.env.DATABASE_URL;

// Conexión a la base de datos
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a la base de datos'))
.catch((err) => {
    console.error('Error al conectarse a la base de datos', err);
    process.exit(1);
});

// Importación de rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(cookieParser());

// Passport
app.use(passport.initialize());
initializePassport();

// AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

// Configuración de Handlebars
const hbs = exphbs.create({
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, 'views'));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('404: Not Found');
});

// Iniciar el servidor
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PUERTO}`);
});

// Websockets
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
