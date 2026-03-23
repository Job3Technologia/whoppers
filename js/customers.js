// Customers Page Logic
(() => {
  const { loadData, saveData, qs, qsa, formatRand, formatDate, download, csv, sum, groupBy } = window.HopperCRM;

  let state = { data: null, selectedCustomer: null };

  function renderMetrics() {
    const { customers, orders, products } = state.data;
    const revenue = sum(orders.filter(o => o.status === "Paid").map(o => o.total));
    const topGroup = Object.entries(groupBy(orders.flatMap(o => o.items), "productId"))
      .map(([pid, list]) => ({ pid, count: sum(list.map(i => i.quantity)) }))
      .sort((a, b) => b.count - a.count)[0];
    const topName = products.find(p => p.id === topGroup?.pid)?.name || "N/A";

    qs("#m-customers .value").textContent = customers.length;
    qs("#m-orders .value").textContent = orders.length;
    qs("#m-revenue .value").textContent = formatRand(revenue);
    qs("#m-top .value").textContent = topName;
  }

  function renderTopProducts() {
    const { orders, products } = state.data;
    const counts = {};
    orders.forEach(o => o.items.forEach(it => {
      counts[it.productId] = (counts[it.productId] || 0) + it.quantity;
    }));
    const top = Object.entries(counts).map(([pid, c]) => ({ pid, c })).sort((a, b) => b.c - a.c).slice(0, 6);
    const wrap = qs("#top-products");
    wrap.innerHTML = "";
    top.forEach(t => {
      const p = products.find(x => x.id === t.pid);
      const bar = document.createElement("div");
      bar.style.height = `${12 + Math.min(100, t.c * 12)}px`;
      bar.className = "bar";
      const outer = document.createElement("div");
      outer.style.textAlign = "center";
      outer.append(bar);
      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = p.name;
      wrap.append(outer);
      outer.append(label);
    });
  }

  function renderCustomersList(filter = "") {
    const { customers, orders } = state.data;
    const list = qs("#customers-list");
    list.innerHTML = "";
    const f = filter.toLowerCase();

    customers
      .filter(c => c.name.toLowerCase().includes(f) || c.email.toLowerCase().includes(f))
      .forEach(c => {
        const item = document.createElement("div");
        item.className = "list-item";
        if (state.selectedCustomer && state.selectedCustomer.id === c.id) {
          item.classList.add("active");
        }

        const totalOrders = orders.filter(o => o.customerId === c.id).length;
        const avatarUrl = c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`;

        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; flex: 1">
            <img src="${avatarUrl}" class="avatar" alt="">
            <div style="flex: 1">
              <div style="font-weight: 600">${c.name}</div>
              <div class="muted" style="font-size: 11px">
                ${c.loyaltyTier} • ${totalOrders} orders
              </div>
            </div>
          </div>
          <button class="btn secondary small">View</button>
        `;

        item.onclick = (e) => {
          if (e.target.tagName === 'BUTTON' || !e.target.closest('button')) {
            selectCustomer(c.id);
            qsa(".list-item").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
          }
        };
        list.append(item);
      });
  }

  function selectCustomer(id) {
    const c = state.data.customers.find(x => x.id === id);
    state.selectedCustomer = c;
    renderProfile();
    renderPayments();
  }

  function renderProfile() {
    const c = state.selectedCustomer;
    if (!c) {
      qs("#profile").innerHTML = "<div class='muted'>Select a customer</div>";
      return;
    }
    qs("#profile").innerHTML = `<div class="card"><h3>${c.name}</h3><div class="muted">${c.email} • ${c.phone}</div><div style="margin-top:8px">Address: ${c.address}</div><div style="margin-top:8px">Preferences: size ${c.preferences.size}, ${c.preferences.color}, loves ${c.preferences.favourite}</div><div style="margin-top:8px">Loyalty: ${c.loyaltyTier}</div><div style="margin-top:8px">Payment Method: <span id="pm-value">${c.paymentMethod}</span></div><div style="margin-top:12px;display:flex;gap:8px"><input id="pm-input" class="search" placeholder="Update payment method" value="${c.paymentMethod}"/><button id="pm-save" class="btn">Save</button></div></div>`;
    qs("#pm-save").addEventListener("click", () => {
      const v = qs("#pm-input").value.trim();
      if (!v) return;
      state.selectedCustomer.paymentMethod = v;
      const idx = state.data.customers.findIndex(x => x.id === state.selectedCustomer.id);
      state.data.customers[idx] = state.selectedCustomer;
      saveData(state.data);
      qs("#pm-value").textContent = v;
    });
  }

  function renderPayments() {
    const c = state.selectedCustomer;
    const { orders } = state.data;
    const wrap = qs("#payments");
    wrap.innerHTML = "";

    if (!c) {
      wrap.innerHTML = "<div class='muted'>Select a customer to view transactions</div>";
      return;
    }

    const rows = orders
      .filter(o => o.customerId === c.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!rows.length) {
      wrap.innerHTML = "<div class='muted'>No transactions found</div>";
      return;
    }

    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Date</th>
          <th>Transaction ID</th>
          <th>Status</th>
          <th>Items</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    rows.forEach(o => {
      const tr = document.createElement("tr");
      const items = o.items.map(it => {
        const p = state.data.products.find(x => x.id === it.productId);
        return `${it.quantity}× ${p ? p.name : 'Unknown'}`;
      }).join(", ");

      const statusClass = o.status.toLowerCase();
      const txnId = o.payment?.transactionId || 'N/A';

      tr.innerHTML = `
        <td>${formatDate(o.date)}</td>
        <td style="font-family: monospace; font-size: 11px;">${txnId}</td>
        <td><span class="badge ${statusClass}">${o.status}</span></td>
        <td title="${items}">${items.length > 30 ? items.substring(0, 27) + '...' : items}</td>
        <td style="font-weight: 600; color: ${o.status === 'Refunded' ? '#e74c3c' : 'inherit'}">
          ${formatRand(o.total)}
        </td>
      `;
      table.querySelector("tbody").append(tr);
    });
    wrap.append(table);
  }

  function init() {
    state.data = loadData();
    renderMetrics();
    renderTopProducts();
    renderCustomersList();
    qs("#search").addEventListener("input", e => renderCustomersList(e.target.value));
    if (state.data.customers[0]) selectCustomer(state.data.customers[0].id);
    qs("#export-customer").addEventListener("click", () => {
      if (!state.selectedCustomer) return;
      const { orders } = state.data;
      const rows = orders.filter(o => o.customerId === state.selectedCustomer.id).map(o => [state.selectedCustomer.name, formatDate(o.date), o.status, o.items.map(it => `${it.quantity}x ${state.data.products.find(p => p.id === it.productId).name}`).join(" | "), o.total]);
      download(`payments_${state.selectedCustomer.id}.csv`, csv([["Customer", "Date", "Status", "Items", "Total"], ...rows]));
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
