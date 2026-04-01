/**
 * L'Étoile Restaurant - Detalle Script
 */
document.addEventListener('DOMContentLoaded', () => {

    const fetchAndRenderDetail = async () => {
        const detailWrapper = document.getElementById('detail-wrapper');
        if (!detailWrapper) return;

        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');

        if (!itemId) {
            detailWrapper.innerHTML = '<div style="text-align:center;"><h2 style="color:#ff4d4d">Plato no encontrado</h2><a href="index.html" class="btn btn--primary mt-2">Regresar al Inicio</a></div>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/menu/${itemId}`);
            if (!response.ok) throw new Error('Plato no encontrado en el servidor');

            const item = await response.json();

            // Render the Dynamic Detail Page
            detailWrapper.innerHTML = `
                <div class="detail-grid reveal active">
                    <div class="detail-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="detail-content">
                        <span class="detail-category">${item.category}</span>
                        <h1>${item.name}</h1>
                        <div class="detail-price">$${item.price}</div>
                        <p class="detail-description">${item.description}</p>
                        
                        <div class="detail-buttons">
                            <a href="index.html#reservations" class="btn btn--primary"><i class="fas fa-calendar-check"></i> Reservar Mesa</a>
                            <a href="https://wa.me/34600000000?text=Hola,%20me%20interesa%20el%20plato:%20${encodeURIComponent(item.name)}" target="_blank" class="btn btn--outline"><i class="fab fa-whatsapp"></i> Preguntar</a>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(error);
            detailWrapper.innerHTML = '<div style="text-align:center;"><h2 style="color:#ff4d4d">Error de conexión</h2><a href="index.html" class="btn btn--primary mt-2">Regresar al Inicio</a></div>';
        }
    };

    fetchAndRenderDetail();
});
