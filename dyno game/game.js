const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 300;

// تحميل الصور
const dinoImg = new Image();
dinoImg.src = "https://cdn-icons-png.flaticon.com/512/4062/4062968.png";  // صورة الديناصور

const cactusImg = new Image();
cactusImg.src = "https://cdn-icons-png.flaticon.com/512/2807/2807486.png";  // صورة الصبار

const groundImg = new Image();
groundImg.src = "https://cdn-icons-png.flaticon.com/512/4101/4101971.png";  // صورة الأرضية

let dino = {
    x: 50,
    y: 200,
    width: 50,
    height: 50,
    dy: 0,
    gravity: 0.7,  // تقليل الجاذبية لجعل القفز سلسًا
    jumpPower: -12, // تقليل قوة القفز لجعلها طبيعية
    isJumping: false
};

let obstacles = [];
let score = 0;
let gameOver = false;
let speed = 5;
let obstacleInterval;

// حدث القفز عند الضغط على المسافة
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !dino.isJumping) {
        dino.dy = dino.jumpPower;
        dino.isJumping = true;
    }
});

// توليد العقبات
function spawnObstacle() {
    if (!gameOver) {
        obstacles.push({ x: canvas.width, y: 220, width: 30, height: 50 });
    }
}

// تحديث حالة اللعبة
function update() {
    if (gameOver) return;

    // تحديث القفز
    dino.y += dino.dy;
    dino.dy += dino.gravity;

    if (dino.y > 200) {
        dino.y = 200;
        dino.isJumping = false;
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= speed;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        if (dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y) {
            gameOver = true;
        }
    });
}

// رسم اللعبة
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الأرضية
    ctx.drawImage(groundImg, 0, 250, canvas.width, 50);

    // رسم الديناصور
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // رسم العقبات
    obstacles.forEach(obstacle => {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // رسم النقاط
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    if (gameOver) {
        ctx.fillText("Game Over! Press Space to Restart", 250, 150);
    }
}

// تشغيل اللعبة
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// إعادة تشغيل اللعبة
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameOver) {
        // إعادة تعيين المتغيرات
        dino.y = 200;
        dino.dy = 0;
        obstacles = [];
        score = 0;
        gameOver = false;

        // إعادة تشغيل توليد العقبات
        clearInterval(obstacleInterval);
        obstacleInterval = setInterval(spawnObstacle, Math.random() * 2000 + 1000);

        // بدء حلقة اللعبة
        gameLoop();
    }
});

// بدء اللعبة
obstacleInterval = setInterval(spawnObstacle, Math.random() * 2000 + 1000);
gameLoop();