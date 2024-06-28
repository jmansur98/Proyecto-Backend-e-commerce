const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const upload = require("../middleware/multer.js")
const checkUserRole = require("../middleware/checkrole.js")

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.cambiarRolPremium);
router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), userController.uploadDocuments);

// Nuevas rutas
router.get('/admin', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), userController.getAdminPage);
router.get('/users/admin', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), userController.getAllUsers);
router.put('/:userId/role', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), userController.updateUserRole);
router.delete('/:userId', passport.authenticate('jwt', { session: false }), checkUserRole(['admin']), userController.deleteUser);



module.exports = router;
