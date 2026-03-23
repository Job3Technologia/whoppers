// Global Data Management
window.HopperCRM = window.HopperCRM || {};

const seedData = {
  products: [
    { id: "p1", name: "Classic T-Shirt", category: "Tops", price: 199, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400" },
    { id: "p2", name: "Premium Golfer", category: "Tops", price: 349, img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400" },
    { id: "p3", name: "Heavyweight Hoodie", category: "Outerwear", price: 599, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
    { id: "p4", name: "Zip-up Sweatshirt", category: "Outerwear", price: 499, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
    { id: "p5", name: "Cargo Shorts", category: "Bottoms", price: 299, img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
    { id: "p6", name: "Chino Pants", category: "Bottoms", price: 449, img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400" },
    { id: "p7", name: "Trucker Cap", category: "Accessories", price: 199, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" },
    { id: "p8", name: "Fleece Joggers", category: "Bottoms", price: 399, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400" },
    { id: "p9", name: "Graphic Tee", category: "Tops", price: 249, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400" },
    { id: "p10", name: "Windbreaker", category: "Outerwear", price: 749, img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400" }
  ],
  customers: [
    { id: "c1", name: "Lerato Mokoena", email: "lerato@example.com", phone: "+27 72 000 1111", address: "Sandton, Johannesburg", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100", preferences: { size: "M", color: "Black", favourite: "Hoodie" }, paymentMethod: "Visa **** 4242", loyaltyTier: "Gold" },
    { id: "c2", name: "Thabo Nkosi", email: "thabo@example.com", phone: "+27 73 555 2222", address: "Hatfield, Pretoria", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100", preferences: { size: "L", color: "Navy", favourite: "Golfer" }, paymentMethod: "Mastercard **** 2211", loyaltyTier: "Silver" },
    { id: "c3", name: "Aisha Patel", email: "aisha@example.com", phone: "+27 71 444 3333", address: "Sea Point, Cape Town", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", preferences: { size: "S", color: "White", favourite: "T-Shirt" }, paymentMethod: "Visa **** 1111", loyaltyTier: "Bronze" },
    { id: "c4", name: "Sipho Dlamini", email: "sipho@example.com", phone: "+27 74 666 7777", address: "Umhlanga, Durban", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", preferences: { size: "XL", color: "Grey", favourite: "Sweatshirt" }, paymentMethod: "Amex **** 3001", loyaltyTier: "Gold" },
    { id: "c5", name: "Nomsa Khumalo", email: "nomsa@example.com", phone: "+27 76 888 9999", address: "Bendor, Polokwane", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100", preferences: { size: "M", color: "Maroon", favourite: "Hoodie" }, paymentMethod: "Visa **** 9876", loyaltyTier: "Silver" },
    { id: "c6", name: "Jason Smith", email: "jason@example.com", phone: "+27 82 222 4444", address: "Summerstrand, Gqeberha", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", preferences: { size: "L", color: "Black", favourite: "Pants" }, paymentMethod: "Mastercard **** 5510", loyaltyTier: "Bronze" },
    { id: "c7", name: "Zanele Cele", email: "zanele@example.com", phone: "+27 61 111 2222", address: "Musgrave, Durban", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100", preferences: { size: "S", color: "Pink", favourite: "T-Shirt" }, paymentMethod: "Visa **** 8877", loyaltyTier: "Gold" },
    { id: "c8", name: "Bongani Mabaso", email: "bongani@example.com", phone: "+27 81 333 4444", address: "Soweto, Johannesburg", avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100", preferences: { size: "XXL", color: "Blue", favourite: "Hoodie" }, paymentMethod: "Mastercard **** 4455", loyaltyTier: "Silver" },
    { id: "c9", name: "Chloe van Wyk", email: "chloe@example.com", phone: "+27 79 555 6666", address: "Stellenbosch, WC", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100", preferences: { size: "M", color: "Green", favourite: "Shorts" }, paymentMethod: "Visa **** 3322", loyaltyTier: "Bronze" },
    { id: "c10", name: "Farai Gumbo", email: "farai@example.com", phone: "+27 78 777 8888", address: "Brooklyn, Pretoria", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100", preferences: { size: "L", color: "Yellow", favourite: "Golfer" }, paymentMethod: "Amex **** 1122", loyaltyTier: "Gold" }
  ],
  orders: []
};

(() => {
  const now = new Date();
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = a => a[rnd(0, a.length - 1)];

  // Generate 85 random orders for a rich demo experience
  for (let i = 0; i < 85; i++) {
    const cust = pick(seedData.customers);
    const items = [];
    const count = rnd(1, 4);
    const used = new Set();
    
    for (let j = 0; j < count; j++) {
      const prod = pick(seedData.products);
      if (used.has(prod.id)) continue;
      used.add(prod.id);
      items.push({
        productId: prod.id,
        quantity: rnd(1, 5),
        price: prod.price
      });
    }

    const total = items.reduce((s, it) => s + (it.quantity * it.price), 0);
    const d = new Date(now.getTime() - rnd(0, 365) * 86400000);
    
    seedData.orders.push({
      id: `ORD-${202400 + i}`,
      customerId: cust.id,
      items,
      total,
      status: pick(["Paid", "Paid", "Paid", "Paid", "Refunded", "Pending", "Cancelled"]),
      date: d.toISOString(),
      payment: {
        method: cust.paymentMethod,
        amount: total,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    });
  }
})();

window.HopperCRM.saveData = function(data) {
  localStorage.setItem("hopper_crm_data", JSON.stringify(data));
};

window.HopperCRM.loadData = function() {
  const raw = localStorage.getItem("hopper_crm_data");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse stored data", e);
    }
  }
  const copy = JSON.parse(JSON.stringify(seedData));
  window.HopperCRM.saveData(copy);
  return copy;
};

window.HopperCRM.resetData = function() {
  localStorage.removeItem("hopper_crm_data");
  return window.HopperCRM.loadData();
};
