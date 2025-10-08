// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initHeartsWishes();
    initGiftBox();
    initYawnGame();
    initStarGame();
    initPuzzle();
    initMusicPlayer();
    initFireworks();
    initGallery();
    
    // Запуск фоновой музыки при первом взаимодействии
    initBackgroundMusic();
    
    // Добавляем плавную прокрутку для якорных ссылок
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

// Интерактивные сердечки с пожеланиями
function initHeartsWishes() {
    const heartsContainer = document.getElementById('hearts-container');
    const dynamicMessage = document.getElementById('dynamic-message');
    
    // Очищаем контейнер на случай повторной инициализации
    heartsContainer.innerHTML = '';
    
    const wishes = [
        "Удачи во всём!",
        "Море улыбок!",
        "Вдохновения!",
        "Ярких моментов!",
        "Крепкого здоровья!",
        "Исполнения мечтаний!",
        "Много радости!",
        "Прекрасного настроения!"
    ];
    
    let revealedHearts = 0;
    
    wishes.forEach((wish, index) => {
        const heart = document.createElement('div');
        heart.className = 'heart-wish';
        heart.innerHTML = '💖';
        heart.title = 'Нажми чтобы увидеть пожелание';
        heart.setAttribute('aria-label', `Пожелание ${index + 1}`);
        
        heart.addEventListener('click', function() {
            if (!this.classList.contains('revealed')) {
                this.classList.add('revealed');
                this.innerHTML = wish;
                this.style.background = '#4ecdc4';
                revealedHearts++;
                
                // Создаем эффект частиц
                createParticles(this);
                
                // Воспроизводим звук
                playTapSound();
                
                // Обновляем сообщение
                if (revealedHearts === 1) {
                    dynamicMessage.textContent = 'Отлично! Продолжай открывать пожелания!';
                } else if (revealedHearts === wishes.length) {
                    dynamicMessage.textContent = 'Все пожелания открыты! Ты заслуживаешь всего самого лучшего!';
                    createConfetti();
                    if (window.playCelebrationSound) {
                        window.playCelebrationSound();
                    }
                }
            }
        });
        
        // Добавляем небольшую задержку для анимации появления
        setTimeout(() => {
            heartsContainer.appendChild(heart);
        }, index * 100);
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
            
            // Добавляем анимацию для котенка
            const kitten = document.querySelector('.kitten-gift');
            kitten.style.animation = 'bounce 1.5s ease infinite';
            
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

// Игра "Поймай зевок"
function initYawnGame() {
    const startButton = document.getElementById('start-game');
    const gameArea = document.getElementById('yawn-game');
    const yawn = document.getElementById('yawn');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    
    let score = 0;
    let timeLeft = 10;
    let gameActive = false;
    let gameTimer;
    
    // Устанавливаем начальную позицию
    moveYawn();
    
    startButton.addEventListener('click', startYawnGame);
    
    function startYawnGame() {
        score = 0;
        timeLeft = 10;
        gameActive = true;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        startButton.disabled = true;
        
        moveYawn();
        
        gameTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endYawnGame();
            }
        }, 1000);
    }
    
    function moveYawn() {
        if (!gameActive && !gameTimer) return;
        
        const maxX = gameArea.offsetWidth - yawn.offsetWidth;
        const maxY = gameArea.offsetHeight - yawn.offsetHeight;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        yawn.style.left = randomX + 'px';
        yawn.style.top = randomY + 'px';
        
        if (gameActive) {
            setTimeout(moveYawn, 800 - Math.min(score * 50, 500)); // Ускоряется с ростом счета
        }
    }
    
    yawn.addEventListener('click', function() {
        if (!gameActive) return;
        
        score++;
        scoreDisplay.textContent = score;
        
        // Анимация клика
        this.style.transform = 'scale(1.4)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Звук клика
        playTapSound();
        
        moveYawn();
    });
    
    function endYawnGame() {
        gameActive = false;
        clearInterval(gameTimer);
        startButton.disabled = false;
        
        let message;
        if (score >= 12) {
            message = "Фантастически! Ты настоящий мастер по ловле зевков! 🏆";
        } else if (score >= 8) {
            message = "Отлично! Ты почти поймал все зевки! ✨";
        } else if (score >= 4) {
            message = "Хороший результат! Продолжай тренироваться! 💪";
        } else {
            message = "Не расстраивайся! В следующий раз получится лучше! 🌟";
        }
        
        setTimeout(() => {
            showToast(`Игра окончена! Твой счёт: ${score}\n${message}`);
        }, 500);
    }
}

