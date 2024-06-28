const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("productos", (data) => {
    renderProductos(data);
});


document.addEventListener("DOMContentLoaded", () => {
    const formSection = document.querySelector(".product-form");
    if (role === "admin" || role === "premium") {
        formSection.style.display = "block"; 
    } else {
        formSection.style.display = "none"; 
    }
});

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = ` 
            <p>${item.title}</p>
            <p>${item.price}</p>
            <button>Eliminar</button>
        `;

        contenedorProductos.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            if ((role === "premium" && item.owner === email) || role === "admin") {
                eliminarProducto(item._id);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No tienes permiso para borrar este producto.",
                });
            }
        });
    });
};

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    if (role !== "admin" && role !== "premium") {
        Swal.fire({
            title: "Error",
            text: "No tienes permiso para agregar productos.",
        });
        return;
    }

    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner: role === "premium" ? email : "admin"
    };

    socket.emit("agregarProducto", producto);
};
