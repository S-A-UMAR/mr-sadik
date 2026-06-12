// Load theme immediately to prevent layout flashes
(function() {
  const savedTheme = localStorage.getItem('maison_sadique_theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }
})();

// Default Product Database
const defaultProducts = [
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

// Global State
let products = [];
let cart = [];
let orders = [];

// Load products database
function loadProducts() {
  const saved = localStorage.getItem('maison_sadique_products');
  if (saved) {
    try {
      products = JSON.parse(saved);
    } catch (e) {
      products = [...defaultProducts];
    }
  } else {
    products = [...defaultProducts];
    saveProducts();
  }
}

function saveProducts() {
  localStorage.setItem('maison_sadique_products', JSON.stringify(products));
}

// Load cart state
function loadCart() {
  const saved = localStorage.getItem('maison_sadique_cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  } else {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem('maison_sadique_cart', JSON.stringify(cart));
  updateHeaderCartBadge();
}

// Settings helpers
function getWhatsAppNumber() {
  return localStorage.getItem('maison_sadique_wa_number') || '447123456789';
}

function getCurrencySymbol() {
  return localStorage.getItem('maison_sadique_currency') || '$';
}

function getCurrencyCode() {
  const sym = getCurrencySymbol();
  if (sym === '€') return 'EUR';
  if (sym === '£') return 'GBP';
  return 'USD';
}

// Format Currency
function formatCurrency(amount) {
  const code = getCurrencyCode();
  const symbol = getCurrencySymbol();
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0
  }).format(amount);
}

// Load orders database
function loadOrders() {
  const saved = localStorage.getItem('maison_sadique_orders');
  if (saved) {
    try {
      orders = JSON.parse(saved);
    } catch (e) {
      orders = [];
    }
  } else {
    orders = [];
  }
}

function saveOrders() {
  localStorage.setItem('maison_sadique_orders', JSON.stringify(orders));
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

// Toast Notification
function showToast(message) {
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
  
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);
  
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
  const businessNumber = getWhatsAppNumber();
  
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
      <a href="admin.html" style="font-size: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; color: var(--accent-gold);">Atelier Admin</a>
    </div>
  `;
  document.body.appendChild(overlay);

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

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

// Dynamic about quote check
function initAboutPageQuote() {
  const quoteEl = document.querySelector('.editorial-para');
  if (quoteEl) {
    const savedQuote = localStorage.getItem('maison_sadique_about_quote');
    if (savedQuote) {
      quoteEl.textContent = savedQuote;
    }
  }
}

// Update all hardcoded WhatsApp links with the user-defined business number
function updateWhatsAppLinks() {
  const businessNumber = getWhatsAppNumber();
  const links = document.querySelectorAll('a[href*="wa.me"]');
  links.forEach(link => {
    link.href = link.href.replace(/wa\.me\/447123456789/g, `wa.me/${businessNumber}`);
  });
}

// Load Products immediately on execution
loadProducts();
loadOrders();

// DOM Page Handlers
document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  loadCart();
  updateHeaderCartBadge();
  initHeaderShrink();
  initMobileMenu();
  updateWhatsAppLinks();

  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);

  // CONTACT handlers
  if (pageName === 'contact.html') {
    initContactPage();
  }

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

  // ABOUT handlers
  if (pageName === 'about.html') {
    initAboutPageQuote();
  }
});

// Render Featured Grid on Homepage
function renderFeaturedProducts() {
  const grid = document.getElementById('featured-products-grid');
  if (!grid) return;
  
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

  function renderCatalog() {
    let filteredProducts = products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // Material filter
      if (filters.materials.length > 0) {
        const productMaterial = (product.specs['Case'] || '').toLowerCase();
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
          document.querySelectorAll('input[name="price"]').forEach(cb => {
            if (cb !== e.target) cb.checked = false;
          });
          filters.priceRange = val;
        } else {
          filters.priceRange = null;
        }
      }

      if (document.startViewTransition) {
        document.startViewTransition(() => renderCatalog());
      } else {
        renderCatalog();
      }
    });
  });

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

  renderCatalog();
}

// Product Detail Page rendering
function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'classic-gold';
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    window.location.href = 'shop.html';
    return;
  }

  document.getElementById('pdp-name').textContent = product.name;
  document.getElementById('pdp-price').textContent = formatCurrency(product.price);
  document.getElementById('pdp-description').textContent = product.description;
  
  const mainImg = document.getElementById('pdp-main-img');
  mainImg.src = product.image;
  mainImg.alt = product.name;
  mainImg.style.viewTransitionName = `card-${product.id}`;

  const thumbnailsContainer = document.getElementById('pdp-thumbnails');
  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = Array(4).fill(null).map((_, index) => `
      <button class="thumbnail-btn ${index === 0 ? 'active' : ''}" onclick="switchGalleryImage(this, '${product.image}')">
        <img src="${product.image}" alt="${product.name} View ${index + 1}">
      </button>
    `).join('');
  }

  const specsList = document.getElementById('pdp-specs-list');
  if (specsList) {
    specsList.innerHTML = Object.entries(product.specs).map(([label, value]) => `
      <div class="spec-row">
        <span class="spec-label">${label}</span>
        <span class="spec-value">${value}</span>
      </div>
    `).join('');
  }

  const accordionHeader = document.querySelector('.accordion-header');
  if (accordionHeader) {
    accordionHeader.addEventListener('click', () => {
      const item = accordionHeader.parentElement;
      item.classList.toggle('active');
    });
  }

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

  const addCartBtn = document.getElementById('pdp-add-cart');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      addToCart(product.id, qty);
    });
  }

  const waInquireBtn = document.getElementById('pdp-wa-inquire');
  if (waInquireBtn) {
    waInquireBtn.addEventListener('click', () => {
      const businessNumber = getWhatsAppNumber();
      const message = `Hello Maison Sadique, I am interested in inquiring about the *${product.name}* (${formatCurrency(product.price)}). Can you provide details on current availability?`;
      window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });
  }
}

function switchGalleryImage(btn, imageSrc) {
  document.querySelectorAll('.thumbnail-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const mainImg = document.getElementById('pdp-main-img');
  mainImg.src = imageSrc;
}

// Shopping Cart Page Rendering & checkout submit
function initCartPage() {
  const itemsContainer = document.getElementById('cart-items-container');
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

    const subtotal = getCartTotal();
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (totalEl) totalEl.textContent = formatCurrency(subtotal);
  }

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

      // Save order details to local database first
      const newOrder = {
        id: 'MS-' + Math.floor(100000 + Math.random() * 900000),
        name: name,
        phone: phone,
        address: address,
        notes: notes,
        items: [...cart],
        total: getCartTotal(),
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      
      orders.push(newOrder);
      saveOrders();

      // Generate link and redirect
      const link = generateWhatsAppLink(name, phone, address, notes);
      window.open(link, '_blank');
      
      clearCart();
      renderCartPage();
      showToast("Redirecting to WhatsApp to complete checkout...");
    });
  }

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

// ----------------------------------------------------
// ATELIER ADMIN CRUD & SETTINGS FUNCTIONS (For admin.html)
// ----------------------------------------------------

window.adminAddProduct = function(product) {
  loadProducts();
  
  // Check unique ID
  const existing = products.find(p => p.id === product.id);
  if (existing) {
    showToast("Product ID must be unique.");
    return false;
  }

  products.push(product);
  saveProducts();
  showToast(`Watch "${product.name}" added successfully.`);
  return true;
};

window.adminEditProduct = function(updatedProduct) {
  loadProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    saveProducts();
    showToast(`Watch "${updatedProduct.name}" updated successfully.`);
    return true;
  }
  showToast("Product not found.");
  return false;
};

window.adminDeleteProduct = function(productId) {
  loadProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id !== productId);
  if (products.length < initialLength) {
    saveProducts();
    showToast("Watch deleted successfully.");
    return true;
  }
  return false;
};

window.adminUpdateOrderStatus = function(orderId, newStatus) {
  loadOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrders();
    showToast(`Order status updated to ${newStatus}.`);
    return true;
  }
  return false;
};

window.adminUpdateSettings = function(waNumber, currency, aboutQuote) {
  localStorage.setItem('maison_sadique_wa_number', waNumber);
  localStorage.setItem('maison_sadique_currency', currency);
  localStorage.setItem('maison_sadique_about_quote', aboutQuote);
  showToast("Settings saved successfully.");
  return true;
};

// ----------------------------------------------------
// CONTACT US PAGE FUNCTIONS
// ----------------------------------------------------
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const interest = document.getElementById('c-interest').value;
    const message = document.getElementById('c-message').value.trim();

    const newInquiry = {
      id: 'INQ-' + Math.floor(100000 + Math.random() * 900000),
      name: name,
      email: email,
      interest: interest,
      message: message,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save to local storage inquiries database
    const saved = localStorage.getItem('maison_sadique_inquiries');
    let inquiries = [];
    if (saved) {
      try { inquiries = JSON.parse(saved); } catch(err) { inquiries = []; }
    }
    inquiries.push(newInquiry);
    localStorage.setItem('maison_sadique_inquiries', JSON.stringify(inquiries));

    // Show success modal
    const modal = document.getElementById('contact-success-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.classList.add('no-scroll');
    }

    form.reset();
  });
}

window.closeSuccessModal = function() {
  const modal = document.getElementById('contact-success-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('no-scroll');
  }
};

// ----------------------------------------------------
// FLOATING THEME SWITCHER
// ----------------------------------------------------
function initThemeSwitcher() {
  if (document.querySelector('.theme-switcher-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'theme-switcher-btn';
  btn.setAttribute('aria-label', 'Switch color theme');
  btn.innerHTML = `
    <!-- Sun Icon (shown in Light Theme) -->
    <svg class="sun-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
    <!-- Moon Icon (shown in Dark Theme) -->
    <svg class="moon-icon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  `;

  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('maison_sadique_theme', isLight ? 'light' : 'dark');
  });
}
