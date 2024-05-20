const CartModel = require("../models/cart.model.js");

class CartRepository {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    async obtenerProductosDelCarrito(idCarrito) {
        try {
            const carrito = await CartModel.findById(idCarrito).populate('products.product');
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return carrito;
        } catch (error) {
            throw new Error("Error");
        }
    }

    async agregarProducto(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.obtenerProductosDelCarrito(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity })
            } 

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {   
            throw new Error("Error");
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error("No se pudo encontrar el carrito");
            }
            carrito.products = carrito.products.filter(item => item.product.toString() !== productId);
            await carrito.save();
            const carritoActualizado = await CartModel.findById(cartId).populate('products.product'); 
            return carritoActualizado;
            } catch (error) {
            throw new Error("Error al eliminar el producto del carrito");
        }
    }

    async actualizarProductoDelCarrito(cartId, updatedProducts) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error("No se pudo encontrar el carrito");
            }
            carrito.products = updatedProducts;
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            throw new Error("Error al actualizar los productos del carrito");
        }
    }

    async actualizarCantidadesEnCarrito(cartId, productId, newQuantity) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                throw new Error("No se pudo encontrar el carrito");
            }
            const productoIndex = carrito.products.findIndex(item => item.product._id.toString() === productId);
            if (productoIndex !== -1) {
                carrito.products[productoIndex].quantity = newQuantity;
            }
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito");
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const carrito = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
            if (!carrito) {
                throw new Error("No existe carrito");
            }
            return carrito;
        } catch (error) {
            throw new Error("Error al vaciar el carrito");
        }
    }
}

module.exports = CartRepository;
