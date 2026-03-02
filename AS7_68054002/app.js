// Modern Video Background Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupFormValidation();
    setupVideoControls();
    setupAnimations();
    setupSocialLinks();
    setupParticles();
}

function setupFormValidation() {
    const form = document.getElementById('mainForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            position: document.getElementById('position').value
        };

        if (validateForm(formData)) {
            submitForm(formData);
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // Radio button validation
    const radioButtons = form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            clearGenderError();
        });
    });
}

function validateForm(data) {
    let isValid = true;
    
    if (!data.fullname.trim()) {
        showFieldError(document.getElementById('fullname'), 'กรุณากรอกชื่อ-นามสกุล');
        isValid = false;
    }
    
    if (!data.email.trim()) {
        showFieldError(document.getElementById('email'), 'กรุณากรอกอีเมล');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError(document.getElementById('email'), 'กรุณากรอกอีเมลที่ถูกต้อง');
        isValid = false;
    }
    
    if (!data.password.trim()) {
        showFieldError(document.getElementById('password'), 'กรุณากรอกรหัสผ่าน');
        isValid = false;
    } else if (data.password.length < 6) {
        showFieldError(document.getElementById('password'), 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
        isValid = false;
    }
    
    if (!data.gender) {
        showGenderError('กรุณาเลือกเพศ');
        isValid = false;
    }
    
    if (!data.position.trim()) {
        showFieldError(document.getElementById('position'), 'กรุณากรอกตำแหน่ง');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'กรุณากรอกข้อมูลนี้');
        return false;
    }
    
    if (field.type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'กรุณากรอกอีเมลที่ถูกต้อง');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function showGenderError(message) {
    clearGenderError();
    
    const genderOptions = document.querySelector('.gender-options');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message gender-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    genderOptions.parentNode.appendChild(errorDiv);
}

function clearGenderError() {
    const errorMessage = document.querySelector('.gender-error');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function submitForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> กำลังส่ง...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        console.log('Form submitted:', data);
        
        // Show success message
        showNotification('ส่งข้อมูลสำเร็จแล้ว!', 'success');
        
        // Reset form
        document.getElementById('mainForm').reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function resetForm() {
    const form = document.getElementById('mainForm');
    if (form) {
        form.reset();
        
        // Clear all errors
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            clearFieldError(input);
        });
        
        // Clear gender error
        clearGenderError();
        
        showNotification('ฟอร์มถูกรีเซ็ตแล้ว', 'info');
    }
}

function setupVideoControls() {
    const video = document.getElementById('bgVideo');
    if (!video) return;

    // Ensure video plays on mobile
    video.play().catch(e => {
        console.log('Auto-play prevented:', e);
    });
}

function togglePlayPause() {
    const video = document.getElementById('bgVideo');
    const btn = document.getElementById('playPauseBtn');
    
    if (!video || !btn) return;

    if (video.paused) {
        video.play();
        btn.innerHTML = '<i class="bi bi-pause-fill"></i><span>Pause</span>';
    } else {
        video.pause();
        btn.innerHTML = '<i class="bi bi-play-fill"></i><span>Play</span>';
    }
}

function toggleMute() {
    const video = document.getElementById('bgVideo');
    const btn = document.getElementById('muteBtn');
    
    if (!video || !btn) return;

    video.muted = !video.muted;
    
    if (video.muted) {
        btn.innerHTML = '<i class="bi bi-volume-mute-fill"></i><span>Mute</span>';
    } else {
        btn.innerHTML = '<i class="bi bi-volume-up-fill"></i><span>Unmute</span>';
    }
}

function toggleFullscreen() {
    const videoContainer = document.querySelector('.video-container');
    
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            console.log('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function setupAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe form elements
    const formElements = document.querySelectorAll('.form-group');
    formElements.forEach(el => observer.observe(el));
}

function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('i').className.split('bi-')[1].split(' ')[0];
            showNotification(`คลิกที่ลิงก์ ${platform}`, 'info');
        });
    });
}

function setupParticles() {
    // Add more particles dynamically
    const container = document.querySelector('.floating-particles');
    if (!container) return;

    setInterval(() => {
        if (container.children.length < 10) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            container.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 7000);
        }
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });

    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to toggle video
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlayPause();
    }
    
    // M key to toggle mute
    if (e.key === 'm' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleMute();
    }
    
    // F key to toggle fullscreen
    if (e.key === 'f' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Escape to exit fullscreen
    if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// Add CSS for error states
const errorStyles = `
    .form-control.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);