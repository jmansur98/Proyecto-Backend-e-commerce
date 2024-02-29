const express = require("express");
const routes = express.Router();

const ProductManager = require("../controllers/product-manager.db.js");
const router = require("./views.router");
const productManager = new ProductManager();


//Obtener todos los productos
router.get("/", async (req, res) => {
        try{
            const limit = req.query.limit;
            const products = await productManager.getProducts();
            if (limit) {
                res.json(products.slice(0, limit));
            } else {
                res.json(products);
            }   
        } catch (error){
            console.error("Error al obtener productos", error);
            res.status(500).json({error: "Error interno del servidor"});
        }
});

//Obtener producto por id
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(id); 
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});



//Agregar producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//Actualizar producto por id
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado);
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


//Eliminar producto por id
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


module.exports = router;