// Игра "Собери звезды"
function initStarGame() {
    const startButton = document.getElementById('start-star-game');
    const gameArea = document.getElementById('star-game');
    const player = document.getElementById('player');
    const scoreDisplay = document.getElementById('star-score');
    const timerDisplay = document.getElementById('star-timer');
    
    let score = 0;
    let timeLeft = 20;
    let gameActive = false;
    let gameTimer;
    let starTimer;
    let stars = [];
    
    startButton.addEventListener('click', startStarGame);
    
    function startStarGame() {
        // Очистка предыдущих звезд
        stars.forEach(star => star.remove());
        stars = [];
        
        score = 0;
        timeLeft = 20;
        gameActive = true;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        startButton.disabled = true;
        
        // Создаем звезды
        createStars();
        
        // Таймер игры
        gameTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endStarGame();
            }
        }, 1000);
        
        // Таймер для создания новых звезд
        starTimer = setInterval(createStars, 1200);
    }
    
    function createStars() {
        if (!gameActive) return;
        
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = '⭐';
        star.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';
        star.style.top = Math.random() * (gameArea.offsetHeight - 40) + 'px';
        
        star.addEventListener('click', function() {
            if (!gameActive) return;
            
            score++;
            scoreDisplay.textContent = score;
            
            // Анимация сбора
            this.style.transform = 'scale(1.4)';
            this.style.opacity = '0.6';
            
            // Звук сбора
            playTapSound();
            
            setTimeout(() => {
                if (this.parentNode) {
                    this.remove();
                    stars = stars.filter(s => s !== star);
                }
            }, 200);
            
            // Создаем эффект частиц
            createParticles(this);
        });
        
        gameArea.appendChild(star);
        stars.push(star);
        
        // Автоматическое удаление звезд через 4 секунды
        setTimeout(() => {
            if (star.parentNode) {
                star.style.opacity = '0.5';
                setTimeout(() => {
                    if (star.parentNode) {
                        star.remove();
                        stars = stars.filter(s => s !== star);
                    }
                }, 500);
            }
        }, 4000);
    }
    
    function endStarGame() {
        gameActive = false;
        clearInterval(gameTimer);
        clearInterval(starTimer);
        startButton.disabled = false;
        
        // Удаляем оставшиеся звезды
        stars.forEach(star => {
            star.style.opacity = '0.3';
            setTimeout(() => {
                if (star.parentNode) {
                    star.remove();
                }
            }, 300);
        });
        stars = [];
        
        let message;
        if (score >= 18) {
            message = "Невероятно! Ты собрал целое созвездие! 🌠";
        } else if (score >= 12) {
            message = "Отлично! Ты настоящий звездочёт! ✨";
        } else if (score >= 6) {
            message = "Хороший результат! Продолжай в том же духе! 💫";
        } else {
            message = "Неплохо для начала! Ты только учишься! 🌟";
        }
        
        setTimeout(() => {
            showToast(`Игра окончена! Собрано звёзд: ${score}\n${message}`);
        }, 500);
    }
}

// Пазл-послание
function initPuzzle() {
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    const puzzleSolution = document.querySelector('.puzzle-solution');
    const secretMessage = document.getElementById('secret-message');
    
    let correctOrder = ['1', '2', '3', '4'];
    let currentOrder = [];
    
    // Для десктопов - перетаскивание
    puzzlePieces.forEach(piece => {
        piece.setAttribute('draggable', 'true');
        
        piece.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.id);
            this.classList.add('dragging');
        });
        
        piece.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Область для сброса
    const puzzleContainer = document.querySelector('.message-puzzle');
    puzzleContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    puzzleContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const draggedPiece = document.querySelector(`[data-id="${id}"]`);
        
        if (draggedPiece) {
            this.appendChild(draggedPiece);
            checkPuzzleOrder();
        }
    });
    
    // Для мобильных устройств - тапы
    puzzlePieces.forEach(piece => {
        piece.addEventListener('click', function() {
            if (window.innerWidth <= 768) { // Только для мобильных
                currentOrder.push(this.dataset.id);
                
                if (currentOrder.length === puzzlePieces.length) {
                    checkPuzzleOrder();
                }
            }
        });
        
        piece.addEventListener('touchstart', function(e) {
            if (window.innerWidth > 768) return; // Для десктопов используем drag&drop
            
            this.style.transform = 'scale(1.1)';
            this.style.opacity = '0.8';
        });
        
        piece.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        });
    });
    
    function checkPuzzleOrder() {
        const currentPieces = Array.from(puzzleContainer.querySelectorAll('.puzzle-piece'));
        const currentIds = currentPieces.map(piece => piece.dataset.id);
        
        const isCorrect = currentIds.every((id, index) => id === correctOrder[index]);
        
        if (isCorrect) {
            puzzleSolution.classList.remove('hidden');
            secretMessage.textContent = "Ты крутая и вечно спишь! 💖";
            createConfetti();
            if (window.playCelebrationSound) {
                window.playCelebrationSound();
            }
            
            // Блокируем дальнейшие перемещения
            puzzlePieces.forEach(piece => {
                piece.style.cursor = 'default';
                piece.style.opacity = '0.7';
                piece.setAttribute('draggable', 'false');
            });
        } else {
            // Сбрасываем порядок для мобильных
            if (window.innerWidth <= 768) {
                currentOrder = [];
            }
        }
    }
}

