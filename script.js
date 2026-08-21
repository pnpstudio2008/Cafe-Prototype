/* ==========================================================================
   KINETIC & CO. - MAXIMALIST CAFE JAVASCRIPT ENGINE & ADMIN CONTROLLER
   Includes: Cart state manager, dynamic menu CRUD, order tracker, promo config,
   and Admin Panel dashboard logic.
   ========================================================================== */

(function () {
  'use strict';

  // LocalStorage Keys
  const CART_KEY = 'kinetic_cafe_cart';
  const MENU_KEY = 'kinetic_cafe_menu';
  const ORDERS_KEY = 'kinetic_cafe_orders';
  const OFFER_KEY = 'kinetic_cafe_offer';
  const ADMIN_AUTH_KEY = 'kinetic_admin_authed';

  // Master Initial Menu Items Seed
  const INITIAL_MENU_ITEMS = [
    {
      id: 'item-1',
      name: 'Espresso Supreme',
      category: 'coffee',
      price: 4.50,
      description: 'Double shot rich dark roast with golden velvety crema & cacao notes.',
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
      badge: 'BESTSELLER',
      badgeClass: 'red'
    },
    {
      id: 'item-2',
      name: 'Spanish Caramel Latte',
      category: 'coffee',
      price: 5.80,
      description: 'Handcrafted espresso with condensed milk layer & butterscotch drizzle.',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
      badge: 'POPULAR',
      badgeClass: 'orange'
    },
    {
      id: 'item-3',
      name: 'Iced Cloud Matcha',
      category: 'cold-drinks',
      price: 6.20,
      description: 'Ceremonial Uji matcha with oat milk cloud foam & vanilla bean syrup.',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
      badge: 'ORGANIC',
      badgeClass: 'green'
    },
    {
      id: 'item-4',
      name: 'Nitro Cold Brew',
      category: 'cold-drinks',
      price: 5.50,
      description: '18-hour steep cold brew infused with nitrogen for a silky smooth pour.',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
      badge: 'CHEF PICK',
      badgeClass: 'red'
    },
    {
      id: 'item-5',
      name: 'Pink Dragonfruit Elixir',
      category: 'cold-drinks',
      price: 6.50,
      description: 'Pitaya dragonfruit, passionfruit juice, coconut milk & crushed ice.',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
      badge: 'FRESH',
      badgeClass: 'orange'
    },
    {
      id: 'item-6',
      name: 'Artisanal Avocado Toast',
      category: 'snacks',
      price: 11.50,
      description: 'Smashed hass avocado, poached organic egg, chili flakes on artisanal sourdough.',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      badge: 'SIGNATURE',
      badgeClass: 'green'
    },
    {
      id: 'item-7',
      name: 'Smoked Salmon Bagel',
      category: 'snacks',
      price: 13.00,
      description: 'Wild salmon, dill cream cheese, capers & pickled red onion on sesame bagel.',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      badge: 'FAVORITE',
      badgeClass: 'red'
    },
    {
      id: 'item-8',
      name: 'Tiramisu Croissant',
      category: 'desserts',
      price: 6.80,
      description: 'Flaky french croissant filled with mascarpone cream & dusted with Valrhona cocoa.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      badge: 'SWEET',
      badgeClass: 'orange'
    },
    {
      id: 'item-9',
      name: 'Berry Soufflé Pancakes',
      category: 'desserts',
      price: 12.50,
      description: 'Ultra fluffy Japanese soufflé pancakes topped with wild berries & maple syrup.',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
      badge: 'NEW',
      badgeClass: 'red'
    },
    {
      id: 'item-10',
      name: 'Truffle Parmesan Fries',
      category: 'snacks',
      price: 8.50,
      description: 'Hand-cut potato fries tossed in black truffle oil, garlic & grated parmesan.',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      badge: 'CRISPY',
      badgeClass: 'orange'
    }
  ];

  // Initial Mock Orders Seed
  const INITIAL_ORDERS_SEED = [
    {
      id: '#CAF-8492',
      date: '2026-08-16 09:45 AM',
      customerName: 'Alex Rivera',
      phone: '+1 (555) 382-9102',
      email: 'alex@example.com',
      address: '104 West 4th St, Apt 3B, New York',
      orderType: 'delivery',
      paymentMethod: 'card',
      status: 'Completed',
      items: [
        { name: 'Spanish Caramel Latte', qty: 2, price: 5.80 },
        { name: 'Tiramisu Croissant', qty: 1, price: 6.80 }
      ],
      subtotal: 18.40,
      tax: 1.47,
      deliveryFee: 3.99,
      grandTotal: 23.86
    },
    {
      id: '#CAF-8493',
      date: '2026-08-17 08:15 AM',
      customerName: 'Sophia Chen',
      phone: '+1 (555) 918-2041',
      email: 'sophia@example.com',
      address: 'Express Store Pickup',
      orderType: 'pickup',
      paymentMethod: 'upi',
      status: 'Preparing',
      items: [
        { name: 'Iced Cloud Matcha', qty: 1, price: 6.20 },
        { name: 'Artisanal Avocado Toast', qty: 1, price: 11.50 }
      ],
      subtotal: 17.70,
      tax: 1.42,
      deliveryFee: 0.00,
      grandTotal: 19.12
    },
    {
      id: '#CAF-8494',
      date: '2026-08-17 09:30 AM',
      customerName: 'Marcus Vance',
      phone: '+1 (555) 491-0329',
      email: 'marcus@example.com',
      address: '52 Greenwich Ave, NY 10011',
      orderType: 'delivery',
      paymentMethod: 'cod',
      status: 'Pending',
      items: [
        { name: 'Nitro Cold Brew', qty: 2, price: 5.50 },
        { name: 'Smoked Salmon Bagel', qty: 1, price: 13.00 }
      ],
      subtotal: 24.00,
      tax: 1.92,
      deliveryFee: 3.99,
      grandTotal: 29.91
    }
  ];

  // Helper Methods: Storage Pipeline
  function getCart() {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      updateNavCartCount();
    } catch (e) {
      console.error(e);
    }
  }

  function getMenuItems() {
    try {
      const stored = localStorage.getItem(MENU_KEY);
      if (!stored) {
        localStorage.setItem(MENU_KEY, JSON.stringify(INITIAL_MENU_ITEMS));
        return INITIAL_MENU_ITEMS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_MENU_ITEMS;
    }
  }

  function saveMenuItems(items) {
    try {
      localStorage.setItem(MENU_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }

  function getOrders() {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (!stored) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS_SEED));
        return INITIAL_ORDERS_SEED;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_ORDERS_SEED;
    }
  }

  function saveOrders(orders) {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }

  function getOfferConfig() {
    try {
      const stored = localStorage.getItem(OFFER_KEY);
      return stored ? JSON.parse(stored) : {
        title: 'WEEKEND POWER COMBO',
        subtitle: 'Get our Signature Nitro Cold Brew paired with a freshly baked Tiramisu Croissant for 30% off!',
        discountText: '30% OFF',
        price: '$10.50',
        badge: '🔥 LIMITED TIME DEAL',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80'
      };
    } catch (e) {
      return {};
    }
  }

  function saveOfferConfig(config) {
    try {
      localStorage.setItem(OFFER_KEY, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }

  function updateNavCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
      b.textContent = totalCount;
    });
  }

  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Add Item to Cart (Exposed Globally)
  window.addToCart = function (itemId) {
    const items = getMenuItems();
    const itemData = items.find(i => i.id === itemId);
    if (!itemData) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(i => i.id === itemId);

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        image: itemData.image,
        qty: 1
      });
    }

    saveCart(cart);
    showToast(`Added 1x ${itemData.name} to order!`);
  };

  // Render Homepage Menu Grid (`index.html`)
  function renderMenuCards(categoryFilter = 'all') {
    const grid = document.getElementById('menu-grid-container');
    if (!grid) return;

    grid.innerHTML = '';
    const items = getMenuItems();

    const filtered = categoryFilter === 'all'
      ? items
      : items.filter(item => item.category === categoryFilter);

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; font-weight:700;">No items found in this category.</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.setAttribute('data-category', item.category);

      card.innerHTML = `
        <div class="menu-card-img-wrap">
          <span class="badge-sticker ${item.badgeClass || 'red'} item-badge">${item.badge || 'SPECIAL'}</span>
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="menu-card-body">
          <div class="menu-card-title-row">
            <h3 class="menu-item-title">${item.name}</h3>
            <span class="menu-item-price">$${parseFloat(item.price).toFixed(2)}</span>
          </div>
          <p class="menu-item-desc">${item.description}</p>
          <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
            <span>Add To Order</span> <span>+</span>
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Render Promo Offer on `index.html`
  function renderPromoOffer() {
    const offer = getOfferConfig();
    const titleEl = document.querySelector('.offer-title');
    const subtitleEl = document.querySelector('.offer-subtitle');
    const badgeCircle = document.querySelector('.discount-badge-circle');
    const imgBox = document.querySelector('.offer-img-box img');

    if (titleEl && offer.title) titleEl.textContent = offer.title;
    if (subtitleEl && offer.subtitle) subtitleEl.textContent = offer.subtitle;
    if (imgBox && offer.image) imgBox.src = offer.image;
    if (badgeCircle && offer.discountText) {
      badgeCircle.innerHTML = `<span>${offer.discountText}</span>`;
    }
  }

  // Menu Tabs Handler
  function initMenuTabs() {
    const tabs = document.querySelectorAll('.category-tabs .tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-category');
        renderMenuCards(cat);
      });
    });
  }

  // Mobile Navigation Drawer
  function initMobileNav() {
    const openBtn = document.getElementById('hamburger-open-btn');
    const closeBtn = document.getElementById('hamburger-close-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');

    if (!openBtn || !drawer || !backdrop) return;

    const toggleDrawer = (open) => {
      if (open) {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    openBtn.addEventListener('click', () => toggleDrawer(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));
    backdrop.addEventListener('click', () => toggleDrawer(false));

    const mobileLinks = drawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });
  }

  // Countdown Timer
  function initCountdownTimer() {
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-mins');
    const secsEl = document.getElementById('timer-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

    function update() {
      const now = new Date().getTime();
      const distance = Math.max(0, targetDate - now);

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // Testimonial Carousel
  function initTestimonials() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const dotsContainer = document.getElementById('slider-dots-container');

    if (!track) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;

    let currentIndex = 0;

    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    setInterval(() => goToSlide(currentIndex + 1), 6000);
  }

  // Navbar Scroll & Back-to-Top
  function initScrollBehavior() {
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        if (navbar) navbar.classList.add('scrolled');
      } else {
        if (navbar) navbar.classList.remove('scrolled');
      }

      if (backToTopBtn) {
        if (window.scrollY > 450) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================================================
  // PAGE 2 (order.html) LOGIC & CHECKOUT ORDER SAVING
  // ==========================================================================
  function initOrderPage() {
    const orderView = document.getElementById('order-active-view');
    const accessDeniedView = document.getElementById('access-denied-view');

    if (!orderView || !accessDeniedView) return; // Not on order.html

    const cart = getCart();

    if (!cart || cart.length === 0) {
      orderView.style.display = 'none';
      accessDeniedView.style.display = 'block';
      return;
    } else {
      orderView.style.display = 'block';
      accessDeniedView.style.display = 'none';
    }

    renderCartItemsTable();
    initOrderTypeToggle();
    initPaymentOptionToggle();
    initCheckoutForm();
  }

  function renderCartItemsTable() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('summary-subtotal');
    const taxEl = document.getElementById('summary-tax');
    const deliveryEl = document.getElementById('summary-delivery');
    const totalEl = document.getElementById('summary-grand-total');

    if (!container) return;

    if (cart.length === 0) {
      initOrderPage();
      return;
    }

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemSubtotal = item.price * item.qty;
      subtotal += itemSubtotal;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} each</div>
          </div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateItemQty('${item.id}', -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateItemQty('${item.id}', 1)">+</button>
        </div>
        <div style="font-weight:800; font-family:var(--font-heading); min-width:70px; text-align:right;">
          $${itemSubtotal.toFixed(2)}
        </div>
        <button class="remove-item-btn" title="Remove item" onclick="removeItemFromCart('${item.id}')">✕</button>
      `;
      container.appendChild(row);
    });

    const tax = subtotal * 0.08;
    const activeOrderTypeBtn = document.querySelector('.order-type-btn.active');
    const orderType = activeOrderTypeBtn ? activeOrderTypeBtn.getAttribute('data-type') : 'delivery';
    const deliveryFee = orderType === 'delivery' ? 3.99 : 0.00;
    const grandTotal = subtotal + tax + deliveryFee;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${grandTotal.toFixed(2)}`;
  }

  window.updateItemQty = function (itemId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== itemId);
    }

    saveCart(cart);
    renderCartItemsTable();
  };

  window.removeItemFromCart = function (itemId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== itemId);
    saveCart(cart);
    renderCartItemsTable();
    showToast('Item removed from cart');
  };

  window.clearAllCart = function () {
    saveCart([]);
    renderCartItemsTable();
  };

  function initOrderTypeToggle() {
    const buttons = document.querySelectorAll('.order-type-btn');
    const deliveryFields = document.getElementById('delivery-address-group');
    const pickupNotes = document.getElementById('pickup-info-box');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const type = btn.getAttribute('data-type');
        if (type === 'delivery') {
          if (deliveryFields) deliveryFields.style.display = 'block';
          if (pickupNotes) pickupNotes.style.display = 'none';
        } else {
          if (deliveryFields) deliveryFields.style.display = 'none';
          if (pickupNotes) pickupNotes.style.display = 'block';
        }

        renderCartItemsTable();
      });
    });
  }

  function initPaymentOptionToggle() {
    const options = document.querySelectorAll('.payment-card-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
  }

  function initCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const modal = document.getElementById('order-modal-backdrop');
    const orderNumEl = document.getElementById('modal-order-number');

    if (!form || !modal) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const cart = getCart();
      if (cart.length === 0) return;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `#CAF-${randomNum}`;
      if (orderNumEl) orderNumEl.textContent = orderId;

      // Extract form details
      const name = document.getElementById('cust-name').value;
      const phone = document.getElementById('cust-phone').value;
      const email = document.getElementById('cust-email').value;
      const address = document.getElementById('cust-address') ? document.getElementById('cust-address').value : 'Pickup';
      const activeTypeBtn = document.querySelector('.order-type-btn.active');
      const orderType = activeTypeBtn ? activeTypeBtn.getAttribute('data-type') : 'delivery';
      const selectedPaymentRadio = document.querySelector('input[name="payment_method"]:checked');
      const paymentMethod = selectedPaymentRadio ? selectedPaymentRadio.value : 'card';

      // Compute totals
      let subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
      let tax = subtotal * 0.08;
      let deliveryFee = orderType === 'delivery' ? 3.99 : 0.00;
      let grandTotal = subtotal + tax + deliveryFee;

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Build Order Object
      const newOrder = {
        id: orderId,
        date: dateStr,
        customerName: name,
        phone: phone,
        email: email,
        address: orderType === 'delivery' ? address : 'Express Pickup Counter',
        orderType: orderType,
        paymentMethod: paymentMethod,
        status: 'Pending',
        items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        grandTotal: grandTotal
      };

      // Append to Order History for Admin Panel
      let orders = getOrders();
      orders.unshift(newOrder);
      saveOrders(orders);

      // Show confirmation modal
      modal.classList.add('active');
      saveCart([]);
    });

    const closeModalBtn = document.getElementById('modal-close-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        window.location.href = 'index.html';
      });
    }
  }

  // ==========================================================================
  // PAGE 3 (admin.html) CONTROLLER & DASHBOARD
  // ==========================================================================
  function initAdminPanel() {
    const adminContainer = document.getElementById('admin-dashboard-view');
    const passModal = document.getElementById('passcode-modal-backdrop');

    if (!adminContainer) return; // Not on admin.html

    // Check session authentication
    const isAuthed = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    if (!isAuthed && passModal) {
      passModal.classList.add('active');
    } else if (passModal) {
      passModal.classList.remove('active');
    }

    // Passcode Form Handler
    const passForm = document.getElementById('passcode-form');
    if (passForm) {
      passForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('admin-passcode-input').value;
        if (input === 'admin123') {
          localStorage.setItem(ADMIN_AUTH_KEY, 'true');
          passModal.classList.remove('active');
          showToast('Admin access granted!');
          renderAdminAll();
        } else {
          alert('Incorrect Passcode! Hint: admin123');
        }
      });
    }

    // Logout Handler
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(ADMIN_AUTH_KEY);
        window.location.reload();
      });
    }

    initAdminTabs();
    renderAdminAll();
    initAdminModalForm();
    initOfferConfigForm();
  }

  function initAdminTabs() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const sections = document.querySelectorAll('.admin-section-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.style.display = 'none');

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.style.display = 'block';
      });
    });
  }

  function renderAdminAll() {
    renderAdminDashboardStats();
    renderAdminOrdersTable('all');
    renderAdminMenuTable();
    populateOfferConfigForm();
  }

  function renderAdminDashboardStats() {
    const orders = getOrders();
    const menuItems = getMenuItems();

    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0);

    const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

    const salesVal = document.getElementById('admin-stat-sales');
    const ordersVal = document.getElementById('admin-stat-orders');
    const pendingVal = document.getElementById('admin-stat-pending');
    const menuVal = document.getElementById('admin-stat-menu');

    if (salesVal) salesVal.textContent = `$${totalSales.toFixed(2)}`;
    if (ordersVal) ordersVal.textContent = orders.length;
    if (pendingVal) pendingVal.textContent = pendingCount;
    if (menuVal) menuVal.textContent = menuItems.length;
  }

  function renderAdminOrdersTable(filterStatus = 'all') {
    const orders = getOrders();
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = filterStatus === 'all'
      ? orders
      : orders.filter(o => o.status.toLowerCase() === filterStatus.toLowerCase());

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem;">No orders found.</td></tr>`;
      return;
    }

    filtered.forEach(order => {
      const tr = document.createElement('tr');

      const itemsSummary = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');
      const statusClass = order.status.toLowerCase();

      tr.innerHTML = `
        <td><strong>${order.id}</strong><br><small style="color:#777;">${order.date}</small></td>
        <td>
          <strong>${order.customerName}</strong><br>
          <small>${order.phone}</small>
        </td>
        <td><small>${order.address}</small></td>
        <td style="max-width:220px;"><small>${itemsSummary}</small></td>
        <td><strong>$${parseFloat(order.grandTotal).toFixed(2)}</strong><br><small style="text-transform:uppercase;">${order.paymentMethod}</small></td>
        <td>
          <span class="status-badge ${statusClass}">${order.status}</span>
        </td>
        <td>
          <select onchange="updateOrderStatus('${order.id}', this.value)" class="form-select" style="padding:0.4rem; font-size:0.85rem;">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Also populate recent orders table on dashboard tab
    const recentTbody = document.getElementById('admin-recent-orders-tbody');
    if (recentTbody) {
      recentTbody.innerHTML = '';
      orders.slice(0, 4).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${order.id}</strong></td>
          <td>${order.customerName}</td>
          <td>$${parseFloat(order.grandTotal).toFixed(2)}</td>
          <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
        `;
        recentTbody.appendChild(tr);
      });
    }
  }

  window.updateOrderStatus = function (orderId, newStatus) {
    let orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      saveOrders(orders);
      renderAdminDashboardStats();
      renderAdminOrdersTable('all');
      showToast(`Order ${orderId} status updated to ${newStatus}`);
    }
  };

  function renderAdminMenuTable() {
    const items = getMenuItems();
    const tbody = document.getElementById('admin-menu-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${item.image}" style="width:50px; height:50px; border-radius:8px; border:2px solid #000; object-fit:cover;"></td>
        <td><strong>${item.name}</strong></td>
        <td><span class="badge-sticker ${item.badgeClass || 'red'}" style="font-size:0.75rem;">${item.category}</span></td>
        <td><strong>$${parseFloat(item.price).toFixed(2)}</strong></td>
        <td><span class="badge-sticker ${item.badgeClass || 'orange'}" style="font-size:0.75rem;">${item.badge}</span></td>
        <td>
          <button class="action-btn-sm edit-btn" onclick="openEditMenuModal('${item.id}')">Edit ✏️</button>
          <button class="action-btn-sm delete-btn" onclick="deleteMenuItem('${item.id}')">Delete 🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.openAddMenuModal = function () {
    const modal = document.getElementById('menu-item-modal-backdrop');
    const form = document.getElementById('menu-item-form');
    if (!modal || !form) return;

    document.getElementById('modal-form-title').textContent = 'ADD NEW MENU ITEM';
    form.reset();
    document.getElementById('menu-item-id').value = '';
    modal.classList.add('active');
  };

  window.openEditMenuModal = function (itemId) {
    const items = getMenuItems();
    const item = items.find(i => i.id === itemId);
    const modal = document.getElementById('menu-item-modal-backdrop');
    if (!item || !modal) return;

    document.getElementById('modal-form-title').textContent = 'EDIT MENU ITEM';
    document.getElementById('menu-item-id').value = item.id;
    document.getElementById('item-name-input').value = item.name;
    document.getElementById('item-category-input').value = item.category;
    document.getElementById('item-price-input').value = item.price;
    document.getElementById('item-desc-input').value = item.description;
    document.getElementById('item-img-input').value = item.image;
    document.getElementById('item-badge-input').value = item.badge;
    document.getElementById('item-badge-color-input').value = item.badgeClass || 'red';

    modal.classList.add('active');
  };

  window.closeMenuModal = function () {
    const modal = document.getElementById('menu-item-modal-backdrop');
    if (modal) modal.classList.remove('active');
  };

  window.deleteMenuItem = function (itemId) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    let items = getMenuItems();
    items = items.filter(i => i.id !== itemId);
    saveMenuItems(items);

    renderAdminMenuTable();
    renderAdminDashboardStats();
    showToast('Menu item deleted');
  };

  function initAdminModalForm() {
    const form = document.getElementById('menu-item-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const itemId = document.getElementById('menu-item-id').value;
      const name = document.getElementById('item-name-input').value;
      const category = document.getElementById('item-category-input').value;
      const price = parseFloat(document.getElementById('item-price-input').value);
      const desc = document.getElementById('item-desc-input').value;
      const img = document.getElementById('item-img-input').value;
      const badge = document.getElementById('item-badge-input').value;
      const badgeClass = document.getElementById('item-badge-color-input').value;

      let items = getMenuItems();

      if (itemId) {
        // Edit existing
        const existing = items.find(i => i.id === itemId);
        if (existing) {
          existing.name = name;
          existing.category = category;
          existing.price = price;
          existing.description = desc;
          existing.image = img;
          existing.badge = badge;
          existing.badgeClass = badgeClass;
        }
      } else {
        // Add new
        const newId = 'item-' + (Date.now());
        items.push({
          id: newId,
          name: name,
          category: category,
          price: price,
          description: desc,
          image: img || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
          badge: badge || 'NEW',
          badgeClass: badgeClass || 'red'
        });
      }

      saveMenuItems(items);
      closeMenuModal();
      renderAdminMenuTable();
      renderAdminDashboardStats();
      showToast('Menu item saved successfully!');
    });
  }

  function populateOfferConfigForm() {
    const offer = getOfferConfig();
    const titleIn = document.getElementById('offer-title-input');
    const subIn = document.getElementById('offer-subtitle-input');
    const discountIn = document.getElementById('offer-discount-input');
    const imgIn = document.getElementById('offer-img-input');

    if (titleIn && offer.title) titleIn.value = offer.title;
    if (subIn && offer.subtitle) subIn.value = offer.subtitle;
    if (discountIn && offer.discountText) discountIn.value = offer.discountText;
    if (imgIn && offer.image) imgIn.value = offer.image;
  }

  function initOfferConfigForm() {
    const form = document.getElementById('offer-config-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const config = {
        title: document.getElementById('offer-title-input').value,
        subtitle: document.getElementById('offer-subtitle-input').value,
        discountText: document.getElementById('offer-discount-input').value,
        image: document.getElementById('offer-img-input').value
      };

      saveOfferConfig(config);
      showToast('Special Weekend Offer updated!');
    });
  }

  // Global Filter Handler for Orders Tab
  window.filterAdminOrders = function (status) {
    const buttons = document.querySelectorAll('.order-filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderAdminOrdersTable(status);
  };

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    updateNavCartCount();
    renderMenuCards('all');
    renderPromoOffer();
    initMenuTabs();
    initMobileNav();
    initCountdownTimer();
    initTestimonials();
    initScrollBehavior();
    initOrderPage();
    initAdminPanel();
  });

})();
