//conexion a la base de datos
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://juancruzmansur:jcm1998@cluster0.jehqgkx.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Conectado a la base de datos"))
.catch((error) => console.log("Error al conectarse a la base de datos", error));