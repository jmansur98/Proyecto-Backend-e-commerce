const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart({ products }) {
        try {
            const arrayCarritos = await this.leerArchivo();
            const newCartId = arrayCarritos.length > 0 ? arrayCarritos[arrayCarritos.length - 1].id + 1 : 1;
            const newCart = { id: newCartId, products: products || [] };
            arrayCarritos.push(newCart);
            await this.guardarArchivo(arrayCarritos);
        } catch (error) {
            throw error;
        }
    }

    async getCartProducts(cartId) {
        try {
            const arrayCarritos = await this.leerArchivo();
            const cart = arrayCarritos.find(cart => cart.id === parseInt(cartId));
            return cart ? cart.products : [];
        } catch (error) {
            throw error;
        }
    }

    async addProductCart(cartId, productId, quantity) {
      try {
          const arrayCarritos = await this.leerArchivo();
          const cartIndex = arrayCarritos.findIndex(cart => cart.id === parseInt(cartId));
          if (cartIndex !== -1) {
              const cart = arrayCarritos[cartIndex];
              const existingProduct = cart.products.find(product => product.id === parseInt(productId));
              if (existingProduct) {
                  existingProduct.quantity += parseInt(quantity);
              } else {
                  cart.products.push({ id: parseInt(productId), quantity: parseInt(quantity) });
              }
              await this.guardarArchivo(arrayCarritos);
          }
      } catch (error) {
          throw error;
      }
  }
  

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayCarritos = JSON.parse(respuesta);
            return arrayCarritos;
        } catch (error) {
            throw error;
        }
    }

    async guardarArchivo(arrayCarritos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayCarritos, null, 2));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartManager;
