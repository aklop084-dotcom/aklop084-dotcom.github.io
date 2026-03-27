// js/animations.js
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Символы: цифры, греческие буквы, элементы из линейной алгебры
const symbols = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'α', 'β', 'γ', 'δ', 'ε', 'λ', 'μ', 'π', 'σ', 'ω',
    'det', 'Σ', '∏', '∫', '∂', '∇', '∈', '⊂', '⊕',
    'A⁻¹', 'Aᵀ', 'E', 'ℝ', 'ℂ', '⌈⌉', '⌊⌋', '||v||'
];

let fontSize = 16;
let columns;
let drops = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -canvas.height;
    }
}

function draw() {
    // Сохраняем прозрачность для эффекта "хвоста"
    ctx.fillStyle = `rgba(${getComputedStyle(document.body).backgroundColor === 'rgb(10, 12, 15)' ? '10, 12, 15' : '249, 250, 251'}, 0.05)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Цвет текста зависит от темы (берем акцентный)
    const isDark = document.body.classList.contains('light-theme') ? false : true;
    ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        // Случайный символ
        const text = symbols[Math.floor(Math.random() * symbols.length)];
        // Случайная прозрачность от 0.2 до 0.8
        const opacity = Math.random() * 0.6 + 0.2;
        ctx.fillStyle = `rgba(${isDark ? '59, 130, 246' : '37, 99, 235'}, ${opacity})`;

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Сброс, когда упали ниже экрана
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.8; // скорость падения
    }
}

window.addEventListener('resize', () => {
    initCanvas();
});

// Анимация
let animationId;
function startAnimation() {
    if (animationId) cancelAnimationFrame(animationId);
    initCanvas();
    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

startAnimation();

// Перезапуск анимации при смене темы, чтобы цвет подстроился
const observer = new MutationObserver(() => {
    // Перерисовываем фон, но не пересоздаем всю анимацию
    // Просто меняем цвет в draw автоматически при следующем кадре
});
observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });