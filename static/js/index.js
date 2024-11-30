// Evento para detectar el cambio de tamaño de la ventana
window.addEventListener('resize', function() {
    let width = window.innerWidth;
    if (width <= 480) {
        console.log("Estás usando un dispositivo móvil");
    } else if (width <= 768) {
        console.log("Estás usando una tableta");
    } else if (width <= 1200) {
        console.log("Estás usando una computadora de escritorio");
    } else {
        console.log("Estás usando una pantalla grande");
    }
});

// Llamada inicial al cargar la página
window.dispatchEvent(new Event('resize'));



/* Scripts para manejar el carrusel de imágenes en la página principal */

document.addEventListener('DOMContentLoaded', function() {
    const carouselImages = document.querySelectorAll('.carousel-image');
    const intervalTime = 600; // Tiempo en milisegundos entre transiciones
    let currentIndex = 0;

    function showNextImage() {
        carouselImages[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % carouselImages.length;
        carouselImages[currentIndex].classList.add('active');
    }

    setInterval(showNextImage, intervalTime);
});

/* Script para manejar el formulario de contacto */

document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/send_email', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                document.getElementById('messageContent').innerText = data.message;
                document.getElementById('messageBox').style.display = 'block';
                contactForm.reset();
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('messageContent').innerText = 'Error al enviar el correo.';
                document.getElementById('messageBox').style.display = 'block';
            }
        });

        document.getElementById('closeButton').addEventListener('click', () => {
            document.getElementById('messageBox').style.display = 'none';
        });
    } else {
        console.error('contactForm element not found');
    }
});