


const BACKEND_URL = 'https://vfcont-site-production.up.railway.app';


function initMap() {
    const escritorio = { lat: -20.3155, lng: -40.2925 };
    
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: escritorio,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#38414e"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#212a37"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9ca5b3"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#17263c"}]
            }
        ]
    });

    const marker = new google.maps.Marker({
        position: escritorio,
        map: map,
        title: "VF Contabilidade",
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#D4A574" stroke="#F4A261" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#000">VF</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="color: #000; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #D4A574;">VF Contabilidade</h3>
                <p style="margin: 0; font-size: 14px;">Av. Jerônimo Monteiro, 688 - Loja B<br>Glória, Vila Velha - ES</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Segunda a Sexta: 08:00-18:00</p>
            </div>
        `
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}

// Manipulação do formulário de leads
document.addEventListener('DOMContentLoaded', function() {
    const leadForm = document.getElementById('leadForm');
    
    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(leadForm);
            const nome = formData.get('nome') || leadForm.querySelector('input[type="text"]').value;
            const email = formData.get('email') || leadForm.querySelector('input[type="email"]').value;
            const telefone = formData.get('telefone') || leadForm.querySelector('input[type="tel"]').value;
            
            // Validação básica
            if (!nome || !email || !telefone) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            try {
                const response = await fetch(`${BACKEND_URL}/leads`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, telefone })
                });

                const data = await response.json();

                if (response.ok) {
                    showCalculator();
                } else {
                    alert('Erro ao cadastrar lead: ' + data.error);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
            }
        });
    }
    
    // Botões de contato
    const contactButtons = document.querySelectorAll('.contact-btn, .contact-btn-hero');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const whatsappNumber = '552731912220'; // Número do WhatsApp
            const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços de contabilidade.');
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    });
    
    // Botão "Como Chegar?"
    const directionsBtn = document.querySelector('.directions-btn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            const address = encodeURIComponent('Av. Jerônimo Monteiro, 688 - Loja B, Glória, Vila Velha - ES');
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
            window.open(googleMapsUrl, '_blank');
        });
    }
});

// Smooth scroll para links internos
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Animações de entrada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animações aos elementos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.services-icons, .services-detailed, .calculator-section, .location-section');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});


