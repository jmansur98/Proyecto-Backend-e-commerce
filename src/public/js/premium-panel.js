document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

     document.getElementById('productForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const productData = {};
        formData.forEach((value, key) => {
            productData[key] = value;
        });
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        if (response.ok) {
            event.target.reset();
        }
    });

    socket.on('productos', (productos) => {
        const productList = document.getElementById('userProductsList');
        productList.innerHTML = ''; 
        productos.forEach(product => {
            const newItem = document.createElement('li');
            newItem.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <form class="deleteForm" data-product-id="${product._id}">
                    <button type="button" class="deleteButton">Eliminar</button>
                </form>
            `;
            productList.appendChild(newItem);
        });
    });

    document.getElementById('userProductsList').addEventListener('click', async (event) => {
        if (event.target.classList.contains('deleteButton')) {
            const productId = event.target.parentElement.dataset.productId;
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                event.target.parentElement.parentElement.remove();
            }
        }
    });

    socket.on('productos', (productos) => {
        const productList = document.getElementById('userProductsList');
        productList.innerHTML = '';
        productos.forEach(product => {
            const newItem = document.createElement('li');
            newItem.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <form class="deleteForm" data-product-id="${product._id}">
                    <button type="button" class="deleteButton">Eliminar</button>
                </form>
            `;
            productList.appendChild(newItem);
        });
    });
});
