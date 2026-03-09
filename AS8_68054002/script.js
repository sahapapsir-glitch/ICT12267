document.addEventListener('DOMContentLoaded', () => {
    console.log('Travel Moments website loaded successfully.');

    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    function updateBodyPadding() {
        const navbarHeight = navbar.offsetHeight;
        body.style.paddingTop = navbarHeight + 'px';
    }
    
    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);

    const contactModal = new bootstrap.Modal(document.getElementById('myModal'));

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const contactForm = document.querySelector('#myModal form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (email && message) {
                showNotification('ขอบคุณสำหรับข้อมูลของคุณ! เราจะติดต่อกลับโดยเร็ว', 'success');
                
                contactForm.reset();
                contactModal.hide();
            } else {
                showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
            }
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
        notification.style.zIndex = '9999';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - navbar.offsetHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    const serviceButtons = document.querySelectorAll('.card .btn-primary');
    serviceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const cardTitle = button.closest('.card').querySelector('.card-title').textContent;
            
            const modalTitle = document.querySelector('#myModal .modal-title');
            const modalBody = document.querySelector('#myModal .modal-body');
            
            modalTitle.textContent = cardTitle;
            modalBody.innerHTML = `
                <div class="text-center mb-3">
                    <h4>${cardTitle}</h4>
                    <p class="text-muted">กรุณากรอกข้อมูลเพื่อรับข้อมูลเพิ่มเติมเกี่ยวกับบริการของเรา</p>
                </div>
                <form>
                    <div class="form-group">
                        <label for="email" class="form-label">อีเมล์</label>
                        <input type="email" id="email" placeholder="กรุณากรอกอีเมล์ของคุณ" class="form-control" required>
                        <label for="message" class="form-label mt-3">ข้อความ</label>
                        <textarea id="message" rows="4" class="form-control" placeholder="กรุณากรอกข้อความของคุณ" required></textarea>
                    </div>
                </form>
            `;
            
            contactModal.show();
        });
    });

});
