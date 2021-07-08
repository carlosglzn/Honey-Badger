// CANVAS SETUP

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let gameOver = false;
let youWon = false;
ctx.font = '40px Georgia'

// MOUSE INTERACTIVITY

let canvasPosition = canvas.getBoundingClientRect(); // Measure current size and position of canvas element

const mouse = {
    x: canvas.width / 2,  // To initiate in the center of the canvas
    y: canvas.height / 2,
    click: false
};

canvas.addEventListener('mousedown', function(event){

    mouse.click = true;
    mouse.x = event.x - canvasPosition.left; // Adjustment to have the coordinates beginning at 0, 0
    mouse.y = event.y - canvasPosition.top; // Adjustment to have the coordinates beginning at 0, 0

});

canvas.addEventListener('mouseup', function(){

    mouse.click = false;

});

// PLAYER

const playerLeft = new Image();
playerLeft.src = 'images/badger_spritesheet.png';
const playerRight = new Image();
playerRight.src = 'images/badger_right.png';


class Player {
    constructor() {
        this.x = canvas.width / 2; // Initial coordinates in the center of the canvas when the player stars moving
        this.y = canvas.height / 2;
        this.radius = 50; // To draw the circle of the player
        this.angle = 0; // We will use this later to rotate player towards current mouse position
        this.frameX = 0;
        this.frameY = 0; // Coordinates sprite sheet of the badger animation; Later review
        this.frame = 0; // Later review for animation
        this.spriteWidth = 641;  
        this.spriteHeight = 466; 
    }

    update() {  // To update player position to move the player towards the mouse -> compare current position with mouse position
        const dx = this.x  - mouse.x;   // Distance in the horizontal x-axis
        const dy = this.y - mouse.y;    // Distance in the vertical y-axis

        let theta = Math.atan2(dy, dx);
        this.angle = theta;                 // Rotate Player in the position of the click

        if (mouse.x != this.x) {
            this.x -= dx / 30;
        }                           // If there's no equality, update this.positions(x, y)

        if (mouse.y != this.y) {
            this.y -= dy / 30;  // divided so we can change movement speed
        }

        if (gameFrame % 5 === 0) {
            this.frame ++;
            if (this.frame >= 9) this.frame = 0;
            if (this.frame === 2 || this.frame === 5 || this.frame === 8) {
                this.frameX = 0;
            } else {
                this.frameX ++;
            }
            if (this.frame < 3) this.frameY = 0;
            else if (this.frame < 5) this.frameY = 1;
            else if (this.frame < 8) this.frameY = 2;
            else (this.frame = 0);
        }
    
    }

    draw() {  // Draw Player

        if (mouse.click) {
            ctx.lineWidth = 0.2; // Draw a line so we can see the direction of movement of the player
            ctx.beginPath();
            ctx.moveTo(this.x, this.y); // Start point = current position
            ctx.lineTo(mouse.x, mouse.y); // End point of the line = mouse click position
            ctx.stroke() // Will connect the two points
        }

        /* ctx.fillStyle = 'red'; // Circle red
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Create a circle
        ctx.fill();
        ctx.closePath(); */

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.x >= mouse.x) {

            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY + this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 85, 0 - 65, this.spriteWidth/3.5, this.spriteHeight/3.7);
        
        } else {

            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY + this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 85, 0 - 65, this.spriteWidth/3.5, this.spriteHeight/3.7);

        }
        ctx.restore();
    }
}

const player = new Player();  // Create a new player object

// HONEY

const honeyArray = [];

const honeyImage = new Image();
honeyImage.src = 'images/honey.png';

class Honey {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100; // All the honey starts at the bottom of the canvas
        this.radius = 50; // All hone have the same size
        this.speed = Math.random() * 5 + 1; // Random between 1 and 6
        this.distance;
        this.counted = false;
        this.sound = 'crunch1'
    }

    update() {  // Behavior Honey
        this.y -= this.speed; // Here the honey moves from the bottom of the canvas to the top
        const dx = this.x - player.x;   
        const dy = this.y - player.y;                   // Calculate distance between player and honey
        this.distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean Theorem: a^2 + b^2 = c
    }

    draw() {
        /* ctx.fillStyle = 'blue';  // Draw Honey
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke(); */
        ctx.drawImage(honeyImage, this.x - 72, this.y - 60, this.radius * 2.8, this.radius * 2.8);
    }
}

