/**
 * Editorial Juanita - Scrollytelling Global, Animaciones de Pestaña,
 * Video Popup Modal en la Página, Flipbook de Muestra y Base de Datos
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalScrollAnimation();
  initTabTitleMarquee();
  initAnimatedFavicon();
  initMobileMenu();
});

/* ==========================================================================
   1. TÍTULO DE LA PESTAÑA ANIMADO (MARQUEE 2 VUELTAS & MENSAJE DE RETORNO)
   ========================================================================== */
function initTabTitleMarquee() {
  const defaultStaticTitle = "Editorial Juanita | Libros Infantiles";
  const initialText = "Editorial Juanita | Libros para Colorear, Leer y Crear ✨ — ";
  const returnText = "¡Te extrañamos! Vuelve a leer y colorear con Juanita 📖✨ — ";
  
  let currentTitleText = initialText;
  let scrollPos = 0;
  let fullCycles = 0;
  let titleInterval = null;
  let isAway = false;
  let awayTimeout = null;

  function stepMarquee() {
    document.title = currentTitleText.substring(scrollPos) + currentTitleText.substring(0, scrollPos);
    scrollPos++;
    
    if (scrollPos >= currentTitleText.length) {
      scrollPos = 0;
      fullCycles++;
      
      // Detenerse tras 2 vueltas completas en la pestaña activa
      if (!isAway && fullCycles >= 2) {
        clearInterval(titleInterval);
        titleInterval = null;
        document.title = defaultStaticTitle;
      }
    }
  }

  titleInterval = setInterval(stepMarquee, 220);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isAway = true;
      if (titleInterval) clearInterval(titleInterval);
      
      awayTimeout = setTimeout(() => {
        if (!document.hidden) return;
        currentTitleText = returnText;
        scrollPos = 0;
        fullCycles = 0;
        titleInterval = setInterval(stepMarquee, 240);
      }, 4000);
    } else {
      isAway = false;
      if (awayTimeout) clearTimeout(awayTimeout);
      if (titleInterval) clearInterval(titleInterval);
      document.title = defaultStaticTitle;
    }
  });

  window.addEventListener('focus', () => {
    isAway = false;
    if (awayTimeout) clearTimeout(awayTimeout);
    if (titleInterval) clearInterval(titleInterval);
    document.title = defaultStaticTitle;
  });
}

/* ==========================================================================
   2. FAVICON ANIMADO (MANITO NARANJA SALUDANDO 👋)
   ========================================================================== */
function initAnimatedFavicon() {
  const faviconLink = document.getElementById('siteFavicon');
  if (!faviconLink) return;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.src = 'assets/favicon.png';

  let animationAngle = 0;
  let animationStep = 0;

  img.onload = () => {
    setInterval(() => {
      ctx.clearRect(0, 0, 32, 32);
      animationStep += 0.18;
      animationAngle = Math.sin(animationStep) * 0.24;

      ctx.save();
      ctx.translate(16, 26);
      ctx.rotate(animationAngle);
      ctx.drawImage(img, -14, -24, 28, 28);
      ctx.restore();

      faviconLink.href = canvas.toDataURL('image/png');
    }, 110);
  };
}

/* ==========================================================================
   3. MOTOR DE SCROLLYTELLING GLOBAL DE 240 FOTOGRAMAS (TODO EL SITIO)
   ========================================================================== */
function initGlobalScrollAnimation() {
  const canvas = document.getElementById('globalScrollCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const TOTAL_FRAMES = 240;
  const frames = [];
  let loadedCount = 0;
  let width, height;
  let targetProgress = 0;
  let currentProgress = 0;
  let currentDrawnIndex = 1;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    drawFrame(currentDrawnIndex);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawCover(img) {
    if (!img || !img.complete || !width || !height) return;
    const sWidth = img.naturalWidth || img.width;
    const sHeight = img.naturalHeight || img.height;
    if (!sWidth || !sHeight) return;

    const hRatio = width / sWidth;
    const vRatio = height / sHeight;
    const ratio = Math.max(hRatio, vRatio);

    const renderW = sWidth * ratio;
    const renderH = sHeight * ratio;
    const offsetX = (width - renderW) / 2;
    const offsetY = (height - renderH) / 2;

    ctx.drawImage(img, 0, 0, sWidth, sHeight, offsetX, offsetY, renderW, renderH);
  }

  function drawFrame(index) {
    const frameImg = frames[index - 1];
    if (frameImg && frameImg.complete) {
      drawCover(frameImg);
      currentDrawnIndex = index;
    }
  }

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const frameNumber = String(i).padStart(4, '0');
    img.src = `assets/frames/frame_${frameNumber}.jpg`;

    img.onload = () => {
      loadedCount++;
      if (i === 1) {
        drawCover(img);
      }
    };

    frames.push(img);
  }

  function onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) {
      targetProgress = 0;
      return;
    }

    const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
    targetProgress = progress;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function animationLoop() {
    currentProgress += (targetProgress - currentProgress) * 0.18;

    const frameIndex = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.floor(currentProgress * (TOTAL_FRAMES - 1)) + 1)
    );

    if (frameIndex !== currentDrawnIndex || loadedCount < 10) {
      drawFrame(frameIndex);
    }

    requestAnimationFrame(animationLoop);
  }

  animationLoop();
}

