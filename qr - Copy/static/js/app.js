// QR Code Generator Pro - Enhanced JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeApp();
});

function initializeApp() {
    // Initialize QR code generation
    initializeQRGeneration();
    
    // Initialize dashboard features
    initializeDashboard();
    
    // Initialize form enhancements
    initializeFormEnhancements();
    
    // Initialize animations
    initializeAnimations();
}

// QR Code Generation
function initializeQRGeneration() {
    const generateBtn = document.getElementById('generateQRBtn');
    const qrContentInput = document.getElementById('qrContent');
    const qrResult = document.getElementById('qrResult');
    
    if (generateBtn && qrContentInput) {
        generateBtn.addEventListener('click', function() {
            generateQRCode();
        });
        
        // Allow Enter key to generate QR
        qrContentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateQRCode();
            }
        });
    }
}

function generateQRCode() {
    const content = document.getElementById('qrContent').value.trim();
    
    if (!content) {
        showNotification('Please enter content for the QR code', 'warning');
        return;
    }
    
    // Show loading state
    const generateBtn = document.getElementById('generateQRBtn');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Generating...';
    generateBtn.disabled = true;
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // Create QR code using API
        fetch('/generate-qr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: content })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayQRCode(data.qr_image, content);
                showNotification('QR Code generated successfully!', 'success');
                
                // Add to dashboard if on dashboard page
                if (window.location.pathname === '/dashboard') {
                    addQRToDashboard(data);
                }
            } else {
                showNotification('Error generating QR code', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error generating QR code', 'error');
        })
        .finally(() => {
            // Reset button state
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        });
    }, 500);
}

function displayQRCode(qrImage, content) {
    const qrResult = document.getElementById('qrResult');
    if (qrResult) {
        qrResult.innerHTML = `
            <div class="qr-result-card">
                <img src="data:image/png;base64,${qrImage}" alt="QR Code" class="img-fluid">
                <div class="qr-actions mt-3">
                    <button class="btn btn-primary btn-sm" onclick="downloadQR('${qrImage}')">
                        <i class="bi bi-download"></i> Download
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" onclick="copyQRContent('${content}')">
                        <i class="bi bi-clipboard"></i> Copy Content
                    </button>
                </div>
            </div>
        `;
        qrResult.classList.add('show');
    }
}

// Dashboard Features
function initializeDashboard() {
    if (window.location.pathname === '/dashboard') {
        // Initialize QR code management
        initializeQRCodeManagement();
        
        // Initialize statistics
        initializeStatistics();
        
        // Initialize search/filter functionality
        initializeSearchFilter();
    }
}

function initializeQRCodeManagement() {
    // Delete QR code functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-qr-btn')) {
            const btn = e.target.closest('.delete-qr-btn');
            const qrId = btn.dataset.qrId;
            deleteQRCode(qrId);
        }
    });
    
    // Copy QR content functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.copy-content-btn')) {
            const btn = e.target.closest('.copy-content-btn');
            const content = btn.dataset.content;
            copyQRContent(content);
        }
    });
}

function deleteQRCode(qrId) {
    if (confirm('Are you sure you want to delete this QR code?')) {
        fetch(`/delete-qr/${qrId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the QR card from DOM
                const qrCard = document.querySelector(`[data-qr-id="${qrId}"]`);
                if (qrCard) {
                    qrCard.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => qrCard.remove(), 300);
                }
                showNotification('QR Code deleted successfully', 'success');
                updateStatistics();
            } else {
                showNotification('Error deleting QR code', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error deleting QR code', 'error');
        });
    }
}

function initializeStatistics() {
    // Animate numbers on load
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(number => {
        animateNumber(number);
    });
}

function animateNumber(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function updateStatistics() {
    // Update statistics after changes
    setTimeout(() => {
        const totalQRCodes = document.querySelectorAll('.qr-card').length;
        const totalElement = document.querySelector('.stat-number');
        if (totalElement) {
            totalElement.textContent = totalQRCodes;
        }
    }, 300);
}

function initializeSearchFilter() {
    const searchInput = document.getElementById('searchQR');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterQRCodes(searchTerm);
        });
    }
}

function filterQRCodes(searchTerm) {
    const qrCards = document.querySelectorAll('.qr-card');
    
    qrCards.forEach(card => {
        const content = card.querySelector('.qr-text').textContent.toLowerCase();
        const created = card.querySelector('.qr-created').textContent.toLowerCase();
        
        if (content.includes(searchTerm) || created.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// Form Enhancements
function initializeFormEnhancements() {
    // Password toggle functionality
    const passwordToggleBtns = document.querySelectorAll('.password-toggle');
    passwordToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function downloadQR(qrImage) {
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = `data:image/png;base64,${qrImage}`;
    link.click();
    showNotification('QR Code downloaded successfully!', 'success');
}

function copyQRContent(content) {
    navigator.clipboard.writeText(content).then(() => {
        showNotification('Content copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy content', 'error');
    });
}

function addQRToDashboard(qrData) {
    const qrGrid = document.querySelector('.qr-grid');
    if (qrGrid) {
        const newQRCard = document.createElement('div');
        newQRCard.className = 'qr-card';
        newQRCard.dataset.qrId = qrData.id;
        newQRCard.innerHTML = `
            <img src="data:image/png;base64,${qrData.qr_image}" alt="QR Code" class="qr-image">
            <div class="qr-content">
                <p class="qr-text">${qrData.content}</p>
                <small class="text-muted qr-created">Just now</small>
                <div class="qr-actions mt-3">
                    <button class="btn btn-outline-primary btn-sm copy-content-btn" data-content="${qrData.content}">
                        <i class="bi bi-clipboard"></i>
                    </button>
                    <button class="btn btn-outline-success btn-sm" onclick="downloadQR('${qrData.qr_image}')">
                        <i class="bi bi-download"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm delete-qr-btn" data-qr-id="${qrData.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        qrGrid.insertBefore(newQRCard, qrGrid.firstChild);
        newQRCard.style.animation = 'fadeInUp 0.5s ease-out';
    }
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .feature-icon, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Additional CSS animations
const additionalStyles = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .qr-result-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        text-align: center;
        animation: fadeIn 0.5s ease-out;
    }
    
    .qr-result-card img {
        max-width: 200px;
        margin: 0 auto;
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);