const ProductModel = require("../models/product.model");
const mongoose = require("mongoose"); 


class ProductManager {
    async addProduct({title,description,price,img,code,stock,category,thumbnail}){
        try{
            if(!title|| !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return; 
            }
            
            const existeProducto = await ProductModel.findOne({code: code});

            if(existeProducto) {
                console.log("El código debe ser unico");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                 status: true,
                thumbnail: thumbnail || [] 
            });

            await newProduct.save();
        } catch (error) {
            console.log("Error al agregar producto");
            throw error;
        }
    }

    async getProducts(sort) {
        try {
            const products = await ProductModel.find().sort({ price: sort });
            return products;
        } catch (error) {
            console.log("Error al obtener productos");
            throw error;
        }
    }
    
    async getProductsByQuery(query, sort) {
        try {
            const products = await ProductModel.find({ category: query }).sort({ price: sort });
            return products;
        } catch (error) {
            console.log("Error al obtener productos por consulta", error);
            throw error;
        }
    }

    async getProductById(id) {
          
        try {
            
            const producto = await ProductModel.findById(id);
            if(!producto) {
                console.log("Producto no encontrado.");
                return null; 
            }
            return producto;
        } catch (error) {
            console.log("Error al recuperar producto por ID", error); 
            throw error; 
        }
    }

    async updateProduct (id, productoActualizado){
        try{
            const updateProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if (!updateProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto actualizado correctamente");
            return updateProduct;
        }
        catch (error) {
            console.log("Error al actualizar producto", error);
            throw error;
        }   
    }

    async deleteProduct(id){
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            if (!deleteProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto eliminado correctamente");
            return deleteProduct;
        } catch (error) {
            console.log("Error al eliminar producto", error);
            throw error;
        }   
    }
}
    
module.exports = ProductManager;