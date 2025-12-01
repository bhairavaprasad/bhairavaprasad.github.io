// Dynamic Colors for Visualizations
// Since we are now fixed to Soft Slate, we can just grab the computed styles once or hardcode if needed.
// But keeping it dynamic allows for easier future changes via CSS.
const body = document.body;

function getThemeColors() {
    const style = getComputedStyle(body);
    return {
        bg: style.getPropertyValue('--secondary-bg').trim(),
        accent: style.getPropertyValue('--accent-color').trim(),
        text: style.getPropertyValue('--text-color').trim(),
        border: style.getPropertyValue('--border-color').trim()
    };
}

// Utility to draw a bar
function drawBar(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// O(n) Visualization
const canvasLinear = document.getElementById('canvas-linear');
const ctxLinear = canvasLinear.getContext('2d');
const sliderLinear = document.getElementById('slider-linear-n');
const valLinear = document.getElementById('val-linear-n');
const btnLinear = document.getElementById('btn-linear-run');
const statsLinear = document.getElementById('stats-linear');

let linearAnimationId;

function drawLinear(n, activeIndex = -1) {
    const colors = getThemeColors();
    ctxLinear.clearRect(0, 0, canvasLinear.width, canvasLinear.height);
    const barWidth = (canvasLinear.width - 20) / n;
    const spacing = 1;

    for (let i = 0; i < n; i++) {
        const x = 10 + i * barWidth;
        const height = 100;
        const y = (canvasLinear.height - height) / 2;

        // Soft Slate specific bar color for inactive
        let barColor = '#4c566a';

        drawBar(ctxLinear, x, y, barWidth - spacing, height, i === activeIndex ? colors.accent : barColor);
    }
}

async function runLinear() {
    if (linearAnimationId) return; // Prevent multiple runs
    const n = parseInt(sliderLinear.value);

    for (let i = 0; i < n; i++) {
        drawLinear(n, i);
        statsLinear.textContent = i + 1;
        await new Promise(r => setTimeout(r, 1000 / n)); // Speed adjusts with N
    }
    drawLinear(n, -1); // Reset highlight
    linearAnimationId = null;
}

sliderLinear.addEventListener('input', (e) => {
    valLinear.textContent = e.target.value;
    drawLinear(parseInt(e.target.value));
});

btnLinear.addEventListener('click', runLinear);


// O(1) Visualization
const canvasConstant = document.getElementById('canvas-constant');
const ctxConstant = canvasConstant.getContext('2d');
const sliderConstant = document.getElementById('slider-constant-n');
const valConstant = document.getElementById('val-constant-n');
const btnConstant = document.getElementById('btn-constant-run');
const statsConstant = document.getElementById('stats-constant');

function drawConstant(n, active = false) {
    const colors = getThemeColors();
    ctxConstant.clearRect(0, 0, canvasConstant.width, canvasConstant.height);

    // Draw "Array" representation
    let barColor = '#4c566a'; // Soft Slate

    ctxConstant.fillStyle = barColor;
    ctxConstant.fillRect(10, 40, canvasConstant.width - 20, 20);

    // Draw "Access" arrow
    if (active) {
        ctxConstant.fillStyle = colors.accent;
        const x = 10 + Math.random() * (canvasConstant.width - 40);
        ctxConstant.beginPath();
        ctxConstant.moveTo(x, 10);
        ctxConstant.lineTo(x + 10, 30);
        ctxConstant.lineTo(x - 10, 30);
        ctxConstant.fill();
    }
}

async function runConstant() {
    const n = parseInt(sliderConstant.value);
    drawConstant(n, true);
    statsConstant.textContent = "1 (Instant Access)";
    await new Promise(r => setTimeout(r, 500));
    drawConstant(n, false);
}

sliderConstant.addEventListener('input', (e) => {
    valConstant.textContent = e.target.value;
    drawConstant(parseInt(e.target.value));
});

btnConstant.addEventListener('click', runConstant);


// O(n^2) Visualization (Grid Fill)
const canvasQuad = document.getElementById('canvas-quadratic');
const ctxQuad = canvasQuad.getContext('2d');
const sliderQuad = document.getElementById('slider-quadratic-n');
const valQuad = document.getElementById('val-quadratic-n');
const btnQuad = document.getElementById('btn-quadratic-run');
const statsQuad = document.getElementById('stats-quadratic');
const totalQuad = document.getElementById('total-quadratic');

let quadAnimationId;

function drawGrid(n, activeRow = -1, activeCol = -1) {
    const colors = getThemeColors();
    ctxQuad.clearRect(0, 0, canvasQuad.width, canvasQuad.height);

    const padding = 10;
    const availableWidth = canvasQuad.width - (padding * 2);
    const cellSize = availableWidth / n;

    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const x = padding + col * cellSize;
            const y = padding + row * cellSize;

            let color = 'transparent'; // Empty cell
            let borderColor = '#4c566a'; // Soft Slate

            // Draw cell border
            ctxQuad.strokeStyle = borderColor;
            ctxQuad.strokeRect(x, y, cellSize, cellSize);

            // If we've passed this cell, fill it
            if (row < activeRow || (row === activeRow && col <= activeCol)) {
                color = '#a3be8c'; // Nord Green
            }

            // Highlight current cell
            if (row === activeRow && col === activeCol) {
                color = colors.accent;
            }

            if (color !== 'transparent') {
                ctxQuad.fillStyle = color;
                ctxQuad.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
            }
        }
    }
}

