// Product Database
const products = [
  {
    id: "classic-gold",
    name: "Maison Sadique Classic Gold",
    price: 12500,
    image: "assets/classic-gold.png",
    category: "Classic",
    badge: "Heritage",
    description: "An elegant masterpiece featuring a polished rose gold case and a dark brown alligator leather strap. The crisp white dial is accented by hand-applied Roman numerals and a subtle date display at 3 o'clock, reflecting traditional Swiss horology and Parisian sophistication.",
    specs: {
      "Movement": "Automatic Swiss Calibre",
      "Case": "38mm Rose Gold (18k)",
      "Strap": "Brown Alligator Leather",
      "Water Resistance": "50m (5 ATM)",
      "Power Reserve": "42 Hours"
    }
  },
  {
    id: "chronograph-dark",
    name: "Maison Sadique Chronograph Black",
    price: 18900,
    image: "assets/chronograph-dark.png",
    category: "Chronograph",
    badge: "Best Seller",
    description: "Designed for performance and luxury. Crafted with a matte black steel case and a matching triple-link metal bracelet. Features three precision sub-dials, gold hands, and chronometer functions powered by our signature automatic movement.",
    specs: {
      "Movement": "Swiss Chronograph Automatic",
      "Case": "42mm Matte Black Stainless Steel",
      "Strap": "Black Stainless Steel Link Bracelet",
      "Water Resistance": "100m (10 ATM)",
      "Power Reserve": "48 Hours"
    }
  },
  {
    id: "obsidian-minimal",
    name: "Maison Sadique Obsidian Minimal",
    price: 9500,
    image: "assets/obsidian-minimal.png",
    category: "Minimalist",
    badge: "Modern",
    description: "Sleek. Minimalist. Bold. The Obsidian Minimal showcases a solid matte black case paired with a high-durability black silicone strap. The watch features a dark dial, thin charcoal grey markers, and polished silver hands for a modern architectural aesthetic.",
    specs: {
      "Movement": "Premium Quartz Movement",
      "Case": "40mm Matte Black Composite",
      "Strap": "Black High-Durability Silicone",
      "Water Resistance": "30m (3 ATM)",
      "Battery Life": "3 Years"
    }
  },
  {
    id: "sport-dive",
    name: "Maison Sadique Ocean Master",
    price: 14800,
    image: "assets/sport-dive.png",
    category: "Sport",
    badge: "Limited Edition",
    description: "A premium diving instrument built for the deep. Features a brushed silver stainless steel case, an ocean-blue wave-textured dial, and a rotating blue ceramic bezel. Equipped with luminous markers and hands for high visibility under any condition.",
    specs: {
      "Movement": "Self-Winding Automatic",
      "Case": "41mm Brushed Stainless Steel",
      "Strap": "Stainless Steel Oyster Bracelet",
      "Water Resistance": "300m (30 ATM)",
      "Power Reserve": "38 Hours"
    }
  }
];

// Cart State Manager
let cart = [];

// Load cart from LocalStorage
function loadCart() {
  const savedCart = localStorage.getItem('maison_sadique_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  } else {
    cart = [];
  }
}

// Save cart to LocalStorage
function saveCart() {
  localStorage.setItem('maison_sadique_cart', JSON.stringify(cart));
  updateHeaderCartBadge();
}

// Add Item to Cart
function addToCart(productId, quantity = 1) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
  }
  saveCart();
  showToast(`${products.find(p => p.id === productId).name} added to cart.`);
}

// Remove Item from Cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

// Update Cart Quantity
function updateCartQty(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, parseInt(quantity) || 1);
    saveCart();
  }
}

// Get Cart Items count
function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get Cart Total Price
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear Cart
function clearCart() {
  cart = [];
  saveCart();
}

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

// Dynamic Header Cart Badge
function updateHeaderCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

