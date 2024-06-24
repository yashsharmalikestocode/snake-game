const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snake = {
    body: [{ x: 200, y: 200 }],
    direction: { x: 10, y: 0 },
    grow: false,
};

const food = {
    x: Math.floor((Math.random() * 60)) * 10,
    y: Math.floor((Math.random() * 60)) * 10
};

let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;
    const goingUp = snake.direction.y === -10;
    const goingDown = snake.direction.y === 10;
    const goingRight = snake.direction.x === 10;
    const goingLeft = snake.direction.x === -10;

    if (keyPressed === 'ArrowUp' && !goingDown) {
        snake.direction = { x: 0, y: -10 };
    }
    if (keyPressed === 'ArrowDown' && !goingUp) {
        snake.direction = { x: 0, y: 10 };
    }
    if (keyPressed === 'ArrowLeft' && !goingRight) {
        snake.direction = { x: -10, y: 0 };
    }
    if (keyPressed === 'ArrowRight' && !goingLeft) {
        snake.direction = { x: 10, y: 0 };
    }
}

function main() {
    if (didGameEnd()) {
        alert('Game Over');
        document.location.reload();
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();

        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "CornflowerBlue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.body.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = "lightgreen";
    ctx.strokestyle = "darkgreen";

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function moveSnake() {
    const head = { x: snake.body[0].x + snake.direction.x, y: snake.body[0].y + snake.direction.y };
    snake.body.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.title = `Snake Game by Yash Sharma - Score: ${score}`;
        createFood();
    } else {
        snake.body.pop();
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.strokestyle = "darkred";
    ctx.fillRect(food.x, food.y, 10, 10);
    ctx.strokeRect(food.x, food.y, 10, 10);
}

function createFood() {
    food.x = Math.floor((Math.random() * 60)) * 10;
    food.y = Math.floor((Math.random() * 60)) * 10;

    snake.body.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === food.x && part.y === food.y;
        if (foodIsOnSnake) createFood();
    });
}

function didGameEnd() {
    for (let i = 4; i < snake.body.length; i++) {
        const hasCollided = snake.body[i].x === snake.body[0].x && snake.body[i].y === snake.body[0].y;
        if (hasCollided) return true;
    }

    const hitLeftWall = snake.body[0].x < 0;
    const hitRightWall = snake.body[0].x > canvas.width - 10;
    const hitTopWall = snake.body[0].y < 0;
    const hitBottomWall = snake.body[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function restartGame() {
    snake.body = [{ x: 200, y: 200 }];
    snake.direction = { x: 10, y: 0 };
    score = 0;
    createFood();
}

main();
