/**
 * L'Étoile Restaurant Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    function toggleMenu() {
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const scrollReveal = function () {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    scrollReveal();
    window.addEventListener('scroll', scrollReveal);

    // --- Dynamic Current Year for Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Form Submission & WhatsApp Automation ---
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Obtención de datos y trim
            const name = document.getElementById('name').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;

            // 2. Validación básica
            if (!name || !date || !time) {
                alert('Por favor, completa todos los campos requeridos para la reserva.');
                return;
            }

            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            // 3. Feedback Visual Inmediato
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirigiendo a WhatsApp...';
            btn.style.backgroundColor = '#25D366'; // WhatsApp Green
            btn.style.opacity = '0.9';
            btn.disabled = true;

            // 4. Automatización del Mensaje
            setTimeout(() => {
                const phone = "34600000000"; // Número real de WhatsApp
                const text = `¡Hola L'Étoile! Me gustaría confirmar una reserva.%0A%0A*Mis Datos:*%0A👤 Nombre: ${name}%0A📅 Fecha: ${date}%0A⏰ Hora: ${time}%0A👥 Personas: ${guests}%0A%0A¿Me confirmas disponibilidad?`;
                const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

                // Abrir wa.me en nueva pestaña
                window.open(whatsappUrl, '_blank');

                // Reset de Interfaz
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.opacity = '1';
                btn.disabled = false;
                bookingForm.reset();
            }, 1200); // Pequeño retraso para que el usuario vea el feedback
        });
    }

    // --- API Integration: Fetch and Render Details ---
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
                        
                        <div style="display:flex; gap:1rem; margin-top:2rem;">
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
    
    // Ejecutar si estamos en detalle.html
    fetchAndRenderDetail();

    // --- API Integration: Fetch and Render Menu ---
    const fetchAndRenderMenu = async () => {
        const menuGrid = document.querySelector('.menu-grid');
        if (!menuGrid) return;
        
        try {
            // Loading State Clean UX
            menuGrid.innerHTML = '<div style="text-align:center; grid-column: 1/-1; padding: 4rem;"><i class="fas fa-circle-notch fa-spin fa-2x text-primary" style="margin-bottom:1rem;"></i><p>Preparando nuestro exquisito menú...</p></div>';
            
            const response = await fetch('http://localhost:5000/api/menu');
            if (!response.ok) throw new Error('Network error');
            const menuItems = await response.json();
            
            menuGrid.innerHTML = ''; // Clean Grid
            
            // Render Dynamic Cards
            menuItems.forEach((item, index) => {
                const delayClass = index === 0 ? '' : `reveal--delay-${(index % 3)}`;
                const card = document.createElement('div');
                card.className = `menu-card reveal ${delayClass} active`;
                card.innerHTML = `
                    <div class="menu-card__image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <div class="menu-card__price">$${item.price}</div>
                    </div>
                    <div class="menu-card__content">
                        <h3 class="menu-card__title">${item.name}</h3>
                        <p class="menu-card__desc">${item.description}</p>
                        <a href="/detalle?id=${item._id}" class="btn btn--outline mt-2" style="font-size: 0.8rem; padding: 0.4rem 1rem;">Ver Detalles</a>
                    </div>
                `;
                menuGrid.appendChild(card);
            });
        } catch (error) {
            console.error('API Error:', error);
            // Fallback UX in case Backend is down (or gracefully degraded)
            menuGrid.innerHTML = '<div style="text-align:center; grid-column: 1/-1; color: #ff4d4d;"><i class="fas fa-exclamation-triangle fa-2x" style="margin-bottom:1rem;"></i><p>Error de conexión con el menú dinámico. Por favor, intenta más tarde.</p></div>';
        }
    };

    fetchAndRenderMenu();

    // --- Basic Tracking & SEO Events (Simulation) ---
    document.querySelectorAll('.track-reserva').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log("📈 Evento: reserva_click -> El usuario hizo clic en CTA de reserva.");
            // Ejemplo de Google Analytics:
            // if(typeof gtag === 'function') gtag('event', 'click_reserva', {'event_category': 'CTA'});
        });
    });

    document.querySelectorAll('.track-whatsapp').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log("📈 Evento: whatsapp_click -> El usuario hizo clic en el botón flotante de WhatsApp.");
        });
    });

    // --- Language Toggle Logic ---
    const translations = {
        en: {
            '.nav__list .nav__item:nth-child(1) .nav__link': 'Home',
            '.nav__list .nav__item:nth-child(2) .nav__link': 'Menu',
            '.nav__list .nav__item:nth-child(3) .nav__link': 'About',
            '.nav__list .nav__item:nth-child(4) .nav__link': 'Experience',
            '.header__actions .track-reserva': 'Book Table',
            '.mobile-nav__list .mobile-nav__item:nth-child(2) .mobile-nav__link': 'Home',
            '.mobile-nav__list .mobile-nav__item:nth-child(3) .mobile-nav__link': 'Menu',
            '.mobile-nav__list .mobile-nav__item:nth-child(4) .mobile-nav__link': 'About',
            '.mobile-nav__list .mobile-nav__item:nth-child(5) .mobile-nav__link': 'Experience',
            '.mobile-nav__list .track-reserva': 'Book Table',
            '.hero__subtitle': 'Haute Cuisine',
            '.hero__title': 'An extraordinary journey<br>for your senses',
            '.hero__text': 'Discover the perfect fusion of signature cuisine and an unforgettable atmosphere in the heart of the city.',
            '.hero__offer p strong': 'Book today and receive a welcome drink',
            '.hero__offer small': '⚠️ Only 10 tables available per night',
            '.hero__cta-group .btn--primary': 'Book my table now',
            '.hero__cta-group .btn--outline': 'View Menu',
            '#menu .section-subtitle': 'Our Selection',
            '#menu .section-title': 'Featured Menu',
            '.menu-card:nth-child(1) .menu-card__title': 'Filet Mignon Medallions',
            '.menu-card:nth-child(1) .menu-card__desc': 'Premium cut accompanied by truffle puree, roasted asparagus, and red wine reduction.',
            '.menu-card:nth-child(2) .menu-card__title': 'Miso Glazed Salmon',
            '.menu-card:nth-child(2) .menu-card__desc': 'Fresh salmon with sesame crust, served over a wok of crispy organic vegetables.',
            '.menu-card:nth-child(3) .menu-card__title': 'Wild Mushroom Risotto',
            '.menu-card:nth-child(3) .menu-card__desc': 'Creamy arborio rice with a variety of seasonal mushrooms, parmigiano reggiano, and truffle oil.',
            '#menu .btn--outline': 'View Full Menu',
            '.about__text': 'Years of<br>Excellence',
            '#about .section-subtitle': 'Our History',
            '#about .section-title': 'Passion and Tradition in Every Detail',
            '.about__desc': "Founded in 2008, L'Étoile was born from Chef Jean Paul's vision to create a space where impeccable culinary technique meets the finest local and seasonal ingredients.",
            '.feature:nth-child(1) .feature__title': 'Local Ingredients',
            '.feature:nth-child(1) .feature__desc': 'We work directly with regional farmers ensuring absolute freshness.',
            '.feature:nth-child(2) .feature__title': 'Award-winning Quality',
            '.feature:nth-child(2) .feature__desc': 'Consecutively recognized by internationally prestigious gastronomic guides.',
            '#gallery .section-subtitle': 'Atmosphere',
            '#gallery .section-title': "The L'Étoile Experience",
            '.testimonials .section-subtitle': 'Testimonials',
            '.testimonials .section-title': 'What our clients say',
            '.testimonials-grid .testimonial-card:nth-child(1) .testimonial-card__text': '"An absolutely sublime experience. Every dish was perfectly executed. The atmosphere is intimate and elegant."',
            '.testimonials-grid .testimonial-card:nth-child(1) .author-info span': 'Gastronomic Guide',
            '.testimonials-grid .testimonial-card:nth-child(2) .testimonial-card__text': '"We celebrated our anniversary here and it was unforgettable. The service is impeccable and the mushroom risotto is out of this world."',
            '.testimonials-grid .testimonial-card:nth-child(2) .author-info span': 'Frequent Client',
            '.testimonials-grid .testimonial-card:nth-child(3) .testimonial-card__text': '"The wine list is exceptional and pairs perfectly with the chef\'s proposal. Highly recommended."',
            '.testimonials-grid .testimonial-card:nth-child(3) .author-info span': 'Wine Critic',
            '#reservations .section-subtitle': 'Secure your table',
            '#reservations .section-title': 'Make your Reservation',
            'label[for="name"]': 'Full Name',
            'label[for="date"]': 'Date',
            'label[for="time"]': 'Time',
            '#time option:nth-child(1)': 'Select',
            'label[for="guests"]': 'Number of People',
            '#guests option:nth-child(1)': '1 Person',
            '#guests option:nth-child(2)': '2 People',
            '#guests option:nth-child(3)': '3 People',
            '#guests option:nth-child(4)': '4 People',
            '#guests option:nth-child(5)': '5 People',
            '#guests option:nth-child(6)': '6 or more People',
            '#bookingForm button[type="submit"]': 'Request Table',
            '.form-note': 'Prefer immediate attention? <br><a href="https://wa.me/34600000000" target="_blank"><i class="fab fa-whatsapp"></i> Book via WhatsApp</a>',
            '.location-info h3': 'Contact Information',
            '.location-info h4': 'Opening Hours',
            '.hours-list li:nth-child(1) span:nth-child(1)': 'Mon - Thu:',
            '.hours-list li:nth-child(2) span:nth-child(1)': 'Fri - Sat:',
            '.hours-list li:nth-child(3) span:nth-child(1)': 'Sunday:',
            '.hours-list li:nth-child(3) span:nth-child(2)': 'Closed',
            '.footer__desc': 'Elevating the standard of haute cuisine with exquisite ingredients and unmatched service.',
            '.footer__links h4': 'Navigation',
            '.footer__links ul li:nth-child(1) a': 'Home',
            '.footer__links ul li:nth-child(2) a': 'Menu',
            '.footer__links ul li:nth-child(3) a': 'About',
            '.footer__links ul li:nth-child(4) a': 'Reservations',
            '.footer__social h4': 'Follow Us',
            '.footer__bottom p': '&copy; <span id="currentYear"></span> L\'Étoile Restaurant. All rights reserved.',
            '.footer__bottom-links a:nth-child(1)': 'Privacy Policy',
            '.footer__bottom-links a:nth-child(2)': 'Legal Notice'
        },
        es: {}
    };

    let currentLang = 'es';
    const langToggles = document.querySelectorAll('.lang-toggle');
    
    if (Object.keys(translations.es).length === 0) {
        for (let selector in translations.en) {
            const el = document.querySelector(selector);
            if (el) translations.es[selector] = el.innerHTML;
        }
    }

    function changeLanguage(lang) {
        currentLang = lang;
        const dict = translations[lang];
        for (let selector in dict) {
            const el = document.querySelector(selector);
            if (el) el.innerHTML = dict[selector];
        }
        langToggles.forEach(btn => btn.textContent = lang === 'es' ? 'EN' : 'ES');
        document.documentElement.lang = lang;
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }

    langToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            changeLanguage(currentLang === 'es' ? 'en' : 'es');
        });
    });
});
