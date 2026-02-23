// Scroll to top on page refresh
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Also scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

let cart = [];
let menuEventListenersAdded = false;
let isMenuToggling = false;
let lastMenuToggleTime = 0;

function toggleMobileMenu() {
    const now = Date.now();
    if (isMenuToggling || (now - lastMenuToggleTime) < 200) return;
    
    isMenuToggling = true;
    lastMenuToggleTime = now;
    
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    // Prevent event bubbling
    event.stopPropagation();
    
    navLinks.classList.toggle('active');
    
    // Change icon based on menu state
    if (navLinks.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
    
    // Reset toggle flag after a short delay
    setTimeout(() => {
        isMenuToggling = false;
    }, 200);
}

function setupMenuEventListeners() {
    if (menuEventListenersAdded) return;
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Close mobile menu when clicking outside - use click with proper timing
    document.addEventListener('click', (e) => {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const now = Date.now();
        
        // Check if menu is open and click is outside menu and toggle button
        // Also check if enough time has passed since last toggle
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            (now - lastMenuToggleTime) > 300) {
            
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    menuEventListenersAdded = true;
}

function openCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.add('open');
    overlay.classList.add('open');
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar.classList.contains('open')) {
        closeCart();
    } else {
        openCart();
    }
}

function addToCart(e, name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCart();
    openCart();
    
    // Button feedback (avoid relying on the global `event`)
    const btn = e?.target?.closest?.('.btn-add');
    if (btn) {
        const originalHTML = btn.innerHTML;
        const originalBg = btn.style.background;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#10b981';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = originalBg;
        }, 1000);
    }
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `฿${total.toLocaleString()}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">ตะกร้าว่างเปล่า</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">👟</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>฿${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.name}')" title="ลบสินค้า">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.querySelector(this.getAttribute('href'));
        
        // Immediately update active class for clicked link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

let isScrolling = false;
let scrollTimeout;

window.addEventListener('scroll', () => {
    // Debounce scroll events to avoid conflicts
    if (isScrolling) return;
    
    isScrolling = true;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        const scrollPosition = window.scrollY + 150; // Increased offset for better detection
        
        // Find the section that's currently most visible
        let maxVisibility = 0;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Calculate how much of the section is visible in viewport
            const viewportTop = window.scrollY;
            const viewportBottom = viewportTop + window.innerHeight;
            
            const visibleTop = Math.max(sectionTop, viewportTop);
            const visibleBottom = Math.min(sectionBottom, viewportBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibilityPercentage = visibleHeight / sectionHeight;
            
            if (visibilityPercentage > maxVisibility) {
                maxVisibility = visibilityPercentage;
                current = section.getAttribute('id');
            }
        });
        
        // Handle edge case: if we're at the bottom of the page, highlight the last section
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                current = lastSection.getAttribute('id');
            }
        }
        
        console.log('Current section:', current); // Debugging line
        console.log('Scroll position:', scrollPosition); // Debugging line

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Scroll animations
        handleScrollAnimations();
        
        isScrolling = false;
    }, 50); // Small delay to prevent conflicts
});

// Close cart on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
});

// Scroll animation observer
function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .feature, .social-item, .categories h2, .products h2, .about h2, .contact h2');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        // Check if element is in viewport
        if (elementTop < windowHeight - 100 && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Setup mobile menu event listeners
    setupMenuEventListeners();
    
    // Initial check for elements already in viewport
    handleScrollAnimations();
    
    // Add staggered animation delays for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation delays for category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation delays for features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Add staggered animation delays for social items
    const socialItems = document.querySelectorAll('.social-item');
    socialItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Trigger entrance animations for elements already in view
    setTimeout(() => {
        const inViewElements = document.querySelectorAll('.category-card, .product-card, .feature, .social-item');
        inViewElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('visible');
            }
        });
    }, 300);
});
