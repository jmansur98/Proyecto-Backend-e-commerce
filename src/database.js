require('dotenv').config();
const mongoose = require("mongoose");

const options = {
    serverSelectionTimeoutMS: 5000,  
    socketTimeoutMS: 45000, 
    family: 4  
};

mongoose.connect(process.env.DATABASE_URL, options)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => {
        console.log("Error al conectarse a la base de datos", error);
        process.exit(1);  
    });
