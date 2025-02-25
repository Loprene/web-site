const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const speedInput = document.getElementById("speedInput");
const gridSizeInput = document.getElementById("gridSizeInput");
const patternSelect = document.getElementById("patternSelect");
const randomPatternBtn = document.getElementById("randomPatternBtn");

let resolution = 20;
let cols, rows;
let grid;
let running = false;
let interval;
let speed = 200;

function setup() {
    cols = Math.floor(canvas.width / resolution);
    rows = Math.floor(canvas.height / resolution);
    grid = Array.from({ length: cols }, () => Array(rows).fill(0));
    drawGrid();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = grid[col][row] ? "black" : "white";
            ctx.fill();
            ctx.stroke();
        }
    }
}

function nextGeneration() {
    const nextGen = grid.map(arr => [...arr]);
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const cell = grid[col][row];
            let neighbors = countNeighbors(col, row);

            if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGen[col][row] = 0;
            } else if (cell === 0 && neighbors === 3) {
                nextGen[col][row] = 1;
            }
        }
    }
    grid = nextGen;
    drawGrid();
}

function countNeighbors(x, y) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const col = (x + i + cols) % cols;
            const row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    return sum;
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / resolution);
    const y = Math.floor((e.clientY - rect.top) / resolution);
    grid[x][y] = grid[x][y] ? 0 : 1;
    drawGrid();
});

startBtn.addEventListener("click", () => {
    running = !running;
    if (running) {
        interval = setInterval(nextGeneration, speed);
        startBtn.textContent = "Pause";
    } else {
        clearInterval(interval);
        startBtn.textContent = "Démarrer";
    }
});

speedInput.addEventListener("input", () => {
    speed = parseInt(speedInput.value);
    if (running) {
        clearInterval(interval);
        interval = setInterval(nextGeneration, speed);
    }
});

gridSizeInput.addEventListener("input", () => {
    resolution = parseInt(gridSizeInput.value);
    setup();
});

patternSelect.addEventListener("change", () => {
    applyPattern(patternSelect.value);
});

randomPatternBtn.addEventListener("click", () => {
    generateRandomPattern();
});

function applyPattern(pattern) {
    setup();
    if (pattern === "glider") {
        grid[1][0] = 1;
        grid[2][1] = 1;
        grid[0][2] = 1;
        grid[1][2] = 1;
        grid[2][2] = 1;
    } else if (pattern === "oscillator") {
        grid[2][1] = 1;
        grid[2][2] = 1;
        grid[2][3] = 1;
    }
    drawGrid();
}

function generateRandomPattern() {
    setup();
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row] = Math.random() > 0.7 ? 1 : 0;
        }
    }
    drawGrid();
}

setup();