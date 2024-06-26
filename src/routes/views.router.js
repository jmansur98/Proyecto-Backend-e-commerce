const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");

 

router.get("/products", checkUserRole(['usuario', 'premium']), passport.authenticate('jwt', { session: false }), viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin', 'premium']), passport.authenticate('jwt', { session: false }), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario', 'premium']), viewsController.renderChat);
router.get("/", viewsController.renderHome);
router.get("/reset-password", viewsController.renderResetPassword);
router.get("/passwordchange", viewsController.renderCambioPassword);
router.get("/confirmacion-envio", viewsController.renderConfirmacion);
router.get("/panel-premium", checkUserRole(['admin', 'premium']), passport.authenticate('jwt', { session: false }), viewsController.renderPanelPremium);



module.exports = router;
    