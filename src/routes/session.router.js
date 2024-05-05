const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken.js");

//LOGIN con JSON Web Token

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ email: email });

        if (!usuario) {
            return res.status(400).send({ message: "Usuario no válido" });
        }

        if (!isValidPassword(password, usuario)) {
            return res.status(401).send({ message: "Credenciales inválidas" });
        }

        // Si el usuario existe y la contraseña es correcta, generamos el token:
        const token = generateToken({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            id: usuario._id
        });
 
        req.session.login = true;
        req.session.user = {
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            age: usuario.age
        };
        res.redirect("/profile");

     

    } catch (error) {
        console.log("Error en autenticación ", error);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
});


//Version para GitHub:

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}) ,async (req, res)=> {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}) ,async (req, res)=> {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})



module.exports = router;