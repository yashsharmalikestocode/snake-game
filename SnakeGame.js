const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Snake {
    constructor() {
        this.body = [{ x: 200, y: 200 }];
        this.direction = { x: 10, y: 0 };
        this.grow = false;
    }

    move() {
        const head = { x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y };
        this.body.unshift(head);

        if (!this.grow) {
            this.body.pop();
        } else {
            this.grow = false;
        }
    }

    changeDirection(newDirection) {
        this.direction = newDirection;
    }

    extend() {
        this.grow = true;
    }

    hasCollidedWithWall() {
        const head = this.body[0];
        return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
    }

    hasCollidedWithSelf() {
        const head = this.body[0];
        for (let i = 4; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}

class Food {
    constructor() {
        this.x = Math.floor(Math.random() * 60) * 10;
        this.y = Math.floor(Math.random() * 60) * 10;
    }

    respawn() {
        this.x = Math.floor(Math.random() * 60) * 10;
        this.y = Math.floor(Math.random() * 60) * 10;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 10, 10);
        ctx.strokeRect(this.x, this.y, 10, 10);
    }
}

class ScoreBoard {
    constructor() {
        this.score = 0;
    }

    increaseScore() {
        this.score += 10;
        document.title = `Snake Game by Yash Sharma - Score: ${this.score}`;
    }

    draw() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${this.score}`, 10, 20);
    }
}

const snake = new Snake();
const food = new Food();
const scoreboard = new ScoreBoard();

document.addEventListener("keydown", event => {
    const keyPressed = event.key;
    const goingUp = snake.direction.y === -10;
    const goingDown = snake.direction.y === 10;
    const goingRight = snake.direction.x === 10;
    const goingLeft = snake.direction.x === -10;

    if (keyPressed === 'ArrowUp' && !goingDown) {
        snake.changeDirection({ x: 0, y: -10 });
    }
    if (keyPressed === 'ArrowDown' && !goingUp) {
        snake.changeDirection({ x: 0, y: 10 });
    }
    if (keyPressed === 'ArrowLeft' && !goingRight) {
        snake.changeDirection({ x: -10, y: 0 });
    }
    if (keyPressed === 'ArrowRight' && !goingLeft) {
        snake.changeDirection({ x: 10, y: 0 });
    }
});

function main() {
    if (snake.hasCollidedWithWall() || snake.hasCollidedWithSelf()) {
        alert('Game Over');
        document.location.reload();
        return;
    }

    setTimeout(() => {
        clearCanvas();
        snake.move();

        if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
            food.respawn();
            snake.extend();
            scoreboard.increaseScore();
        }

        food.draw();
        drawSnake();
        scoreboard.draw();

        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "CornflowerBlue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.body.forEach(part => {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(part.x, part.y, 10, 10);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(part.x, part.y, 10, 10);
    });
}

main();

