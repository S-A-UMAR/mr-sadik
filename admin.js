/**
 * ════════════════════════════════════════════════════
 *  MAISON SADIQUE — ADMIN PORTAL CONTROLLER
 *  Full admin functionality: Dashboard, Analytics,
 *  Inventory CRUD, Order Management, Customers, Media
 * ════════════════════════════════════════════════════
 */

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure app.js data is loaded
  if (typeof window.loadProducts === 'function') window.loadProducts();
  if (typeof window.loadOrders === 'function') window.loadOrders();

  // Initialize all modules
  initSidebar();
  initTabs();
  initProductImagePreview();
  initForms();

  // Render initial data
  refreshAllData();

  // Log initialization
  addActivity('Admin portal initialized', 'gold');
});

/* ──────────────────────────────────────────────
   SIDEBAR — Mobile hamburger toggle
────────────────────────────────────────────── */
function initSidebar() {
  const hamburger = document.getElementById('admin-hamburger');
  const sidebar   = document.getElementById('admin-sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  if (!hamburger) return;

  const openSidebar = () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
  };
  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
  };

  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);
}

/* ──────────────────────────────────────────────
   TAB NAVIGATION
────────────────────────────────────────────── */
function initTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.dataset.tab;
      switchTab(targetTab);

      // Close sidebar on mobile after click
      if (window.innerWidth < 1024) {
        document.getElementById('admin-sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
        document.getElementById('admin-hamburger').classList.remove('open');
      }
    });
  });
}

window.switchTab = function(tabName) {
  // Update nav items
  document.querySelectorAll('.admin-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  // Update tab panels
  document.querySelectorAll('.admin-tab-content').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });
  // Refresh tab-specific data
  refreshTab(tabName);
};

function refreshTab(tabName) {
  switch (tabName) {
    case 'dashboard':  renderDashboard(); break;
    case 'analytics':  renderAnalytics(); break;
    case 'products':   renderInventoryTable(); break;
    case 'orders':     renderOrdersTable(); break;
    case 'customers':  renderCustomers(); break;
    case 'media':      renderMediaLibrary(); break;
    case 'settings':   loadSettingsForm(); break;
  }
}

function refreshAllData() {
  renderDashboard();
  renderInventoryTable();
  renderOrdersTable();
  renderAnalytics();
  renderCustomers();
  renderMediaLibrary();
  loadSettingsForm();
  updateNavBadges();
}

/* ──────────────────────────────────────────────
   DASHBOARD
────────────────────────────────────────────── */
function renderDashboard() {
  const products = window.products || [];
  const orders   = window.orders   || [];

  // KPI: Products
  setEl('kpi-products', products.length);

  // KPI: Catalog value
  const totalVal = products.reduce((s, p) => s + (p.price || 0), 0);
  setEl('kpi-value', fmtCurrency(totalVal));

  // KPI: Orders + pending
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  setEl('kpi-orders', orders.length);
  setEl('kpi-orders-pending', `${pendingOrders.length} pending`);

  // KPI: Unique customers
  const uniqueCustomers = new Set(orders.map(o => o.phone)).size;
  setEl('kpi-customers', uniqueCustomers);

  // Bar chart (simulated weekly data)
  renderBarChart();

  // Recent orders panel
  renderRecentOrders(orders);

  // Sys info
  setEl('sys-products', products.length);
  setEl('sys-orders', orders.length);
}

