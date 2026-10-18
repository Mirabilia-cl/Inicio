/**
 * MIRABILIA — Arquitectura de la Mirada (@somosmirabilia)
 * Editorial Minimalism Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CONFIGURACIÓN DEL NEGOCIO
     ========================================================================== */
  const WHATSAPP_PHONE = '56912345678'; 
  const DEPOSIT_AMOUNT = 5000;

  /* ==========================================================================
     2. APARICIÓN SUAVE DE CONTENIDO (EDITORIAL REVEAL)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     3. MENÚ RESPONSIVO (MOBILE DRAWER)
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     4. FILTRADO POR PESTAÑAS (CATEGORÍAS DE SERVICIOS + ÍNDICE COMPLETO)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  const filterServices = (category) => {
    serviceCards.forEach(card => {
      const match = category === 'todos' || card.getAttribute('data-category') === category;
      if (match) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.35s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  };

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const category = button.getAttribute('data-category');
      filterServices(category);
    });
  });

  filterServices('pestanas');

  /* ==========================================================================
     5. ACORDEÓN DE POLÍTICAS DE RESERVA
     ========================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const content = header.nextElementSibling;

      accordionHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          if (otherHeader.nextElementSibling) {
            otherHeader.nextElementSibling.classList.remove('open');
          }
        }
      });

      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        content.classList.remove('open');
      } else {
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('open');
      }
    });
  });

  /* ==========================================================================
     6. TABS DE CUIDADOS POSTERIORES
     ========================================================================== */
  const aftercareTabs = document.querySelectorAll('.aftercare-tab-btn');
  const aftercarePanels = document.querySelectorAll('.aftercare-panel');

  aftercareTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      aftercareTabs.forEach(t => t.classList.remove('active'));
      aftercarePanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     7. MODAL DINÁMICO & GENERADOR DE URL WHATSAPP
     ========================================================================== */
  const bookingModal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalClose');
  const bookingForm = document.getElementById('bookingForm');
  const clientNameInput = document.getElementById('clientName');
  const serviceSelect = document.getElementById('serviceSelect');
  const scheduleInput = document.getElementById('scheduleInput');
  const remainingBalanceEl = document.getElementById('remainingBalance');
  const balanceRow = document.getElementById('balanceRow');
  const timeChips = document.querySelectorAll('.time-chip');

  const updateBalanceSummary = () => {
    if (!serviceSelect || !remainingBalanceEl) return;
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const price = parseInt(selectedOption.getAttribute('data-price') || '0', 10);

    if (price > DEPOSIT_AMOUNT) {
      const remaining = price - DEPOSIT_AMOUNT;
      remainingBalanceEl.textContent = `$${remaining.toLocaleString('es-CL')}`;
      balanceRow.style.display = 'flex';
    } else {
      balanceRow.style.display = 'none';
    }
  };

  if (serviceSelect) {
    serviceSelect.addEventListener('change', updateBalanceSummary);
  }

  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (scheduleInput) {
        scheduleInput.value = chip.getAttribute('data-time');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-modal]');
    if (!trigger) return;

    e.preventDefault();
    const serviceName = trigger.getAttribute('data-service');

    if (serviceName && serviceSelect) {
      let optionFound = false;
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === serviceName) {
          serviceSelect.selectedIndex = i;
          optionFound = true;
          break;
        }
      }
      if (!optionFound) {
        serviceSelect.value = 'Consulta General';
      }
      updateBalanceSummary();
    }

    bookingModal.classList.add('active');
    bookingModal.setAttribute('aria-hidden', 'false');
    if (clientNameInput) clientNameInput.focus();
  });

  const closeModal = () => {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);

  window.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeModal();
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = clientNameInput ? clientNameInput.value.trim() : '';
      const selectedService = serviceSelect.value;
      const preferredSchedule = scheduleInput.value.trim() || 'Día y horario a convenir';

      const greeting = clientName ? `¡Hola! Soy ${clientName} (vengo desde la web de @somosmirabilia) y quiero agendar una cita.` : `¡Hola! Quiero agendar una cita en @somosmirabilia.`;
      const rawMessage = `${greeting} Me interesa el servicio de: ${selectedService} para el día/horario: ${preferredSchedule}. ¿Qué disponibilidad tienes?`;

      const encodedMessage = encodeURIComponent(rawMessage);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      closeModal();
      bookingForm.reset();
      timeChips.forEach(c => c.classList.remove('active'));
    });
  }

  /* ==========================================================================
     8. BOTÓN VOLVER ARRIBA
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});