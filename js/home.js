// Home Page Logic
(() => {
  const { loadData, qs, formatRand } = window.HopperCRM;

  function renderFeatured() {
    const data = loadData();
    const wrap = qs("#featured-products");
    if (!wrap) return;
    
    wrap.innerHTML = "";
    data.products.slice(0, 8).forEach(p => {
      const card = document.createElement("div");
      card.className = "card product-card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" style="width:100%;height:180px;object-fit:cover;border-radius:8px">
        <h4 style="margin:10px 0 5px">${p.name}</h4>
        <div class="muted">${p.category}</div>
        <div style="font-weight:bold;margin-top:5px">${formatRand(p.price)}</div>
      `;
      wrap.append(card);
    });
  }

  document.addEventListener("DOMContentLoaded", renderFeatured);
})();
