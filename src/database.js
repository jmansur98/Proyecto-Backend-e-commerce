require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => {
        console.log("Error al conectarse a la base de datos", error);
    });
