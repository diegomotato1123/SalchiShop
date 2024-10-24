document.addEventListener('DOMContentLoaded', function () {
    const carritoBtn = document.getElementById('carrito-btn');
    const itemsCarrito = document.getElementById('items-carrito');
    const totalProductos = document.getElementById('total-productos');
    const totalPrecio = document.getElementById('total-precio');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const carritoContenido = document.getElementById('carrito-contenido');
    const productosContainer = document.getElementById('productos');
    const agregarProductoBtn = document.getElementById('agregar-producto');
    const nombreProductoInput = document.getElementById('nombre-producto');
    const precioProductoInput = document.getElementById('precio-producto');
    const imagenProductoInput = document.getElementById('imagen-producto');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    
    actualizarCarrito();

    carritoBtn.addEventListener('click', () => {
        carritoContenido.classList.toggle('hidden');
        if (carrito.length > 0) {
            alert('Comprado'); 
            carrito = []; 
            localStorage.removeItem('carrito'); 
            actualizarCarrito(); 
        }
    });

    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const productoId = card.dataset.id;
            const productoName = card.dataset.name;
            const productoPrice = Number(card.dataset.price);

            const productoEnCarrito = carrito.find(item => item.id === productoId);

            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({
                    id: productoId,
                    name: productoName,
                    price: productoPrice,
                    cantidad: 1
                });
            }

            actualizarCarrito();
        });
    });

    function actualizarCarrito() {
        itemsCarrito.innerHTML = '';
        let total = 0;
        let cantidadTotal = 0;

        carrito.forEach(producto => {
            const item = document.createElement('div');
            item.innerHTML = `
                ${producto.name} x${producto.cantidad} - $${producto.price * producto.cantidad}
                <button class="eliminar-item" data-id="${producto.id}">Eliminar</button>
            `;
            itemsCarrito.appendChild(item);

            total += producto.price * producto.cantidad;
            cantidadTotal += producto.cantidad;
        });

        totalProductos.textContent = cantidadTotal;
        totalPrecio.textContent = `$${total.toFixed(2)}`;

        localStorage.setItem('carrito', JSON.stringify(carrito));

        document.querySelectorAll('.eliminar-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const productoId = btn.dataset.id;
                carrito = carrito.filter(item => item.id !== productoId);
                actualizarCarrito();
            });
        });
    }

    vaciarCarritoBtn.addEventListener('click', () => {
        carrito = [];
        localStorage.removeItem('carrito');
        actualizarCarrito();
    });

    agregarProductoBtn.addEventListener('click', () => {
        const nombre = nombreProductoInput.value;
        const precio = parseFloat(precioProductoInput.value);
        const imagenFile = imagenProductoInput.files[0];

        if (nombre && !isNaN(precio) && imagenFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const nuevaCard = document.createElement('div');
                nuevaCard.classList.add('card');
                nuevaCard.dataset.id = Date.now().toString(); 
                nuevaCard.dataset.name = nombre;
                nuevaCard.dataset.price = precio;

                nuevaCard.innerHTML = `
                    <img src="${event.target.result}" alt="${nombre}">
                    <h2>${nombre}</h2>
                    <p>$${precio}</p>
                    <button class="btn-add">Agregar al carrito</button>
                `;

                productosContainer.appendChild(nuevaCard);

                nuevaCard.querySelector('.btn-add').addEventListener('click', () => {
                    carrito.push({
                        id: nuevaCard.dataset.id,
                        name: nombre,
                        price: precio,
                        cantidad: 1
                    });
                    actualizarCarrito();
                });

                nombreProductoInput.value = '';
                precioProductoInput.value = '';
                imagenProductoInput.value = '';
            };
            reader.readAsDataURL(imagenFile);
        } else {
            alert('Por favor completa todos los campos.');
        }
    });
});
