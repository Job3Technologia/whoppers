// Global UI Utilities
window.HopperCRM = window.HopperCRM || {};

window.HopperCRM.qs = function(s, el = document) { return el.querySelector(s); };
window.HopperCRM.qsa = function(s, el = document) { return Array.from(el.querySelectorAll(s)); };
window.HopperCRM.formatRand = function(v) { return "R " + Number(v || 0).toLocaleString("en-ZA", { maximumFractionDigits: 0 }); };
window.HopperCRM.formatDate = function(iso) { 
  const d = new Date(iso); 
  return d.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "2-digit" }); 
};
window.HopperCRM.download = function(filename, text) { 
  const a = document.createElement("a"); 
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" })); 
  a.download = filename; 
  document.body.appendChild(a); 
  a.click(); 
  a.remove(); 
};
window.HopperCRM.csv = function(rows) { 
  return rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"); 
};
window.HopperCRM.sum = function(a) { return a.reduce((s, v) => s + v, 0); };
window.HopperCRM.groupBy = function(arr, key) { 
  return arr.reduce((m, it) => { 
    const k = typeof key === "function" ? key(it) : it[key]; 
    (m[k] = m[k] || []).push(it); 
    return m; 
  }, {}); 
};