// Show micro-interaction Toast Notification
function showToast(message) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '2rem';
    container.style.right = '2rem';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.75rem';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'glass-panel';
  toast.style.background = 'rgba(18, 18, 22, 0.9)';
  toast.style.borderLeft = '4px solid #dfc39a';
  toast.style.padding = '1rem 1.5rem';
  toast.style.fontSize = '0.85rem';
  toast.style.letterSpacing = '0.05em';
  toast.style.color = '#ffffff';
  toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
  toast.style.transform = 'translateY(100px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Animate Entry
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);
  
  // Auto Remove
  setTimeout(() => {
    toast.style.transform = 'translateY(-20px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

// WhatsApp Checkout Generator
function generateWhatsAppLink(name, phone, address, notes) {
  // Prefill boutique WhatsApp number (Replace with actual phone if needed)
  const businessNumber = "447123456789"; 
  
  let orderDetailsText = `*NEW ORDER - MAISON SADIQUE*\n`;
  orderDetailsText += `------------------------------------\n`;
  orderDetailsText += `*Customer Info:*\n`;
  orderDetailsText += `Name: ${name}\n`;
  orderDetailsText += `Phone: ${phone}\n`;
  orderDetailsText += `Address: ${address}\n`;
  if (notes) orderDetailsText += `Notes: ${notes}\n`;
  orderDetailsText += `------------------------------------\n`;
  orderDetailsText += `*Order Items:*\n`;
  
  cart.forEach((item, index) => {
    orderDetailsText += `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
  });
  
  orderDetailsText += `------------------------------------\n`;
  orderDetailsText += `*TOTAL AMOUNT: ${formatCurrency(getCartTotal())}*\n`;
  orderDetailsText += `------------------------------------\n`;
  orderDetailsText += `Thank you for choosing Maison Sadique. Please confirm my order request!`;
  
  const encodedText = encodeURIComponent(orderDetailsText);
  return `https://wa.me/${businessNumber}?text=${encodedText}`;
}

// Initialise Header Scroll Shrinking
function initHeaderShrink() {
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    });
  }
}

// Mobile Menu Toggle & Overlay Injection
function initMobileMenu() {
  const header = document.querySelector('header');
  if (!header) return;

  // 1. Create Hamburger button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'mobile-menu-toggle';
  toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
  toggleBtn.innerHTML = `
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  `;

  const navActions = header.querySelector('.nav-actions');
  if (navActions) {
    header.insertBefore(toggleBtn, navActions);
  } else {
    header.appendChild(toggleBtn);
  }

  // 2. Create Mobile Menu Overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';

  const navLinks = header.querySelector('nav');
  let linksHtml = '';
  if (navLinks) {
    linksHtml = navLinks.innerHTML;
  }

  overlay.innerHTML = `
    <div class="mobile-menu-content">
      ${linksHtml}
    </div>
  `;
  document.body.appendChild(overlay);

  // 3. Bind events
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Close mobile overlay on clicking any link
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

// Collapsible Mobile Filters for Shop Page
function initMobileFilters() {
  const sidebar = document.querySelector('.filters-sidebar');
  const shopControls = document.querySelector('.shop-controls');
  if (!sidebar || !shopControls) return;

  const toggleFiltersBtn = document.createElement('button');
  toggleFiltersBtn.className = 'btn-toggle-filters';
  toggleFiltersBtn.innerHTML = `
    <span style="font-size: 1.1rem; line-height: 1; margin-right: 0.25rem;">&#9776;</span>
    <span>Filters</span>
  `;

  shopControls.insertBefore(toggleFiltersBtn, shopControls.firstChild);

  toggleFiltersBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    toggleFiltersBtn.classList.toggle('active');
  });
}

// DOM Page Handlers
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateHeaderCartBadge();
  initHeaderShrink();
  initMobileMenu();

  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);

  // HOMEPAGE handlers
  if (pageName === 'index.html' || pageName === '') {
    renderFeaturedProducts();
  }
  
  // CATALOG handlers
  if (pageName === 'shop.html') {
    initCatalogPage();
    initMobileFilters();
  }
  
  // PRODUCT DETAIL handlers
  if (pageName === 'product.html') {
    initProductDetailPage();
  }
  
  // CART handlers
  if (pageName === 'cart.html') {
    initCartPage();
  }
});

// Render Featured Grid on Homepage
function renderFeaturedProducts() {
  const grid = document.getElementById('featured-products-grid');
  if (!grid) return;
  
  // Show 3 featured watches
  const featured = products.slice(0, 3);
  
  grid.innerHTML = featured.map((product, index) => `
    <article class="product-card" style="view-transition-name: card-${product.id}">
      <div class="product-image-container">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        <div class="product-badge">${product.badge}</div>
        <div class="product-quick-add">
          <button class="btn-quick" onclick="addToCart('${product.id}', 1)">Add to Cart</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${product.id}">
          <h3 class="product-name">${product.name}</h3>
        </a>
        <span class="product-price">${formatCurrency(product.price)}</span>
      </div>
    </article>
  `).join('');
}