/* ==========================================================================
   4. BASE DE DATOS DE SANTOS CON CANCIONES EN YOUTUBE
   ========================================================================== */
const saintsData = {
  carlo: {
    name: "San Carlo Acutis",
    quote: "“La Eucaristía es mi autopista hacia el Cielo.”",
    badge: "Ciberapóstol de la Eucaristía",
    price: "$15.000",
    songTitle: "Canción Oficial: San Carlo Acutis",
    youtubeId: "6hUrtRrhpDg",
    sceneImg: "assets/card-carlo-acutis.jpg",
    synopsis: "La historia inspiradora del joven Carlo Acutis, un chico que amaba la informática, los videojuegos y los paseos en bicicleta, y que dedicó su talento a ayudar a los necesitados mostrando que la santidad es actual, alegre y cercana.",
    features: [
      "🌟 La vida de tu Santo favorito en una canción.",
      "📄 36 páginas",
      "🖍️ 16 Escenas para colorear.",
      "🎵 Una canción para cantar y aprender."
    ]
  },
  teresita: {
    name: "Santa Teresita del Niño Jesús",
    quote: "“Hacer las cosas más pequeñas con un amor inmensamente grande.”",
    badge: "Lluvia de Rosas & Ternura",
    price: "$15.000",
    songTitle: "Canción Oficial: Santa Teresita del Niño Jesús",
    youtubeId: "flVYL-0eA8g",
    sceneImg: "assets/card-teresita.jpg",
    synopsis: "Descubre el secreto del «caminito espiritual» de la pequeña Santa Teresa de Lisieux. Enseña a los niños cómo un gesto de bondad o una sonrisa regalada con cariño transforman el corazón.",
    features: [
      "🌟 La vida de tu Santo favorito en una canción.",
      "📄 36 páginas",
      "🖍️ 16 Escenas para colorear.",
      "🎵 Una canción para cantar y aprender."
    ]
  },
  padrepio: {
    name: "Santo Padre Pío",
    quote: "“Reza, ten fe y no te preocupes. Dios cuida siempre de ti.”",
    badge: "Oración, Paz & Ángel Custodio",
    price: "$15.000",
    songTitle: "Canción Oficial: Santo Padre Pío",
    youtubeId: "-YqTUc6JRz8",
    sceneImg: "assets/card-padre-pio.jpg",
    synopsis: "Las entrañables historias del Padre Pío y su amistad cercana con su Ángel Custodio. Un libro lleno de paz que transmite serenidad ante los miedos infantiles y enseña el poder de la oración.",
    features: [
      "🌟 La vida de tu Santo favorito en una canción.",
      "📄 36 páginas",
      "🖍️ 16 Escenas para colorear.",
      "🎵 Una canción para cantar y aprender."
    ]
  },
  juanpablo: {
    name: "San Juan Pablo II",
    quote: "“¡No tengáis miedo! Abrid las puertas del corazón al amor.”",
    badge: "Peregrino de Paz & Amigo Infantil",
    price: "$15.000",
    songTitle: "Canción Oficial: San Juan Pablo II",
    youtubeId: "jhAt-GSIKnk",
    sceneImg: "assets/card-juan-pablo-ii.jpg",
    synopsis: "Sigue los pasos del Papa más viajero de la historia: desde su juventud deportista en Polonia hasta sus viajes por más de 120 países cantando y sonriendo con niños de todas las culturas.",
    features: [
      "🌟 La vida de tu Santo favorito en una canción.",
      "📄 36 páginas",
      "🖍️ 16 Escenas para colorear.",
      "🎵 Una canción para cantar y aprender."
    ]
  },
  laura: {
    name: "Santa Laura Montoya",
    quote: "“Sembradora de fe, amor por la selva y las comunidades indígenas.”",
    badge: "Primera Santa de Colombia",
    price: "$15.000",
    songTitle: "Canción Oficial: Santa Laura Montoya",
    youtubeId: "rz5htQN34S0",
    sceneImg: "assets/card-laura-montoya.jpg",
    synopsis: "Acompaña a la Madre Laura en sus travesías por la selva a caballo, llevando esperanza, educación y canciones alegres a los niños de las comunidades indígenas de Colombia.",
    features: [
      "🌟 La vida de tu Santo favorito en una canción.",
      "📄 36 páginas",
      "🖍️ 16 Escenas para colorear.",
      "🎵 Una canción para cantar y aprender."
    ]
  },
  martin: {
    name: "San Martín de Porres",
    quote: "“La escoba de la humildad y el plato compartido con todos.”",
    badge: "Amigo de los Animalitos",
    price: "$15.000",
    songTitle: "Canción Oficial: San Martín de Porres",
    youtubeId: "il22GlukD_0",
    sceneImg: "assets/card-martin-porres.jpg",
    synopsis: "Fray Martín de Porres, el santo de la escoba que cuidaba de los enfermos y que con su ternura lograba que el perro, el gato y el ratoncito comieran juntos del mismo plato sin pelear.",
    features: [
      "🌟 La vida de tu Santo favorito en una canción.",
      "📄 36 páginas",
      "🖍️ 16 Escenas para colorear.",
      "🎵 Una canción para cantar y aprender."
    ]
  }
};

