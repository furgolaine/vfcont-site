// Funcionalidades do site VF Contabilidade

// Inicialização do Google Maps
function initMap() {
    const escritorio = { lat: -20.3155, lng: -40.2925 }; // Coordenadas aproximadas de Vila Velha, ES
    
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
                const response = await fetch('http://localhost:3000/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, telefone })
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
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
            const whatsappNumber = '5527991227720'; // Número do WhatsApp
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

// Função para mostrar a calculadora de IR
function showCalculator() {
    // Criar modal da calculadora
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const calculatorContent = document.createElement('div');
    calculatorContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 15px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        color: #333;
    `;
    
    calculatorContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #D4A574; margin-bottom: 10px;">Calculadora de Imposto de Renda</h2>
            <p>Preencha os dados abaixo para calcular seu IR</p>
        </div>
        
        <form id="irCalculatorForm">
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Renda Bruta Anual (R$):</label>
                <input type="number" id="rendaBruta" step="0.01" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" required>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Deduções (R$):</label>
                <input type="number" id="deducoes" step="0.01" value="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Dependentes:</label>
                <input type="number" id="dependentes" value="0" min="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Contribuição Previdenciária (R$):</label>
                <input type="number" id="previdencia" step="0.01" value="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            
            <button type="submit" style="width: 100%; background: linear-gradient(135deg, #F4A261, #E76F51); color: #000; border: none; padding: 15px; border-radius: 25px; font-weight: 600; font-size: 16px; cursor: pointer; margin-bottom: 20px;">
                Calcular IR
            </button>
        </form>
        
        <div id="resultado" style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px; display: none;">
            <h3 style="color: #D4A574; margin-bottom: 15px;">Resultado do Cálculo</h3>
            <div id="resultadoContent"></div>
        </div>
        
        <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
    `;
    
    modal.appendChild(calculatorContent);
    document.body.appendChild(modal);
    
    // Adicionar funcionalidade de cálculo
    const irForm = document.getElementById('irCalculatorForm');
    irForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const rendaBruta = parseFloat(document.getElementById('rendaBruta').value) || 0;
        const deducoes = parseFloat(document.getElementById('deducoes').value) || 0;
        const dependentes = parseInt(document.getElementById('dependentes').value) || 0;
        const previdencia = parseFloat(document.getElementById('previdencia').value) || 0;

        try {
            const response = await fetch('http://localhost:3000/calculate-ir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rendaBruta, deducoes, dependentes, previdencia })
            });

            const data = await response.json();

            if (response.ok) {
                const resultadoDiv = document.getElementById('resultado');
                const resultadoContent = document.getElementById('resultadoContent');
                
                resultadoContent.innerHTML = `
                    <p><strong>Renda Bruta Anual:</strong> R$ ${rendaBruta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    <p><strong>Base de Cálculo:</strong> R$ ${parseFloat(data.baseCalculo).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    <p><strong>Imposto Devido:</strong> R$ ${parseFloat(data.impostoDevido).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    <p><strong>Alíquota Efetiva:</strong> ${rendaBruta > 0 ? ((parseFloat(data.impostoDevido) / rendaBruta) * 100).toFixed(2) : 0}%</p>
                    <hr style="margin: 15px 0;">
                    <p style="font-size: 12px; color: #666;">
                        * Cálculo aproximado baseado na tabela de 2024. Para cálculos precisos, consulte um contador.
                    </p>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        <strong>Precisa de ajuda profissional?</strong> Entre em contato conosco!
                    </p>
                `;
                
                resultadoDiv.style.display = 'block';
            } else {
                alert('Erro ao calcular IR: ' + data.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
        }
    });
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

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

