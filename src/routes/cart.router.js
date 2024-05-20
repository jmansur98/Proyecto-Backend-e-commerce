const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartController = new CartController();

router.use(authMiddleware);


router.post("/", cartController.nuevocarrito); //creamos un nuevo carrito
router.get("/:cid", cartController.obtenerProductosDeCarrito); //listamos los productos que pertenecen a determinado carrito. 
router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito); // Agregar productos a distintos carritos.
router.delete("/:cid/product/:pid", cartController.eliminarProductoDeCarrito);
router.put("/:cid", cartController.actualizarProductoEnCarrito); //actualizamos el PRODUCTO carrito.
router.put("/:cid/product/:pid", cartController.actualizarCantidades); //actualizamos la CANTIDAD del PRODUCTO carrito.
router.delete("/:cid", cartController.vaciarCarrito); //vaciamos el carrito.
router.post('/:cid/purchase', cartController.finalizarCompra);

module.exports = router;