async function runQuad() {
    if (quadAnimationId) return;
    const n = parseInt(sliderQuad.value);
    let ops = 0;
    totalQuad.textContent = n * n;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            ops++;
            statsQuad.textContent = ops;
            drawGrid(n, i, j);
            await new Promise(r => setTimeout(r, 20));
        }
    }
    drawGrid(n, n, n);
    quadAnimationId = null;
}

sliderQuad.addEventListener('input', (e) => {
    valQuad.textContent = e.target.value;
    totalQuad.textContent = e.target.value * e.target.value;
    drawGrid(parseInt(e.target.value));
});

btnQuad.addEventListener('click', runQuad);


// O(log n) Visualization (Binary Search with Dimming)
const canvasLog = document.getElementById('canvas-log');
const ctxLog = canvasLog.getContext('2d');
const sliderLog = document.getElementById('slider-log-n');
const valLog = document.getElementById('val-log-n');
const btnLog = document.getElementById('btn-log-run');
const statsLog = document.getElementById('stats-log');

let logAnimationId;

function drawLog(n, low, high, mid = -1, found = -1) {
    const colors = getThemeColors();
    ctxLog.clearRect(0, 0, canvasLog.width, canvasLog.height);
    const barWidth = (canvasLog.width - 40) / n;
    const height = 80;
    const y = (canvasLog.height - height) / 2;

    for (let i = 0; i < n; i++) {
        const x = 20 + i * barWidth;
        let color = '#4c566a'; // Soft Slate inactive

        let alpha = 0.2;

        if (i >= low && i <= high) {
            alpha = 1.0;
            color = '#8fbcbb'; // Nord Teal-ish
        }

        if (i === mid) {
            color = colors.accent;
            alpha = 1.0;
        }
        if (i === found) {
            color = '#a3be8c'; // Nord Green
            alpha = 1.0;
        }

        ctxLog.globalAlpha = alpha;
        drawBar(ctxLog, x, y, barWidth - 1, height, color);
        ctxLog.globalAlpha = 1.0;
    }
}

async function runLog() {
    if (logAnimationId) return;
    const n = parseInt(sliderLog.value);
    const target = Math.floor(Math.random() * n);
    let low = 0;
    let high = n - 1;
    let ops = 0;

    while (low <= high) {
        ops++;
        statsLog.textContent = ops;
        const mid = Math.floor((low + high) / 2);

        drawLog(n, low, high, mid);
        await new Promise(r => setTimeout(r, 1000));

        if (mid === target) {
            drawLog(n, low, high, mid, mid);
            break;
        } else if (mid < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    logAnimationId = null;
}

sliderLog.addEventListener('input', (e) => {
    valLog.textContent = e.target.value;
    drawLog(parseInt(e.target.value), 0, parseInt(e.target.value) - 1);
});

btnLog.addEventListener('click', runLog);

// Initial Draws
setTimeout(() => {
    drawLinear(10);
    drawConstant(10);
    drawGrid(5);
    drawLog(16, 0, 15);
}, 100);
