const products = [
  {
    id: 'th-vortex-14',
    name: 'Vortex 14 Pro Laptop',
    category: 'Laptops',
    price: 1799,
    rating: 4.8,
    reviews: 512,
    description: '14" OLED, RTX 4060, 32GB RAM, 1TB SSD, Thunderbolt 4',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    stock: 18
  },
  {
    id: 'th-quantum-32',
    name: 'Quantum X Desktop',
    category: 'Desktops',
    price: 2299,
    rating: 4.9,
    reviews: 319,
    description: 'Intel i9, RTX 4080, 64GB RAM, 2TB NVMe, liquid cooled',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    stock: 12
  },
  {
    id: 'th-arc-gear-7',
    name: 'ArcGear Wireless Mouse',
    category: 'Accessories',
    price: 69,
    rating: 4.6,
    reviews: 1450,
    description: 'Ergonomic RGB gaming mouse with programmable buttons',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80&sat=-30',
    stock: 64
  },
  {
    id: 'th-nova-speaker',
    name: 'Nova Soundbar',
    category: 'Accessories',
    price: 129,
    rating: 4.4,
    reviews: 680,
    description: 'Compact Bluetooth speaker with immersive stereo sound',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    stock: 42
  },
  {
    id: 'th-glide-keyboard',
    name: 'Glide Pro Mechanical Keyboard',
    category: 'Accessories',
    price: 149,
    rating: 4.7,
    reviews: 830,
    description: 'Hot-swappable switches, per-key RGB, macro engine',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80&sat=-20',
    stock: 28
  },
  {
    id: 'th-zenbook-16',
    name: 'ZenBook 16 Creator',
    category: 'Laptops',
    price: 2099,
    rating: 4.7,
    reviews: 234,
    description: '16" QHD, RTX 4060, 32GB RAM, lightweight aluminum chassis',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80&sat=-10',
    stock: 15
  },
  {
    id: 'th-fusion-18',
    name: 'Fusion Workstation',
    category: 'Desktops',
    price: 1449,
    rating: 4.6,
    reviews: 282,
    description: 'AMD Ryzen 9, RTX 4070, 32GB DDR5, 1TB SSD',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80&sat=-10',
    stock: 21
  },
  {
    id: 'th-pulse-headset',
    name: 'Pulse RGB Headset',
    category: 'Accessories',
    price: 99,
    rating: 4.5,
    reviews: 940,
    description: 'Noise-canceling mic, memory foam, 7.1 surround sound',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80&sat=-30',
    stock: 34
  }
];

const cart = JSON.parse(localStorage.getItem('techhavenCart') || '[]');
const userState = JSON.parse(localStorage.getItem('techhavenUser') || 'null');
const wishlist = JSON.parse(localStorage.getItem('techhavenWishlist') || '[]');

const productGrid = document.getElementById('productGrid');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartStatus = document.getElementById('cartStatus');
const subtotalValue = document.getElementById('subtotalValue');
const shippingValue = document.getElementById('shippingValue');
const taxValue = document.getElementById('taxValue');
const discountValue = document.getElementById('discountValue');
const totalValue = document.getElementById('totalValue');
const promoMessage = document.getElementById('promoMessage');
const shippingMessage = document.getElementById('shippingMessage');
const loginStatus = document.getElementById('loginStatus');
const authButton = document.getElementById('authButton');
const promoCodeInput = document.getElementById('promoCode');
const shippingZipInput = document.getElementById('shippingZip');
const estimateShippingBtn = document.getElementById('estimateShipping');
const applyPromoBtn = document.getElementById('applyPromo');
const searchInput = document.getElementById('searchInput');
const priceRange = document.getElementById('priceRange');
const filterPills = document.querySelectorAll('.filter-pill');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav');
const backToTop = document.getElementById('backToTop');
const toastContainer = document.getElementById('toastContainer');
const subscribeForm = document.getElementById('newsletterForm');
const subscribeEmail = document.getElementById('newsletterEmail');
const newsletterMessage = document.getElementById('newsletterMessage');
const heroCarousel = document.getElementById('heroCarousel');
const carouselControls = document.getElementById('carouselControls');
const heroButtons = document.querySelectorAll('.hero-actions button');

let activeCategory = 'all';
let searchTerm = '';
let priceFilter = Number(priceRange.value);
let activePromo = null;
let shippingCost = 0;
let currentUser = userState;
let activeSlide = 0;
let carouselInterval;

const discountCodes = {
  TECH10: 10,
  HAVEN20: 20,
  FREEDEL: 0
};