/* Modal de Detalle de Santo con Reproducción de Video Popup */
window.openSaintModal = function(saintId) {
  const saint = saintsData[saintId];
  if (!saint) return;

  const modalContent = document.getElementById('modalSaintContent');
  modalContent.innerHTML = `
    <div class="modal-saint-layout">
      
      <div class="modal-scene-preview">
        <img src="${saint.sceneImg}" alt="Ilustración 3D de ${saint.name} y su libro para colorear">
      </div>

      <div class="modal-saint-info">
        <div class="modal-badge-group">
          <span class="modal-badge" style="background:#FFF3E0; color:#E65100;">${saint.badge}</span>
          <span class="modal-badge" style="background:#E1F4FC; color:#0F78AC;">Libro + canción</span>
        </div>

        <h3>${saint.name}</h3>
        <p class="modal-saint-quote">${saint.quote}</p>

        <!-- Bloque de Canción con Reproducción Directa en Popup -->
        <div class="modal-audio-player-box">
          <div class="audio-player-info">
            <strong>🎵 ${saint.songTitle}</strong>
            <small>Canción oficial disponible para escuchar en video dentro de la web</small>
          </div>
          <button class="btn btn-primary" style="padding: 10px 18px; font-size: 0.9rem;" onclick="openVideoModal('${saint.youtubeId}', '${saint.name} - Canción Oficial')">
            <span>▶ Escuchar Canción</span>
          </button>
        </div>

        <p class="modal-synopsis">${saint.synopsis}</p>

        <div style="background:#FFF9F2; border-left:4px solid #FFA000; padding:12px 16px; border-radius:6px; margin-bottom:18px;">
          <strong style="color:#7A4B29; display:block; font-size:0.88rem; margin-bottom:6px;">✨ Incluye en esta edición:</strong>
          <ul style="list-style:none; font-size:0.86rem; color:#4A2E00; display:flex; flex-direction:column; gap:4px;">
            ${saint.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div class="modal-actions">
          <button class="btn btn-primary" onclick="alert('¡Has agregado el libro de ${saint.name} a tu bolsa de compra (${saint.price})!')">
            <span>Añadir al Carrito (${saint.price}) 🛍️</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById('saintModal');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closeSaintModal = function() {
  const modal = document.getElementById('saintModal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

/* ==========================================================================
   5. MODAL DE VIDEO POPUP (REPRODUCCIÓN DE CANCIONES YOUTUBE EN LA WEB)
   ========================================================================== */
window.openVideoModal = function(youtubeId, videoTitle) {
  const content = document.getElementById('videoModalContent');
  content.innerHTML = `
    <div class="modal-video-header">
      <h4>🎵 ${videoTitle}</h4>
    </div>
    <div class="video-responsive-wrapper" style="box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <iframe 
        src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1" 
        title="${videoTitle}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    </div>
  `;

  const modal = document.getElementById('videoModal');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.closeVideoModal = function() {
  const modal = document.getElementById('videoModal');
  const content = document.getElementById('videoModalContent');
  content.innerHTML = ''; // Detiene el video inmediatamente al cerrar
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

/* ==========================================================================
   6. FLIPBOOK INTERACTIVO: CAPÍTULO DE MUESTRA (4 PÁGINAS)
   ========================================================================== */
let currentFlipPage = 1;
const totalFlipPages = 4;
const flipPagesData = [
  "assets/fiorecillas-pag-1.jpg",
  "assets/fiorecillas-pag-2.jpg",
  "assets/fiorecillas-pag-3.jpg",
  "assets/fiorecillas-pag-4.jpg"
];

window.openFiorecillasSampleModal = function() {
  currentFlipPage = 1;
  renderFlipbook();

  const modal = document.getElementById('sampleViewerModal');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

function renderFlipbook() {
  const content = document.getElementById('sampleViewerContent');
  content.innerHTML = `
    <div class="flipbook-header">
      <span class="modal-badge" style="background:#FFF3E0; color:#E65100;">📖 Libro Digital Interactivo</span>
      <h3>Fiorecillas de los Santos (Tomo 1)</h3>
      <p>Pasa las páginas para leer el capítulo de muestra ilustrado.</p>
    </div>

    <!-- Escenario del Flipbook -->
    <div class="flipbook-stage" id="flipbookStage" onclick="nextFlipPage()" title="Haz clic para pasar a la siguiente página">
      <img src="${flipPagesData[currentFlipPage - 1]}" alt="Página ${currentFlipPage} de Fiorecillas de los Santos" class="flipbook-page-display" id="flipPageImg">
    </div>

    <!-- Controles de navegación de páginas -->
    <div class="flipbook-controls">
      <button class="btn-flip-nav" onclick="prevFlipPage()" ${currentFlipPage === 1 ? 'disabled' : ''}>
        ◀ Anterior
      </button>

      <div class="flipbook-counter">
        Página <strong>${currentFlipPage}</strong> de ${totalFlipPages}
      </div>

      <button class="btn-flip-nav" onclick="nextFlipPage()" ${currentFlipPage === totalFlipPages ? 'disabled' : ''}>
        Siguiente ▶
      </button>
    </div>

    <!-- Indicadores puntitos -->
    <div class="flipbook-dots">
      ${[1, 2, 3, 4].map(num => `
        <span class="flipbook-dot ${num === currentFlipPage ? 'active' : ''}" onclick="goToFlipPage(${num})"></span>
      `).join('')}
    </div>

    <div class="flipbook-footer-actions">
      <button class="btn btn-primary" onclick="alert('¡Has añadido Fiorecillas de los Santos ($40.000) a tu carrito!')">
        <span>Comprar Libro Físico ($40.000) 🛍️</span>
      </button>
      <button class="btn btn-secondary-pill" onclick="closeSampleViewerModal()">
        <span>Cerrar Visor</span>
      </button>
    </div>
  `;
}

window.nextFlipPage = function() {
  if (currentFlipPage < totalFlipPages) {
    currentFlipPage++;
    animatePageChange();
  }
};

window.prevFlipPage = function() {
  if (currentFlipPage > 1) {
    currentFlipPage--;
    animatePageChange();
  }
};

window.goToFlipPage = function(pageNum) {
  if (pageNum >= 1 && pageNum <= totalFlipPages) {
    currentFlipPage = pageNum;
    animatePageChange();
  }
};

function animatePageChange() {
  const img = document.getElementById('flipPageImg');
  if (img) {
    img.style.opacity = '0.3';
    img.style.transform = 'scale(0.98)';
    setTimeout(() => {
      renderFlipbook();
    }, 120);
  } else {
    renderFlipbook();
  }
}

window.closeSampleViewerModal = function() {
  const modal = document.getElementById('sampleViewerModal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// Cerrar modales con clic fuera
document.getElementById('saintModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'saintModal') closeSaintModal();
});

document.getElementById('videoModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'videoModal') closeVideoModal();
});

document.getElementById('sampleViewerModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'sampleViewerModal') closeSampleViewerModal();
});

// Teclado: Escape cierra y flechas izquierda/derecha pasan páginas del flipbook
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSaintModal();
    closeVideoModal();
    closeSampleViewerModal();
  } else if (e.key === 'ArrowRight') {
    const sampleModal = document.getElementById('sampleViewerModal');
    if (sampleModal && sampleModal.classList.contains('is-open')) {
      nextFlipPage();
    }
  } else if (e.key === 'ArrowLeft') {
    const sampleModal = document.getElementById('sampleViewerModal');
    if (sampleModal && sampleModal.classList.contains('is-open')) {
      prevFlipPage();
    }
  }
});

/* ==========================================================================
   7. INTERACCIÓN DE LOMO DE FIORECILLAS
   ========================================================================== */
window.toggleBookSpineView = function() {
  const flipper = document.getElementById('fiorecillasFlipper');
  if (flipper) {
    flipper.classList.toggle('is-flipped');
  }
};

/* ==========================================================================
   8. MENÚ MÓVIL
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('is-active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}
