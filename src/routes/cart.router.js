const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartController = new CartController();

router.use(authMiddleware);

router.post("/", cartController.nuevocarrito);
router.get("/:cid", cartController.obtenerProductosDeCarrito);
router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito);
router.delete('/:cid/product/:pid', cartController.eliminarProductoDeCarrito);
router.put('/:cid', cartController.actualizarProductoEnCarrito);
router.put('/:cid/product/:pid', cartController.actualizarCantidades);
router.delete('/:cid', cartController.vaciarCarrito);
router.post('/:cid/purchase', cartController.finalizarCompra);


module.exports = router;