// Admin Page Logic
(() => {
  const { loadData, saveData, resetData, qs, formatRand, download, csv } = window.HopperCRM;

  let state = { data: null, authed: false };

  function show(section) {
    qs("#tab-products").style.display = section === "products" ? "block" : "none";
    qs("#tab-customers").style.display = section === "customers" ? "block" : "none";
    qs("#tab-orders").style.display = section === "orders" ? "block" : "none";
  }

  function renderProducts() {
    const { products } = state.data;
    const tbody = qs("#products-body");
    tbody.innerHTML = "";
    products.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${p.name}</td><td>${p.category}</td><td>${formatRand(p.price)}</td><td><button class="btn secondary" data-id="${p.id}">Delete</button></td>`;
      tbody.append(tr);
    });
    tbody.querySelectorAll("button").forEach(b => b.addEventListener("click", e => {
      const id = e.currentTarget.getAttribute("data-id");
      state.data.products = state.data.products.filter(p => p.id !== id);
      saveData(state.data);
      renderProducts();
    }));
  }

  qs("#add-product").onclick = () => {
    const name = qs("#prod-name").value.trim();
    const cat = qs("#prod-cat").value.trim();
    const price = parseInt(qs("#prod-price").value, 10) || 0;
    if (!name || !cat || !price) return;
    state.data.products.push({ id: "p" + (Math.random() * 100000 | 0), name, category: cat, price });
    saveData(state.data);
    qs("#prod-name").value = "";
    qs("#prod-cat").value = "";
    qs("#prod-price").value = "";
    renderProducts();
  };

  function renderCustomers() {
    const { customers } = state.data;
    const tbody = qs("#customers-body");
    tbody.innerHTML = "";
    customers.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.name}</td><td>${c.email}</td><td>${c.loyaltyTier}</td><td>${c.paymentMethod}</td><td><button class="btn secondary" data-id="${c.id}">Delete</button></td>`;
      tbody.append(tr);
    });
    tbody.querySelectorAll("button").forEach(b => b.addEventListener("click", e => {
      const id = e.currentTarget.getAttribute("data-id");
      state.data.customers = state.data.customers.filter(p => p.id !== id);
      state.data.orders = state.data.orders.filter(o => o.customerId !== id);
      saveData(state.data);
      renderCustomers();
    }));
  }

  function renderOrders() {
    const { orders, products, customers } = state.data;
    const tbody = qs("#orders-body");
    tbody.innerHTML = "";

    const stats = { Paid: 0, Pending: 0, Refunded: 0, Cancelled: 0 };
    orders.forEach(o => { if (stats[o.status] !== undefined) stats[o.status]++; });

    const summary = document.createElement("div");
    summary.className = "status-grid";
    summary.innerHTML = `
      <div class="status-card"><span class="count">${stats.Paid}</span><span class="label">Paid</span></div>
      <div class="status-card"><span class="count">${stats.Pending}</span><span class="label">Pending</span></div>
      <div class="status-card"><span class="count" style="color: #fa5252">${stats.Refunded}</span><span class="label">Refunded</span></div>
      <div class="status-card"><span class="count">${stats.Cancelled}</span><span class="label">Cancelled</span></div>
    `;

    const existingSummary = qs("#tab-orders .status-grid");
    if (existingSummary) existingSummary.remove();
    qs("#tab-orders h3").after(summary);

    orders.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(o => {
      const tr = document.createElement("tr");
      const c = customers.find(x => x.id === o.customerId);
      const cname = c ? c.name : o.customerId;
      const items = o.items.map(it => {
        const p = products.find(x => x.id === it.productId);
        return `${it.quantity}× ${p ? p.name : 'Item'}`;
      }).join(", ");

      const statusClass = o.status.toLowerCase();
      tr.innerHTML = `
        <td style="font-family: monospace; font-size: 11px;">${o.id}</td>
        <td>${cname}</td>
        <td title="${items}">${items.length > 25 ? items.substring(0, 22) + '...' : items}</td>
        <td style="font-weight: 600">${formatRand(o.total)}</td>
        <td><span class="badge ${statusClass}">${o.status}</span></td>
      `;
      tbody.append(tr);
    });
  }

  function exportJSONAll() { download("hopper_crm_data.json", JSON.stringify(state.data, null, 2)); }
  function exportCSVs() {
    const cRows = [["Name", "Email", "Phone", "Tier", "Payment"]].concat(state.data.customers.map(c => [c.name, c.email, c.phone, c.loyaltyTier, c.paymentMethod]));
    const oRows = [["OrderId", "Customer", "Date", "Status", "Items", "Total"]].concat(state.data.orders.map(o => [o.id, state.data.customers.find(c => c.id === o.customerId)?.name || o.customerId, new Date(o.date).toISOString().slice(0, 10), o.status, o.items.map(it => `${it.quantity}x ${state.data.products.find(p => p.id === it.productId)?.name}`).join(" | "), o.total]));
    download("customers.csv", csv(cRows));
    setTimeout(() => download("orders.csv", csv(oRows)), 150);
  }

  function login() {
    const u = qs("#admin-user").value.trim();
    const p = qs("#admin-pass").value.trim();
    if (u === "admin" && p === "password") {
      state.authed = true;
      qs("#login").style.display = "none";
      qs("#panel").style.display = "block";
    }
  }

  function init() {
    state.data = loadData();
    qs("#panel").style.display = "none";
    qs("#login-btn").addEventListener("click", login);
    qs("#nav-products").onclick = () => { show("products"); renderProducts(); };
    qs("#nav-customers").onclick = () => { show("customers"); renderCustomers(); };
    qs("#nav-orders").onclick = () => { show("orders"); renderOrders(); };
    qs("#export-json").onclick = exportJSONAll;
    qs("#export-csvs").onclick = exportCSVs;
    qs("#reset").onclick = () => {
      state.data = resetData();
      renderProducts();
      renderCustomers();
      renderOrders();
    };
    show("products");
    renderProducts();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
