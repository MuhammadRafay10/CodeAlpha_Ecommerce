// Backend API Global Target Base
const API_URL = 'http://localhost:5000/api';

// --- Consolidated Dynamic UI Binding Elements ---
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

const authModal = document.getElementById('auth-modal');
const loginNavBtn = document.getElementById('login-nav-btn');
const closeAuth = document.getElementById('close-auth');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const productsNavBtn = document.getElementById('products-nav-btn');
const footerProducts = document.getElementById('footer-products');
const footerHome = document.getElementById('footer-home');
const footerAbout = document.getElementById('footer-about');
const footerContact = document.getElementById('footer-contact');

// Client State Management Instance
let cart = [];

// ==========================================
// 1. PRODUCT FETCHING & ARCHITECTURE MANAGEMENT
// ==========================================

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p>No products found in the database.</p>';
            return;
        }

        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productsGrid.innerHTML = '<p style="color: red; text-align: center;">Error connecting to the server. Make sure backend is running!</p>';
    }
}

function displayProducts(products) {
    productsGrid.innerHTML = ''; 

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn add-to-cart-btn" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                Add to Cart
            </button>
        `;

        productsGrid.appendChild(productCard);
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// ==========================================
// 2. BASKET & SHOPPING CART CONTROLLER
// ==========================================

function addToCart(e) {
    const button = e.target;
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    const image = button.getAttribute('data-image');

    const existingItem = cart.find(item => item.product === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            product: id,
            name: name,
            price: price,
            image: image,
            qty: 1
        });
    }

    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalCount;

    const totalSum = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartTotalPrice.innerText = totalSum.toFixed(2);

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.style.display = 'flex';
        itemElement.style.justifyContent = 'space-between';
        itemElement.style.alignItems = 'center';
        itemElement.style.marginBottom = '15px';
        itemElement.style.borderBottom = '1px solid #eee';
        itemElement.style.paddingBottom = '10px';

        itemElement.innerHTML = `
            <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            <div style="flex-grow: 1; margin-left: 10px;">
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.qty}</p>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
}

// ==========================================
// 3. SECURITY GATEWAY & IDENTIFICATION (AUTH)
// ==========================================

loginNavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(localStorage.getItem('userInfo')) {
        localStorage.removeItem('userInfo');
        alert('Logged out successfully!');
        window.location.reload();
    } else {
        authModal.style.display = 'block';
    }
});

closeAuth.addEventListener('click', () => authModal.style.display = 'none');
goToRegister.addEventListener('click', (e) => { e.preventDefault(); loginSection.style.display = 'none'; registerSection.style.display = 'block'; });
goToLogin.addEventListener('click', (e) => { e.preventDefault(); registerSection.style.display = 'none'; loginSection.style.display = 'block'; });

if (localStorage.getItem('userInfo')) {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    loginNavBtn.innerText = `Logout (${user.name})`;
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Login Successful!');
            window.location.reload();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login Error:', error);
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            alert('Registration Successful!');
            window.location.reload();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration Error:', error);
    }
});

// ==========================================
// 4. SECURE TRANSACTION PROCESSING (CHECKOUT)
// ==========================================

checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        alert('Please login first to checkout!');
        authModal.style.display = 'block';
        cartModal.style.display = 'none';
        return;
    }

    const user = JSON.parse(userInfo);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                orderItems: cart,
                totalPrice: totalPrice
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Order placed successfully! Order ID: ${data._id}`);
            cart = []; 
            updateCartUI();
            cartModal.style.display = 'none';
        } else {
            alert(data.message || 'Order failed');
        }
    } catch (error) {
        console.error('Checkout Error:', error);
    }
});

// ==========================================
// 5. INTERACTION ENGINE (SCROLLING, POPUPS, MODALS)
// ==========================================

function scrollToProducts(e) {
    e.preventDefault();
    const productsSection = document.getElementById('products-section');
    productsSection.scrollIntoView({ behavior: 'smooth' });
}

if (productsNavBtn) productsNavBtn.addEventListener('click', scrollToProducts);
if (footerProducts) footerProducts.addEventListener('click', scrollToProducts);

if (footerHome) {
    footerHome.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (footerAbout) {
    footerAbout.addEventListener('click', (e) => {
        e.preventDefault();
        alert('AlphaShop v1.0.0\n\nThis is a fully functional full-stack E-commerce application developed as part of the CodeAlpha Web Development Internship, utilizing Node.js, Express, MongoDB Atlas, and native JavaScript.');
    });
}

if (footerContact) {
    footerContact.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Contact Developer:\n\nEmail: intern@codealpha.com\nSupport: support@alphashop.com\nLocation: Intern Workspace');
    });
}

cartBtn.addEventListener('click', () => cartModal.style.display = 'block');
closeCart.addEventListener('click', () => cartModal.style.display = 'none');

window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
    if (e.target === authModal) authModal.style.display = 'none';
});

// --- Initialization Launch ---
fetchProducts();