const crunch = document.createElement('audio');
crunch.src = 'sounds/crunch.1.ogg';

function handleHoney() {
    if (gameFrame % 50 === 0) {  // Run this code every 50 frames
        honeyArray.push(new Honey());
    }

    for (let i = 0; i < honeyArray.length; i++) {  // Loop in honey array

        honeyArray[i].update(); // Draw and update the position of the honey
        honeyArray[i].draw();
        
        if (honeyArray[i].y < 0 - honeyArray[i].radius * 2) { // If the honey leaves the canvas... 
            honeyArray.splice(i, 1); // remove the honey from the array. In other loop to solve the blinking for now
            i --;
        } else if (honeyArray[i].distance < honeyArray[i].radius + player.radius) {

            crunch.play();
           
          if (!honeyArray[i].counted) {
                score ++;
                honeyArray[i].counted = true;   // If there's a collision, add 1 to the counter, and eliminate the honey in the array.
                honeyArray.splice(i, 1);  
                i --;  
            }
            
        }
        
    }

}


// SNAKES

const snake = new Image();
snake.src = 'images/snake.png';

class Enemy {
    constructor() {
        this.x = canvas.width + 200;   // Starting point
        this.y = Math.random() * canvas.height;  // Random from the right of the canvas
        this.radius = 60;
        this.speed = Math.random() * 2 + 2; // Random between 2 and 4
        this.frame = 0;
        this.frameX = 0; 
        this.frameY = 0; 
        this.spriteWidth = 1082; 
        this.spriteHeight = 621; 

    }

    draw() {                        // Draw enemy
       /* ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Draw the enemy
        ctx.fill(); */

        ctx.drawImage(snake, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 90, this.y - 90, this.radius * 2.5, this.radius * 2.5);

        
    }

    update() {                  // Behavior of the enemy
        this.x -= this.speed
        if (this.x < 0 - this.radius * 2) { // If the enemy leaves the canvas screen to the left...
            this.x = canvas.width + 200;
            this.y = Math.random() * canvas.height;  // Change position random
            this.speed = Math.random() * 2 + 2;
        }

        if (gameFrame % 5 === 0) {
            this.frame ++;
            if (this.frame >= 12) this.frame = 0;
            if (this.frame === 3 || this.frame === 7 || this.frame === 11) {
                this.frameX = 0;
            } else {
                this.frameX ++;
            }
            if (this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else (this.frame = 0);
        }

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean Theorem: a^2 + b^2 = c

        if (distance < this.radius + player.radius) {
            handleGameOver();                           // If collision, game over!
        }
    }
}

const enemy1 = new Enemy(); // Create enemy
const enemy2 = new Enemy();


function handleEnemy() {
    
    enemy1.draw();
    enemy2.draw();
    enemy1.update();
    enemy2.update();
    
}

function handleGameOver() {         // Game Over Function
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER! Your score was: ' + score, 110, 250);
    gameOver = true;

}

function handleYouWon() {
    if (score === 50) {
        ctx.fillStyle = 'black';
        ctx.fillText('Congratulations! You won.', 150, 250);    // Win condition
        youWon = true;
    }
}

// Background

const background = new Image();      // Get image of the background
background.src = 'images/sand.jpg';

function handleBackground() {
    ctx.drawImage(background, 0, 0 , canvas.width, canvas.height);  // position of the background
}

// ANIMATION LOOP / Motor

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height) // To clear the entire canvas from old paint between every animation frame
    handleBackground();
    handleHoney()    // Call Honey
    player.update(); // Calculate player position
    player.draw(); // Draw the line and the circle
    handleEnemy() // Call enemy
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50); // Print the score in canvas
    gameFrame ++;  // Frame counter
    if (!gameOver && !youWon) {
        requestAnimationFrame(animate); // Animation loop, recursion when function calls itself over and over
    }
    handleYouWon() // Call win condition
    
};


animate(); // Invoke the function



window.addEventListener('rezise', function(){
    canvasPosition = canvas.getBoundingClientRect();  // Register mouse position when we rezise the window.
})