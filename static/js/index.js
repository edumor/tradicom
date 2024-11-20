
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


/* este script maneja el menú desplegable dropdown */

document.addEventListener('DOMContentLoaded', function() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.addEventListener('click', function() {
            var menu = this.querySelector('.dropdown-menu');
            menu.classList.toggle('show');
        });
    }

    document.addEventListener('click', function(event) {
        var isClickInside = dropdownMenu.contains(event.target);
        if (!isClickInside) {
            document.querySelector('.dropdown-menu').classList.remove('show');
        }
    });
});



/* este script maneja el menú de navegación fijo */


window.addEventListener('scroll', function() {
  var navbar = document.getElementById('navbar');
  var videoSection = document.getElementById('arriba');
  var videoHeight = videoSection ? videoSection.offsetHeight : 0; // Verificar si videoSection existe antes de obtener su altura

  if (window.scrollY >= videoHeight) {
      navbar.classList.add('fixed-top');
  } else {
      navbar.classList.remove('fixed-top');
  }
});


document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video_inicial');
    if (video) {
        video.classList.add('zoom');
    }
});


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
            } catch (error) {
                console.error('Error:', error);
            }
        });

        document.getElementById('closeButton').addEventListener('click', () => {
            contactForm.reset();
        });
    } else {
        console.error('contactForm element not found');
    }
});


/* este script maneja el carrusel de productos */

$(document).ready(function(){
    $('#myCarousel').carousel({
      interval: 1000, // Intervalo de tiempo en milisegundos
      ride: 'carousel'
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video-container-t');
    if (video) {
        video.playbackRate =552.0; // Cambia el valor a la velocidad deseada
    }
});

$(document).ready(function() {
    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/send_email',
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                $('#messageContent').text(response.message);
                $('#messageBox').show();
            },
            error: function(xhr, status, error) {
                $('#messageContent').text('Error al enviar el correo: ' + error);
                $('#messageBox').show();
            }
        });
    });
});

document.getElementById('contactForm').addEventListener('submit', async function(event) {
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
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('messageContent').innerText = 'Error al enviar el correo: ' + error.message;
        document.getElementById('messageBox').style.display = 'block';
    }
});

function closeMessageBox() {
    document.getElementById('messageBox').style.display = 'none';
    document.getElementById('contactForm').reset();
}

document.getElementById('closeButton').addEventListener('click', closeMessageBox);

function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    fetch('/send_email', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response received:', response);
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        document.getElementById('messageContent').innerText = data.message;
        document.getElementById('messageBox').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('messageContent').innerText = 'Error al enviar el mensaje.';
        document.getElementById('messageBox').style.display = 'block';
    });
}

function closeMessageBox() {
    document.getElementById('messageBox').style.display = 'none';
    
    // Resetea los inputs del formulario de contacto
    const form = document.getElementById('contactForm'); // Asegúrate de que el formulario tenga este ID
    if (form) {
        form.reset();
    }
}