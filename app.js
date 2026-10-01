// CONFIGURACIÓN CENTRAL DEL COMERCIO CIBERNÉTICO
const CONFIG = {
    whatsappNumber: "56912345678", // Reemplaza con tu número sin el signo +
    currency: "USD"
};

// BASE DE DATOS DEL INVENTARIO MÓVIL
const products = [
    { id: "t800", name: "Infiltración T-800", price: 120, meta: "CARBON-PLA // LED ROJO 9V", type: "terminator", desc: "Acabado metalizado con texturas de desgaste bélico. Visor luminoso integrado." },
    { id: "yautja", name: "Bio-Máscara Yautja", price: 145, meta: "COMPUESTO COBRE // TRIPLE LÁSER", type: "predator", desc: "Diseño rugoso alienígena con réplica decorativa del clásico puntero de caza." },
    { id: "oni", name: "Cyber Oni V3", price: 99, meta: "PETG NEÓN // REACCIÓN UV", type: "oni", desc: "Inspiración cyberpunk oriental equipada con elementos fluorescentes." }
];

let cart = [];

// INYECTAR PRODUCTOS EN EL DOM
function renderProducts() {
    const container = document.getElementById('products-grid-container');
    container.innerHTML = '';
    
    products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container">
                <div class="scanline-effect"></div>
                <div class="mask-placeholder ${prod.type}"></div>
            </div>
            <div class="product-info">
                <div class="product-title">${prod.name}</div>
                <div class="product-meta">${prod.meta}</div>
                <p class="product-desc">${prod.desc}</p>
                <div class="product-price-row">
                    <span>$${prod.price}.00</span>
                </div>
                <button class="btn-action" onclick="addToCart('${prod.id}')">Cargar Módulo</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// LOGICA INTERNA DEL CARRITO
window.addToCart = function(id) {
    const prod = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...prod, quantity: 1 });
    }
    updateCartUI();
};

window.changeQuantity = function(id, amount) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCartUI();
};

function updateCartUI() {
    const container = document.getElementById('cart-container');
    const totalValue = document.getElementById('cart-total-value');
    const cartCount = document.getElementById('cart-count');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart-msg">SISTEMA VACÍO - ESPERANDO HARDWARE</div>';
        totalValue.innerText = '\$0.00';
        cartCount.innerText = '0';
        return;
    }

    container.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div><strong>${item.name}</strong><br>$${item.price} x ${item.quantity}</div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity('${item.id}', -1)">-</button>
                <button onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });

    totalValue.innerText = `$${total}.00`;
    cartCount.innerText = totalItems;
}

// PROCESAR COMPRA Y REDIRIGIR A WHATSAPP
window.executeTransaction = function() {
    if (cart.length === 0) {
        alert("ERROR: No se han detectado módulos en el terminal de carga.");
        return;
    }

    // Validar el formulario biométrico
    const opId = document.getElementById('op-id').value.trim();
    const opPhone = document.getElementById('op-phone').value.trim();
    const cranialSize = document.getElementById('cranial-size').value.trim();
    const harness = document.getElementById('harness-type').value;

    if (!opId || !opPhone || !cranialSize) {
        alert("CRÍTICO: Datos biométricos incompletos. Llena el formulario.");
        return;
    }

    // Construir Mensaje de Compra Militarizado
    let message = `🛰️ *CYBERMIND 3D - INFORME DE ADQUISICIÓN*\n`;
    message += `==============================\n\n`;
    message += `👤 *DATOS DEL OPERATIVO:*\n`;
    message += `• ID: ${opId}\n`;
    message += `• Enlace: ${opPhone}\n`;
    message += `• Cráneo: ${cranialSize} cm\n`;
    message += `• Anclaje: ${harness}\n\n`;
    
    message += `📦 *MÓDULOS SOLICITADOS:*\n`;
    let total = 0;
    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) -> $${item.price * item.quantity} USD\n`;
        total += item.price * item.quantity;
    });
    
    message += `\n💵 *TOTAL NETO:* $${total}.00 USD\n`;
    message += `==============================\n`;
    message += `⚙️ _Procesando manufactura aditiva..._`;

    // Redirección API
    const url = `https://whatsapp.com{CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};

// Inicialización de la pantalla al cargar
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
