const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartutilis.js");
const EmailManager = require("../service/email.js");
const emailManager = new EmailManager();



class CartController {
    async nuevocarrito(req, res) {
        try {
            const nuevoCarrito = await cartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            console.error("Error al crear el carrito", error);
            res.status(500).send("Error al crear el carrito");
        }
    }
        

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await cartRepository.obtenerProductosDeCarrito(carritoId);
            if (!productos) {
                return res.status(404).send("Carrito no encontrado");
            }
            res.json(productos);
        } catch (error) {
            res.status(500).send("Error al obtener los productos del carrito");
        }
    }

    async agregarProductoEnCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;   
        try {
            const producto = await productRepository.obtenerProductoPorId(productId);

            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            if (req.user.role === 'premium' && producto.owner === req.user.email) {
                return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
            }
            await cartRepository.agregarProducto(cartId, productId, quantity);
            const carritoID = (req.user.cart).toString();

            res.redirect(`/carts/${carritoID}`)
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error); 
            res.status(500).send("Error al agregar el producto al carrito"); 
        }
    }

      

    async eliminarProductoDeCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        try {
            const carrito = await cartRepository.eliminarProductoDelCarrito(cartId, productId);
            res.json({
                status: "success",
                message: "Producto eliminado exitosamente",
                carrito
            });
        } catch (error) {
            res.status(500).send("Error al eliminar el producto del carrito");
        }
    }

    async actualizarProductoEnCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const carrito = await cartRepository.actualizarProductoDelCarrito(cartId, updatedProducts);
            res.json({
                status: "success",
                message: "Carrito actualizado exitosamente",
                carrito
            });
        } catch (error) {
            res.status(500).send("Error al actualizar el carrito");
        }
    }

    async actualizarCantidades(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const carrito = await cartRepository.actualizarCantidadesEnCarrito(cartId, productId, newQuantity);
            res.json({
                status: "success",
                message: "Cantidad del producto actualizada exitosamente",
                carrito
            });
        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad del producto en el carrito");
        }
    }

    async vaciarCarrito(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await cartRepository.vaciarCarrito(cartId);
            res.json({
                status: "success",
                message: "Carrito vaciado exitosamente",
                carrito
            });
        } catch (error) {
            res.status(500).send("Error al vaciar el carrito");
        }
    }

    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {

            const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;

            const productosNoDisponibles = [];

            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));
            await cart.save();


            await emailManager.enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id);


            res.render("checkout", {
                cliente: userWithCart.first_name,
                email: userWithCart.email,
                numTicket: ticket._id
            });
        } catch (error) {
            console.error('Error al procesar la compra:', error); 
            res.status(500).json({ error: 'Error al procesar la compra' }); 
        }
    }
}

    
module.exports = CartController;   
