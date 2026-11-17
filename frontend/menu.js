/**
 * L'Étoile Restaurant - Menú Completo Script (Lazy Loading)
 */
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const fetchAndRenderFullMenu = async () => {
        const menuGrid = document.getElementById('full-menu-grid');
        if (!menuGrid) return;
        
        try {
            const response = await fetch('https://restaurant-landing-template.onrender.com/api/menu');
            if (!response.ok) throw new Error('Network error');
            const menuItems = await response.json();
            
            menuGrid.innerHTML = ''; // Clear loading spinner
            
            const observerOptions = {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            menuItems.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = `menu-card reveal`; // 'reveal' starts it hidden, observer adds 'active'
                card.innerHTML = `
                    <div class="menu-card__image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <div class="menu-card__price">$${item.price}</div>
                    </div>
                    <div class="menu-card__content">
                        <h3 class="menu-card__title">${item.name}</h3>
                        <p class="menu-card__desc">${item.description}</p>
                        <a href="/detalle.html?id=${item._id}" class="btn btn--outline mt-2" style="font-size: 0.8rem; padding: 0.4rem 1rem;">Ver Detalles</a>
                    </div>
                `;
                menuGrid.appendChild(card);
                observer.observe(card);
            });

        } catch (error) {
            console.error('API Error:', error);
            menuGrid.innerHTML = '<div style="text-align:center; grid-column: 1/-1; color: #ff4d4d;"><i class="fas fa-exclamation-triangle fa-2x" style="margin-bottom:1rem;"></i><p>Error cargando la carta. Por favor, intenta más tarde.</p></div>';
        }
    };

    fetchAndRenderFullMenu();
});