function saveState() {
  localStorage.setItem('techhavenCart', JSON.stringify(cart));
  localStorage.setItem('techhavenUser', JSON.stringify(currentUser));
  localStorage.setItem('techhavenWishlist', JSON.stringify(wishlist));
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderStars(rating) {
  const filled = Math.floor(rating);
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += `<i class="fas fa-star" style="opacity:${i < filled ? '1' : '0.25'}"></i>`;
  }
  return stars;
}

function toast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<strong>${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</strong><p style='margin:0.55rem 0 0;'>${message}</p>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

function renderProducts() {
  productGrid.innerHTML = '';
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
    const matchesPrice = product.price <= priceFilter;
    return matchesCategory && matchesSearch && matchesPrice;
  });
  if (!filtered.length) {
    productGrid.innerHTML = '<p style="grid-column:1/-1;color:var(--muted);text-align:center;padding:2rem 0;">No products match your search and filters.</p>';
    return;
  }
  filtered.forEach(product => {
    const isWishlisted = wishlist.includes(product.id);
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-thumb">
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist="${product.id}" aria-label="Toggle wishlist"><i class="fas fa-heart"></i></button>
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-info">
        <div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="price-row">
          <span class="price">${formatPrice(product.price)}</span>
          <span class="stars" title="Rated ${product.rating} stars">${renderStars(product.rating)} ${product.reviews}</span>
        </div>
        <button data-add="${product.id}">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

function renderCart() {
  cartItemsEl.innerHTML = '';
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem 0;">Your cart is empty. Browse products to add items.</p>';
  }
  cart.forEach(item => {
    const product = products.find(prod => prod.id === item.id);
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="item-details">
        <div>
          <h4>${product.name}</h4>
          <small>${product.category} • ${product.description}</small>
        </div>
        <div class="item-actions">
          <div class="quantity-control">
            <button data-decrease="${item.id}"><i class="fas fa-minus"></i></button>
            <span>${item.quantity}</span>
            <button data-increase="${item.id}"><i class="fas fa-plus"></i></button>
          </div>
          <button class="icon-btn" data-remove="${item.id}" style="padding:0.5rem 0.8rem;">Remove</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(itemEl);
  });
  updateSummary();
}

function updateSummary() {
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(prod => prod.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);
  const tax = subtotal * 0.08;
  shippingCost = shippingCost || (subtotal >= 150 || subtotal === 0 ? 0 : 15);
  let discount = 0;
  if (activePromo === 'TECH10') discount = subtotal * 0.1;
  if (activePromo === 'HAVEN20') discount = subtotal * 0.2;
  if (activePromo === 'FREEDEL') shippingCost = 0;
  const total = Math.max(subtotal + tax + shippingCost - discount, 0);

  subtotalValue.textContent = formatPrice(subtotal);
  taxValue.textContent = formatPrice(tax);
  shippingValue.textContent = formatPrice(shippingCost);
  discountValue.textContent = `-${formatPrice(discount)}`;
  totalValue.textContent = formatPrice(total);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartStatus.textContent = `${cart.length} item${cart.length === 1 ? '' : 's'} in your cart`;
  saveState();
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  renderCart();
  toast('Added to cart successfully.', 'success');
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    renderCart();
    toast('Removed from cart.', 'info');
  }
}

function changeQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  renderCart();
}

function toggleCart(open) {
  if (open) {
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden', 'false');
  } else {
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
  }
}

function setActiveCategory(category) {
  activeCategory = category;
  filterPills.forEach(pill => pill.classList.toggle('active', pill.dataset.category === category));
  renderProducts();
}

function filterProducts() {
  searchTerm = searchInput.value.trim().toLowerCase();
  priceFilter = Number(priceRange.value);
  renderProducts();
}

function applyPromo() {
  const code = promoCodeInput.value.trim().toUpperCase();
  if (!code) {
    promoMessage.textContent = 'Enter a discount code to save.';
    return;
  }
  if (!discountCodes.hasOwnProperty(code)) {
    promoMessage.textContent = 'Invalid code. Try TECH10, HAVEN20, or FREEDEL.';
    return;
  }
  activePromo = code;
  promoMessage.textContent = `Code ${code} applied. Enjoy your savings!`;
  updateSummary();
  toast(`Discount code ${code} applied.`, 'success');
}

