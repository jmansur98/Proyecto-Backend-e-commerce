const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository(); // instancia 

class CartController {
    async nuevocarrito(req, res) {
        try {
            const nuevoCarrito = await cartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error al crear el carrito");
        }
    }

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await cartRepository.obtenerProductosDelCarrito(carritoId);
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
            await cartRepository.agregarProducto(cartId, productId, quantity);

            res.send("Producto Agregado");
        
        } catch (error) {
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
            // Obtener el carrito y sus productos
            const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;

            // Inicializar un arreglo para almacenar los productos no disponibles
            const productosNoDisponibles = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ productosNoDisponibles });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = CartController;