// Filter and Sort Catalog Page
function initCatalogPage() {
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('catalog-count');
  if (!grid) return;

  const filters = {
    categories: [],
    materials: [],
    priceRange: null
  };
  
  let currentSort = 'default';

  // Render complete catalog
  function renderCatalog() {
    let filteredProducts = products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // Material filter
      if (filters.materials.length > 0) {
        const productMaterial = product.specs['Case'].toLowerCase();
        const matchesMaterial = filters.materials.some(m => productMaterial.includes(m.toLowerCase()));
        if (!matchesMaterial) return false;
      }
      
      // Price filter
      if (filters.priceRange) {
        if (filters.priceRange === 'under-10k' && product.price >= 10000) return false;
        if (filters.priceRange === '10k-15k' && (product.price < 10000 || product.price > 15000)) return false;
        if (filters.priceRange === 'over-15k' && product.price <= 15000) return false;
      }

      return true;
    });

    // Sorting
    if (currentSort === 'price-low') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Render HTML
    if (filteredProducts.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; padding: 4rem 0; text-align: center; color: var(--text-secondary);">No watches match your selection.</div>`;
    } else {
      grid.innerHTML = filteredProducts.map(product => `
        <article class="product-card" style="view-transition-name: card-${product.id}">
          <div class="product-image-container">
            <a href="product.html?id=${product.id}">
              <img src="${product.image}" alt="${product.name}" loading="lazy">
            </a>
            <div class="product-badge">${product.badge}</div>
            <div class="product-quick-add">
              <button class="btn-quick" onclick="addToCart('${product.id}', 1)">Add to Cart</button>
            </div>
          </div>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <a href="product.html?id=${product.id}">
              <h3 class="product-name">${product.name}</h3>
            </a>
            <span class="product-price">${formatCurrency(product.price)}</span>
          </div>
        </article>
      `).join('');
    }
    
    countEl.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Watch' : 'Watches'}`;
  }

  // Bind side filters
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const type = e.target.name;
      const val = e.target.value;
      
      if (type === 'category') {
        if (e.target.checked) {
          filters.categories.push(val);
        } else {
          filters.categories = filters.categories.filter(c => c !== val);
        }
      } else if (type === 'material') {
        if (e.target.checked) {
          filters.materials.push(val);
        } else {
          filters.materials = filters.materials.filter(m => m !== val);
        }
      } else if (type === 'price') {
        if (e.target.checked) {
          // Uncheck other price checkboxes to make it single select
          document.querySelectorAll('input[name="price"]').forEach(cb => {
            if (cb !== e.target) cb.checked = false;
          });
          filters.priceRange = val;
        } else {
          filters.priceRange = null;
        }
      }

      // Smooth render catalog
      if (document.startViewTransition) {
        document.startViewTransition(() => renderCatalog());
      } else {
        renderCatalog();
      }
    });
  });

  // Bind Sort Selection
  const sortSelect = document.getElementById('catalog-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      if (document.startViewTransition) {
        document.startViewTransition(() => renderCatalog());
      } else {
        renderCatalog();
      }
    });
  }

  // First render
  renderCatalog();
}

