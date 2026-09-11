/**
 * Grupo GH Strategy / GH Express - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initial Preloader / Splash Screen Fadeout & Hero Entrance Animation
  const preloader = document.getElementById('preloader');
  const heroCard = document.querySelector('.hero-card');

  let isPreloaderDismissed = false;
  const hidePreloader = () => {
    if (isPreloaderDismissed || !preloader) return;
    isPreloaderDismissed = true;
    preloader.classList.add('preloader-hidden');

    if (heroCard) {
      setTimeout(() => {
        heroCard.classList.add('hero-card-animate');
      }, 200);
    }
  };

  // Hide preloader when all assets finish loading
  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 400);
  });

  // Safety fallback (maximum 1.5s splash display)
  setTimeout(hidePreloader, 1500);

  // 1. Sticky Navbar Elevation on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Services Interactive Carousel Controls (Single Row)
  const track = document.getElementById('servicesTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = track.querySelectorAll('.service-card-v2');

    // Función para actualizar la visibilidad de las flechas detectando la posición visual real de las tarjetas
    const updateArrowVisibility = () => {
      if (!cards.length) return;

      const trackRect = track.getBoundingClientRect();
      const firstCardRect = cards[0].getBoundingClientRect();
      const lastCardRect = cards[cards.length - 1].getBoundingClientRect();

      // Ocultar flecha izquierda si la primera tarjeta está totalmente visible a la izquierda
      const isFirstFullyVisible = firstCardRect.left >= trackRect.left - 12 || track.scrollLeft <= 5;
      if (isFirstFullyVisible) {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
        prevBtn.style.visibility = 'hidden';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
        prevBtn.style.visibility = 'visible';
      }

      // Ocultar flecha derecha si la última tarjeta ya está totalmente visible dentro del contenedor
      const isLastFullyVisible = lastCardRect.right <= trackRect.right + 12 || (track.scrollWidth - track.scrollLeft - track.clientWidth) <= 10;
      if (isLastFullyVisible) {
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
        nextBtn.style.visibility = 'hidden';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
        nextBtn.style.visibility = 'visible';
      }
    };

    // Estado inicial de las flechas
    updateArrowVisibility();

    // Helper para obtener el desplazamiento exacto a cualquier tarjeta sin acumulaciones de error
    const getCardTargetScroll = (targetIndex) => {
      if (!cards[targetIndex]) return 0;
      return cards[targetIndex].offsetLeft - cards[0].offsetLeft;
    };

    // Helper para calcular el índice activo actual basándose en la posición real de las tarjetas
    const getActiveCardIndex = () => {
      const trackLeft = track.scrollLeft;
      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((_, idx) => {
        const targetScroll = getCardTargetScroll(idx);
        const distance = Math.abs(trackLeft - targetScroll);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });
      return closestIndex;
    };

    // Create pagination dots dynamically
    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        track.scrollTo({ left: getCardTargetScroll(index), behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    // Update active dot indicator and arrow visibility on scroll
    track.addEventListener('scroll', () => {
      const activeIndex = getActiveCardIndex();
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
      updateArrowVisibility();
    });

    // Previous Button click (Navega a la tarjeta anterior exacta)
    prevBtn.addEventListener('click', () => {
      const currentIndex = getActiveCardIndex();
      const prevIndex = Math.max(0, currentIndex - 1);
      track.scrollTo({ left: getCardTargetScroll(prevIndex), behavior: 'smooth' });
    });

    // Next Button click (Navega a la tarjeta siguiente exacta)
    nextBtn.addEventListener('click', () => {
      const currentIndex = getActiveCardIndex();
      const nextIndex = Math.min(cards.length - 1, currentIndex + 1);
      track.scrollTo({ left: getCardTargetScroll(nextIndex), behavior: 'smooth' });
    });

    // Recalcular visibilidad al cambiar tamaño de ventana
    window.addEventListener('resize', updateArrowVisibility);
  }

  // 4. Dynamic High-Contrast Map Zone Interactivity (#cobertura)
  const regionPills = document.querySelectorAll('.region-pill-btn');
  const mapZones = document.querySelectorAll('.map-zone');
  const concentricHubs = document.querySelectorAll('.concentric-hub');
  const routeArcs = document.querySelectorAll('.route-arc');
  const satelliteNodes = document.querySelectorAll('.satellite-node');

  if (regionPills.length > 0 && mapZones.length > 0) {
    regionPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const selectedZone = pill.getAttribute('data-zone');

        // Update active pill button state
        regionPills.forEach(btn => btn.classList.remove('active'));
        pill.classList.add('active');

        // Highlight selected zone in SVG map
        mapZones.forEach(zone => {
          if (zone.classList.contains(`zone-${selectedZone}`)) {
            zone.classList.add('active');
          } else {
            zone.classList.remove('active');
          }
        });

        // Highlight corresponding concentric hubs with white/cyan glow
        concentricHubs.forEach(hub => {
          if (hub.classList.contains(`node-${selectedZone}`)) {
            hub.classList.add('active');
          } else {
            hub.classList.remove('active');
          }
        });

        // Highlight route arcs touching the selected zone
        routeArcs.forEach(arc => {
          if (arc.classList.contains(`route-${selectedZone}`)) {
            arc.classList.add('active');
          } else {
            arc.classList.remove('active');
          }
        });

        // Highlight satellite nodes in selected zone
        satelliteNodes.forEach(sat => {
          if (sat.classList.contains(`node-${selectedZone}`)) {
            sat.classList.add('active-sat');
          } else {
            sat.classList.remove('active-sat');
          }
        });
      });
    });
  }

  /* ==========================================================================
     5. CONFIGURACIÓN Y CREDENCIALES OFICIALES DE EMAILJS (FORMULARIO DE COTIZACIÓN)
     ==========================================================================
     A continuación se encuentran las 3 credenciales oficiales de tu cuenta EmailJS:
     
     🔑 PUBLIC KEY:   '8ASele9YPLw4Re73X'  (Llave pública de tu cuenta de EmailJS)
     📧 SERVICE ID:   'service_vpbacc4'   (ID del servicio de Gmail vinculado)
     📄 TEMPLATE ID:  'template_8cl006p'  (ID de la plantilla creada en EmailJS)
     
     Mapeo exacto de las variables de tu plantilla {{...}}:
     - {{empresa}}  ➔ Nombre de la Empresa ingresado en el formulario
     - {{nombre}}   ➔ Nombre de Contacto ingresado en el formulario
     - {{telefono}} ➔ Teléfono / WhatsApp ingresado
     - {{email}}    ➔ Correo Electrónico ingresado
     - {{servicio}} ➔ Servicio Requerido seleccionado en el menú
     - {{tiempo}}   ➔ Fecha y hora exacta en que el usuario envió la solicitud
     ========================================================================== */

  // --- CREDENCIALES DE EMAILJS Y GOOGLE RECAPTCHA (CONFIGURADAS Y ACTIVAS) ---
  const EMAILJS_PUBLIC_KEY = '8ASele9YPLw4Re73X';  // <--- TU PUBLIC KEY DE EMAILJS
  const EMAILJS_SERVICE_ID = 'service_vpbacc4';   // <--- TU SERVICE ID DE GMAIL
  const EMAILJS_TEMPLATE_ID = 'template_8cl006p';  // <--- TU TEMPLATE ID DE EMAILJS

  // 🤖 Clave del Sitio de Google reCAPTCHA v2 Estándar (Casilla "No soy un robot") Oficial de Grupo GH Strategy
  const RECAPTCHA_SITE_KEY = '6LeQlogtAAAAANEN3AUWr4u9D_psbQSshSFAoNcZ';

  // Inicialización del SDK de EmailJS en el navegador
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // --- ELEMENTOS DOM DEL MODAL DE COTIZACIÓN ---
  const quoteModal = document.getElementById('quoteModal');
  const modalClose = document.getElementById('modalClose');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const quoteForm = document.getElementById('quoteForm');
  const toastNotification = document.getElementById('toastNotification');

  const openModal = (e) => {
    e.preventDefault();
    if (quoteModal) {
      quoteModal.classList.add('active');
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    }
  };

  const closeModal = () => {
    if (quoteModal) {
      quoteModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close quote modal when clicking on dark backdrop overlay
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });
  }

  // Quote Form Submission with EmailJS Integration & Live Indicators
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputEmpresa = document.getElementById('inputEmpresa');
      const inputContacto = document.getElementById('inputContacto');
      const inputTelefono = document.getElementById('inputTelefono');
      const inputEmail = document.getElementById('inputEmail');
      const selectServicio = document.getElementById('selectServicio');
      const submitBtn = quoteForm.querySelector('.btn-submit');

      const originalBtnText = submitBtn ? submitBtn.innerText : 'ENVIAR SOLICITUD';

      // Formatear Fecha y Hora de El Salvador para {{tiempo}}
      const now = new Date();
      const formattedTime = now.toLocaleDateString('es-SV', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('es-SV', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Obtener el objeto de reCAPTCHA (Enterprise o Estándar v2)
      const recaptchaObj = (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise) ? grecaptcha.enterprise : (typeof grecaptcha !== 'undefined' ? grecaptcha : null);
      const recaptchaToken = (recaptchaObj && typeof recaptchaObj.getResponse === 'function') ? recaptchaObj.getResponse() : '';

      // Exigir estrictamente que el usuario haya marcado la casilla "No soy un robot"
      if (!recaptchaToken) {
        alert('Por favor marca la casilla "No soy un robot" antes de enviar la solicitud.');
        return;
      }

      // Mapeo exacto de los campos de la plantilla de EmailJS + Token de reCAPTCHA
      const templateParams = {
        empresa: inputEmpresa ? inputEmpresa.value.trim() : '',
        nombre: inputContacto ? inputContacto.value.trim() : '',
        telefono: inputTelefono ? inputTelefono.value.trim() : '',
        email: inputEmail ? inputEmail.value.trim() : '',
        servicio: selectServicio && selectServicio.selectedIndex >= 0 ? selectServicio.options[selectServicio.selectedIndex].text : '',
        tiempo: formattedTime,
        'g-recaptcha-response': recaptchaToken
      };

      // Indicador de carga en el botón
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando solicitud...';
      }

      const handleSuccess = () => {
        closeModal();
        if (recaptchaObj && typeof recaptchaObj.reset === 'function') {
          try { recaptchaObj.reset(); } catch(e) {}
        }
        if (toastNotification) {
          toastNotification.innerText = '¡Gracias! Tu solicitud ha sido enviada con éxito a nuestro equipo.';
          toastNotification.classList.add('active');
          setTimeout(() => {
            toastNotification.classList.remove('active');
          }, 4500);
        }
        quoteForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      };

      const handleError = (error) => {
        console.error('Error enviando correo con EmailJS:', error);
        alert('Hubo un inconveniente al enviar la solicitud. Por favor intenta de nuevo o contáctanos a gh@grupoghstrategy.com');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      };

      // Verificar disponibilidad del SDK de EmailJS
      if (typeof emailjs === 'undefined') {
        handleError('EmailJS SDK no disponible');
        return;
      }

      // Envío de correo mediante EmailJS SDK
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          handleSuccess();
        })
        .catch((err) => {
          handleError(err);
        });
    });
  }

  // 6. Interactive Delivery Time Estimator Modal Logic
  const deliveryTimeModal = document.getElementById('deliveryTimeModal');
  const openDeliveryModalBtn = document.getElementById('openDeliveryModalBtn');
  const deliveryModalClose = document.getElementById('deliveryModalClose');
  const selectOrigen = document.getElementById('selectOrigen');
  const selectDestino = document.getElementById('selectDestino');
  const deliveryResultCard = document.getElementById('deliveryResultCard');

  // Classification of El Salvador's 14 departments into 3 zones
  const deptZoneMap = {
    'Ahuachapán': 'Occidente',
    'Santa Ana': 'Occidente',
    'Sonsonate': 'Occidente',
    'La Libertad': 'Central',
    'Chalatenango': 'Central',
    'San Salvador': 'Central',
    'Cuscatlán': 'Central',
    'La Paz': 'Central',
    'Cabañas': 'Central',
    'San Vicente': 'Central',
    'Usulután': 'Oriente',
    'San Miguel': 'Oriente',
    'Morazán': 'Oriente',
    'La Unión': 'Oriente'
  };

  const openDeliveryModal = () => {
    if (deliveryTimeModal) {
      deliveryTimeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDeliveryModal = () => {
    if (deliveryTimeModal) {
      deliveryTimeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (openDeliveryModalBtn) {
    openDeliveryModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDeliveryModal();
    });
  }

  if (deliveryModalClose) {
    deliveryModalClose.addEventListener('click', closeDeliveryModal);
  }

  if (deliveryTimeModal) {
    deliveryTimeModal.addEventListener('click', (e) => {
      if (e.target === deliveryTimeModal) {
        closeDeliveryModal();
      }
    });
  }

  // ESC key closes any active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (deliveryTimeModal && deliveryTimeModal.classList.contains('active')) {
        closeDeliveryModal();
      }
      if (quoteModal && quoteModal.classList.contains('active')) {
        closeModal();
      }
    }
  });

  // Calculate & Update Delivery Time Result Card
  function updateDeliveryEstimate() {
    if (!selectOrigen || !selectDestino || !deliveryResultCard) return;

    const origen = selectOrigen.value;
    const destino = selectDestino.value;

    if (!origen || !destino) {
      deliveryResultCard.className = 'delivery-result-card placeholder-state';
      deliveryResultCard.innerHTML = `
        <p class="result-prompt-text">Selecciona departamento de origen y destino para calcular el tiempo estimado.</p>
      `;
      return;
    }

    const zone1 = deptZoneMap[origen];
    const zone2 = deptZoneMap[destino];

    let estimatedDays = '2 días hábiles';
    if (zone1 === zone2) {
      estimatedDays = '1 día hábil';
    } else if ((zone1 === 'Occidente' && zone2 === 'Oriente') || (zone1 === 'Oriente' && zone2 === 'Occidente')) {
      estimatedDays = '3 días hábiles';
    } else {
      estimatedDays = '2 días hábiles';
    }

    deliveryResultCard.className = 'delivery-result-card';
    deliveryResultCard.innerHTML = `
      <div class="result-card-content">
        <div class="result-top-meta">
          <div class="result-icon-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <span class="result-header-title">TIEMPO ESTIMADO DE ENTREGA</span>
        </div>
        
        <div class="result-route-badge">
          <span>${origen}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          <span>${destino}</span>
        </div>

        <div class="result-time-num">${estimatedDays}</div>

        <p class="result-disclaimer">
          Los tiempos de entrega son estimados y pueden variar según las condiciones de ruta, disponibilidad y operación logística.
        </p>
      </div>
    `;
  }

  if (selectOrigen && selectDestino) {
    selectOrigen.addEventListener('change', updateDeliveryEstimate);
    selectDestino.addEventListener('change', updateDeliveryEstimate);
  }
});