function renderBarChart() {
  const container = document.getElementById('bar-chart');
  if (!container) return;
  const days = [
    { label: 'Mon', val: 38 + Math.floor(Math.random() * 20) },
    { label: 'Tue', val: 52 + Math.floor(Math.random() * 30) },
    { label: 'Wed', val: 61 + Math.floor(Math.random() * 20) },
    { label: 'Thu', val: 79 + Math.floor(Math.random() * 20) },
    { label: 'Fri', val: 65 + Math.floor(Math.random() * 20) },
    { label: 'Sat', val: 42 + Math.floor(Math.random() * 15) },
    { label: 'Sun', val: 34 + Math.floor(Math.random() * 15) },
  ];
  const maxVal = Math.max(...days.map(d => d.val));
  container.innerHTML = days.map(d => {
    const pct = Math.round((d.val / maxVal) * 100);
    return `
      <div class="bar-chart-item">
        <div class="bar-chart-bar" style="height: ${pct}%;" title="${d.val} inquiries">
          <span class="bar-chart-label">${d.label}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecentOrders(orders) {
  const container = document.getElementById('dashboard-recent-orders');
  if (!container) return;
  if (orders.length === 0) {
    container.innerHTML = '<div class="empty-state-sm">No orders yet</div>';
    return;
  }
  const recent = [...orders].slice(-5).reverse();
  container.innerHTML = recent.map(o => `
    <div class="recent-order-item">
      <div>
        <div class="ro-name">${escHtml(o.name)}</div>
        <div class="ro-id">${escHtml(o.id)} · <span class="badge-status ${o.status.toLowerCase()}">${o.status}</span></div>
      </div>
      <div class="ro-total">${fmtCurrency(o.total)}</div>
    </div>
  `).join('');
}

/* ──────────────────────────────────────────────
   ANALYTICS
────────────────────────────────────────────── */
function renderAnalytics() {
  const products = window.products || [];
  const orders   = window.orders   || [];

  // Avg order value
  const totalOrderVal = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = orders.length ? totalOrderVal / orders.length : 0;
  setEl('anal-avg-order', fmtCurrency(avgOrder));

  // Avg catalog price
  const avgPrice = products.length
    ? products.reduce((s, p) => s + (p.price || 0), 0) / products.length
    : 0;
  setEl('anal-avg-price', fmtCurrency(avgPrice));

  // Price distribution chart
  renderPriceDistChart(products);

  // Category breakdown table
  renderCategoryTable(products);
}

function renderPriceDistChart(products) {
  const container = document.getElementById('price-dist-chart');
  if (!container) return;
  const ranges = [
    { label: 'Under $5,000',       fn: p => p.price < 5000 },
    { label: '$5k – $10k',         fn: p => p.price >= 5000  && p.price < 10000 },
    { label: '$10k – $25k',        fn: p => p.price >= 10000 && p.price < 25000 },
    { label: '$25k – $50k',        fn: p => p.price >= 25000 && p.price < 50000 },
    { label: '$50,000+',           fn: p => p.price >= 50000 },
  ];
  if (products.length === 0) {
    container.innerHTML = '<div class="empty-state-sm" style="padding: 2rem;">No products in inventory yet.</div>';
    return;
  }
  const maxCount = Math.max(1, ...ranges.map(r => products.filter(r.fn).length));
  container.innerHTML = ranges.map(r => {
    const count = products.filter(r.fn).length;
    const pct   = Math.round((count / maxCount) * 100);
    return `
      <div class="price-dist-item">
        <div class="price-dist-label">${r.label}</div>
        <div class="price-dist-bar-wrap">
          <div class="price-dist-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="price-dist-val">${count} piece${count !== 1 ? 's' : ''}</div>
      </div>
    `;
  }).join('');
}

function renderCategoryTable(products) {
  const tbody = document.querySelector('#analytics-category-table tbody');
  if (!tbody) return;
  const categories = ['Classic', 'Chronograph', 'Minimalist', 'Sport'];
  const totalValue = products.reduce((s, p) => s + (p.price || 0), 0) || 1;
  tbody.innerHTML = categories.map(cat => {
    const items   = products.filter(p => p.category === cat);
    const avg     = items.length ? items.reduce((s, p) => s + p.price, 0) / items.length : 0;
    const share   = items.length ? Math.round((items.reduce((s,p) => s+p.price, 0) / totalValue) * 100) : 0;
    const status  = items.length > 1 ? 'Active' : items.length === 1 ? 'Limited' : 'Empty';
    const scls    = { Active: 'completed', Limited: 'pending', Empty: 'cancelled' }[status];
    return `
      <tr>
        <td class="table-name-cell">${cat}</td>
        <td>${items.length} piece${items.length !== 1 ? 's' : ''}</td>
        <td class="table-price-cell">${fmtCurrency(avg)}</td>
        <td>
          <div style="display:flex; align-items:center; gap:.5rem;">
            <div style="background:rgba(255,255,255,.05); border-radius:4px; height:6px; width:80px; overflow:hidden;">
              <div style="background:var(--accent-gold); width:${share}%; height:100%; border-radius:4px;"></div>
            </div>
            <span style="font-size:.75rem; color:var(--text-secondary);">${share}%</span>
          </div>
        </td>
        <td><span class="badge-status ${scls}">${status}</span></td>
      </tr>
    `;
  }).join('');
}

/* ──────────────────────────────────────────────
   INVENTORY TABLE
────────────────────────────────────────────── */
let currentView = 'table';
let selectedProductIds = new Set();

function renderInventoryTable() {
  const products = getFilteredProducts();
  setEl('products-count-display', `${products.length} timepiece${products.length !== 1 ? 's' : ''}`);
  setEl('nav-count-products', window.products ? window.products.length : 0);

  // Table view
  const tbody = document.getElementById('admin-products-tbody');
  if (tbody) {
    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:3rem; color:var(--text-tertiary);">No timepieces found. <button onclick="openCrudModal(false)" style="background:none;border:none;color:var(--accent-gold);cursor:pointer;font-family:var(--font-sans);font-size:0.82rem;">Add one →</button></td></tr>`;
    } else {
      tbody.innerHTML = products.map(p => `
        <tr>
          <td><input type="checkbox" ${selectedProductIds.has(p.id) ? 'checked' : ''} onchange="toggleProductSelect('${p.id}', this.checked)"></td>
          <td>
            <div class="admin-table-img">
              <img src="${p.image}" alt="${escHtml(p.name)}" loading="lazy">
            </div>
          </td>
          <td><code>${escHtml(p.id)}</code></td>
          <td class="table-name-cell">${escHtml(p.name)}</td>
          <td class="table-price-cell">${fmtCurrency(p.price)}</td>
          <td>${escHtml(p.category)}</td>
          <td><span class="badge-label ${p.badge ? '' : 'none'}">${p.badge || 'None'}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-table-view" onclick="viewProduct('${p.id}')">View</button>
              <button class="btn-table-edit" onclick="triggerEditProduct('${p.id}')">Edit</button>
              <button class="btn-table-delete" onclick="triggerDeleteProduct('${p.id}')">Del</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // Grid view
  const grid = document.getElementById('products-grid-view');
  if (grid) {
    if (products.length === 0) {
      grid.innerHTML = '<div class="empty-state-sm" style="grid-column:1/-1;">No timepieces found.</div>';
    } else {
      grid.innerHTML = products.map(p => `
        <div class="admin-product-card">
          <div class="admin-product-card-img">
            <img src="${p.image}" alt="${escHtml(p.name)}" loading="lazy">
          </div>
          <div class="admin-product-card-body">
            <div class="admin-product-card-name">${escHtml(p.name)}</div>
            <div class="admin-product-card-price">${fmtCurrency(p.price)}</div>
            <div class="admin-product-card-actions">
              <button class="btn-table-edit" onclick="triggerEditProduct('${p.id}')" style="flex:1;justify-content:center;">Edit</button>
              <button class="btn-table-delete" onclick="triggerDeleteProduct('${p.id}')">Del</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  updateBulkBar();
}

function getFilteredProducts() {
  const products = window.products || [];
  const query = (document.getElementById('product-search')?.value || '').toLowerCase();
  const cat   = (document.getElementById('product-filter-cat')?.value || '');
  return products.filter(p => {
    const matchQuery = !query || p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    const matchCat   = !cat   || p.category === cat;
    return matchQuery && matchCat;
  });
}

window.filterProducts = function() { renderInventoryTable(); };

window.switchView = function(view) {
  currentView = view;
  document.getElementById('products-table-view').style.display = view === 'table' ? '' : 'none';
  document.getElementById('products-grid-view').style.display  = view === 'grid'  ? '' : 'none';
  document.getElementById('toggle-table').classList.toggle('active', view === 'table');
  document.getElementById('toggle-grid').classList.toggle('active', view === 'grid');
};

// Selection
window.toggleProductSelect = function(id, checked) {
  checked ? selectedProductIds.add(id) : selectedProductIds.delete(id);
  updateBulkBar();
};
window.toggleSelectAll = function() {
  const allChecked = document.getElementById('select-all-products')?.checked;
  const products = getFilteredProducts();
  products.forEach(p => allChecked ? selectedProductIds.add(p.id) : selectedProductIds.delete(p.id));
  renderInventoryTable();
};
function updateBulkBar() {
  const bar = document.getElementById('bulk-actions-bar');
  const countLabel = document.getElementById('bulk-count-label');
  if (!bar) return;
  if (selectedProductIds.size > 0) {
    bar.style.display = 'flex';
    if (countLabel) countLabel.textContent = `${selectedProductIds.size} selected`;
  } else {
    bar.style.display = 'none';
  }
}
window.clearSelection = function() {
  selectedProductIds.clear();
  renderInventoryTable();
};
window.bulkDelete = function() {
  if (selectedProductIds.size === 0) return;
  showConfirm(
    'Delete Selected',
    `Are you sure you want to delete ${selectedProductIds.size} timepiece(s)? This cannot be undone.`,
    () => {
      selectedProductIds.forEach(id => window.adminDeleteProduct && window.adminDeleteProduct(id));
      selectedProductIds.clear();
      renderInventoryTable();
      updateNavBadges();
      showToast(`${selectedProductIds.size || 'Selected'} timepieces deleted.`, 'error');
    }
  );
};

/* ──────────────────────────────────────────────
   CRUD MODAL
────────────────────────────────────────────── */
window.openCrudModal = function(isEdit, id) {
  const modal     = document.getElementById('crud-modal');
  const titleText = document.getElementById('modal-title-text');
  const editFlag  = document.getElementById('edit-mode-flag');
  const idInput   = document.getElementById('prod-id');

  if (isEdit) {
    titleText.textContent = 'Edit Timepiece';
    editFlag.value = 'true';
    idInput.disabled = true;

    const product = (window.products || []).find(p => p.id === id);
    if (product) {
      idInput.value = product.id;
      setInputVal('prod-name',    product.name);
      setInputVal('prod-price',   product.price);
      setInputVal('prod-image',   product.image);
      setInputVal('prod-category',product.category);
      setInputVal('prod-badge',   product.badge || '');
      setInputVal('prod-desc',    product.description);
      setInputVal('spec-mov',     product.specs?.['Movement'] || '');
      setInputVal('spec-case',    product.specs?.['Case'] || '');
      setInputVal('spec-strap',   product.specs?.['Strap'] || '');
      setInputVal('spec-water',   product.specs?.['Water Resistance'] || '');
      updateImagePreview(product.image);
    }
  } else {
    titleText.textContent = 'Add Timepiece';
    editFlag.value = 'false';
    idInput.disabled = false;
    document.getElementById('crud-form').reset();
    updateImagePreview('');
  }

  modal.classList.add('active');
  document.body.classList.add('no-scroll');
};

window.closeCrudModal = function() {
  document.getElementById('crud-modal').classList.remove('active');
  document.body.classList.remove('no-scroll');
};

// Form submit
document.getElementById('crud-form').addEventListener('submit', e => {
  e.preventDefault();

  const isEdit = document.getElementById('edit-mode-flag').value === 'true';
  const watch  = {
    id:          document.getElementById('prod-id').value.trim(),
    name:        document.getElementById('prod-name').value.trim(),
    price:       parseFloat(document.getElementById('prod-price').value),
    image:       document.getElementById('prod-image').value,
    category:    document.getElementById('prod-category').value,
    badge:       document.getElementById('prod-badge').value.trim(),
    description: document.getElementById('prod-desc').value.trim(),
    specs: {
      'Movement':         document.getElementById('spec-mov').value.trim(),
      'Case':             document.getElementById('spec-case').value.trim(),
      'Strap':            document.getElementById('spec-strap').value.trim(),
      'Water Resistance': document.getElementById('spec-water').value.trim(),
    }
  };

  const ok = isEdit
    ? (window.adminEditProduct && window.adminEditProduct(watch))
    : (window.adminAddProduct  && window.adminAddProduct(watch));

  if (ok) {
    closeCrudModal();
    renderInventoryTable();
    renderDashboard();
    renderAnalytics();
    updateNavBadges();
    addActivity(`${isEdit ? 'Updated' : 'Added'} timepiece: ${watch.name}`, isEdit ? 'blue' : 'green');
    showToast(`Timepiece "${watch.name}" ${isEdit ? 'updated' : 'added'} successfully.`, 'success');
  } else {
    showToast(`Could not ${isEdit ? 'update' : 'add'} timepiece. Check for duplicate ID.`, 'error');
  }
});

// Image preview on select change
function initProductImagePreview() {
  const sel = document.getElementById('prod-image');
  if (sel) sel.addEventListener('change', () => updateImagePreview(sel.value));
}

function updateImagePreview(src) {
  const wrap = document.querySelector('.img-preview-wrap');
  const img  = document.getElementById('modal-img-preview');
  if (!wrap || !img) return;
  if (src) {
    img.src = src;
    wrap.classList.add('has-img');
  } else {
    img.src = '';
    wrap.classList.remove('has-img');
  }
}

/* CRUD triggers */
window.triggerEditProduct = function(id) { openCrudModal(true, id); };

window.triggerDeleteProduct = function(id) {
  const product = (window.products || []).find(p => p.id === id);
  if (!product) return;
  showConfirm(
    'Delete Timepiece',
    `Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`,
    () => {
      if (window.adminDeleteProduct && window.adminDeleteProduct(id)) {
        renderInventoryTable();
        renderDashboard();
        renderAnalytics();
        updateNavBadges();
        addActivity(`Deleted timepiece: ${product.name}`, 'red');
        showToast(`"${product.name}" has been deleted.`, 'error');
      }
    }
  );
};

window.viewProduct = function(id) {
  const product = (window.products || []).find(p => p.id === id);
  if (!product) return;
  alert(`${product.name}\nPrice: ${fmtCurrency(product.price)}\nCategory: ${product.category}\n\n${product.description}`);
};

/* ──────────────────────────────────────────────
   ORDERS
────────────────────────────────────────────── */
function renderOrdersTable() {
  const orders = getFilteredOrders();
  const all    = window.orders || [];

  // Status pills count
  setEl('os-pending',   all.filter(o => o.status === 'Pending').length);
  setEl('os-contacted', all.filter(o => o.status === 'Contacted').length);
  setEl('os-completed', all.filter(o => o.status === 'Completed').length);
  setEl('os-cancelled', all.filter(o => o.status === 'Cancelled').length);

  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:3rem; color:var(--text-tertiary);">No orders found.</td></tr>`;
    return;
  }

  tbody.innerHTML = [...orders].reverse().map(o => {
    const itemsList = (o.items || []).map(i => `${i.name} (×${i.quantity})`).join(', ');
    return `
      <tr>
        <td><code>${escHtml(o.id)}</code></td>
        <td>${escHtml(o.date)}</td>
        <td class="table-name-cell">${escHtml(o.name)}</td>
        <td><a href="tel:${o.phone}" style="color:var(--accent-gold);">${escHtml(o.phone)}</a></td>
        <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escHtml(itemsList)}">${escHtml(itemsList)}</td>
        <td class="table-price-cell">${fmtCurrency(o.total)}</td>
        <td>
          <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
            <option value="Pending"   ${o.status === 'Pending'   ? 'selected' : ''}>Pending</option>
            <option value="Contacted" ${o.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-table-view" onclick="viewOrderDetail('${o.id}')">View</button>
            <button class="btn-table-delete" onclick="deleteOrder('${o.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getFilteredOrders() {
  const orders = window.orders || [];
  const query  = (document.getElementById('order-search')?.value || '').toLowerCase();
  const status = (document.getElementById('order-filter-status')?.value || '');
  return orders.filter(o => {
    const matchQuery  = !query  || o.name.toLowerCase().includes(query) || o.id.toLowerCase().includes(query) || o.phone.includes(query);
    const matchStatus = !status || o.status === status;
    return matchQuery && matchStatus;
  });
}

window.filterOrders = function() { renderOrdersTable(); };

window.filterByStatus = function(status) {
  const sel = document.getElementById('order-filter-status');
  if (sel) sel.value = status;
  renderOrdersTable();
};

window.updateOrderStatus = function(id, status) {
  if (window.adminUpdateOrderStatus && window.adminUpdateOrderStatus(id, status)) {
    renderOrdersTable();
    renderDashboard();
    addActivity(`Order ${id} status → ${status}`, 'blue');
    showToast(`Order ${id} updated to "${status}".`, 'success');
  }
};

window.viewOrderDetail = function(id) {
  const order = (window.orders || []).find(o => o.id === id);
  if (!order) return;
  const body = document.getElementById('order-detail-body');
  const modal = document.getElementById('order-detail-modal');
  if (!body || !modal) return;
  const itemsList = (order.items || []).map(i => `
    <div class="od-item-row">
      <span>${escHtml(i.name)} × ${i.quantity}</span>
      <span>${fmtCurrency((i.price || 0) * i.quantity)}</span>
    </div>
  `).join('');
  body.innerHTML = `
    <div class="order-detail-grid">
      <div class="od-field"><label>Order ID</label><span>${escHtml(order.id)}</span></div>
      <div class="od-field"><label>Date</label><span>${escHtml(order.date)}</span></div>
      <div class="od-field"><label>Client Name</label><span>${escHtml(order.name)}</span></div>
      <div class="od-field"><label>Phone</label><span>${escHtml(order.phone)}</span></div>
    </div>
    <div class="od-items-list">
      ${itemsList || '<div class="od-item-row"><span>Items not recorded</span></div>'}
    </div>
    <div class="od-total">
      <span>Total Value</span>
      <span>${fmtCurrency(order.total)}</span>
    </div>
    <div style="margin-top:1.5rem;">
      <select class="status-select" style="width:100%;" onchange="updateOrderStatus('${order.id}', this.value)">
        <option value="Pending"   ${order.status === 'Pending'   ? 'selected' : ''}>Pending</option>
        <option value="Contacted" ${order.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
        <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
      </select>
    </div>
  `;
  modal.classList.add('active');
  document.body.classList.add('no-scroll');
};

window.closeOrderDetailModal = function() {
  document.getElementById('order-detail-modal').classList.remove('active');
  document.body.classList.remove('no-scroll');
};

window.deleteOrder = function(id) {
  showConfirm('Delete Order', `Are you sure you want to delete order ${id}?`, () => {
    const idx = (window.orders || []).findIndex(o => o.id === id);
    if (idx > -1) {
      window.orders.splice(idx, 1);
      if (window.saveOrders) window.saveOrders();
      renderOrdersTable();
      renderDashboard();
      showToast(`Order ${id} deleted.`, 'error');
    }
  });
};

window.clearOrders = function() {
  showConfirm('Clear All Orders', 'This will permanently delete all client orders. Are you absolutely sure?', () => {
    window.orders = [];
    if (window.saveOrders) window.saveOrders();
    renderOrdersTable();
    renderDashboard();
    renderAnalytics();
    showToast('All orders cleared.', 'error');
  });
};

/* ──────────────────────────────────────────────
   CUSTOMERS
────────────────────────────────────────────── */
function renderCustomers() {
  const orders = window.orders || [];

  // Build customer map
  const customerMap = {};
  orders.forEach(o => {
    const key = o.phone;
    if (!customerMap[key]) {
      customerMap[key] = { name: o.name, phone: o.phone, orders: [], lastOrder: '' };
    }
    customerMap[key].orders.push(o);
    if (!customerMap[key].lastOrder || o.date > customerMap[key].lastOrder) {
      customerMap[key].lastOrder = o.date;
    }
  });

  const customers = Object.values(customerMap);
  const repeatClients = customers.filter(c => c.orders.length > 1).length;
  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgLTV = customers.length ? totalSpent / customers.length : 0;

  setEl('cs-total', customers.length);
  setEl('cs-repeat', repeatClients);
  setEl('cs-ltv', fmtCurrency(avgLTV));
  setEl('kpi-customers', customers.length);

  const tbody = document.getElementById('customers-tbody');
  if (!tbody) return;

  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:3rem; color:var(--text-tertiary);">No customer data available. Orders will populate this view.</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(c => {
    const spent    = c.orders.reduce((s, o) => s + (o.total || 0), 0);
    const isRepeat = c.orders.length > 1;
    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:.75rem;">
            <div style="width:36px; height:36px; background:rgba(223,195,154,.1); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; color:var(--accent-gold); flex-shrink:0;">
              ${escHtml(c.name.charAt(0).toUpperCase())}
            </div>
            <span class="table-name-cell">${escHtml(c.name)}</span>
          </div>
        </td>
        <td><a href="tel:${c.phone}" style="color:var(--accent-gold);">${escHtml(c.phone)}</a></td>
        <td>${c.orders.length} order${c.orders.length !== 1 ? 's' : ''}</td>
        <td class="table-price-cell">${fmtCurrency(spent)}</td>
        <td>${escHtml(c.lastOrder)}</td>
        <td><span class="badge-status ${isRepeat ? 'completed' : 'contacted'}">${isRepeat ? 'VIP Client' : 'Client'}</span></td>
        <td>
          <a href="https://wa.me/${c.phone}" target="_blank" class="btn-table-view">WhatsApp</a>
        </td>
      </tr>
    `;
  }).join('');
}

window.exportCustomers = function() {
  const orders = window.orders || [];
  const customerMap = {};
  orders.forEach(o => {
    if (!customerMap[o.phone]) customerMap[o.phone] = { name: o.name, phone: o.phone, total: 0, count: 0 };
    customerMap[o.phone].total += (o.total || 0);
    customerMap[o.phone].count++;
  });
  const rows = [['Name', 'Phone', 'Orders', 'Total Spent']];
  Object.values(customerMap).forEach(c => rows.push([c.name, c.phone, c.count, c.total]));
  const csv = rows.map(r => r.join(',')).join('\n');
  downloadFile('customers.csv', csv, 'text/csv');
  showToast('Customer list exported.', 'success');
};

/* ──────────────────────────────────────────────
   MEDIA LIBRARY
────────────────────────────────────────────── */
const defaultAssets = [
  { src: 'assets/hero.png',              name: 'Hero Banner' },
  { src: 'assets/classic-gold.png',      name: 'Classic Rose Gold' },
  { src: 'assets/chronograph-dark.png',  name: 'Chronograph Black' },
  { src: 'assets/obsidian-minimal.png',  name: 'Obsidian Minimalist' },
  { src: 'assets/sport-dive.png',        name: 'Sport Dive Master' },
];

function renderMediaLibrary() {
  const grid = document.getElementById('media-grid');
  if (!grid) return;

  const stored = JSON.parse(localStorage.getItem('maison_sadique_media_uploads') || '[]');
  const all = [...defaultAssets, ...stored];

  grid.innerHTML = all.map((asset, idx) => `
    <div class="media-item" id="media-${idx}">
      <img src="${asset.src}" alt="${escHtml(asset.name)}" loading="lazy">
      <div class="media-item-label">${escHtml(asset.name)}</div>
      <div class="media-item-actions">
        <button class="media-action-btn" onclick="copyMediaUrl('${asset.src}')" title="Copy URL">⎘</button>
        ${idx >= defaultAssets.length ? `<button class="media-action-btn" onclick="deleteMedia(${idx})" title="Delete" style="color:#ef4444;">✕</button>` : ''}
      </div>
    </div>
  `).join('');

  setEl('sys-media', `${all.length} image${all.length !== 1 ? 's' : ''}`);
}

window.handleMediaUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Please upload an image file.', 'error'); return; }
  if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB.', 'error'); return; }

  const reader = new FileReader();
  reader.onload = (e) => {
    const stored = JSON.parse(localStorage.getItem('maison_sadique_media_uploads') || '[]');
    stored.push({ src: e.target.result, name: file.name });
    localStorage.setItem('maison_sadique_media_uploads', JSON.stringify(stored));
    renderMediaLibrary();
    showToast(`"${file.name}" uploaded successfully.`, 'success');
    addActivity(`Media uploaded: ${file.name}`, 'green');
  };
  reader.readAsDataURL(file);
  event.target.value = ''; // reset
};

window.copyMediaUrl = function(url) {
  navigator.clipboard.writeText(window.location.origin + '/' + url).catch(() => {});
  showToast('Image URL copied to clipboard.', 'success');
};

window.deleteMedia = function(idx) {
  const stored = JSON.parse(localStorage.getItem('maison_sadique_media_uploads') || '[]');
  const offset = idx - defaultAssets.length;
  if (offset >= 0 && offset < stored.length) {
    stored.splice(offset, 1);
    localStorage.setItem('maison_sadique_media_uploads', JSON.stringify(stored));
    renderMediaLibrary();
    showToast('Image deleted from library.', 'error');
  }
};

/* ──────────────────────────────────────────────
   SETTINGS
────────────────────────────────────────────── */
function loadSettingsForm() {
  const waNum  = window.getWhatsAppNumber ? window.getWhatsAppNumber() : localStorage.getItem('maison_sadique_wa_number') || '';
  const cur    = window.getCurrencySymbol ? window.getCurrencySymbol() : localStorage.getItem('maison_sadique_currency') || '$';
  const quote  = localStorage.getItem('maison_sadique_about_quote') || 'Time is not merely a duration to be measured, but a canvas for artistic precision and mechanical truth.';
  const waMsg  = localStorage.getItem('maison_sadique_wa_message') || 'Hello Maison Sadique, I would like to inquire about a watch order.';
  const email  = localStorage.getItem('maison_sadique_email') || 'support@maisonsadique.com';

  setInputVal('s-wa-number', waNum);
  setInputVal('s-wa-message', waMsg);
  setInputVal('s-currency', cur);
  setInputVal('s-quote', quote);
  setInputVal('s-email', email);
}

function initForms() {
  // WhatsApp settings
  const waForm = document.getElementById('whatsapp-settings-form');
  if (waForm) {
    waForm.addEventListener('submit', e => {
      e.preventDefault();
      const num = document.getElementById('s-wa-number').value.trim();
      const msg = document.getElementById('s-wa-message').value.trim();
      localStorage.setItem('maison_sadique_wa_number', num);
      localStorage.setItem('maison_sadique_wa_message', msg);
      if (window.adminUpdateSettings) window.adminUpdateSettings(num, window.getCurrencySymbol(), localStorage.getItem('maison_sadique_about_quote') || '');
      showToast('WhatsApp settings saved.', 'success');
      addActivity('WhatsApp settings updated', 'blue');
    });
  }

  // Branding
  const brandForm = document.getElementById('branding-settings-form');
  if (brandForm) {
    brandForm.addEventListener('submit', e => {
      e.preventDefault();
      const cur   = document.getElementById('s-currency').value;
      const quote = document.getElementById('s-quote').value.trim();
      const email = document.getElementById('s-email').value.trim();
      localStorage.setItem('maison_sadique_currency', cur);
      localStorage.setItem('maison_sadique_about_quote', quote);
      localStorage.setItem('maison_sadique_email', email);
      if (window.adminUpdateSettings) window.adminUpdateSettings(window.getWhatsAppNumber(), cur, quote);
      showToast('Branding settings saved.', 'success');
      addActivity('Branding configuration updated', 'blue');
    });
  }
}

/* ─── Danger Zone Actions ─── */
window.confirmResetOrders = function() {
  showConfirm('Clear All Orders', 'This will permanently delete ALL order logs. This cannot be undone.', () => {
    window.orders = [];
    if (window.saveOrders) window.saveOrders();
    renderDashboard();
    renderOrdersTable();
    renderAnalytics();
    showToast('All orders have been cleared.', 'error');
    addActivity('All orders cleared (admin)', 'red');
  });
};

window.confirmResetProducts = function() {
  showConfirm('Reset Inventory', 'This will restore the inventory to default products only. Custom additions will be lost.', () => {
    localStorage.removeItem('maison_sadique_products');
    if (window.loadProducts) window.loadProducts();
    refreshAllData();
    showToast('Inventory reset to defaults.', 'error');
    addActivity('Inventory reset to defaults', 'red');
  });
};

window.confirmResetAll = function() {
  showConfirm('Full Data Reset', 'WARNING: This will DELETE ALL data including products, orders, settings, and media. This is completely irreversible.', () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('maison_sadique') || k.startsWith('ms_'));
    keys.forEach(k => localStorage.removeItem(k));
    if (window.loadProducts) window.loadProducts();
    if (window.loadOrders)   window.loadOrders();
    refreshAllData();
    showToast('All data has been reset.', 'error');
  });
};