// Музыкальный плеер
function initMusicPlayer() {
    const bgMusic = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    if (!playBtn || !pauseBtn || !stopBtn) {
        console.log("Элементы музыкального плеера не найдены");
        return;
    }
    
    playBtn.addEventListener('click', function() {
        bgMusic.play().catch(e => console.log("Не удалось воспроизвести музыку"));
        showToast("Музыка включена 🎵");
    });
    
    pauseBtn.addEventListener('click', function() {
        bgMusic.pause();
        showToast("Музыка приостановлена ⏸️");
    });
    
    stopBtn.addEventListener('click', function() {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        showToast("Музыка остановлена ⏹️");
    });
}

// Фейерверк - ИСПРАВЛЕННАЯ ВЕРСИЯ
function initFireworks() {
    const fireworksBtn = document.getElementById('fireworks-btn');
    const fireworksContainer = document.getElementById('fireworks-container');
    
    if (!fireworksBtn) {
        console.log("Кнопка фейерверка не найдена");
        return;
    }
    
    fireworksBtn.addEventListener('click', function() {
        console.log("Запуск фейерверка!");
        createFireworks();
        if (window.playCelebrationSound) {
            window.playCelebrationSound();
        }
        showToast("Фейерверк запущен! 🎆");
    });
    
    function createFireworks() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#7e6bc9', '#fd7e14', '#a78bfa'];
        
        // Очищаем предыдущие фейерверки
        fireworksContainer.innerHTML = '';
        
        // Создаем несколько залпов фейерверков
        for (let burst = 0; burst < 5; burst++) {
            setTimeout(() => {
                createFireworkBurst(burst);
            }, burst * 400);
        }
    }
    
    function createFireworkBurst(burstIndex) {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#7e6bc9', '#fd7e14', '#a78bfa'];
        const particlesPerBurst = 30;
        
        for (let i = 0; i < particlesPerBurst; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework-particle';
                
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 8 + 4;
                const startX = 50 + (burstIndex * 10); // Начальная позиция по X
                const startY = 50; // Начальная позиция по Y
                
                // Случайное направление разлета
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                firework.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    left: ${startX}%;
                    top: ${startY}%;
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 0 10px ${color};
                `;
                
                fireworksContainer.appendChild(firework);
                
                // Анимация разлета
                const animation = firework.animate([
                    { 
                        transform: 'translate(0, 0) scale(1)',
                        opacity: 1
                    },
                    { 
                        transform: `translate(${endX}px, ${endY}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
                });
                
                animation.onfinish = () => {
                    if (firework.parentNode) {
                        firework.remove();
                    }
                };
            }, i * 20);
        }
    }
}

// Галерея
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const type = this.dataset.type;
            let message;
            
            switch(type) {
                case 'dreamer':
                    message = "Вероника - настоящая мечтательница! Её идеи и фантазии вдохновляют всех вокруг ✨";
                    break;
                case 'thinker':
                    message = "Глубокомысленная и вдумчивая, Вероника всегда находит нестандартные решения 💭";
                    break;
                case 'smile':
                    message = "Её улыбка освещает всё вокруг! С Вероникой всегда тепло и уютно 😊";
                    break;
                default:
                    message = "Вероника прекрасна в любой своей ипостаси! 💖";
            }
            
            showToast(message);
        });
    });
}

// Вспомогательные функции
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#7e6bc9', '#fd7e14', '#a78bfa'];
    
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 12px;
                height: 12px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                top: -20px;
                left: ${Math.random() * 100}%;
                z-index: 1000;
                pointer-events: none;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 1200 + Math.random() * 1800,
                easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
            });
            
            animation.onfinish = () => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            };
        }, i * 100);
    }
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const color = window.getComputedStyle(element).backgroundColor || '#4ecdc4';
    
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
        
        document.body.appendChild(particle);
        
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
    
    // Обрабатываем переносы строк
    const lines = message.split('\n');
    toast.innerHTML = lines.map(line => `<div>${line}</div>`).join('');
    
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
        
        .firework-particle {
            animation: firework-explode 1s ease-out forwards;
        }
        
        @keyframes firework-explode {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--end-x, 100px), var(--end-y, 100px)) scale(0);
                opacity: 0;
            }
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