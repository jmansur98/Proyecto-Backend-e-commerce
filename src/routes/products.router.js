const express = require("express");
const routes = express.Router();

const ProductManager = require("../controllers/product-manager.db.js");
const router = require("./views.router");
const productManager = new ProductManager();

router.get("/favicon.ico", (req, res) => res.status(204).end());

// todos los productos
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // 3 prod. por página
        const page = parseInt(req.query.page) || 1; // page predeterminada 1
        const sort = req.query.sort === "desc" ? -1 : 1; // orden ascendente
        const query = req.query.query || ''; // búsqueda general

        const startIndex = (page - 1) * limit;

        let products;
        let totalProducts;

        if (query) {
            products = await productManager.getProductsByQuery(query, sort);
            totalProducts = products.length;
            products = products.slice(startIndex, startIndex + limit);
        } else {
            products = await productManager.getProducts(sort);
            totalProducts = products.length;
            products = products.slice(startIndex, startIndex + limit);
        }

        const totalPages = Math.ceil(totalProducts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        //objeto de respuesta con información de pagination
        const response = {
            status: "success",
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? "/api/products?page=${prevPage}" : null,
            nextLink: hasNextPage ? "/api/products?page=${nextPage}" : null
        };
        
        //renderizar la vista de productos con toda la info. 
        res.render("products", {
            pageTitle: "Productos",
            productos: products.map(product => ({
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status,
                stock: product.stock,
                category: product.category,
            })),
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({ status: 'error', error: "Error interno del servidor" });
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