/* ──────────────────────────────────────────────
   UTILITY: Export
────────────────────────────────────────────── */
window.exportData = function() {
  const data = {
    products: window.products || [],
    orders:   window.orders   || [],
    exported: new Date().toISOString(),
  };
  downloadFile('maison-sadique-export.json', JSON.stringify(data, null, 2), 'application/json');
  showToast('Data exported as JSON.', 'success');
};

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ──────────────────────────────────────────────
   CONFIRM MODAL
────────────────────────────────────────────── */
let _confirmCallback = null;

function showConfirm(title, body, callback) {
  _confirmCallback = callback;
  setEl('confirm-modal-title', title);
  setEl('confirm-modal-body', body);
  document.getElementById('confirm-modal').classList.add('active');
  document.body.classList.add('no-scroll');
}
window.closeConfirmModal = function() {
  _confirmCallback = null;
  document.getElementById('confirm-modal').classList.remove('active');
  document.body.classList.remove('no-scroll');
};
window.runConfirmAction = function() {
  if (_confirmCallback) _confirmCallback();
  closeConfirmModal();
};

/* ──────────────────────────────────────────────
   TOAST
────────────────────────────────────────────── */
let adminToastTimer = null;
function showToast(message, type = 'default') {
  // Admin portal toast (overrides app.js showToast on admin page)
  const toast = document.getElementById('admin-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className   = `toast show ${type}`;
  if (adminToastTimer) clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ──────────────────────────────────────────────
   ACTIVITY FEED
────────────────────────────────────────────── */
function addActivity(text, color = 'gold') {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;
  const colorMap = { gold: 'ad-gold', green: 'ad-green', red: 'ad-red', blue: 'ad-blue' };
  const cls = colorMap[color] || 'ad-gold';
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const li = document.createElement('li');
  li.className = 'activity-item';
  li.innerHTML = `
    <span class="activity-dot ${cls}"></span>
    <div>
      <div class="activity-text">${escHtml(text)}</div>
      <div class="activity-time">${time}</div>
    </div>
  `;
  feed.insertBefore(li, feed.firstChild);
  // Max 20 items
  while (feed.children.length > 20) feed.removeChild(feed.lastChild);
}

window.clearActivityFeed = function() {
  const feed = document.getElementById('activity-feed');
  if (feed) feed.innerHTML = '';
};

/* ──────────────────────────────────────────────
   NAV BADGES
────────────────────────────────────────────── */
function updateNavBadges() {
  const orders  = window.orders   || [];
  const products = window.products || [];
  const pending = orders.filter(o => o.status === 'Pending').length;
  const badge = document.getElementById('nav-badge-orders');
  if (badge) {
    badge.textContent = pending;
    badge.style.display = pending > 0 ? '' : 'none';
  }
  setEl('nav-count-products', products.length);
}

/* ──────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setInputVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function fmtCurrency(val) {
  if (typeof window.formatCurrency === 'function') return window.formatCurrency(val);
  const sym = localStorage.getItem('maison_sadique_currency') || '$';
  return `${sym}${Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
