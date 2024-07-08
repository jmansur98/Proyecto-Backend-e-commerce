const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const { generarResetToken } = require("../utils/tokenrest.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const EmailManager = require("../service/email.js");
const emailManager = new EmailManager();


class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await userRepository.findOne(email);
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe");
            }

            const nuevoCarrito = new CartModel();
            await nuevoCarrito.save();

            const nuevoUsuario = new UserModel({
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id,
                password: createHash(password),
                age
            });

            await nuevoUsuario.save();

            const token = jwt.sign({ user: nuevoUsuario }, "tokenProyect", {
                expiresIn: "1h"
            });

            res.cookie("CookieProyectTest", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email }).exec();

            if (!usuarioEncontrado) {
                return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: usuarioEncontrado._id }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });

            usuarioEncontrado.last_connection = new Date();
            await usuarioEncontrado.save();

            res.cookie("CookieProyectTest", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error("Error en el inicio de sesión", error);
            res.status(500).send("Error interno del servidor");
        }
    }


    async profile(req, res) {
        try {
            const isPremium = req.user.role === 'premium';
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === 'admin';

            res.render("profile", { user: userDto, isPremium, isAdmin });
        } catch (error) {
            res.status(500).send('Error interno del servidor');
        }
    }

    async logout(req, res) {
        if (req.user) {
            try {
                req.user.last_connection = new Date();
                await req.user.save();
            } catch (error) {
                console.error(error);
                res.status(500).send("Error interno del servidor");
                return;
            }
        }
        res.clearCookie("CookieProyectTest");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }

    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            const user = await userRepository.findOne(email);
            if (!user) {
                return res.status(404).send("Este usuario no se encuentra en la base de datos.");
            }

            const token = generarResetToken();

            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000)
            };
            await user.save();

            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            res.redirect("/confirmacion-envio");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await userRepository.findOne(email);
            if (!user) {
                return res.render("passwordcambio", { error: "Usuario no encontrado" });
            }

            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            const now = new Date();
            if (now > resetToken.expiresAt) {
                return res.redirect("/passwordcambio");
            }

            if (isValidPassword(password, user)) {
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();

            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }

    async cambiarRolPremium(req, res) {
        const { uid } = req.params;
        try {
            const user = await userRepository.findById(uid);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            const documentacionRequerida = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
            const userDocuments = user.documents.map(doc => doc.name);
            const tieneDocumentacion = documentacionRequerida.every(doc => userDocuments.includes(doc));

            if (!tieneDocumentacion) {
                return res.status(400).send("El usuario tiene que completar toda la documentacion requerida.");
            }

            const nuevoRol = user.role === "usuario" ? "premium" : "usuario";
            user.role = nuevoRol;
            await userRepository.save(user);

            res.send(nuevoRol);
        } catch (error) {
            res.status(500).send("Error del servidor.");
        }
    }

    async uploadDocuments(req, res) {
        const { uid } = req.params;
        const uploadedDocuments = req.files;

        try {
            const user = await userRepository.findById(uid);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            if (uploadedDocuments) {
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }

                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }

                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
            }

            await user.save();

            res.status(200).send("Documentos cargados exitosamente");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }


    // obtener página de administración
    async getAdminPage(req, res) {
        try {
            const users = await UserModel.find({}, 'first_name last_name email role').lean();
            res.render("admin", { users: users });
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            res.status(500).send("Error interno del servidor");
        }
    }


    // Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({}, 'first_name last_name email role');
            res.status(200).json(users);
        } catch (error) {
            console.error("Error al obtener usuarios", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Actualizar rol de usuario
    async updateUserRole(req, res) {
        const { userId } = req.params;
        const { role } = req.body;

        try {
            if (!['usuario', 'premium', 'admin'].includes(role)) {
                return res.status(400).json({ error: "Rol no válido" });
            }

            const user = await UserModel.findByIdAndUpdate(userId, { role }, { new: true });

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json({ message: "Rol actualizado con éxito", user });
        } catch (error) {
            console.error("Error al actualizar rol de usuario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Eliminar usuario
    async deleteUser(req, res) {
        const { userId } = req.params;

        try {
            const user = await UserModel.findByIdAndDelete(userId);

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json({ message: "Usuario eliminado con éxito" });
        } catch (error) {
            console.error("Error al eliminar usuario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Eliminar usuarios inactivos
    async deleteInactiveUsers(req, res) {
        try {
            const inactivePeriod = 5 * 60 * 1000; // 5 minutos en milisegundos
            const cutoffDate = new Date(Date.now() - inactivePeriod);

            console.log("Buscando usuarios inactivos antes de:", cutoffDate);

            const inactiveUsers = await userRepository.findInactiveUsers(cutoffDate);

            console.log("Usuarios inactivos encontrados:", inactiveUsers);

            for (const user of inactiveUsers) {
                await emailManager.sendInactivityEmail(user.email, user.first_name);
                await UserModel.deleteOne({ _id: user._id });
                console.log(`Usuario ${user.email} eliminado por inactividad.`);
            }

            res.status(200).json({ message: "Usuarios inactivos eliminados y notificados con éxito" });
        } catch (error) {
            console.error("Error al eliminar usuarios inactivos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

}


module.exports = UserController;