function estimateShipping() {
  const zip = shippingZipInput.value.trim();
  if (!/^[0-9]{5}$/.test(zip)) {
    shippingMessage.textContent = 'Enter a valid 5-digit ZIP code.';
    return;
  }
  const zone = Number(zip[0]);
  shippingCost = zone <= 3 ? 9.99 : zone <= 5 ? 12.49 : zone <= 7 ? 14.99 : 16.99;
  shippingMessage.textContent = `Estimated shipping: ${formatPrice(shippingCost)} for ZIP ${zip}.`;
  updateSummary();
  toast('Shipping estimate updated.', 'info');
}

function toggleLogin() {
  if (currentUser) {
    currentUser = null;
    toast('Logged out successfully.', 'info');
  } else {
    currentUser = { name: 'Alex', email: 'alex@techhaven.com' };
    toast('Logged in as Alex.', 'success');
  }
  updateLoginState();
  saveState();
}

function updateLoginState() {
  if (currentUser) {
    loginStatus.innerHTML = `<p>Signed in as <strong>${currentUser.name}</strong>. Your cart and wishlist are saved locally.</p>`;
    authButton.textContent = 'Logout';
  } else {
    loginStatus.innerHTML = '<p>Welcome, guest. Sign in to sync your saved cart and wishlist.</p>';
    authButton.textContent = 'Login';
  }
}

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    const index = wishlist.indexOf(productId);
    wishlist.splice(index, 1);
    toast('Removed from wishlist.', 'info');
  } else {
    wishlist.push(productId);
    toast('Added to wishlist.', 'success');
  }
  saveState();
  renderProducts();
}

function setupCarousel() {
  const slides = heroCarousel.querySelectorAll('.slide');
  carouselControls.innerHTML = '';
  slides.forEach((slide, idx) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => setSlide(idx));
    if (idx === 0) dot.classList.add('active');
    carouselControls.appendChild(dot);
  });
  carouselInterval = setInterval(() => setSlide((activeSlide + 1) % slides.length), 6000);
}

function setSlide(index) {
  const slides = heroCarousel.querySelectorAll('.slide');
  slides[activeSlide].classList.remove('active');
  carouselControls.children[activeSlide].classList.remove('active');
  activeSlide = index;
  slides[activeSlide].classList.add('active');
  carouselControls.children[activeSlide].classList.add('active');
}

function handleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

function init() {
  renderProducts();
  renderCart();
  updateLoginState();
  setupCarousel();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.body.addEventListener('click', event => {
    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      addToCart(addButton.dataset.add);
    }
    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
      removeFromCart(removeButton.dataset.remove);
    }
    const decreaseButton = event.target.closest('[data-decrease]');
    if (decreaseButton) {
      changeQuantity(decreaseButton.dataset.decrease, -1);
    }
    const increaseButton = event.target.closest('[data-increase]');
    if (increaseButton) {
      changeQuantity(increaseButton.dataset.increase, 1);
    }
    const wishlistBtn = event.target.closest('[data-wishlist]');
    if (wishlistBtn) {
      toggleWishlist(wishlistBtn.dataset.wishlist);
    }
  });

  document.querySelectorAll('.cart-toggle').forEach(button => button.addEventListener('click', () => toggleCart(true)));
  document.querySelectorAll('.cart-close').forEach(button => button.addEventListener('click', () => toggleCart(false)));
  cartOverlay.addEventListener('click', () => toggleCart(false));
  menuToggle.addEventListener('click', () => navMenu.classList.toggle('show'));
  filterPills.forEach(pill => pill.addEventListener('click', () => setActiveCategory(pill.dataset.category)));
  searchInput.addEventListener('input', filterProducts);
  priceRange.addEventListener('input', () => {
    priceFilter = Number(priceRange.value);
    filterProducts();
  });
  applyPromoBtn.addEventListener('click', applyPromo);
  estimateShippingBtn.addEventListener('click', estimateShipping);
  authButton.addEventListener('click', toggleLogin);
  document.querySelector('.login-toggle').addEventListener('click', toggleLogin);
  searchInput.addEventListener('keypress', event => { if (event.key === 'Enter') filterProducts(); });
  window.addEventListener('scroll', handleBackToTop);
  heroButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      const element = document.getElementById(target);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.collection-card .cta-btn').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      const element = document.getElementById(target);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    });
  });

  subscribeForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = subscribeEmail.value.trim();
    if (!email || !email.includes('@')) {
      newsletterMessage.textContent = 'Enter a valid email address to subscribe.';
      newsletterMessage.style.color = '#ff5f7a';
      return;
    }
    newsletterMessage.textContent = 'Subscription confirmed! Check your inbox for a welcome offer.';
    newsletterMessage.style.color = '#39d98a';
    subscribeEmail.value = '';
    toast('Newsletter subscription received.', 'success');
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('show'));
  });
}

init();
