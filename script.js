// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initWishes();
    initGiftBox();
    initCelebration();
    initBackgroundMusic();
    
    // Добавляем плавную прокрутку
    initSmoothScrolling();
});

// Фоновая музыка
function initBackgroundMusic() {
    const bgMusic = document.getElementById('bg-music');
    const celebrationSound = document.getElementById('celebration-sound');
    
    // Устанавливаем громкость
    bgMusic.volume = 0.2;
    celebrationSound.volume = 0.4;
    
    function enableMusic() {
        bgMusic.play().catch(e => {
            console.log("Автовоспроизведение музыки заблокировано");
        });
        
        // Удаляем обработчики после первого клика
        document.removeEventListener('click', enableMusic);
        document.removeEventListener('touchstart', enableMusic);
    }
    
    // Добавляем обработчики для первого взаимодействия
    document.addEventListener('click', enableMusic);
    document.addEventListener('touchstart', enableMusic);
    
    window.playCelebrationSound = function() {
        celebrationSound.currentTime = 0;
        celebrationSound.play().catch(e => console.log("Звук праздника не может быть воспроизведен"));
    };
}

// Плавная прокрутка
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Интерактивные пожелания
function initWishes() {
    const wishItems = document.querySelectorAll('.wish-item');
    
    wishItems.forEach(item => {
        item.addEventListener('click', function() {
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Создаем эффект частиц
            createParticles(this);
            
            // Воспроизводим звук
            playTapSound();
            
            // Показываем сообщение
            const wishText = this.querySelector('p').textContent;
            showToast(wishText);
        });
    });
}

// Подарочная коробка
function initGiftBox() {
    const giftBox = document.getElementById('gift-box');
    const giftContent = document.getElementById('gift-content');
    let isOpened = false;
    
    giftBox.addEventListener('click', function() {
        if (!isOpened) {
            this.classList.add('open');
            giftContent.classList.remove('hidden');
            isOpened = true;
            
            // Анимация и звук
            createConfetti();
            if (window.playCelebrationSound) {
                window.playCelebrationSound();
            }
            
            // Добавляем анимацию для подарка
            const giftImage = document.querySelector('.gift-image');
            giftImage.style.animation = 'bounce 1.5s ease infinite';
            
            // Плавно прокручиваем к подарку
            setTimeout(() => {
                giftContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 500);
        }
    });
}

// Праздничные эффекты
function initCelebration() {
    const celebrationBtn = document.getElementById('celebration-btn');
    const celebrationContainer = document.getElementById('celebration-container');
    
    if (!celebrationBtn) {
        console.log("Кнопка праздника не найдена");
        return;
    }
    
    celebrationBtn.addEventListener('click', function() {
        console.log("Запуск праздника!");
        createCelebration();
        if (window.playCelebrationSound) {
            window.playCelebrationSound();
        }
        showToast("Праздник начался! 🎉");
    });
    
    function createCelebration() {
        // Очищаем предыдущие эффекты
        celebrationContainer.innerHTML = '';
        
        // Создаем конфетти
        createConfettiBurst();
        
        // Добавляем дополнительные эффекты через интервалы
        setTimeout(createConfettiBurst, 500);
        setTimeout(createConfettiBurst, 1000);
        setTimeout(createConfettiBurst, 1500);
        
        // Анимируем элементы страницы
        animatePageElements();
    }
    
    function createConfettiBurst() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#7e6bc9', '#fd7e14', '#a78bfa'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            
            confetti.style.cssText = `
                background: ${color};
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                animation-duration: ${animationDuration}s;
            `;
            
            celebrationContainer.appendChild(confetti);
            
            // Удаляем конфетти после анимации
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, animationDuration * 1000);
        }
    }
    
    function animatePageElements() {
        // Анимируем элементы пожеланий
        const wishItems = document.querySelectorAll('.wish-item');
        wishItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 300);
            }, index * 200);
        });
        
        // Анимируем аватар
        const avatarFrame = document.querySelector('.avatar-frame');
        avatarFrame.style.animation = 'avatar-pulse 0.5s ease 3';
        
        // Анимируем декор
        const decorationElement = document.querySelector('.decoration-element');
        decorationElement.style.animation = 'rotate 2s ease 3';
    }
}

// Вспомогательные функции
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#7e6bc9', '#fd7e14', '#a78bfa'];
    const celebrationContainer = document.getElementById('celebration-container');
    
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            
            confetti.style.cssText = `
                background: ${color};
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                animation-duration: ${animationDuration}s;
            `;
            
            celebrationContainer.appendChild(confetti);
            
            // Удаляем конфетти после анимации
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, animationDuration * 1000);
        }, i * 100);
    }
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const color = window.getComputedStyle(element).backgroundColor || '#4ecdc4';
    const celebrationContainer = document.getElementById('celebration-container');
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        celebrationContainer.appendChild(particle);
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 25 + Math.random() * 15;
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
        ], {
            duration: 500 + Math.random() * 300,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.remove();
            }
        };
    }
}

function playTapSound() {
    // Создаем простой звук с использованием Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log("Web Audio API не поддерживается");
    }
}

function showToast(message) {
    // Удаляем существующие тосты
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #a78bfa 0%, #67e8f9 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 1001;
        max-width: 300px;
        animation: slideInRight 0.4s ease;
        font-weight: 500;
        text-align: center;
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
    `;
    
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 3000);
}

// Добавляем CSS для анимаций, если их еще нет
if (!document.querySelector('style[data-dynamic-styles]')) {
    const styleSheet = document.createElement('style');
    styleSheet.setAttribute('data-dynamic-styles', 'true');
    styleSheet.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .custom-toast {
            font-family: 'Poppins', sans-serif;
        }
        
        @media (max-width: 768px) {
            .custom-toast {
                right: 10px;
                left: 10px;
                max-width: none;
                top: 10px;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}