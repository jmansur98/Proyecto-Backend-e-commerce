const express = require('express');
const router = express.Router();
const CartManager = require('../controllers/cartManager');

const cartManager = new CartManager('./src/models/carts.json');

router.post('/', async (req, res) => {
    try {
        const { products } = req.body;
        await cartManager.createCart({ products });
        res.status(201).json({ message: 'Carrito creado exitosamente' });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: 'Error del servidor al crear carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartProducts = await cartManager.getCartProducts(cartId);
        res.status(200).json({ products: cartProducts });
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ error: 'Error del servidor al obtener productos del carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: 'Producto agregado al carrito exitosamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error del servidor al agregar producto al carrito' });
    }
});

module.exports = router;
