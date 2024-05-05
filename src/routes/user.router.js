const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcryp.js");
const generateToken = require("../utils/jsonwebtoken.js");

// REGISTRO con JSON Web Token:

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    try {
        const existeUsuario = await UserModel.findOne({email:email});
        if(existeUsuario) {
            return res.status(400).send({error: "Este Email ya existe."});
        }

        // Creamos un nuevo usuario: 
        const nuevoUsuario = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age
        });

        // Generamos el token: 
        const token = generateToken({id: nuevoUsuario._id});

        // Almacenamos los datos del usuario en la sesión
        req.session.user = {
            first_name: nuevoUsuario.first_name,
            last_name: nuevoUsuario.last_name,
            email: nuevoUsuario.email,
            age: nuevoUsuario.age
        };

        req.session.login = true;

        // Redireccionamos al usuario al perfil
        res.redirect("/profile");
    

    } catch (error) {
        console.log("Error en autenticación ", error);
        res.status(500).send({status:"error", message: "Error interno del servidor"});
    }
});

module.exports = router;