// Product Detail Page rendering & interactivity
function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'classic-gold'; // Fallback
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    window.location.href = 'shop.html';
    return;
  }

  // Load product content into DOM
  document.getElementById('pdp-name').textContent = product.name;
  document.getElementById('pdp-price').textContent = formatCurrency(product.price);
  document.getElementById('pdp-description').textContent = product.description;
  
  const mainImg = document.getElementById('pdp-main-img');
  mainImg.src = product.image;
  mainImg.alt = product.name;
  
  // Set view transition name on detail image for transition morphing
  mainImg.style.viewTransitionName = `card-${product.id}`;

  // Populate thumbnails (using same image for prototype gallery)
  const thumbnailsContainer = document.getElementById('pdp-thumbnails');
  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = Array(4).fill(null).map((_, index) => `
      <button class="thumbnail-btn ${index === 0 ? 'active' : ''}" onclick="switchGalleryImage(this, '${product.image}')">
        <img src="${product.image}" alt="${product.name} View ${index + 1}">
      </button>
    `).join('');
  }

  // Populate specs table
  const specsList = document.getElementById('pdp-specs-list');
  if (specsList) {
    specsList.innerHTML = Object.entries(product.specs).map(([label, value]) => `
      <div class="spec-row">
        <span class="spec-label">${label}</span>
        <span class="spec-value">${value}</span>
      </div>
    `).join('');
  }

  // Accordion Expand/Collapse
  const accordionHeader = document.querySelector('.accordion-header');
  if (accordionHeader) {
    accordionHeader.addEventListener('click', () => {
      const item = accordionHeader.parentElement;
      item.classList.toggle('active');
    });
  }

  // Quantity control buttons
  let qty = 1;
  const qtyInput = document.getElementById('pdp-qty');
  const minusBtn = document.getElementById('pdp-minus');
  const plusBtn = document.getElementById('pdp-plus');

  if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyInput.value = qty;
      }
    });
    plusBtn.addEventListener('click', () => {
      qty++;
      qtyInput.value = qty;
    });
  }

  // Add to cart buttons
  const addCartBtn = document.getElementById('pdp-add-cart');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      addToCart(product.id, qty);
    });
  }

  // WhatsApp inquiry button
  const waInquireBtn = document.getElementById('pdp-wa-inquire');
  if (waInquireBtn) {
    waInquireBtn.addEventListener('click', () => {
      const businessNumber = "447123456789";
      const message = `Hello Maison Sadique, I am interested in inquiring about the *${product.name}* (${formatCurrency(product.price)}). Can you provide details on current availability?`;
      window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });
  }
}

// Switch gallery thumbnails
function switchGalleryImage(btn, imageSrc) {
  document.querySelectorAll('.thumbnail-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const mainImg = document.getElementById('pdp-main-img');
  mainImg.src = imageSrc;
}

// Shopping Cart Page Rendering & checkout submit
function initCartPage() {
  const itemsContainer = document.getElementById('cart-items-container');
  const summaryPanel = document.getElementById('cart-summary-panel');
  const checkoutView = document.getElementById('cart-checkout-view');
  const emptyView = document.getElementById('cart-empty-view');

  function renderCartPage() {
    loadCart();
    
    if (cart.length === 0) {
      if (checkoutView) checkoutView.style.display = 'none';
      if (emptyView) emptyView.style.display = 'flex';
      return;
    }

    if (checkoutView) checkoutView.style.display = 'grid';
    if (emptyView) emptyView.style.display = 'none';

    // Render Items
    if (itemsContainer) {
      itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-row">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <span class="cart-item-meta">Exclusive Boutique Series</span>
            <span class="cart-item-price">${formatCurrency(item.price)}</span>
          </div>
          <div class="cart-item-actions">
            <div class="cart-qty">
              <button class="cart-qty-btn" onclick="adjustCartQty('${item.id}', -1)">-</button>
              <input type="text" class="cart-qty-input" value="${item.quantity}" readonly>
              <button class="cart-qty-btn" onclick="adjustCartQty('${item.id}', 1)">+</button>
            </div>
            <button class="btn-remove" onclick="removeCartItem('${item.id}')">Remove</button>
          </div>
        </div>
      `).join('');
    }

    // Render Summary
    const subtotal = getCartTotal();
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (totalEl) totalEl.textContent = formatCurrency(subtotal);
  }

  // Bind Checkout form submit
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('cus-name').value.trim();
      const phone = document.getElementById('cus-phone').value.trim();
      const address = document.getElementById('cus-address').value.trim();
      const notes = document.getElementById('cus-notes').value.trim();
      
      if (!name || !phone || !address) {
        showToast("Please fill in all required fields.");
        return;
      }

      // Generate link and open
      const link = generateWhatsAppLink(name, phone, address, notes);
      window.open(link, '_blank');
      
      // Clear cart after redirect
      clearCart();
      renderCartPage();
      showToast("Redirecting to WhatsApp to complete checkout...");
    });
  }

  // Exposed global click handlers for cart
  window.adjustCartQty = function(id, val) {
    const item = cart.find(i => i.id === id);
    if (item) {
      const newQty = item.quantity + val;
      if (newQty <= 0) {
        removeCartItem(id);
      } else {
        updateCartQty(id, newQty);
        renderCartPage();
      }
    }
  };

  window.removeCartItem = function(id) {
    removeFromCart(id);
    if (document.startViewTransition) {
      document.startViewTransition(() => renderCartPage());
    } else {
      renderCartPage();
    }
  };

  renderCartPage();
}
