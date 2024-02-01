const express = require("express");
const app = express();
const PORT = 8080;

const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/productos.json");

const CartManager = require("./controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carts.json");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();

        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

app.get("/api/products/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const producto = await productManager.getProductById(parseInt(id));
        if (!producto) {
            res.json({
                error: "Producto no encontrado"
            });
        } else {
            res.json(producto);
        }

    } catch (error) {
        console.log("Error al obtener el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

app.post("/api/products", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({message: "Producto agregado exitosamente"});
    } catch (error) {
        console.log("error al agregar un producto ", error);
        res.status(500).json({error: "error del servidor, vamos a morir"});
    }
});

app.put("/api/products/:pid", async (req, res) => {
    let id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(parseInt(id), productoActualizado);
        res.json({message: "Producto actualizado correctamente"});
    } catch (error) {
        console.log("No pudimos actualizar el producto, ANALIZAR ERROR", error); 
        res.status(500).json({error: "Error server"});
    }
});

app.delete("/api/products/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.log("Error al eliminar el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});   

app.post("/api/cart", async (req, res) => {
    const nuevoCarrito = req.body;

    try {
        console.log(nuevoCarrito);
        await cartManager.createCart(nuevoCarrito);
        res.status(201).json({message: "Carrito creado exitosamente"});
    } catch (error) {
        console.log("error al crear un carrito ", error);
        res.status(500).json({error: "error del servidor, vamos a morir"});
    }
});

app.post("/api/cart/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        await cartManager.addProductCart(cartId, productId, quantity);
        res.status(201).json({ message: "Producto agregado al carrito exitosamente" });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error del servidor al agregar producto al carrito" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto localhost:${PORT}`);
});
